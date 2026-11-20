"""Scrape CPABC Registered Firm Directory & Practitioner details for Lower Mainland & Fraser Valley."""

from __future__ import annotations

import argparse
import csv
import re
import sqlite3
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlparse

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

BASE_URL = "https://services.bccpa.ca"
FIRM_SEARCH_URL = f"{BASE_URL}/Directory/BC_Search_By_Firm.aspx"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)

DEFAULT_CITIES = [
    # Metro Vancouver / Lower Mainland
    "Burnaby",
    "Vancouver",  # also matches North Vancouver, West Vancouver
    "Richmond",
    "Surrey",
    "Coquitlam",  # also matches Port Coquitlam
    "Port Moody",
    "New Westminster",
    "Delta",
    "Langley",  # also matches Fort Langley, Langley Township
    "Maple Ridge",
    "Pitt Meadows",
    "White Rock",
    "Bowen Island",
    "Lions Bay",
    "Anmore",
    "Belcarra",
    # Fraser Valley
    "Abbotsford",
    "Chilliwack",
    "Mission",
    "Hope",
    "Agassiz",
    "Harrison Hot Springs",
    "Aldergrove",
]

POSTAL_RE = re.compile(r"\b([A-Z]\d[A-Z]\s?\d[A-Z]\d)\b")
PHONE_RE = re.compile(r"\(\d{3}\)\s*\d{3}-\d{4}")
KNOWN_CITIES = sorted(
    [
        "North Vancouver",
        "West Vancouver",
        "Port Coquitlam",
        "New Westminster",
        "Port Moody",
        "Maple Ridge",
        "Pitt Meadows",
        "White Rock",
        "Bowen Island",
        "Lions Bay",
        "Harrison Hot Springs",
        "Fort Langley",
        "Langley Township",
        "Burnaby",
        "Vancouver",
        "Richmond",
        "Surrey",
        "Coquitlam",
        "Delta",
        "Langley",
        "Abbotsford",
        "Chilliwack",
        "Mission",
        "Hope",
        "Agassiz",
        "Aldergrove",
        "Anmore",
        "Belcarra",
    ],
    key=len,
    reverse=True,
)
CITY_PROV_RE = re.compile(
    r"(" + "|".join(re.escape(c) for c in KNOWN_CITIES) + r")\s+(BC|AB|ON|QC|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b",
    re.IGNORECASE,
)


def parse_contact_info(raw_lines: list[str]) -> dict[str, str]:
    """Extract address, city, province, postal_code, phone, and fax from contact lines."""
    lines = [re.sub(r"\s+", " ", line).strip() for line in raw_lines if line.strip()]
    phones: list[str] = []
    addr_lines: list[str] = []

    for line in lines:
        found_phones = PHONE_RE.findall(line)
        if found_phones and PHONE_RE.sub("", line).strip(" ,;-") == "":
            phones.extend(found_phones)
        else:
            if found_phones:
                phones.extend(found_phones)
                cleaned = PHONE_RE.sub("", line).strip(" ,;-")
                if cleaned:
                    addr_lines.append(cleaned)
            else:
                addr_lines.append(line)

    full_addr = ", ".join(addr_lines)
    postal_code = ""
    city = ""
    province = ""

    m_postal = POSTAL_RE.search(full_addr)
    if m_postal:
        postal_code = m_postal.group(1)

    m_cp = CITY_PROV_RE.search(full_addr)
    if m_cp:
        city = m_cp.group(1).strip().title()
        province = m_cp.group(2).strip().upper()
    elif addr_lines:
        m_prov = re.search(r"\b(BC|AB|ON|QC|MB|SK|NS|NB|NL|PE|YT|NT|NU)\b", full_addr)
        if m_prov:
            province = m_prov.group(1)

    return {
        "contact_raw": " | ".join(lines),
        "address": full_addr,
        "city": city,
        "province": province,
        "postal_code": postal_code,
        "phone": phones[0] if len(phones) >= 1 else "",
        "fax": phones[1] if len(phones) >= 2 else "",
    }


def extract_firm_id(href: str) -> str:
    parsed = urlparse(href)
    qs = parse_qs(parsed.query)
    return qs.get("ID", [""])[0]


def scrape_city_firms(page: Any, city: str) -> list[dict[str, Any]]:
    """Search BC_Search_By_Firm.aspx by city and return all firm rows."""
    page.goto(FIRM_SEARCH_URL, wait_until="domcontentloaded", timeout=30000)
    city_input = page.locator("input[id*=Input0_TextBox1]")
    city_input.fill(city)
    page.locator("input[value=Find]").click()

    # Wait for results grid or empty message
    page.wait_for_selector(
        "table.rgMasterTable, .rgNoRecords, div[id*=ResultsGrid] span:has-text('No records')",
        timeout=25000,
    )

    grid = page.locator("table.rgMasterTable")
    if grid.count() == 0:
        return []

    # Check total items in pager; if > 20, set page size to 5000 and click Change
    pager = page.locator(".rgPager").first
    total_items = 0
    if pager.count() > 0:
        pager_text = pager.inner_text()
        m_total = re.search(r"of\s+(\d+)", pager_text)
        if m_total:
            total_items = int(m_total.group(1))

    if total_items > 20:
        ps_input = page.locator("input[id*=ChangePageSizeTextBox]").first
        ps_btn = page.locator("input[id*=ChangePageSizeLinkButton]").first
        if ps_input.count() > 0 and ps_btn.count() > 0:
            ps_input.fill(str(max(total_items + 50, 5000)))
            ps_btn.click()
            # Wait until row count grows or network settles
            try:
                page.wait_for_function(
                    f"document.querySelectorAll('table.rgMasterTable tbody tr.rgRow, table.rgMasterTable tbody tr.rgAltRow').length >= {min(total_items, 21)}",
                    timeout=30000,
                )
            except Exception:
                page.wait_for_load_state("networkidle", timeout=15000)

    html = page.content()
    soup = BeautifulSoup(html, "html.parser")
    table = soup.select_one("table.rgMasterTable")
    if not table:
        return []

    firms: list[dict[str, Any]] = []
    for tr in table.select("tbody tr.rgRow, tbody tr.rgAltRow"):
        tds = tr.select("td")
        if len(tds) < 3:
            continue
        link = tds[0].select_one("a[href]")
        firm_name = tds[0].get_text(" ", strip=True)
        href = link.get("href", "") if link else ""
        firm_id = extract_firm_id(href) if href else ""
        if not firm_id:
            continue

        contact_lines = [s for s in tds[1].stripped_strings]
        contact = parse_contact_info(contact_lines)
        current_status = tds[2].get_text(" ", strip=True) if len(tds) > 2 else ""
        public_notice = tds[3].get_text(" ", strip=True) if len(tds) > 3 else ""

        firms.append(
            {
                "firm_id": firm_id,
                "firm_name": firm_name,
                "detail_url": f"{BASE_URL}{href}" if href.startswith("/") else href,
                "current_status": current_status,
                "public_notice": public_notice,
                "search_city": city,
                **contact,
            }
        )
    return firms


def parse_practitioner_tables(html: str) -> tuple[list[dict[str, str]], int]:
    """Parse practitioners table from Firm_Practitioner_Directory.aspx HTML."""
    soup = BeautifulSoup(html, "html.parser")
    tables = soup.select("table.rgMasterTable")
    practitioners: list[dict[str, str]] = []
    total_count = 0

    if len(tables) >= 2:
        prac_table = tables[1]
        pager = prac_table.select_one(".rgPager")
        if pager:
            m_total = re.search(r"of\s+(\d+)", pager.get_text(" ", strip=True))
            if m_total:
                total_count = int(m_total.group(1))
        for tr in prac_table.select("tbody tr.rgRow, tbody tr.rgAltRow"):
            tds = tr.select("td")
            if len(tds) < 3:
                continue
            practitioners.append(
                {
                    "practitioner_name": tds[0].get_text(" ", strip=True),
                    "public_practice_licence": tds[1].get_text(" ", strip=True),
                    "licence_status": tds[2].get_text(" ", strip=True),
                    "public_notice": tds[3].get_text(" ", strip=True) if len(tds) > 3 else "",
                }
            )
    if total_count == 0:
        total_count = len(practitioners)
    return practitioners, total_count


def fetch_firm_practitioners_http(
    session: requests.Session, firm: dict[str, Any]
) -> tuple[str, list[dict[str, str]], int, str | None]:
    """Fetch Firm_Practitioner_Directory.aspx via HTTP GET."""
    url = firm["detail_url"]
    for attempt in range(3):
        try:
            resp = session.get(url, timeout=20)
            if resp.status_code == 200:
                pracs, total = parse_practitioner_tables(resp.text)
                return firm["firm_id"], pracs, total, None
            time.sleep(1.0 * (attempt + 1))
        except Exception as exc:
            if attempt == 2:
                return firm["firm_id"], [], 0, str(exc)
            time.sleep(1.0 * (attempt + 1))
    return firm["firm_id"], [], 0, "Failed after retries"


def fetch_all_practitioners_playwright(page: Any, detail_url: str) -> list[dict[str, str]]:
    """Fallback for firms with >20 practitioners: expand page size in Playwright."""
    page.goto(detail_url, wait_until="domcontentloaded", timeout=30000)
    page.wait_for_selector("table.rgMasterTable", timeout=15000)
    tables = page.locator("table.rgMasterTable")
    if tables.count() < 2:
        return []
    prac_tbl = tables.nth(1)
    ps_input = prac_tbl.locator("input[id*=ChangePageSizeTextBox]").first
    ps_btn = prac_tbl.locator("input[id*=ChangePageSizeLinkButton]").first
    if ps_input.count() > 0 and ps_btn.count() > 0:
        ps_input.fill("5000")
        ps_btn.click()
        page.wait_for_load_state("networkidle", timeout=15000)
        page.wait_for_timeout(800)
    pracs, _ = parse_practitioner_tables(page.content())
    return pracs


def save_to_sqlite_and_csv(
    firms_by_id: dict[str, dict[str, Any]],
    practitioners_by_firm: dict[str, list[dict[str, str]]],
    out_dir: Path,
) -> None:
    db_path = out_dir / "cpabc_firms.db"
    firms_csv = out_dir / "cpabc_firms_lower_mainland_fraser_valley.csv"
    pracs_csv = out_dir / "cpabc_practitioners_lower_mainland_fraser_valley.csv"
    now_iso = datetime.now(timezone.utc).isoformat()

    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.executescript(
        """
        DROP TABLE IF EXISTS practitioners;
        DROP TABLE IF EXISTS firms;
        CREATE TABLE firms (
            firm_id TEXT PRIMARY KEY,
            firm_name TEXT NOT NULL,
            current_status TEXT,
            address TEXT,
            city TEXT,
            province TEXT,
            postal_code TEXT,
            phone TEXT,
            fax TEXT,
            public_notice TEXT,
            practitioner_count INTEGER,
            audit_count INTEGER,
            review_count INTEGER,
            compilation_count INTEGER,
            other_licence_count INTEGER,
            licence_categories TEXT,
            search_cities TEXT,
            detail_url TEXT,
            contact_raw TEXT,
            scraped_at TEXT
        );
        CREATE TABLE practitioners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firm_id TEXT NOT NULL,
            firm_name TEXT NOT NULL,
            practitioner_name TEXT NOT NULL,
            public_practice_licence TEXT,
            licence_status TEXT,
            public_notice TEXT,
            FOREIGN KEY (firm_id) REFERENCES firms(firm_id)
        );
        CREATE INDEX idx_firms_city ON firms(city);
        CREATE INDEX idx_firms_status ON firms(current_status);
        CREATE INDEX idx_pracs_firm ON practitioners(firm_id);
        """
    )

    firm_rows: list[tuple[Any, ...]] = []
    prac_rows: list[tuple[Any, ...]] = []

    for firm_id, firm in sorted(firms_by_id.items(), key=lambda kv: kv[1]["firm_name"]):
        pracs = practitioners_by_firm.get(firm_id, [])
        audit_cnt = 0
        review_cnt = 0
        comp_cnt = 0
        other_cnt = 0
        lic_cats: set[str] = set()

        for p in pracs:
            lic = p["public_practice_licence"]
            if lic:
                lic_cats.add(lic)
            low = lic.lower()
            if "audit" in low:
                audit_cnt += 1
            elif "review" in low:
                review_cnt += 1
            elif "compil" in low:
                comp_cnt += 1
            else:
                other_cnt += 1

            prac_rows.append(
                (
                    firm_id,
                    firm["firm_name"],
                    p["practitioner_name"],
                    p["public_practice_licence"],
                    p["licence_status"],
                    p["public_notice"],
                )
            )

        firm_rows.append(
            (
                firm_id,
                firm["firm_name"],
                firm["current_status"],
                firm["address"],
                firm["city"],
                firm["province"],
                firm["postal_code"],
                firm["phone"],
                firm["fax"],
                firm["public_notice"],
                len(pracs),
                audit_cnt,
                review_cnt,
                comp_cnt,
                other_cnt,
                "; ".join(sorted(lic_cats)),
                "; ".join(sorted(firm["search_cities"])),
                firm["detail_url"],
                firm["contact_raw"],
                now_iso,
            )
        )

    cur.executemany(
        """
        INSERT INTO firms VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """,
        firm_rows,
    )
    cur.executemany(
        """
        INSERT INTO practitioners (
            firm_id, firm_name, practitioner_name,
            public_practice_licence, licence_status, public_notice
        ) VALUES (?,?,?,?,?,?)
        """,
        prac_rows,
    )
    conn.commit()
    conn.close()

    firm_headers = [
        "firm_id",
        "firm_name",
        "current_status",
        "address",
        "city",
        "province",
        "postal_code",
        "phone",
        "fax",
        "public_notice",
        "practitioner_count",
        "audit_count",
        "review_count",
        "compilation_count",
        "other_licence_count",
        "licence_categories",
        "search_cities",
        "detail_url",
        "contact_raw",
        "scraped_at",
    ]
    with firms_csv.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(firm_headers)
        w.writerows(firm_rows)

    prac_headers = [
        "firm_id",
        "firm_name",
        "practitioner_name",
        "public_practice_licence",
        "licence_status",
        "public_notice",
    ]
    with pracs_csv.open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow(prac_headers)
        w.writerows(prac_rows)


def main() -> None:
    parser = argparse.ArgumentParser(description="Scrape CPABC firms and practitioners.")
    parser.add_argument(
        "--cities",
        nargs="+",
        default=DEFAULT_CITIES,
        help="List of city search terms.",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=Path(__file__).resolve().parent,
        help="Output directory for SQLite DB and CSVs.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=8,
        help="Concurrent HTTP workers for practitioner detail pages.",
    )
    parser.add_argument(
        "--limit-details",
        type=int,
        default=0,
        help="Optional cap on firm detail pages (0 = no limit, for testing).",
    )
    args = parser.parse_args()

    firms_by_id: dict[str, dict[str, Any]] = {}

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(user_agent=USER_AGENT)
        page = ctx.new_page()

        for city in args.cities:
            rows = scrape_city_firms(page, city)
            new_cnt = 0
            for r in rows:
                fid = r["firm_id"]
                if fid not in firms_by_id:
                    r["search_cities"] = {city}
                    firms_by_id[fid] = r
                    new_cnt += 1
                else:
                    firms_by_id[fid]["search_cities"].add(city)
            print(f"[{city}] found={len(rows)} new_unique={new_cnt} total_unique={len(firms_by_id)}", flush=True)

        # Fetch practitioner details via HTTP pool
        firm_list = list(firms_by_id.values())
        if args.limit_details > 0:
            firm_list = firm_list[: args.limit_details]

        practitioners_by_firm: dict[str, list[dict[str, str]]] = {}
        large_firms: list[dict[str, Any]] = []
        errors = 0

        session = requests.Session()
        session.headers.update({"User-Agent": USER_AGENT})

        with ThreadPoolExecutor(max_workers=args.workers) as pool:
            futures = [
                pool.submit(fetch_firm_practitioners_http, session, f)
                for f in firm_list
            ]
            done = 0
            for fut in as_completed(futures):
                fid, pracs, total_cnt, err = fut.result()
                done += 1
                if err:
                    errors += 1
                practitioners_by_firm[fid] = pracs
                if total_cnt > len(pracs):
                    large_firms.append(firms_by_id[fid])
                if done % 200 == 0 or done == len(firm_list):
                    print(f"[Details] {done}/{len(firm_list)} done (large_firms={len(large_firms)}, errors={errors})", flush=True)

        # Expand large firms (>20 practitioners) via Playwright
        for lf in large_firms:
            try:
                pracs = fetch_all_practitioners_playwright(page, lf["detail_url"])
                if pracs:
                    practitioners_by_firm[lf["firm_id"]] = pracs
            except Exception as exc:
                print(f"[LargeFirmWarn] {lf['firm_name']} ({lf['firm_id']}): {exc}", flush=True)

        browser.close()

    args.out_dir.mkdir(parents=True, exist_ok=True)
    save_to_sqlite_and_csv(firms_by_id, practitioners_by_firm, args.out_dir)
    print(f"Saved {len(firms_by_id)} firms to {args.out_dir}", flush=True)


if __name__ == "__main__":
    main()

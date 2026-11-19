# -*- coding: utf-8 -*-
import os
import shutil
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

PACKAGE_DIR = os.path.join(os.getcwd(), "legal_package")
os.makedirs(PACKAGE_DIR, exist_ok=True)

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(
        f'<w:tcMar {nsdecls("w")}>'
        f'<w:top w:w="{top}" w:type="dxa"/>'
        f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
        f'<w:left w:w="{left}" w:type="dxa"/>'
        f'<w:right w:w="{right}" w:type="dxa"/>'
        f'</w:tcMar>'
    )
    tcPr.append(tcMar)

def init_doc():
    doc = docx.Document()
    for section in doc.sections:
        section.top_margin = Inches(0.9)
        section.bottom_margin = Inches(0.9)
        section.left_margin = Inches(0.9)
        section.right_margin = Inches(0.9)
    normal = doc.styles['Normal']
    normal.font.name = 'Calibri'
    normal.font.size = Pt(10.5)
    normal.font.color.rgb = RGBColor(0x22, 0x22, 0x22)
    normal.paragraph_format.line_spacing = 1.15
    normal.paragraph_format.space_after = Pt(5)
    return doc

def add_title(doc, title, subtitle=None):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(title)
    r.bold = True
    r.font.size = Pt(14.5)
    r.font.color.rgb = RGBColor(0x0F, 0x2B, 0x5C)
    p.paragraph_format.space_after = Pt(2)
    if subtitle:
        p2 = doc.add_paragraph()
        p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
        r2 = p2.add_run(subtitle)
        r2.italic = True
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = RGBColor(0x55, 0x55, 0x55)
        p2.paragraph_format.space_after = Pt(12)

def add_h1(doc, text):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = True
    r.font.size = Pt(11.5)
    r.font.color.rgb = RGBColor(0x0F, 0x2B, 0x5C)
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(4)

def add_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph()
    if bold_prefix:
        rb = p.add_run(bold_prefix)
        rb.bold = True
    p.add_run(text)
    return p

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    if bold_prefix:
        rb = p.add_run(bold_prefix)
        rb.bold = True
    p.add_run(text)
    p.paragraph_format.space_after = Pt(3)
    return p

def build_bcbca_resolution():
    doc = init_doc()
    add_title(
        doc,
        "NEXUS INSURANCE BROKERS LTD.",
        "CONSENT RESOLUTION OF THE DIRECTORS AND ALL VOTING SHAREHOLDERS\n(Pursuant to Sections 147-149 and Section 227 of the Business Corporations Act (British Columbia))"
    )

    add_p(doc, "Effective Date: [DATE]")
    add_p(doc, "WHEREAS:")
    add_bullet(doc, "Nexus Insurance Brokers Ltd. (the \"Company\") proposes to enter into the Domain & Platform License and Producer Commission Addendum (the \"Addendum\") with Chase Pierce Addison (the \"Producer\"), governing the exclusive operation of the online surety platform contractbonding.ca, corporate funding of platform expenses, commission splits, and book-of-business buyout terms;")
    add_bullet(doc, "Kenneth James Addison is the President, sole or controlling director, Level 3 Nominee, and 90% voting shareholder of the Company, and is the father of the Producer, which constitutes a disclosable interest within the meaning of Sections 147 through 149 of the Business Corporations Act (British Columbia) (the \"BCBCA\");")
    add_bullet(doc, "The undersigned Vice President holds all remaining issued and outstanding voting shares of the Company not held by Kenneth James Addison, such that the undersigned shareholders collectively represent 100% of the issued and outstanding voting shares of the Company; and")
    add_bullet(doc, "The nature and extent of Kenneth James Addison's disclosable interest and the full commercial terms of the Addendum have been fully disclosed to and reviewed by all directors and all voting shareholders of the Company.")

    add_p(doc, "NOW THEREFORE BE IT RESOLVED AS A SPECIAL AND UNANIMOUS RESOLUTION OF THE DIRECTORS AND SHAREHOLDERS THAT:", bold_prefix=None)

    add_bullet(doc, "The Addendum in the form presented to the directors and shareholders is hereby approved, ratified, and confirmed as fair and reasonable to the Company at the time it is entered into, pursuant to Section 149 of the BCBCA.", bold_prefix="1. Approval of Addendum: ")
    add_bullet(doc, "Kenneth James Addison and the Vice President are each authorized and directed, for and on behalf of the Company, to execute and deliver the Addendum and any related DBA, Insurance Council, or E&O filings contemplated thereby.", bold_prefix="2. Authorization to Execute: ")
    add_bullet(doc, "Each undersigned voting shareholder hereby waives any conflict-of-interest objection or procedural defect under Sections 147 through 149 of the BCBCA and covenants not to assert any claim of corporate waste, breach of fiduciary duty, or shareholder oppression under Section 227 of the BCBCA arising out of the execution or performance of the Addendum.", bold_prefix="3. Waiver & Ratification: ")
    add_bullet(doc, "This consent resolution may be executed in counterparts and shall be filed in the corporate minute book of the Company.", bold_prefix="4. Minute Book Filing: ")

    add_p(doc, "")
    table = doc.add_table(rows=1, cols=2)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    for j in range(2):
        table.cell(0, j).width = Inches(3.3)
        set_cell_margins(table.cell(0, j), top=120, bottom=120, left=140, right=140)
        set_cell_background(table.cell(0, j), "FAFAFA")

    p0 = table.cell(0, 0).paragraphs[0]
    p0.add_run("PRESIDENT, DIRECTOR & 90% SHAREHOLDER:\n\n").bold = True
    p0.add_run("Signature: ___________________________\n\n")
    p0.add_run("Name: Kenneth James Addison\nDate: _______________________________")

    p1 = table.cell(0, 1).paragraphs[0]
    p1.add_run("VICE PRESIDENT & MINORITY SHAREHOLDER:\n\n").bold = True
    p1.add_run("Signature: ___________________________\n\n")
    p1.add_run("Name: [NAME OF MINORITY SHAREHOLDER / VP]\nDate: _______________________________")

    out_path = os.path.join(PACKAGE_DIR, "02_BCBCA_Related_Party_Resolution_(Minute_Book).docx")
    doc.save(out_path)
    print("Created:", out_path)

def build_summary_and_checklist():
    doc = init_doc()
    add_title(
        doc,
        "LEGAL PACKAGE SUMMARY & SIGNING CHECKLIST",
        "Prepared for Kenneth James Addison, Vice President (Minority Shareholder), and Chase Pierce Addison"
    )

    add_h1(doc, "1. Purpose of This Package (Plain-English Overview)")
    add_p(doc, "This legal package formalizes the operation of contractbonding.ca inside Nexus Insurance Brokers Ltd. (\"Nexus\"). It replaces uncertainty with a single, clean licensing framework that protects Nexus's regulatory standing, rewards Chase for building and running the digital platform, and guarantees strong profit margins and upside for all Nexus shareholders.")

    add_bullet(doc, "Chase keeps 100% personal ownership of the contractbonding.ca domain, source code, and his personal AI/bid-intelligence tools (Schedule B). Nexus receives an exclusive operating license to write all surety and cross-sold commercial insurance generated by the platform.", bold_prefix="Ownership & License: ")
    add_bullet(doc, "Nexus retains 35% of Year 1 commissions and 65% of all Renewal commissions on Producer-worked business (Stream A), plus 15% to 35% of renewals on complex handoffs (Stream B) and a 10% administrative fee on out-of-province referrals (Stream C).", bold_prefix="Brokerage Revenue Share: ")
    add_bullet(doc, "Nexus pays fixed platform overhead (hosting, domain, DBA filings, E&O endorsement) plus up to $2,000.00/month in pre-approved Google Ads, SEO, and AI tools using pre-tax corporate dollars. Anything over $2,000.00/month requires Ken's prior written approval.", bold_prefix="Corporate Marketing Budget: ")
    add_bullet(doc, "If Chase departs or Nexus sells, Chase retains his domain/code (subject to a 30-day neutral client redirect notice) and Nexus pays 4.5x trailing 12-month CB-WEB gross revenue for the client book Nexus keeps (a 25% discount to Nexus's ~6.0x benchmark multiple, leaving ~1.5x net profit spread for Nexus shareholders in an M&A exit). For internal departures, Nexus can pay over 12 months in 4 quarterly installments.", bold_prefix="Fair Exit & M&A Economics: ")

    add_h1(doc, "2. Complete List of Documents That Need to Be Signed")
    table = doc.add_table(rows=3, cols=4)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    widths = [Inches(2.0), Inches(1.8), Inches(1.6), Inches(1.3)]
    for row in table.rows:
        for j, w in enumerate(widths):
            row.cells[j].width = w
            set_cell_margins(row.cells[j], top=90, bottom=90, left=100, right=100)

    headers = ["Document", "Who Must Sign", "Blanks to Fill In", "Purpose"]
    for j, h in enumerate(headers):
        c = table.cell(0, j)
        set_cell_background(c, "0F2B5C")
        p = c.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    data = [
        (
            "01_Domain_and_Platform_License_Addendum_(Execution_Ready).docx",
            "1. Chase Pierce Addison (Producer/Licensor)\n2. Kenneth James Addison (President & 90% Shareholder)\n3. Vice President (Minority Shareholder)",
            "- [DATE]\n- [LICENCE_NO] & [CHASE_ADDRESS]\n- [INC_NO] & [AGENCY_LICENCE_NO]\n- [SUITE_NO] & [POSTAL_CODE]\n- [NAME OF MINORITY SHAREHOLDER / VP]",
            "Main binding contract governing IP ownership, exclusive license, $2k/mo budget, splits, Level 2 upgrade, 4.5x buyout, and arbitration."
        ),
        (
            "02_BCBCA_Related_Party_Resolution_(Minute_Book).docx",
            "1. Kenneth James Addison (President, Director & 90% Shareholder)\n2. Vice President (Minority Shareholder)",
            "- [DATE]\n- [NAME OF MINORITY SHAREHOLDER / VP]",
            "Corporate minute book resolution under BC Business Corporations Act ss. 147-149 & s. 227 confirming unanimous shareholder approval."
        )
    ]

    for i, row_data in enumerate(data):
        row = table.rows[i + 1]
        for j, val in enumerate(row_data):
            c = row.cells[j]
            set_cell_background(c, "F7F9FB" if i % 2 == 0 else "FFFFFF")
            p = c.paragraphs[0]
            r = p.add_run(val)
            r.font.size = Pt(9)
            if j == 0:
                r.bold = True

    add_h1(doc, "3. Post-Signing Compliance & Setup Checklist (No Extra Contract Required)")
    add_bullet(doc, "Notify Nexus's E&O insurance broker/carrier in writing that contractbonding.ca is an approved online surety channel and DBA of Nexus (Addendum Section 4.3).", bold_prefix="1. E&O Insurer Notification: ")
    add_bullet(doc, "Register contractbonding.ca as an approved trade name / DBA with the BC Corporate Registry and Insurance Council of BC / Alberta Insurance Council if required, and display Nexus's legal name and Burnaby office address on the site (Section 2.2).", bold_prefix="2. DBA & Website Disclosures: ")
    add_bullet(doc, "Create the \"CB-WEB\" source tracking tag in Nexus's CRM / BMS so all inbound site leads and outbound Intelligence Tool deals are tracked cleanly for monthly payroll and TTM valuation (Section 6.3).", bold_prefix="3. CRM \"CB-WEB\" Tagging: ")
    add_bullet(doc, "Place the signed Addendum and the signed BCBCA Resolution together in Nexus's corporate minute book.", bold_prefix="4. Minute Book Filing: ")

    out_path = os.path.join(PACKAGE_DIR, "03_Summary_and_Signing_Checklist_for_Ken.docx")
    doc.save(out_path)
    print("Created:", out_path)

if __name__ == "__main__":
    # 1. Copy Execution Ready Main Agreement
    src_main = "DOMAIN & PLATFORM LICENSE AND PRODUCER COMMISSION ADDENDUM (Execution Ready).docx"
    dst_main = os.path.join(PACKAGE_DIR, "01_Domain_and_Platform_License_Addendum_(Execution_Ready).docx")
    shutil.copy2(src_main, dst_main)
    print("Copied:", dst_main)

    # 2. Build BCBCA Resolution
    build_bcbca_resolution()

    # 3. Build Summary & Signing Checklist
    build_summary_and_checklist()

    # 4. Copy Original Drafts for reference
    src_orig = "Legal Agreement Drafts.docx"
    dst_orig = os.path.join(PACKAGE_DIR, "05_Reference_Original_Drafts_and_Comparison.docx")
    shutil.copy2(src_orig, dst_orig)
    print("Copied:", dst_orig)

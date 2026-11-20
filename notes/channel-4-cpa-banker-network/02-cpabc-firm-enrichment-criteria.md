# CPABC Firm Enrichment & Targeting Criteria (Channel 4)

Reference guide for filtering and enriching the **2,119 CPABC-registered firms** and **3,304 practitioners** collected in `cpabc_firms.db` / `cpabc_firms_lower_mainland_fraser_valley.csv` for the **Construction CPA Referral Flywheel** (see [01-surety-ratio-cheat-sheet-and-outreach-pack.md](./01-surety-ratio-cheat-sheet-and-outreach-pack.md)).

---

## 1. Pre-Enrichment Filters (Available Immediately from CPABC Data)

Before running web/LinkedIn enrichment, narrow the 2,119 firms using fields already in `cpabc_firms.db`:

1. **Public Practice Licence Capability (Primary Gate)**
   - **Must-have for `$500K–$5M+` tender bond referrals:** `review_count > 0 OR audit_count > 0` (**1,104 firms** in the dataset). Contractors bidding `$1M+` public tenders generally cannot qualify on Compilation (CSRS 4200) statements alone.
   - **Secondary bucket (Compilation-only):** `review_count = 0 AND audit_count = 0 AND compilation_count > 0` — not a fit for Review upgrades, though they can still refer emerging `$10K–$500K` contractors or hand off clients needing a Review-licensed firm.
2. **Firm Size Sweet Spot (`practitioner_count`)**
   - **Sweet spot (`2–25` practitioners):** Large enough to have Review/Audit capacity and commercial contractor clients, small enough that partners are accessible for a 15-minute Burnaby/Metro Vancouver coffee and value reciprocal referrals.
   - **Sole practitioners (`1` practitioner):** Prioritize only if they hold a `Review` or `Audit` licence and show a commercial/construction niche.
   - **National / Big 4 (`25+` practitioners):** Lower cold-outreach priority (often have entrenched national broker relationships), unless targeting a specific local construction-practice partner.
3. **Geography Priority**
   - **Core hubs:** Burnaby, Vancouver, Surrey, Langley, Coquitlam, Richmond, Abbotsford, North Vancouver.
   - **Secondary Fraser Valley:** Chilliwack, Maple Ridge, Delta, New Westminster, Port Coquitlam, White Rock, Mission.
4. **Compliance / Standing**
   - `current_status = 'Registered'`
   - `public_notice = ''` (exclude or review any firm/practitioner with active disciplinary/public notices).

---

## 2. Enrichment Fields to Collect Later

When enriching shortlisted firms (via website scraping, Google search, and LinkedIn), capture:

| Field | Why It Matters |
| :--- | :--- |
| `website_url` | Confirms active practice, service lines, and team directory. |
| `construction_focus` (Yes/No/Mentioned) | Look for keywords: *construction, contractors, trades, real estate, developers, engineering, WIP / work-in-progress, percentage-of-completion, bonding, surety, CCDC*. |
| `assurance_services_listed` | Confirms they actively market **Review Engagements** and/or **Audits** (not just holding an unused licence). |
| `target_partner_name` & `title` | Prefer **Assurance / Review Partner** or **Managing Partner** (from `practitioners` table where `public_practice_licence` is `Review` or `Audit`). |
| `partner_email` / `linkedin_url` | Direct outreach channel for Pitch A (see `01-surety-ratio-cheat-sheet-and-outreach-pack.md`). |
| `firm_type_signal` | Boutique commercial/assurance firm vs. personal tax / bookkeeping / wealth-only practice. |
| `ideal_client_profile_fit` | Signs they serve `$1M–$25M` revenue private businesses (trades, civil, mechanical, electrical, GCs, developers). |
| `notes` / `enrichment_source` | Specific hook for personalized outreach (e.g., *"Lists construction & real estate industry page; 4 Review-licensed partners in Burnaby"*). |

---

## 3. Targeting Tier Rubric

Score enriched firms into tiers before moving them into outreach:

- **Tier 1 — Priority Targets (Outreach First)**
  - `Registered`, `review_count > 0` (or `audit_count > 0`), `2–25` practitioners, located in Burnaby / Vancouver / Surrey / Langley / Abbotsford / Coquitlam, **and** explicitly mentions construction, trades, developers, or WIP/assurance for private businesses on their website/LinkedIn.
- **Tier 2 — Strong General Commercial Targets**
  - `Registered`, `review_count > 0` (or `audit_count > 0`), `2–25` practitioners, active commercial/corporate accounting website, no explicit construction page yet (still strong candidates for Review Engagement referrals).
- **Tier 3 — Low Priority / Niche**
  - Sole practitioners with Review/Audit licences, large national firms (`25+` practitioners), or Compilation-only firms with clear construction client bases (reverse-referral only).
- **Exclude / Disqualify**
  - Personal-tax-only / T1 / wealth-management-only firms, inactive/no-web-presence practices, or firms with `public_notice` flags.

---

## 4. Suggested SQL Query to Pull Initial Enrichment Queue

```sql
SELECT
    firm_id,
    firm_name,
    city,
    address,
    phone,
    practitioner_count,
    review_count,
    audit_count,
    compilation_count,
    detail_url
FROM firms
WHERE current_status = 'Registered'
  AND (public_notice IS NULL OR public_notice = '')
  AND (review_count > 0 OR audit_count > 0)
  AND practitioner_count BETWEEN 2 AND 25
ORDER BY
    CASE
        WHEN city IN ('Burnaby', 'Surrey', 'Vancouver', 'Langley', 'Coquitlam', 'Abbotsford') THEN 0
        ELSE 1
    END,
    (review_count + audit_count) DESC,
    practitioner_count DESC;
```

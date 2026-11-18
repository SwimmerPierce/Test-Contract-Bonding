# Missed Items & Operational Readiness Todo List (9 Critical Gaps Found in Audit)

Your initial 8-bullet summary covered the core site, backend, cross-sell, SEO/outbound, and checklist items—but our codebase and statutory audit uncovered **9 additional items** that are essential to stay compliant, pass regulatory scrutiny, and convert incoming leads into paid commissions.

---

## 1. Delete or Replace Placeholder Testimonials ([index.html#L591-L607](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L591-L607)) — *CRITICAL*
- **Why Missed:** Not included in branding updates alone.
- **The Law:** Federal ***Competition Act* (s. 52 & s. 74.01)** strictly prohibits unverified/fabricated reviews (with major Administrative Monetary Penalties), and the **Insurance Council of BC Code of Conduct** restricts unconsented or confidential client testimonials.
- **Todo:**
  - [ ] Remove both generic `blockquote.quote-card` blocks (`"Commercial Electrical Contractor, Burnaby, BC"` and `"Civil & Excavation Principal, Lower Mainland, BC"`) immediately before DNS cutover.
  - [ ] Collect 2–3 real client testimonials with **signed written marketing consent** (containing zero confidential claim/file numbers) before re-enabling a testimonials block.

## 2. Add Physical Address, Phone, Hours & Privacy Officer to Website ([index.html#L613-L662](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L613-L662)) — *CRITICAL*
- **Why Missed:** Current footer only says `Burnaby, BC` with no street address, phone number, or Privacy Officer.
- **The Law:** **BC PIPA (s. 5 & s. 10)**, **Alberta PIPA (s. 6(2))**, **CASL (s. 6)**, and **Insurance Council Code of Conduct**.
- **Todo:**
  - [ ] Add `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, `Tel: 604-420-2501`, `Hours: Mon–Fri 8:30 AM – 4:30 PM PT`, and Privacy Officer designation to the footer and confirmation emails.

## 3. Apply for Chase's Individual Alberta Non-Resident Level 1 Licence (`AB Insurance Act s. 452`) — *CRITICAL*
- **Why Missed:** Nexus's corporate Alberta license does **not** license you individually to quote or solicit Alberta contractors.
- **Todo:**
  - [ ] Apply on `abcouncil.ab.ca` via **BC–Alberta Reciprocity** (no Alberta exam needed; requires CIPR number, BC licence check, Criminal Record Check, E&O confirmation, and Father's Designated Representative sponsorship).
  - [ ] Enforce a strict interim office rule: route **100% of Alberta leads** immediately at intake to an individually AIC-licensed Nexus broker until your certificate is issued.

## 4. Publish BC Financial Products Disclosure Notice (`B.C. Reg. 573/2004`) & `terms.html` — *HIGH URGENCY*
- **Why Missed:** Privacy policy alone does not satisfy BC's insurance-specific intermediary disclosure regulation.
- **The Law:** ***Financial Products Disclosure Regulation* (B.C. Reg. 573/2004)** under the BC *Financial Institutions Act* & **CISRO Principles of Conduct**.
- **Todo:**
  - [ ] Create `terms.html` (`/terms`) disclosing Nexus's represented surety markets, absence of insurer ownership ties, commission/fee structure, and out-of-province referral fee disclosure.

## 5. Add Province Dropdown, Out-of-Province Referral Consent & Pre-Signed Partner Agreements — *HIGH URGENCY*
- **Why Missed:** Your notes mentioned making out-of-province referral arrangements *"as it happens"*, which creates unlicensed solicitation and PIPA violation risks.
- **Todo:**
  - [ ] Update [index.html#L578](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L578) from `"across British Columbia and Canada"` to `"Licensed in British Columbia & Alberta (with licensed partner referrals across Canada)"`.
  - [ ] Add the **Province** selector and referral-fee disclosure consent to both modals ([spec](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/01-website-branding-disclaimers-privacy-and-forms-spec.md)).
  - [ ] Pre-execute broker-to-broker referral agreements with 1 vetted surety brokerage each in **Ontario (RIBO)**, **Saskatchewan (GICS)**, and **Manitoba (ICM)** payable strictly to **Nexus Insurance Brokers Ltd.**
  - [ ] Set a growth trigger: once Ontario, SK, or MB generates 3+ qualified facilities/year, have Nexus (via your father's CAIB 4 / Level 3) apply for non-resident corporate licensing there to keep 100% of commissions.

## 6. Implement Level 1 Supervision Trail & Rule 6 Sign-Off (`Council Rule 6(1)(a) & (c)`) — *HIGH URGENCY*
- **Todo:**
  - [ ] Give Father (Level 3 Nominee) `/admin` access and add `assigned_broker` + `supervising_agent` columns in [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js) and [admin/index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html).
  - [ ] Establish a written rule that **no Level 1 broker signs or seals any bond or Consent of Surety** (`Rule 6(1)(a)`).

## 7. Build CASL 6-Month Implied Consent Expiry Tracker (`CASL s. 10(9) & s. 13`) — *MEDIUM URGENCY*
- **Why Missed:** Unconverted form inquiries expire after **6 months** under CASL unless express opt-in was checked or the contractor became an active client (2-year EBR).
- **Todo:**
  - [ ] Store `consent_timestamp`, `marketing_opt_in`, and `casl_implied_expires_at` (`NOW() + 6 months`) in `surety_leads` and surface expiry status in `/admin`.

## 8. Complete Technical SEO & Production Cutover Hygiene — *PRE-LAUNCH*
- **Todo:**
  - [ ] Create `robots.txt` (allowing `/` and public landing pages, disallowing `/admin` and `/api/`).
  - [ ] Create `sitemap.xml` listing `/` and all 8 SEO landing pages + `/privacy` + `/terms`.
  - [ ] Add `InsuranceAgency` **JSON-LD structured data** to `index.html` containing Nexus's exact Burnaby NAP (Name, Address, Phone) and `contractbonding.ca` URL.
  - [ ] Configure `contractbonding.ca` custom domain in Vercel, force HTTPS/www redirect (`contractbonding.ca` canonical), verify `@vercel/analytics` in [package.json#L13](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/package.json#L13), and run `npm test` (`test-suite.js`) after final edits.

## 9. Prepare Your Post-Lead "Underwriting Intake & Cross-Sell Packet" — *CONVERSION READY*
- **Why Missed:** A website lead only turns into commission if you can move the contractor through surety underwriting faster than competing brokers.
- **Todo:**
  - [ ] Assemble a clean Google Drive / SharePoint / BMS folder of standard fillable surety forms from Nexus's top 3–4 surety markets (e.g., Intact, Trisura, Travelers, Aviva) + a **Commercial Insurance Quick-Quote Sheet** (CGL, Tools, Builders Risk, Commercial Auto) ready to send within 15 minutes of every lead alert!

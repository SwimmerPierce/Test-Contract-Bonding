# Missed Items & Operational Readiness Todo List (9 Critical Gaps Found in Audit)

Your initial 8-bullet summary covered the core site, backend, cross-sell, SEO/outbound, and checklist items—but our codebase and statutory audit uncovered **9 additional items** that are essential to stay compliant, pass regulatory scrutiny, and convert incoming leads into paid commissions.

---

## 1. Delete or Replace Placeholder Testimonials ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)) — *CRITICAL*
- **Why Missed:** Not included in branding updates alone.
- **The Law:** Federal ***Competition Act* (s. 52 & s. 74.01)** strictly prohibits unverified/fabricated reviews (with major Administrative Monetary Penalties), and the **Insurance Council of BC Code of Conduct** restricts unconsented or confidential client testimonials.
- **Todo:**
  - [x] Removed both generic `blockquote.quote-card` blocks (`"Commercial Electrical Contractor, Burnaby, BC"` and `"Civil & Excavation Principal, Lower Mainland, BC"`) from [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html).
  - [ ] **[Human Post-Launch Action]:** Collect 2–3 real client testimonials with **signed written marketing consent** (containing zero confidential claim/file numbers) before re-enabling a testimonials block.

## 2. Add Physical Address, Phone, Hours & Privacy Officer to Website ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)) — *CRITICAL*
- **Why Missed:** Current footer only says `Burnaby, BC` with no street address, phone number, or Privacy Officer.
- **The Law:** **BC PIPA (s. 5 & s. 10)**, **Alberta PIPA (s. 6(2))**, **CASL (s. 6)**, and **Insurance Council Code of Conduct**.
- **Todo:**
  - [x] Added `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, `Tel: 604-420-2501`, `Hours: Mon–Fri 8:30 AM – 4:30 PM PT`, and Privacy Officer designation to [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html) and [lib/email.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/email.js) confirmation emails.
  - [ ] **[Human Action]:** Confirm live Privacy Officer mailbox (`privacy@nexusinsurancebrokers.com`).

## 3. Apply for Chase's Individual Alberta Non-Resident Level 1 Licence (`AB Insurance Act s. 452`) — *CRITICAL*
- **Why Missed:** Nexus's corporate Alberta license does **not** license you individually to quote or solicit Alberta contractors.
- **Todo:**
  - [ ] **[Human Action — Chase & Ken]:** Apply on `abcouncil.ab.ca` via **BC–Alberta Reciprocity** (no Alberta exam needed; requires CIPR number, BC licence check, Criminal Record Check, E&O confirmation, and Father's Designated Representative sponsorship).
  - [x] Built automated interim Alberta lead routing in [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js) (`AB` leads auto-assign to `"AIC-Licensed Nexus Broker (Interim AB Routing)"`) and [lib/email.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/email.js).
  - [ ] **[Human Interim Rule]:** Enforce office rule routing **100% of Alberta leads** at intake to an individually AIC-licensed Nexus broker until Chase's certificate is issued.

## 4. Publish BC Financial Products Disclosure Notice (`B.C. Reg. 573/2004`) & `terms.html` — *HIGH URGENCY*
- **Why Missed:** Privacy policy alone does not satisfy BC's insurance-specific intermediary disclosure regulation.
- **The Law:** ***Financial Products Disclosure Regulation* (B.C. Reg. 573/2004)** under the BC *Financial Institutions Act* & **CISRO Principles of Conduct**.
- **Todo:**
  - [x] Created page outline folder [notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md).
  - [ ] **[Finish Page & Broker Review]:** Build `terms.html` (`/terms`) once Option 1 vs. Option 2 ownership attribution & `B.C. Reg. 573/2004` disclosures are verified by Nexus's Level 3 Nominee.

## 5. Add Province Dropdown, Out-of-Province Referral Consent & Pre-Signed Partner Agreements — *HIGH URGENCY*
- **Why Missed:** Your notes mentioned making out-of-province referral arrangements *"as it happens"*, which creates unlicensed solicitation and PIPA violation risks.
- **Todo:**
  - [x] Updated [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html) from `"across British Columbia and Canada"` to `"in British Columbia and Alberta (with licensed partner brokerage referrals across Canada)"`.
  - [x] Added the **Province** selector and referral-fee disclosure consent to `#contact-form`, `#apply-form`, and `#checklist-form` + automatic `"Out-of-Province Referral Partner"` assignment in [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js).
  - [ ] **[Human Action]:** Pre-execute broker-to-broker referral agreements with 1 vetted surety brokerage each in **Ontario (RIBO)**, **Saskatchewan (GICS)**, and **Manitoba (ICM)** payable strictly to **Nexus Insurance Brokers Ltd.**
  - [ ] **[Human Growth Trigger]:** Once Ontario, SK, or MB generates 3+ qualified facilities/year, have Nexus (via Ken's CAIB 4 / Level 3) apply for non-resident corporate licensing there to keep 100% of commissions.

## 6. Implement Level 1 Supervision Trail & Rule 6 Sign-Off (`Council Rule 6(1)(a) & (c)`) — *HIGH URGENCY*
- **Todo:**
  - [x] Added `assigned_broker` + `supervising_agent` columns in [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js) and `/admin` ([admin/index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html) & [admin/admin.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/admin.js)).
  - [x] Implemented multi-broker `/admin` logins in [lib/auth.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/auth.js) & [admin/index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html) (`chase`, `ken`, and `nathan` @nexusinsurancebrokers.com) with 20-character secure passwords and anti-reconnaissance UI hardening.
  - [ ] **[Human Action — Chase & Ken]:** Add `ADMIN_PASSWORD_CHASE`, `ADMIN_PASSWORD_KEN`, and `ADMIN_PASSWORD_NATHAN` to Vercel Production Environment Variables, provide Ken (Level 3 Nominee) his credentials, and establish the written rule (deferred with Stage 0 Supervision Protocol) that **no Level 1 broker signs or seals any bond or Consent of Surety** (`Rule 6(1)(a)`).

## 7. Build CASL 6-Month Implied Consent Expiry Tracker (`CASL s. 10(9) & s. 13`) — *MEDIUM URGENCY*
- **Why Missed:** Unconverted form inquiries expire after **6 months** under CASL unless express opt-in was checked or the contractor became an active client (2-year EBR).
- **Todo:**
  - [x] Stored `consent_timestamp`, `marketing_opt_in`, and `casl_implied_expires_at` (`NOW() + 6 months`) in `surety_leads` and surfaced Express / Implied / Expired badges in `/admin` and CSV export.

## 8. Complete Technical SEO & Production Cutover Hygiene — *PRE-LAUNCH*
- **Todo:**
  - [x] Created [robots.txt](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/robots.txt) (allowing `/` and disallowing `/admin` and `/api/`).
  - [x] Created [sitemap.xml](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/sitemap.xml) listing `/` (with `/privacy`, `/terms`, and all 8 SEO landing pages staged in comments ready to uncomment upon page completion & broker approval).
  - [x] Added `InsuranceAgency` **JSON-LD structured data** to [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html) containing Nexus's exact Burnaby NAP and `contractbonding.ca` URL.
  - [x] Verified `@vercel/analytics` in [package.json#L13](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/package.json#L13) and verified `npm test` (`test-suite.js`) passes after edits.
  - [ ] **[Human Action]:** Complete `privacy.html` & `terms.html` + Stage 0 ownership agreement, then configure `contractbonding.ca` custom domain and HTTPS/www redirect in Vercel.

## 9. Prepare Your Post-Lead "Underwriting Intake & Cross-Sell Packet" — *CONVERSION READY*
- **Why Missed:** A website lead only turns into commission if you can move the contractor through surety underwriting faster than competing brokers.
- **Todo:**
  - [x] Created the **Post-Lead Underwriting Intake Checklist & Commercial Insurance Quick-Quote Sheet** template in [notes/channel-5-cross-sell-and-nurture/01-casl-4-email-drip-and-underwriting-intake-packet.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/channel-5-cross-sell-and-nurture/01-casl-4-email-drip-and-underwriting-intake-packet.md).
  - [ ] **[Human Action]:** Assemble a clean Google Drive / SharePoint / BMS folder of actual fillable carrier PDFs from Nexus's top 3–4 surety markets (Intact, Trisura, Travelers, Aviva) ready to attach within 15 minutes of every lead alert!

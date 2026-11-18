# Master Action Plan & Sequenced Todo Roadmap (`contractbonding.ca`)

This folder contains the complete technical, legal/compliance, and marketing execution blueprints for everything required to take `https://test-contract-bonding.vercel.app/` live on `contractbonding.ca` safely and profitably.

---

## Navigation Index for This Folder

| File | Scope Covered |
| :--- | :--- |
| **[00-master-todo-roadmap.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/00-master-todo-roadmap.md)** | This master prioritized checklist across every phase (Launch Blockers -> Marketing Scale) |
| **[01-website-branding-disclaimers-privacy-and-forms-spec.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/01-website-branding-disclaimers-privacy-and-forms-spec.md)** | Exact code & copy changes for `index.html` branding, disclaimers, calculator minimums, Privacy Policy (`privacy.html`), Terms/B.C. Reg. 573/2004 (`terms.html`), Province selector, CASL/PIPA checkboxes, and Cross-Sell checkbox |
| **[02-backend-email-alerts-canada-hosting-and-admin-security.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/02-backend-email-alerts-canada-hosting-and-admin-security.md)** | Drop-in specs for `api/leads.js` email alerts, `vercel.json` Canadian region pinning (`yyz1`), Neon `aws-ca-central-1` migration, `/api/auth` brute-force rate limiting, spam protection, `lib/db.js` schema updates, and `/admin` supervisor audit UI |
| **[03-marketing-channels-1-to-5-execution-playbook.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/03-marketing-channels-1-to-5-execution-playbook.md)** | Sub-tasks, outreach scripts, SEO page blueprints (8 pages), Google Search Ads config, CPA/Banker flywheel, and Cross-Sell scripts across **Channels 1–5** |
| **[04-first-time-bonding-readiness-checklist-lead-magnet.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/04-first-time-bonding-readiness-checklist-lead-magnet.md)** | Full publication-ready text for the **"First-Time Contractor Bonding Readiness Checklist (PDF)"** + HTML/JS capture modal blueprint |
| **[05-missed-items-and-operational-readiness-todo.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/05-missed-items-and-operational-readiness-todo.md)** | All **9 critical items missed on the initial 8-bullet list** (testimonials removal, physical address/Privacy Officer, AIC non-resident licence, B.C. Reg. 573/2004, CASL 6-month expiry tracking, SEO technical cutover, underwriting intake packet, etc.) |

---

## Sequenced Master Checklist

### Stage 0: Ownership Structure Selection (Day 1)
- [ ] Choose either **Option 1** ([option-1-personal-ip-license](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/option-1-personal-ip-license/00-option-1-todo-checklist.md)) or **Option 2** ([option-2-nexus-corporate-ownership](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/option-2-nexus-corporate-ownership/00-option-2-todo-checklist.md)) and execute the written agreement with Nexus Insurance Brokers Ltd. before taking live leads.
- [ ] Notify Nexus's E&O insurer (`Rule 7(11)`), file DBA/trade name updates if adopted (`Rule 7(3)(d)` / `AB s. 490`), and sign the Level 1 Supervision Protocol (`Rule 6(1)(a) & (c)`).
- [ ] Submit Chase's reciprocal **AIC Non-Resident General Level 1 Licence** application (`abcouncil.ab.ca`) — route 100% of Alberta leads to an AIC-licensed Nexus broker in the interim.

### Stage 1: Tier 1 Launch Blockers — Website Compliance & Liability Protection (Days 2–5)
*(Must complete BEFORE pointing `contractbonding.ca` DNS or spending $1 on ads)*
- [ ] **1. Update [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html) Entity Branding:** Replace `"Trusted Broker Partner"` and independent-entity copy with `"contractbonding.ca — A Surety Bond Service Operated by Nexus Insurance Brokers Ltd."` ([spec](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/01-website-branding-disclaimers-privacy-and-forms-spec.md#section-1-update-indexhtml-entity-branding--contact-details)).
- [ ] **2. Delete Placeholder Testimonials:** Remove [index.html#L591-L607](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L591-L607) (*Competition Act s. 52 & s. 74.01* / *ICBCouncil Code of Conduct*).
- [ ] **3. Add Nexus Physical Address, Phone, Hours & Privacy Officer Contact:** Add `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, `604-420-2501`, and `Mon–Fri 8:30 AM – 4:30 PM PT` to footer & modals.
- [ ] **4. Add Disclaimers & Fix Calculator Minimums:** Add *"Submitting online does not bind coverage"* and *"Bid Bond within 48 hours? Call 604-420-2501"* disclaimers + enforce realistic minimum bond premiums (`$250+` floor) in [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js#L115-L174).
- [ ] **5. Publish Privacy Policy (`privacy.html`) & Financial Products Disclosure / Terms (`terms.html`):** Include mandatory **Alberta PIPA s. 13.1 & s. 6(2)** cross-border data notice and **B.C. Reg. 573/2004** insurer/compensation disclosures.
- [ ] **6. Update Modals & Database Schema for Form Checkboxes:** Add Province dropdown, **Commercial Insurance Cross-Sell Checkbox**, mandatory Privacy/Referral consent, and unbundled **CASL Express Marketing Opt-In** ([spec](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/01-website-branding-disclaimers-privacy-and-forms-spec.md#section-4-form-checkboxes-province-selector--commercial-insurance-cross-sell)).

### Stage 2: Tier 2 Technical & Security Hardening (Days 4–10)
- [ ] **7. Add Instant Email Alerts in [api/leads.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js):** Trigger immediate internal `[URGENT TENDER]` broker alert emails + CASL-compliant applicant confirmations ([spec](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/02-backend-email-alerts-canada-hosting-and-admin-security.md#section-1-instant-email-alerts-in-apileadsjs)).
- [ ] **8. Pin Hosting & Database to Canada:** Update [vercel.json](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/vercel.json) (`"regions": ["yyz1"]` + security headers) and provision production Neon Postgres in `aws-ca-central-1` (Montreal).
- [ ] **9. Harden `/admin` & Add Supervision Tracking:** Add brute-force rate limiting in [api/auth.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/auth.js), honeypot/anti-spam on `/api/leads`, and `assigned_broker` / `supervising_agent` / `casl_implied_expires_at` fields in [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js) and [admin/index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html).
- [ ] **10. Technical SEO & Production DNS Cutover:** Deploy `robots.txt`, `sitemap.xml`, `InsuranceAgency` JSON-LD schema, verify `npm test` passes, and point `contractbonding.ca` DNS to Vercel ([missed items guide](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/05-missed-items-and-operational-readiness-todo.md)).

### Stage 3: High-ROI Marketing & Conversion Launch (Weeks 2–6)
- [ ] **11. Publish Downloadable Lead Magnet:** Generate the PDF from [04-first-time-bonding-readiness-checklist-lead-magnet.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/04-first-time-bonding-readiness-checklist-lead-magnet.md) and embed the checklist capture strip/modal on `contractbonding.ca`.
- [ ] **12. Build Outbound Engine (Channel 1):** Launch weekly **BC Bid & APC** awards/unverified-bids prospecting + TSBC/Service Alberta `$10k` license-bond outreach + Developer LOC replacement letters.
- [ ] **13. Publish 8 High-Intent SEO Pages (Channel 2):** Deploy the 8 clean-URL landing pages (starting with `/bc-electrical-gas-contractor-bond`, `/alberta-prepaid-contractor-bond`, and `/bid-bonds-bc`) + optimize Google Business Profile.
- [ ] **14. Launch Surgical Google Search Ads (Channel 3):** Complete Google Ads Financial Services verification, configure 4 exact/phrase-match ad groups, load the negative keyword list (`-bail -jail -court -fidelity...`), and link traffic to `#calculator`.
- [ ] **15. Build Construction CPA & Banker Network (Channel 4):** Pitch 10 Metro Vancouver & Alberta construction CPAs + 10 commercial bankers with the 1-page surety ratio cheat sheet.
- [ ] **16. Activate Cross-Sell & CASL Nurture (Channel 5):** Use the Commercial Insurance cross-sell call script on every `$10k` license-bond client and launch the 4-email educational drip sequence for opted-in checklist downloaders.

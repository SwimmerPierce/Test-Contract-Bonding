# Combined Printable To-Do List — `contractbonding.ca` Launch & Growth

**Source:** Consolidated from all open (unchecked) action items across `notes/`  
**Total Open Tasks:** 27 (grouped by Task Type, ordered by Priority Order `P1` → `P27`)  
**Total Estimated Time:** 1,445 minutes (~24.1 hours across all 5 roles)

> **Priority Order Rule:** Highest priority (`P1`) = lowest estimated time + highest launch importance (`Very High` / `High`). Lowest priority (`P27`) = highest estimated time + lowest launch importance (`Low`).  
> **Launch Importance Rubric:**  
> - **Very High:** Needed to launch AND blocking multiple launch-critical tasks.  
> - **High:** Needed to launch, OR blocking many launch-critical tasks.  
> - **Medium:** Blocking 1 important task / post-launch channel, can launch core site without it.  
> - **Low:** Blocking 0 launch-critical tasks; post-launch optimization or growth.

---

## Summary by Task Type

| Task Type | Tasks | Total Time (min) | Highest Priority |
| :--- | :---: | :---: | :---: |
| **1. Legal Review** | 5 | 290 min | `P4` |
| **2. System Admin Review** | 6 | 195 min | `P3` |
| **3. Broker Review** | 6 | 210 min | `P1` |
| **4. Web Dev Review** | 4 | 165 min | `P10` |
| **5. Marketing Review** | 6 | 585 min | `P17` |

---

## 1. Legal Review

### [ ] Task: Sign Level 1 Supervision Protocol (`Rule 6(1)(a) & (c)`)
- **Task Type:** Legal Review
- **Priority Order:** `P4`
- **Estimated Time:** 20 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks compliant Level 1 lead handling & `/admin` supervision)*
- **Task Description:** Execute the Level 1 Supervision Protocol between Chase and Ken (Level 3 Nominee) establishing that no Level 1 broker signs or seals any bond or Consent of Surety.
- **Sub-Tasks:**
  - [ ] Review template in `notes/legal_package/archive/option-1-personal-ip-license/03-level-1-supervision-and-operating-protocol.md`
  - [ ] Confirm operational rule that no Level 1 broker signs or seals any bond or Consent of Surety
  - [ ] Sign and file the protocol in Nexus's compliance/supervision records

---

### [ ] Task: Execute & Sign Option 1 Legal Package (License Addendum & BCBCA Resolution)
- **Task Type:** Legal Review
- **Priority Order:** `P8`
- **Estimated Time:** 45 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks DNS cutover, E&O notice, DBA filings, and ad launch)*
- **Task Description:** Fill in all bracketed fields and execute the finalized Option 1 Domain & Platform License Addendum and BCBCA Related-Party Resolution before taking live leads or pointing DNS.
- **Sub-Tasks:**
  - [ ] Fill in bracketed fields (`[DATE]`, `[LICENCE_NO]`, `[CHASE_ADDRESS]`, `[INC_NO]`, `[AGENCY_LICENCE_NO]`, `[SUITE_NO]`, `[POSTAL_CODE]`, `[NAME OF MINORITY SHAREHOLDER / VP]`)
  - [ ] Sign `notes/legal_package/01_Domain_and_Platform_License_Addendum_(Execution_Ready).docx` (Chase Pierce Addison, Kenneth James Addison, VP / Minority Shareholder)
  - [ ] Sign `notes/legal_package/02_BCBCA_Related_Party_Resolution_(Minute_Book).docx` (Kenneth James Addison, VP / Minority Shareholder — BCBCA ss. 147–149 & s. 227)
  - [ ] Place both signed documents in Nexus's corporate minute book (per `03_Summary_and_Signing_Checklist_for_Ken.docx`)

---

### [ ] Task: Notify E&O Insurer & File DBA / Trade Name Updates (`Rule 7(11)`, `Rule 7(3)(d)`, `AB s. 490`)
- **Task Type:** Legal Review
- **Priority Order:** `P12`
- **Estimated Time:** 45 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** High *(needed to launch compliantly)*
- **Task Description:** Have Ken (Level 3 Nominee) send written notification to Nexus's E&O insurer confirming `contractbonding.ca` is an approved online surety channel/DBA, and complete required BC Corporate Registry / ICBC / AIC DBA filings.
- **Sub-Tasks:**
  - [ ] Customize and send written E&O notification using templates in `notes/legal_package/archive/option-1-personal-ip-license/02-regulatory-dba-and-eo-notification-templates.md`
  - [ ] Complete BC Corporate Registry, Insurance Council of BC, and AIC DBA / trade name filings for `contractbonding.ca`
  - [ ] Confirm E&O carrier accepts Option 1 exclusive license (no Option 2 fallback required)

---

### [ ] Task: Submit Chase's Reciprocal AIC Non-Resident General Level 1 Licence (`abcouncil.ab.ca`)
- **Task Type:** Legal Review
- **Priority Order:** `P13`
- **Estimated Time:** 60 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** High *(blocks Alberta SEO pages, Alberta Google Ads, and Alberta outbound callbacks)*
- **Task Description:** Submit Chase's BC–Alberta reciprocity application on `abcouncil.ab.ca` (no Alberta exam required) and enforce interim 100% Alberta lead routing to an individually AIC-licensed Nexus broker until active.
- **Sub-Tasks:**
  - [ ] Gather CIPR number, BC licence check, Criminal Record Check, E&O confirmation, and Ken's Designated Representative sponsorship
  - [ ] Submit reciprocity application on `abcouncil.ab.ca`
  - [ ] Enforce Nexus office interim rule routing 100% of Alberta (`AB`) inquiries/applications to an individually AIC-licensed Nexus broker until Chase's certificate is issued

---

### [ ] Task: Pre-Execute Interprovincial Broker-to-Broker Referral Agreements (ON, SK, MB)
- **Task Type:** Legal Review
- **Priority Order:** `P21`
- **Estimated Time:** 120 min
- **Estimated Difficulty:** Hard
- **Estimated Importance to Launch:** Medium *(blocks out-of-province referral monetization; BC/AB can launch without it)*
- **Task Description:** Execute broker-to-broker referral agreements with 1 vetted surety brokerage each in Ontario (RIBO), Saskatchewan (GICS), and Manitoba (ICM), payable strictly to Nexus Insurance Brokers Ltd., before accepting/referring out-of-province leads.
- **Sub-Tasks:**
  - [ ] Identify and vet 1 surety brokerage each in Ontario (RIBO), Saskatchewan (GICS), and Manitoba (ICM)
  - [ ] Customize and execute referral agreement templates (`04-interprovincial-broker-referral-agreement-template.md`) payable to Nexus Insurance Brokers Ltd.
  - [ ] Track provincial volume post-launch for corporate non-resident licensing trigger (3+ qualified facilities/year in ON, SK, or MB)

---

## 2. System Admin Review

### [ ] Task: Set `/admin` Broker Passwords in Vercel & Create `"CB-WEB"` CRM Tag
- **Task Type:** System Admin Review
- **Priority Order:** `P3`
- **Estimated Time:** 15 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks broker lead access and supervision trail)*
- **Task Description:** Configure `ADMIN_PASSWORD_CHASE`, `ADMIN_PASSWORD_KEN`, `ADMIN_PASSWORD_NATHAN` (and optional master `ADMIN_PASSWORD`) in Vercel Production Environment Variables, distribute credentials, and add the `"CB-WEB"` tag in Nexus's CRM/BMS.
- **Sub-Tasks:**
  - [ ] Add `ADMIN_PASSWORD_CHASE`, `ADMIN_PASSWORD_KEN`, and `ADMIN_PASSWORD_NATHAN` to Vercel Project Settings -> Environment Variables
  - [ ] Securely share `/admin` login credentials with Ken (Level 3 Nominee) and Nathan
  - [ ] Create `"CB-WEB"` source tracking tag in Nexus's CRM / BMS

---

### [ ] Task: Provision Neon Postgres in Canada (`aws-ca-central-1`) & Verify Vercel Region (`yul1`)
- **Task Type:** System Admin Review
- **Priority Order:** `P5`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks `privacy.html` residency sign-off and live lead storage)*
- **Task Description:** Provision the production Neon Postgres database in AWS Canada (Central) — `ca-central-1` (Montréal), update `DATABASE_URL` in Vercel, and verify Vercel Functions run in `yul1` (Montréal).
- **Sub-Tasks:**
  - [ ] Create production Neon Postgres project in `aws-ca-central-1` (Montréal) at `console.neon.tech`
  - [ ] Update `DATABASE_URL` in Vercel Project Settings -> Environment Variables
  - [ ] Verify `ensureSchema()` initializes `surety_leads` and `auth_attempts` tables
  - [ ] Verify Vercel Project Settings -> Functions -> Function Region displays `Montréal, Canada (yul1)` (or plan default)

---

### [ ] Task: Configure Resend (`resend.com`), SPF/DKIM/DMARC DNS & Test Live Lead Email
- **Task Type:** System Admin Review
- **Priority Order:** `P6`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks instant lead alerts and `privacy.html` email residency verification)*
- **Task Description:** Create/verify the Resend account for `contractbonding.ca` (or `mail.contractbonding.ca`), configure SPF/DKIM/DMARC DNS records, set Resend environment variables in Vercel and local `.env`, and verify test lead email delivery.
- **Sub-Tasks:**
  - [ ] Create/verify Resend account (`resend.com`) and verify `contractbonding.ca` (or `mail.contractbonding.ca`) with SPF, DKIM, and DMARC DNS records
  - [ ] Set `RESEND_API_KEY`, `ALERT_TO_EMAILS`, and `ALERT_FROM_EMAIL` in Vercel Environment Variables and local `.env`
  - [ ] Submit one test lead and verify both internal broker alert and applicant confirmation email arrive in inbox (not spam)

---

### [ ] Task: Configure Production Custom Domain (`contractbonding.ca`), DNS Cutover & Search Console
- **Task Type:** System Admin Review
- **Priority Order:** `P7`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Very High *(final go-live cutover; blocks Google Ads domain verification and SEO indexing)*
- **Task Description:** After Stage 0 legal execution and `privacy.html`/`terms.html` broker sign-off, point `contractbonding.ca` CIRA DNS records to Vercel, enable HTTPS/www canonical redirect, verify analytics, and submit `sitemap.xml` in Google Search Console.
- **Sub-Tasks:**
  - [ ] Confirm Stage 0 legal agreements are signed and `privacy.html` & `terms.html` are broker-approved (hard blocker gate)
  - [ ] Configure `contractbonding.ca` custom domain and HTTPS/www canonical redirect in Vercel
  - [ ] Point CIRA domain DNS records to Vercel and verify domain ownership in Google Search Console (TXT record)
  - [ ] Verify `@vercel/analytics` in Vercel dashboard and submit `sitemap.xml` in Google Search Console

---

### [ ] Task: Set Up Google Workspace Mailboxes, Aliases & DNS MX/TXT Records
- **Task Type:** System Admin Review
- **Priority Order:** `P11`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** High *(needed to launch professional broker email; blocks outbound/reply inbox readiness)*
- **Task Description:** Provision Google Workspace for `contractbonding.ca` (primary broker user + `info@` and `bonds@` aliases/groups) and add MX and TXT verification records to the DNS host.
- **Sub-Tasks:**
  - [ ] Provision Google Workspace account and primary user (`chase@contractbonding.ca`, or route to `chase@nexusinsurancebrokers.com`)
  - [ ] Configure free aliases or shared groups for `info@contractbonding.ca` and `bonds@contractbonding.ca` *(Privacy Officer uses existing `info@nexusinsurancebrokers.com`)*
  - [ ] Add Google Workspace MX records and TXT domain verification records to `contractbonding.ca` DNS

---

### [ ] Task: Assemble Fillable Surety Carrier Forms & Load 4-Email CASL Drip in CRM
- **Task Type:** System Admin Review
- **Priority Order:** `P18`
- **Estimated Time:** 60 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Medium *(blocks Channel 5 conversion/nurture automation; core site can launch without it)*
- **Task Description:** Organize fillable carrier PDFs from Nexus's top 3–4 surety markets in SharePoint/BMS/Google Drive for <15-minute post-lead dispatch, and load the 4-email CASL nurture sequence into Nexus's CRM/email tool.
- **Sub-Tasks:**
  - [ ] Assemble fillable surety application/questionnaire PDFs from Intact, Trisura, Travelers, and Aviva in SharePoint / BMS / Google Drive
  - [ ] Save the 6-Item Contractor Document Request reply template for rapid post-lead dispatch
  - [ ] Load the 4-email CASL drip sequence into Nexus's email/CRM tool filtered strictly by `marketing_opt_in = true` or non-expired `casl_implied_expires_at` (with Burnaby address, phone, and 1-click unsubscribe)

---

## 3. Broker Review

### [ ] Task: Approve `privacy.html` (Privacy Officer & Cloud Residency Verification)
- **Task Type:** Broker Review
- **Priority Order:** `P1`
- **Estimated Time:** 15 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks DNS cutover and `/privacy` sitemap activation)*
- **Task Description:** Have a licensed Nexus Level 3 broker review `privacy.html`, confirm whether a named Designated Privacy Officer should be listed alongside `info@nexusinsurancebrokers.com`, and verify production cloud/email hosting regions.
- **Sub-Tasks:**
  - [ ] Confirm whether a named Designated Privacy Officer should be listed alongside `info@nexusinsurancebrokers.com`
  - [ ] Verify production cloud/email data residency (`yul1` Montréal, `aws-ca-central-1`, Resend) matches `privacy.html`
  - [ ] Grant Level 3 broker sign-off on `privacy.html`

---

### [ ] Task: Approve `terms.html` (`B.C. Reg. 573/2004` Disclosures & Represented Sureties)
- **Task Type:** Broker Review
- **Priority Order:** `P2`
- **Estimated Time:** 15 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Very High *(needed to launch; blocks DNS cutover and `/terms` sitemap activation)*
- **Task Description:** Have Nexus's Level 3 Nominee verify the `B.C. Reg. 573/2004` insurer ownership conflict statement and list of represented surety markets in `terms.html` and grant final regulatory sign-off.
- **Sub-Tasks:**
  - [ ] Confirm no insurer ownership conflict statement under `B.C. Reg. 573/2004`
  - [ ] Verify accurate list of represented surety markets
  - [ ] Grant final regulatory sign-off on `terms.html`

---

### [ ] Task: Review `first-time-bonding-readiness-checklist.pdf` Underwriting Guidelines
- **Task Type:** Broker Review
- **Priority Order:** `P9`
- **Estimated Time:** 15 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** High *(live on homepage `#checklist-modal`; needed to launch lead magnet accurately)*
- **Task Description:** Review `assets/first-time-bonding-readiness-checklist.pdf` to confirm underwriting guidelines (`10%` working capital/equity rule of thumb, financial tiers, Burnaby NAP) match Nexus's surety markets.
- **Sub-Tasks:**
  - [ ] Verify `10%` working capital/equity rule of thumb and 3 C's underwriting copy
  - [ ] Confirm financial statement tier thresholds and Burnaby NAP details

---

### [ ] Task: Review Channel 4 CPA/Banker Cheat Sheet & Channel 5 Drip/Quick-Quote Copy
- **Task Type:** Broker Review
- **Priority Order:** `P14`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Medium *(blocks Channel 4 & Channel 5 outreach; core site can launch without it)*
- **Task Description:** Have Nexus's Level 3 broker review the financial ratios on the 1-Page CPA/Banker Surety Ratio Cheat Sheet and review the 4 CASL drip emails + Commercial Insurance Quick-Quote Sheet wording.
- **Sub-Tasks:**
  - [ ] Verify financial ratios on the 1-Page Cheat Sheet (`10%` working capital/equity, `<2.0x–3.0x` debt-to-equity, `$250k–$500k` Compilation vs. `$1M+` Review Engagement)
  - [ ] Review wording of the 4 CASL educational drip emails and Commercial Insurance Quick-Quote Sheet (`notes/channel-5-cross-sell-and-nurture/01-casl-4-email-drip-and-underwriting-intake-packet.md`)

---

### [ ] Task: AIC-Licensed Broker Review of Alberta SEO Landing Pages (Pages 2 & 8)
- **Task Type:** Broker Review
- **Priority Order:** `P16`
- **Estimated Time:** 45 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Medium *(gated on AIC licensing/routing; blocks Alberta SEO & Alberta Google Ads)*
- **Task Description:** Have an individually AIC-licensed Nexus broker review `/alberta-prepaid-contractor-bond` and `/calgary-edmonton-surety-bonds` and confirm the AIC licensing/routing gate (`AB Insurance Act s. 452`) before publishing.
- **Sub-Tasks:**
  - [ ] Confirm Chase's individual AIC Non-Resident Level 1 Licence (`abcouncil.ab.ca`) OR verified 100% automatic `/admin` routing to an individually AIC-licensed Nexus broker
  - [ ] Review `/alberta-prepaid-contractor-bond`: verify Service Alberta `$10,000` / `$25,000` bond amounts, wet-ink courier procedures, and Alberta regulatory wording
  - [ ] Review `/calgary-edmonton-surety-bonds`: verify Alberta *Public Works Act*, *Prompt Payment and Construction Lien Act*, and AIC disclosure copy

---

### [ ] Task: Broker Review of BC & General SEO Landing Pages (Pages 1, 3, 4, 5, 6, 7)
- **Task Type:** Broker Review
- **Priority Order:** `P19`
- **Estimated Time:** 90 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Medium *(core site can launch first; blocks SEO page publishing & matching Google Ad groups)*
- **Task Description:** Have a licensed Nexus (Level 3 where specified) broker review the 6 BC/general SEO landing pages for statutory, wording, premium, and underwriting accuracy prior to publishing and uncommenting in `sitemap.xml`.
- **Sub-Tasks:**
  - [ ] Review `/bc-electrical-gas-contractor-bond`: verify TSBC bond wording, `$250–$350+` minimum annual premium, and digital e-bond vs. wet-ink filing rules
  - [ ] Review `/bid-bonds-bc` (Level 3): verify digital E-Bond platform claims, Bid Bond minimum fees (`$250` vs. `$0` on active facilities), and CCDC 220 / statutory wording
  - [ ] Review `/performance-and-payment-bonds` (Level 3): verify CCDC 221/222 terminology, 50% vs. 100% rating explanation, and BC *Builders Lien Act* / prompt payment commentary
  - [ ] Review `/developer-subdivision-bonds` (Level 3): confirm Metro Vancouver / Fraser Valley / Alberta municipal LOC replacement acceptance and underwriting liquidity requirements
  - [ ] Review `/first-time-contractor-bonding` (Level 3): verify emerging contractor financial thresholds (`$250k–$500k` Compilation vs. `$1M+` Review), `$0` standby facility phrasing, and GIA explanation
  - [ ] Review `/burnaby-vancouver-surety-bonds`: verify Burnaby office parking/appointment instructions, GBP link consistency, and Lower Mainland obligee examples

---

## 4. Web Dev Review

### [ ] Task: Uncomment Approved Pages in `sitemap.xml` & Link from Navigation/Footer
- **Task Type:** Web Dev Review
- **Priority Order:** `P10`
- **Estimated Time:** 15 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** High *(needed for `/privacy` and `/terms` indexing at launch; SEO pages follow incrementally)*
- **Task Description:** Uncomment `/privacy`, `/terms`, and each of the 8 SEO landing page URLs in `sitemap.xml` (and add nav/footer links in `index.html`) strictly after their corresponding Broker Review and Licensing Gate sign-offs.
- **Sub-Tasks:**
  - [ ] Uncomment `/privacy` and `/terms` in `sitemap.xml` once Broker Review is signed off
  - [ ] Uncomment each approved SEO page URL in `sitemap.xml` as Broker Review (and Alberta AIC Licensing Gate) completes
  - [ ] Link approved SEO pages from `index.html` navigation/footer as appropriate

---

### [ ] Task: Configure Google Ads Conversion Tracking (`POST /api/leads` & `tel:6044202501`)
- **Task Type:** Web Dev Review
- **Priority Order:** `P15`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Medium *(blocks Channel 3 Google Ads launch; does not block site launch)*
- **Task Description:** Install Google Ads conversion tracking events firing strictly on successful `POST /api/leads` form submissions (Contact Us, Apply Now, Checklist Download) and `tel:6044202501` clicks — explicitly excluding calculator clicks or modal opens.
- **Sub-Tasks:**
  - [ ] Fire conversion event on `POST /api/leads` success across `#contact-form`, `#apply-form`, and `#checklist-form`
  - [ ] Fire conversion event on `tel:6044202501` clicks
  - [ ] Verify calculator button clicks and modal opens are NOT counted as conversions

---

### [ ] Task: Add Weekly Read-Only CSV Export in `BC_Bid_Organizer_Skill` (Personal Repo)
- **Task Type:** Web Dev Review
- **Priority Order:** `P23`
- **Estimated Time:** 60 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Low *(post-launch Channel 1 outbound automation; does not block site launch)*
- **Task Description:** In the separate personal repository (`SwimmerPierce/BC_Bid_Organizer_Skill`), add a read-only SQL query or Monday CSV export matching the Channel 1 tracker schema (`Bucket A`: `$75K–$250K` winners; `Bucket B`: 2nd–4th place bidders) and document portal coverage gaps.
- **Sub-Tasks:**
  - [ ] Add read-only query/CSV export script in `BC_Bid_Organizer_Skill` outputting Channel 1 Section 3 columns (`Pull Date, Source Portal, Bucket, Company Name, ...`)
  - [ ] Confirm which portals (`BC Bid`, municipal portals, APC, etc.) are covered daily vs. needing manual pulls
  - [ ] Keep `BC_Bid_Organizer_Skill` strictly separate and unmerged from the `contractbonding.ca` repo

---

### [ ] Task: Add Cloudflare Turnstile Invisible Challenge (Optional Post-Launch Anti-Spam)
- **Task Type:** Web Dev Review
- **Priority Order:** `P24`
- **Estimated Time:** 60 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Low *(optional post-launch hardening; `website_url` honeypot is already live)*
- **Task Description:** Add Cloudflare Turnstile invisible bot protection to public lead forms if automated spam bots target `#contact-form`, `#apply-form`, or `#checklist-form` after launch.
- **Sub-Tasks:**
  - [ ] Monitor post-launch lead submissions for automated spam beyond the existing `website_url` honeypot
  - [ ] Integrate Cloudflare Turnstile widget and server-side verification in `api/leads.js` if needed

---

## 5. Marketing Review

### [ ] Task: Complete Google Ads Financial Services & Advertiser Verification
- **Task Type:** Marketing Review
- **Priority Order:** `P17`
- **Estimated Time:** 45 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Medium *(blocks Channel 3 paid ads; does not block organic site launch)*
- **Task Description:** Complete Google Ads business and Financial Services verification under the exact legal name **Nexus Insurance Brokers Ltd.**, matching the Burnaby NAP and uploading corporate insurance licences.
- **Sub-Tasks:**
  - [ ] Create/verify Google Ads billing profile under exact legal name **Nexus Insurance Brokers Ltd.** and address `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`
  - [ ] Upload Insurance Council of BC corporate licence (and AIC corporate licence if running Alberta ad groups)
  - [ ] Confirm domain ownership (`contractbonding.ca`) in Google Search Console / DNS

---

### [ ] Task: Build & Launch Google Search Ads Campaign (4 Ad Groups + Negative Keywords)
- **Task Type:** Marketing Review
- **Priority Order:** `P20`
- **Estimated Time:** 90 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Medium *(Channel 3 launch; depends on verification, conversion tracking, and landing page approvals)*
- **Task Description:** Build the surgical Google Search Ads campaign with strict `Presence` geo-targeting (`British Columbia`, plus `Alberta` only once AIC licensed/routed), apply the master negative keyword list, and activate ad groups only as matching landing pages go live.
- **Sub-Tasks:**
  - [ ] Configure strict `Presence` geo-targeting (`British Columbia`; keep `Alberta` paused until AIC licensing/routing is active)
  - [ ] Build the 4 exact/phrase match ad groups with compliant RSA copy from `notes/channel-3-google-ads/01-google-ads-campaign-import-and-verification-pack.md`
  - [ ] Apply the master negative keyword list before enabling spend
  - [ ] Turn on each ad group only after its corresponding SEO landing page is broker-approved and live

---

### [ ] Task: Optimize Nexus Google Business Profile (Burnaby)
- **Task Type:** Marketing Review
- **Priority Order:** `P22`
- **Estimated Time:** 30 min
- **Estimated Difficulty:** Easy
- **Estimated Importance to Launch:** Low *(post-launch local SEO enhancement; separate GBP for `contractbonding.ca` was waived)*
- **Task Description:** Update Nexus's existing Burnaby Google Business Profile (`#101 – 4268 Lozells Avenue`) to add Surety Bonds / Construction Bonding as secondary categories/services, upload real office/team photos, and link appropriately once live.
- **Sub-Tasks:**
  - [ ] Add **Surety Bonds / Construction Bonding** as secondary categories/services on Nexus's Burnaby GBP
  - [ ] Upload real office/team photos and verify NAP consistency
  - [ ] Link to `contractbonding.ca` (or Nexus's surety page) once live, if desired

---

### [ ] Task: Train on 30-Second CGL Cross-Sell Script & Execute Weekly Channel 1 Outbound
- **Task Type:** Marketing Review
- **Priority Order:** `P25`
- **Estimated Time:** 120 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Low *(ongoing post-launch revenue engine; does not block site launch)*
- **Task Description:** Train brokers on the 30-second License-Bond-to-CGL cross-sell script for every `$10k` licence bond applicant, and execute the weekly Monday 9:00 AM PT outbound prospecting workflow across Buckets A–D.
- **Sub-Tasks:**
  - [ ] Train on the 30-second CGL Cross-Sell script (`$10k` TSBC / AB Prepaid Bond -> CGL + Tools + Auto)
  - [ ] Every Monday at 9:00 AM PT, export trailing 7 days from `BC_Bid_Organizer_Skill` and supplement with APC, municipal permit/award logs, and TSBC / Service Alberta new-registrant lists
  - [ ] Segment prospects into Buckets A, B, C, and D, apply CASL checks (Phone/LinkedIn or `s. 10(9)(b)` conspicuous business email) and Alberta AIC routing tags
  - [ ] Execute phone, LinkedIn, and CASL-safe outreach

---

### [ ] Task: Collect 2–3 Real Client Testimonials with Signed Written Consent
- **Task Type:** Marketing Review
- **Priority Order:** `P26`
- **Estimated Time:** 120 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Low *(explicitly post-launch; does not block site launch)*
- **Task Description:** Post-launch, collect 2–3 real client testimonials with signed written marketing consent (containing zero confidential claim/file numbers) before re-enabling any testimonials section on the website.
- **Sub-Tasks:**
  - [ ] Request written testimonials from satisfied bonding clients
  - [ ] Obtain signed written marketing consent forms ensuring zero confidential file/claim details
  - [ ] Hand off approved quotes to Web Dev to add back to `index.html`

---

### [ ] Task: Build & Outreach to Construction CPA & Commercial Banker Network (Channel 4)
- **Task Type:** Marketing Review
- **Priority Order:** `P27`
- **Estimated Time:** 180 min
- **Estimated Difficulty:** Medium
- **Estimated Importance to Launch:** Low *(post-launch Channel 4 flywheel; does not block site launch)*
- **Task Description:** Populate the target list of 20 construction-focused CPA firms and 15 commercial bankers across Metro Vancouver, Calgary, and Edmonton, send two-way referral pitches, book 15-minute coffees, and log referring partners in `/admin`.
- **Sub-Tasks:**
  - [ ] Populate named list of 20 construction CPAs and 15 commercial bankers (Vancity, Coast Capital, ATB Financial, RBC, BMO, TD)
  - [ ] Send two-way referral pitch emails with the 1-Page Surety Ratio Cheat Sheet and book 15-minute coffee meetings
  - [ ] Log referring CPAs/bankers in `/admin` `admin_notes` to track reciprocation

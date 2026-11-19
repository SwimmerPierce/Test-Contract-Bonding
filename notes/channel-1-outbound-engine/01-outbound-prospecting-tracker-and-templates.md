# Channel 1 Execution Pack: Automated Public Procurement Outbound Engine (`BC_Bid_Organizer_Skill`, BC Bid, APC & Licensing Portals)

This operational pack turns Channel 1 of `03-marketing-channels-1-to-5-execution-playbook.md` into a repeatable weekly workflow with prospect segmentation rules, ready-to-paste tracker columns, and CASL-safe outreach scripts.

---

## 0. Upstream Personal Intelligence Feed: `BC_Bid_Organizer_Skill` (Keep Decoupled)

- **Repository:** `https://github.com/SwimmerPierce/BC_Bid_Organizer_Skill` *(separate personal project collecting BC Bid and other RFP site data daily into a structured database)*
- **Architecture Rule (Do NOT Merge):** Keep `BC_Bid_Organizer_Skill` in its own repository and database. Do **not** merge its scraper code or database into the `contractbonding.ca` brokerage website repository (`Test-Contract-Bonding`). Treating it as a standalone upstream intelligence source:
  1. Preserves clean IP/ownership boundaries (protecting Chase's Schedule B Excluded Personal IP carve-out under the finalized Option 1 Licensing Structure in `notes/legal_package/`).
  2. Prevents scraping dependencies or heavy database workloads from touching the Vercel frontend/API.
- **How It Connects to Channel 1:** Instead of manually pulling BC Bid and RFP sites every Monday morning, query/export the previous 7 days of collected records from `BC_Bid_Organizer_Skill` directly into the **Section 3 CSV Tracker** below:
  - **Bucket A Export Filter:** Contract awards from the past 7 days between `$75,000` and `$250,000` (plus emerging/small-value public RFP winners) where bonding was not yet required or no recurring surety history appears.
  - **Bucket B Export Filter:** 2nd, 3rd, and 4th place bidders from unverified bid openings / multi-bidder RFP results from the past 7 days (active bidders likely using Bid Bonds & Consents of Surety).
  - **Clean Handoff Checklist (Human Setup):**
    - [ ] Add a saved read-only query or weekly CSV export script inside `BC_Bid_Organizer_Skill` that outputs columns matching Section 3 (`Pull Date, Source Portal, Bucket, Company Name, ...`).
    - [ ] Confirm which additional RFP portals (`BC Bid`, municipal portals, APC, etc.) are covered daily in `BC_Bid_Organizer_Skill` so only gaps need manual pulls.
    - [ ] Apply CASL check (`Phone`/`LinkedIn` preferred; or verified `s. 10(9)(b)` conspicuous business email) and Alberta AIC routing tag before handing exported rows to Nexus brokers.

---

## 1. Weekly Monday 9:00 AM PT Procurement Pull SOP

1. **Primary Automated Pull — `BC_Bid_Organizer_Skill` Daily Database Export:**
   - Run your weekly Monday morning export from `https://github.com/SwimmerPierce/BC_Bid_Organizer_Skill` covering the previous 7 days of **BC Bid Contract Awards**, **Unverified Bid Results**, and **other tracked RFP sites**.
   - Load newly surfaced **Bucket A** (`$75K–$250K` award winners) and **Bucket B** (2nd/3rd/4th place bidders) rows into the Section 3 tracker.
   - *(Fallback / Manual Skills if offline: pull `bc-contract-awards` / `bc-opportunity-awards` & `bc-unverified-bids`, or sync via `bc-bid-coordinator`.)*
2. **Supplementary Pulls (Portals Not Yet Covered by `BC_Bid_Organizer_Skill`):**
   - **Alberta Purchasing Connection (`purchasingconnection.ca`):** Pull recent municipal/provincial awards and bid results across Calgary, Edmonton, Red Deer, and Lethbridge (unless already ingested into `BC_Bid_Organizer_Skill`).
   - **AIC Licensing Rule:** Until Chase's individual AIC Non-Resident Level 1 Licence is issued, log Alberta prospects and hand warm/qualified Alberta callbacks to an individually AIC-licensed Nexus broker.
   - **Municipal Permit & Licensing Feeds:** Check Metro Vancouver / Burnaby / Surrey / Vancouver / Calgary / Edmonton subdivision/building permit logs and **Technical Safety BC** / **Service Alberta** new-registrant directories for **Buckets C & D**.

---

## 2. Prospect Segmentation Buckets & Action Playbook

| Bucket | Target Criteria | Core Angle | Primary Script |
| :--- | :--- | :--- | :--- |
| **Bucket A** | `$75,000 – $250,000` Unbonded Award Winners | "Graduate to Bid Bonding" — pre-qualify for `$500K–$2M` tenders (`$0` standby setup fee) | **Script A** (Phone / LinkedIn / Conspicuous Business Email) |
| **Bucket B** | 2nd, 3rd & 4th Place Bidders on Bonded Tenders | "Second-Opinion Rate & E-Bond Audit" — benchmark `1.5%–2%` tiers & fast tender-day E-Bonds | **Script B** (Phone / LinkedIn) |
| **Bucket C** | Land Developers & Civil Firms Pulling Subdivision Permits | "Free Up Your Bank LOC" — replace 100% cash/bank LOCs with `~1%–2%` Subdivision Surety Bonds | **Script C** (Phone / LinkedIn / Email) |
| **Bucket D** | New TSBC Electrical/Gas & Service Alberta Prepaid Licensees | `$10,000` express licence bond + `$2M–$5M` CGL / Tool Floater / Commercial Auto cross-sell | **30-Second CGL Script** (Channel 5) |

---

## 3. Outbound Prospect Tracker Template

Copy into a spreadsheet / CRM or track manually each Monday:

```csv
Pull Date,Source Portal,Bucket (A/B/C/D),Company Name,Contact Name,Phone,Public Business Email,Province,City,Recent Tender / Project,Award or Bid Amount,Outreach Channel (Phone/LI/Email),CASL Basis (Phone/LI Exempt vs. Conspicuous Pub Email s.10(9)(b)),Follow-Up Date,Status,Outcome / Notes
```

---

## 4. CASL-Safe Outreach Rules (`CASL s. 6 & s. 10(9)(b)`)
- **Phone Calls & LinkedIn InMail/Messages:** Exempt from CASL Commercial Electronic Message (CEM) restrictions — **preferred channel for cold outbound**.
- **Conspicuously Published Business Emails (`s. 10(9)(b)`):** Permitted only when:
  1. The recipient's email is publicly published on a corporate site/directory without a "no unsolicited commercial messages" disclaimer;
  2. The message is directly relevant to their construction/bidding/licensing business role; AND
  3. The email clearly states **Nexus Insurance Brokers Ltd.** (`contractbonding.ca`), `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, `604-420-2501`, and a working opt-out line (`Reply "Unsubscribe" to opt out`).

---

## 5. Ready-to-Use Scripts (Channel 1)

### Script A — `$75K–$250K` Unbonded Award Winners (Email / LinkedIn)
> **Subject:** Congrats on [Municipal Project Name] — Quick Bid Bond tip for next tender  
>  
> Hi [First Name],  
>  
> Saw that **[Company Name]** was awarded the **[Project Name]** contract (`$[Amount]`) with **[Issuing Organization]**. Congrats to you and the crew.  
>  
> A lot of BC/AB contractors at your stage tell us the only thing holding them back from bidding **$500K–$2M** tenders on BC Bid is not having a standby **Bid Bond & Consent of Surety** facility ready before tender week.  
>  
> Having a pre-approved Bid Bond facility set up with Nexus Insurance Brokers costs **$0 upfront** while you aren't using it—you only pay a premium if you win the bonded job. You can preview indicative costs on our calculator at **https://contractbonding.ca/#calculator**, or reply and we'll walk through the 3-item checklist to get you pre-qualified in ~5 business days.  
>  
> Best regards,  
> **Chase Addison** | Nexus Insurance Brokers Ltd. (`contractbonding.ca`)  
> #101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6 | 604-420-2501  
> *(To opt out of future emails, reply "Unsubscribe".)*

### Script B — 2nd/3rd Place Active Bidders (Phone Call)
> *"Hi [Name], Chase calling from Nexus Insurance Brokers in Burnaby (`contractbonding.ca`). I noticed your firm bid the [Municipality] [Project] tender last week—tough finish at #2. I'm not calling to disturb your current broker relationship, just offering a fast second look: if your current facility is charging flat 1.5%–2% tiers or taking more than a few hours to turn around digital E-Bonds on tender day, we market across Intact, Trisura, Travelers, and Aviva and can benchmark your rate and single/aggregate limits in 15 minutes."*

### Script C — Developer Subdivision & Off-Site Servicing Bond Pitch (Phone / Email)
> *"Municipalities across Metro Vancouver and Alberta usually let developers post a Subdivision / Servicing Surety Bond instead of locking up 100% cash collateral in a bank Letter of Credit. If you have $500K–$2M sitting tied up at the bank for off-site works, a surety bond typically frees up that credit line for ~1%–1.5%/yr so you can deploy that cash into your next project."*

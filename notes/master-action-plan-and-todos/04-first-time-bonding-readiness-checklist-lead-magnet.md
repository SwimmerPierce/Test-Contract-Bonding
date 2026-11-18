# Lead Magnet Blueprint: "First-Time Contractor Bonding Readiness Checklist (PDF)"

This file contains:
- **Part A:** Complete publication-ready text to convert into a branded 1-page or 2-page PDF (`assets/First-Time-Contractor-Bonding-Checklist.pdf`).
- **Part B:** Exact HTML/JS/API integration blueprint to capture leads (`lead_type: "checklist"`) on `contractbonding.ca` while complying with PIPA and CASL.

---

## Part A: Publication-Ready PDF Content (BC & Alberta Edition)

*(Design tips: Export cleanly as a 1–2 page PDF using Nexus / `contractbonding.ca` navy `#0B2545` and gold `#D4A017` branding, include the logo at `Visual Assets/Re Do Logo.png`, and save to `assets/first-time-bonding-readiness-checklist.pdf`.)*

---

### HEADER
**contractbonding.ca** — *Operated by Nexus Insurance Brokers Ltd. (Licensed in BC & Alberta)*  
# First-Time Contractor Bonding Readiness Checklist
**How Contractors in BC & Alberta Get Approved for Bid, Performance & Licence Bonds in 5–7 Business Days**

---

### 1. Understand the "3 C's" Surety Underwriters Score
Unlike traditional insurance, a surety bond is a **three-party credit guarantee**—the surety expects zero losses. Underwriters evaluate every contractor on:
- [ ] **Character:** Clean credit history (corporate & personal), strong trade references, zero unresolved lien/bond claims, and honest communication.
- [ ] **Capacity:** Proven project management track record, equipment, key estimators/superintendents, and experience completing projects of similar scope and size.
- [ ] **Capital:** Positive **Working Capital** (`Current Assets minus Current Liabilities`) and **Net Worth / Equity** sized appropriately for your target job size *(industry rule of thumb: sureties commonly look for Working Capital & Equity equal to ~10%+ of your total uncompleted bonded backlog, depending on trade & facility tier)*.

---

### 2. Financial Statement Tiers: What Level Do You Need?
| Target Single Project / Aggregate Limit | Typical Financial Statement Requirement |
| :--- | :--- |
| **`$10,000` Licence Bonds** *(TSBC Electrical/Gas or AB Prepaid Contractor)* | **Credit-score / Express Underwriting** — Often approved in 24–48 hrs via short application + credit check (no CPA financials needed). |
| **Small / Emerging Facility (`Up to $250K – $500K`)** | **Compilation (CSRS 4200 / Notice to Reader)** prepared by a CPA + personal net worth statement + credit check. |
| **Standard Growth Facility (`$500K – $2M+`)** | **Review Engagement Financial Statements** prepared by an independent CPA (including Work-in-Progress / WIP schedule). |
| **Major Public & Civil Facilities (`$5M+`)** | **Review Engagement or Audited Statements** + full CPA-reviewed WIP schedule + confirmed bank operating line of credit. |

*(Tip: Still on Compilation statements and planning to bid `$1M+` tenders? Ask Nexus to introduce you to a construction-specialized CPA early so you upgrade smoothly at year-end!)*

---

### 3. The 6-Item "Bond-Ready" Document Packet
Gather these six items before tender week so your broker can negotiate the lowest rate tier (`1%–1.5%` vs. emergency rates):
- [ ] **1. Completed Contractor Questionnaire** (company history, ownership %, key staff resumes, 3 largest completed jobs).
- [ ] **2. Last 2–3 Years Fiscal Year-End Financial Statements** (plus most recent internal interim Balance Sheet & Income Statement if >6 months old).
- [ ] **3. Current Work-in-Progress (WIP) Schedule** (contract price, billed to date, costs to date, estimated cost to complete).
- [ ] **4. Signed Personal Net Worth (PNW) Statement** for all shareholders owning 10%+ (required for corporate indemnity).
- [ ] **5. Bank Line of Credit Confirmation** (limit, current utilization, and maturity date—unused operating lines strengthen surety capacity).
- [ ] **6. Certificate of Insurance (COI)** showing active Commercial General Liability (`$2M–$5M`) and Builders Risk / Equipment coverage.

---

### 4. Know Your Pre-Bid Timeline (Avoid Missed Tenders!)
- **Bid Bonds / Consents of Surety:** Request facility setup **at least 10–14 days before your first tender**, and request project-specific E-Bonds **at least 3–5 business days** prior to tender closing.
- **Urgent Tender (<48 Hours)?** Never rely solely on an email or web form—call **604-420-2501** immediately.

---

### FOOTER & CONTACT BLOCK
**Need Help Getting Bond-Ready or Benchmarking Your Current Surety Rate?**  
**Nexus Insurance Brokers Ltd.** (`contractbonding.ca`)  
#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6 | Tel: **604-420-2501** | Mon–Fri, 8:30 AM – 4:30 PM PT  
*Licensed in British Columbia & Alberta (partner broker referrals across Canada). Indicative guidelines only; bond issuance requires formal underwriting and execution by a licensed surety company.*

---

## Part B: Website Integration Blueprint (Checklist Capture Section + Download Trigger)

### Todo Checklist
- [ ] **B.1 Export PDF** to `C:\Users\ChaseAddison\Documents\GitHub\Test-Contract-Bonding\assets\first-time-bonding-readiness-checklist.pdf`.
- [ ] **B.2 Add a Lead Magnet Banner/Section** in `index.html` right below `#who-qualifies` (or inside `#how-it-works`) with a button `"Download Free 1-Page Readiness Checklist (PDF)"` opening a clean `#checklist-modal`.
- [ ] **B.3 Wire `#checklist-form` in `app.js`:**
  - Fields: `Name`, `Company Name`, `Email`, `Phone (optional or required)`, `Province`, mandatory `privacyConsent` checkbox, and unbundled `marketingOptIn` checkbox.
  - On submit, `POST /api/leads` with `lead_type: "checklist"` and `bond_type: "Checklist"`.
  - In [api/leads.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js#L21-L58), permit `lead_type: "checklist"` alongside `"contact"` and `"application"`.
  - On `201 Created`, display a download button linking directly to `/assets/first-time-bonding-readiness-checklist.pdf` (`download` attribute) and trigger automatic download / email delivery!

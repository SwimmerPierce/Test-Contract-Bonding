# Page Outline & Requirements: First-Time Contractor Bonding Guide (`/first-time-contractor-bonding`)

- **Target File & URL (`cleanUrls`):** `first-time-contractor-bonding.html` -> `https://contractbonding.ca/first-time-contractor-bonding`
- **Status:** Outline drafted — **Pending build & human broker review**
- **Primary Keyword Target:** `how to get bonded first time contractor BC`
- **Secondary Keywords:** `first time contractor bonding Alberta`, `how to qualify for surety bond Canada`, `3 C's of surety`, `Compilation vs Review Engagement bonding`
- **Pre-Selected Modal Bond Type:** `Contract` (`data-bond-type="Contract"`)

---

## 1. SEO, Metadata & Schema Requirements
- **Title Tag:** `First-Time Contractor Bonding Guide (BC & Alberta) | contractbonding.ca`
- **Meta Description:** `How first-time contractors and growing subtrades in BC & Alberta qualify for Bid and Performance Bonds. Learn the 3 C's, CPA financial statement tiers, and download the 1-page Readiness Checklist.`
- **Canonical URL:** `https://contractbonding.ca/first-time-contractor-bonding`
- **JSON-LD Schema:** `InsuranceAgency` + `HowTo` / `FAQPage` schema covering the 5-step first-time bonding setup process.

---

## 2. Page Structure & Section-by-Section Content Outline

### Hero Section
- **Eyebrow:** `First-Time Bonding Roadmap • Operated by Nexus Insurance Brokers Ltd.`
- **H1:** `First-Time Contractor Bonding Guide (BC & Alberta)`
- **Subtitle:** `The 3 C’s of Surety, CPA Financial Tiers & How to Get a Standby Facility in 5–7 Business Days`
- **CTAs:**
  - `Download Free Readiness Checklist (PDF)` (`data-open-modal="checklist-modal"`)
  - `Apply for Starter Bonding Facility` (`data-open-modal="apply-modal" data-bond-type="Contract"`)

### Section 1: The "3 C's" Every Surety Underwriter Scores
- **Character:** Clean corporate/personal credit, trade references, zero unresolved claims/liens, transparent communication.
- **Capacity:** Relevant project resume, key estimators/superintendents, equipment owned/leased, comparable historical job sizes.
- **Capital:** Working Capital (`Current Assets - Current Liabilities`) and Tangible Net Worth—explain the ~`10%` working capital/equity benchmark relative to uncompleted bonded backlog.

### Section 2: Financial Statement Tiers (Compilation vs. Review Engagement)
Embed the clean 4-tier matrix from `04-first-time-bonding-readiness-checklist-lead-magnet.md`:
- `$10,000` Licence Bonds (Express credit underwriting)
- Up to `$250K – $500K` Emerging Facility (Compilation / Notice to Reader)
- `$500K – $2M+` Growth Facility (Independent CPA Review Engagement + WIP)
- `$5M+` Major Public/Civil Facility (Review Engagement / Audit + Bank Line)
- Include note: *"Still on Compilation statements and planning to bid $1M+ public tenders? Nexus can introduce you to a construction-savvy CPA partner."*

### Section 3: The 6-Item "Bond-Ready" Document Packet + Timeline
- 6 checklist items (Contractor Questionnaire, 2–3 yrs Financials, WIP Schedule, Shareholder PNW 10%+, Bank Line Confirmation, COI showing CGL/Builders Risk).
- Timeline warning: Setup standby facility **10–14 days before first tender**; never wait until <48 hours before bid close (`604-420-2501`).

### Section 4: Inline Lead Magnet Banner + Rate Calculator
- Prominent CTA card triggering `#checklist-modal` (delivering `/assets/first-time-bonding-readiness-checklist.pdf`).
- Link to Calculator (`#calculator`).

### Section 5: Frequently Asked Questions (FAQ)
1. *Does it cost money to set up a standby Bid Bond facility before I win a tender?* (Typically $0 upfront setup cost for qualified standby facilities; premiums apply when final bonds issue—verify wording with broker).
2. *Can a startup contractor with <2 years in business get bonded?* (Often yes for `$10k` licence bonds or smaller `$100k–$250k` emerging facilities if principals have strong industry track records and liquidity).
3. *Why do sureties require personal indemnity?* (Standard corporate/shareholder General Indemnity Agreement because surety is credit, not traditional loss-pooling insurance).

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/first-time-contractor-bonding/01-page-outline-and-requirements.md`.
- [x] Build `first-time-contractor-bonding.html` in root (pre-selecting `Contract` in modals and wiring `#checklist-modal`).
- [ ] **[Human Broker Review]:** Have a licensed Nexus Level 3 broker verify the emerging-contractor financial thresholds (`$250k–$500k` Compilation vs. `$1M+` Review Engagement), `$0` standby facility phrasing, and General Indemnity Agreement (GIA) explanation before publishing.
- [ ] Uncomment `/first-time-contractor-bonding` in `sitemap.xml` once approved.

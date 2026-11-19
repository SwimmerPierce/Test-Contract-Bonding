# Page Outline & Requirements: Construction Bid Bonds & Consents of Surety (`/bid-bonds-bc`)

- **Target File & URL (`cleanUrls`):** `bid-bonds-bc.html` -> `https://contractbonding.ca/bid-bonds-bc`
- **Status:** Outline drafted — **Pending build & human broker review**
- **Primary Keyword Target:** `bid bond BC / consent of surety BC Bid`
- **Secondary Keywords:** `construction bid bond Vancouver`, `consent of surety BC`, `agreement to bond BC Bid`, `digital e-bond BC`, `bid bond Edmonton Calgary`
- **Pre-Selected Modal Bond Type:** `Bid` (`data-bond-type="Bid"`)

---

## 1. SEO, Metadata & Schema Requirements
- **Title Tag:** `Construction Bid Bonds & Consents of Surety (BC & Alberta) | contractbonding.ca`
- **Meta Description:** `Fast digital E-Bonds for Bid Bonds (10%) and Consents of Surety on BC Bid, Alberta Purchasing Connection (APC), and municipal tenders. Operated by Nexus Insurance Brokers Ltd. (Burnaby, BC).`
- **Canonical URL:** `https://contractbonding.ca/bid-bonds-bc`
- **JSON-LD Schema:** `InsuranceAgency` + `FAQPage` schema covering Bid Bond vs. Consent of Surety, pricing, and digital E-Bonding.

---

## 2. Page Structure & Section-by-Section Content Outline

### Hero Section
- **Eyebrow:** `Pre-Award Tender Bonding • Operated by Nexus Insurance Brokers Ltd.`
- **H1:** `Construction Bid Bonds & Consents of Surety in BC & Alberta`
- **Subtitle:** `Fast Digital E-Bonds for Municipal, Provincial (BC Bid / APC) & Private Tenders`
- **Urgent Callout Banner:** *"Tender closing within 48 hours? Do not rely solely on an online form—call our Burnaby office at **604-420-2501** (Mon–Fri, 8:30 AM – 4:30 PM PT)."*
- **CTAs:**
  - `Apply for Bid Bond / Consent of Surety` (`data-open-modal="apply-modal" data-bond-type="Bid"`)
  - `Contact a Surety Broker` (`data-open-modal="contact-modal" data-bond-type="Bid"`)

### Section 1: Bid Bond vs. Consent of Surety (Agreement to Bond) Explained
- **Bid Bond (Usually 10% of Tender Price):** Guarantees the bidder submitted a good-faith bid and will enter into the contract and post required final bonds if awarded.
- **Consent of Surety (Agreement to Bond / Undertaking of Surety):** Companion letter committing the surety company to issue the required Performance Bond (typically 50%) and Labour & Material Payment Bond (typically 50%) upon award.
- Explain why **both** are routinely mandatory in BC Bid, Metro Vancouver, TransLink, School District, Health Authority, and City of Calgary/Edmonton tenders.

### Section 2: Digital E-Bonds & Turnaround Timelines
- **Digital E-Bonds:** Cryptographically sealed PDF instruments accepted by BC Bid, Bonfire, Merx, bids&tenders, and APC portals.
- **Timeline Truthfulness:**
  - Setting up a brand-new standby bonding facility: **5–10 business days** (requires financial statements + contractor questionnaire).
  - Project-specific Bid Bond on an existing facility: often **same day to 48 hours**.
  - Cost structure: Once an annual facility is active, Bid Bonds carry low or zero incremental fee (or `$250+` minimum if standalone); final premium applies only if you win and issue Performance/L&M bonds.

### Section 3: What Underwriters Review Before Issuing a Bid Bond
- Summarized 3 C's + CPA Financial Statement tiers (Compilation vs. Review Engagement) + 48-hour tender deadline warning.
- Link to Calculator (`#calculator` or embedded calculator defaulting to `Bid`) and Readiness Checklist modal (`#checklist-modal`).

### Section 4: Frequently Asked Questions (FAQ)
1. *Does submitting a Bid Bond application guarantee issuance before tender closing?* (No—never bound until underwritten and formally executed by an Attorney-in-Fact).
2. *What happens if I win a tender with a Bid Bond?* (You convert into Performance & L&M Payment bonds; Bid Bond fee is typically nominal compared to final bond premium).
3. *Are digital E-Bonds accepted on BC Bid and municipal tenders?* (Yes—via verifiable digital seals from Xenex/Mobile Surety/Insurer portals).

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/bid-bonds-bc/01-page-outline-and-requirements.md`.
- [x] Build `bid-bonds-bc.html` in root (pre-selecting `Bid` in modals and highlighting the 48-hour urgent tender phone rule).
- [ ] **[Human Broker Review]:** Have a licensed Nexus Level 3 broker verify digital E-Bond platform claims, Bid Bond minimum fees (`$250` vs. `$0` on active facilities), and CCDC 220 / statutory bid bond wording before publishing.
- [ ] Uncomment `/bid-bonds-bc` in `sitemap.xml` once approved.

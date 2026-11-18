# Page Outline & Requirements: Performance & Labour and Material Payment Bonds (`/performance-and-payment-bonds`)

- **Target File & URL (`cleanUrls`):** `performance-and-payment-bonds.html` -> `https://contractbonding.ca/performance-and-payment-bonds`
- **Status:** Outline drafted — **Pending build & human broker review**
- **Primary Keyword Target:** `CCDC 221 performance bond cost Canada`
- **Secondary Keywords:** `performance bond BC`, `labour and material payment bond CCDC 222`, `subcontractor performance bond Canada`, `construction final bonds cost`
- **Pre-Selected Modal Bond Type:** `Contract` (`data-bond-type="Contract"`)

---

## 1. SEO, Metadata & Schema Requirements
- **Title Tag:** `Performance & L&M Payment Bonds (CCDC 221 / 222) | contractbonding.ca`
- **Meta Description:** `Performance Bonds (CCDC 221) and Labour & Material Payment Bonds (CCDC 222) for general contractors and trade subcontractors in BC and Alberta. Indicative rates 1%–1.5% ($500 min). Operated by Nexus Insurance Brokers Ltd.`
- **Canonical URL:** `https://contractbonding.ca/performance-and-payment-bonds`
- **JSON-LD Schema:** `InsuranceAgency` + `FAQPage` schema covering CCDC 221/222, 50% vs 100% bond penalties, and pricing.

---

## 2. Page Structure & Section-by-Section Content Outline

### Hero Section
- **Eyebrow:** `Final Contract Bonds • Operated by Nexus Insurance Brokers Ltd.`
- **H1:** `Performance & Labour & Material Payment Bonds`
- **Subtitle:** `CCDC 221 & CCDC 222 Compliance for General Contractors & Trade Subcontractors in BC & Alberta`
- **Lead Copy:** Explain how Performance Bonds and L&M Payment Bonds protect public owners, developers, and prime contractors after contract award—ensuring completion on contract terms and payment of eligible first-tier trades and suppliers.
- **CTAs:**
  - `Apply for Performance / L&M Bond` (`data-open-modal="apply-modal" data-bond-type="Contract"`)
  - `Calculate Indicative Bond Cost` (`#calculator`)

### Section 1: CCDC 221 Performance Bond vs. CCDC 222 L&M Payment Bond
- **Performance Bond (CCDC 221 — commonly 50% or 100% of contract price):** Protects the Obligee (owner/GC) against contractor default, abandonment, or defective work. Includes standard warranty/maintenance period (often 12 months post-substantial performance).
- **Labour & Material Payment Bond (CCDC 222 — commonly 50% of contract price):** Protects eligible first-tier subcontractors and material suppliers with a direct contract with the bonded Principal, reducing builders lien friction.
- **Subcontractor Default Protection:** Explain why GCs increasingly require `50%/50%` or `100%` Performance & L&M bonds from major mechanical, electrical, structural steel, and civil subcontractors.

### Section 2: Pricing & Minimum Premiums
- **Typical Rate:** Generally **`1% to 1.5%`** of the total contract price for qualified contractors (higher for first-time or stretched facilities; `$500+` minimum premium floor).
- Note that rates apply to the **full contract price** (not only the 50% bond penalty) in most Canadian surety markets—clarify this common contractor misconception!
- Include embedded/linked Rate Calculator pre-set to `Contract`.

### Section 3: Underwriting Package Required (The 6-Item Readiness Packet)
- Contractor Questionnaire, 2–3 years CPA financials (Compilation up to `~$250k–$500k`; Review Engagement for `$500k–$2M+`), current WIP schedule, Personal Net Worth (10%+ shareholders), bank operating line confirmation, and Certificate of Insurance (CGL + Builders Risk).
- CTA to open `#checklist-modal` (`Download First-Time Readiness Checklist (PDF)`).

### Section 4: Frequently Asked Questions (FAQ)
1. *Is a 50% Performance Bond half the price of a 100% bond?* (Usually rated on total contract value, not penalty percentage—clarify with broker).
2. *Do I need Review Engagement financials for a $1M+ Performance Bond?* (Generally yes—or strong interim CPA work/credit).
3. *Does Nexus also quote the required Builders Risk and CGL insurance?* (Yes—via Cross-Sell option).

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/performance-and-payment-bonds/01-page-outline-and-requirements.md`.
- [ ] Build `performance-and-payment-bonds.html` in root (pre-selecting `Contract` in modals and linking calculator + checklist PDF modal).
- [ ] **[Human Broker Review]:** Have a licensed Nexus Level 3 broker verify CCDC 221/222 terminology, 50% vs. 100% rating explanation, and BC *Builders Lien Act* / prompt payment commentary before publishing.
- [ ] Uncomment `/performance-and-payment-bonds` in `sitemap.xml` once approved.

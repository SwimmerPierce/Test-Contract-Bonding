# Page Outline & Requirements: BC Electrical & Gas Contractor Bonds (`/bc-electrical-gas-contractor-bond`)

- **Target File & URL (`cleanUrls`):** `bc-electrical-gas-contractor-bond.html` -> `https://contractbonding.ca/bc-electrical-gas-contractor-bond`
- **Status:** Outline drafted — **Pending build & human broker review**
- **Primary Keyword Target:** `Technical Safety BC $10,000 surety bond`
- **Secondary Keywords:** `electrical contractor bond BC`, `gas contractor bond BC`, `TSBC $10,000 bond`, `Class A B C electrical contractor surety bond`
- **Pre-Selected Modal Bond Type:** `Administrative` (`data-bond-type="Administrative"`)

---

## 1. SEO, Metadata & Schema Requirements
- **Title Tag:** `Technical Safety BC $10,000 Electrical & Gas Contractor Bonds | contractbonding.ca`
- **Meta Description:** `Fast $10,000 Technical Safety BC (TSBC) electrical and gas contractor licence surety bonds in British Columbia. 24–48 hour turnaround + contractor CGL bundle options from Nexus Insurance Brokers Ltd. (Burnaby, BC).`
- **Canonical URL:** `https://contractbonding.ca/bc-electrical-gas-contractor-bond`
- **JSON-LD Schema:** `InsuranceAgency` (Burnaby NAP) + `FAQPage` schema covering TSBC bond amount, typical minimum annual premium (`$250+ CAD`), and turnaround time.

---

## 2. Page Structure & Section-by-Section Content Outline

### Hero Section
- **Eyebrow:** `Technical Safety BC Licensing • Operated by Nexus Insurance Brokers Ltd.`
- **H1:** `Technical Safety BC $10,000 Electrical & Gas Contractor Bonds`
- **Subtitle:** `Fast 24–48 Hour Issuance + Commercial General Liability (CGL) Bundle Options Across BC`
- **Lead Copy:** Explain how licensed electrical contractors (Class A, B, C, or restricted) and gas contractors in BC must maintain a `$10,000` continuous surety bond in good standing with Technical Safety BC (TSBC) under the *Safety Standards Act*. Highlight quick personal-credit express underwriting with no full CPA financial statements required.
- **CTAs:**
  - `Apply for $10,000 TSBC Bond` (`data-open-modal="apply-modal" data-bond-type="Administrative"`)
  - `Contact a Burnaby Broker` (`data-open-modal="contact-modal" data-bond-type="Administrative"`)

### Section 1: Who Needs a Technical Safety BC Contractor Bond?
- Electrical Contractors applying for or renewing a TSBC Contractor Licence (residential, commercial, industrial).
- Gas Contractors (Class A and Class B gas fitting contractors) operating in BC.
- Highlight difference between BC TSBC `$10,000` bond and municipal business licence/CGL requirements.

### Section 2: Pricing & Express Underwriting Requirements
- **Bond Amount:** `$10,000 CAD` statutory penalty sum.
- **Typical Annual Premium:** Subject to insurer minimum premiums—typically starting around **`$250–$350+ CAD/year`** (emphasize minimum premium rather than misleading `1%` math; include embedded/linked Rate Calculator defaulting to `$10,000` / `Administrative`).
- **What You Need to Apply (Express Track):**
  1. Legal business name (or sole proprietor name) matching your TSBC application.
  2. Principal owner's personal info for soft/standard credit check.
  3. Active or pending Commercial General Liability (CGL) insurance details.
- **No Bind Notice:** Clearly state online application does not bind coverage; bond becomes active upon underwriting approval, payment, and formal execution.

### Section 3: Bundle & Save — Contractor CGL, Tools & Commercial Auto Cross-Sell
- Dedicated callout explaining that TSBC and commercial GCs require `$2M–$5M` Commercial General Liability coverage alongside your `$10,000` bond.
- Encourage checking the **"Also review my Commercial Insurance"** box in the modal for side-by-side CGL, Tool Floater, Installation Floater, and Commercial Auto quotes.

### Section 4: Frequently Asked Questions (FAQ)
1. *How fast can I get a Technical Safety BC $10,000 electrical or gas bond?* (24–48 business hours in most cases).
2. *Do I need accountant-prepared financial statements for a $10,000 TSBC bond?* (Typically no—underwritten based on owner credit score and clean history).
3. *Does TSBC require an original paper bond or a digital PDF copy?* (Broker to confirm current TSBC portal PDF upload vs. wet-ink filing requirements).
4. *Can I upgrade from a $10,000 licence bond to Bid and Performance bonds later?* (Yes—explain growth path via Nexus).

### Shared Footer & Compliance Modals
- Reuse `styles.css` & `app.js` with full Contact Us, Apply Now, and Checklist modals (including Province dropdown, Cross-Sell checkbox, mandatory Privacy/Referral consent, unbundled CASL opt-in, and no-bind disclaimer).

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/bc-electrical-gas-contractor-bond/01-page-outline-and-requirements.md`.
- [x] Build `bc-electrical-gas-contractor-bond.html` in root (reusing `styles.css` & `app.js` and pre-selecting `Administrative` bond type in modals and calculator default `$10,000`).
- [ ] **[Human Broker Review]:** Have a licensed Nexus broker verify current TSBC bond form wording, current minimum annual premium (`$250–$350`), and whether TSBC currently accepts digital e-bonds or requires wet-ink originals.
- [ ] Uncomment `/bc-electrical-gas-contractor-bond` in `sitemap.xml` and link from `index.html` footer/nav once approved.

# Page Outline & Requirements: Privacy Policy (`privacy.html` / `/privacy`)

- **Target URL (`cleanUrls`):** `https://contractbonding.ca/privacy` (`privacy.html` in root)
- **Status:** Outline drafted — **Pending build & human broker/Privacy Officer review before publishing**
- **Primary Legal Frameworks:** BC *Personal Information Protection Act* (**BC PIPA** s. 5–10, 23, 34, 35), Alberta *Personal Information Protection Act* (**AB PIPA** s. 6(2), 13.1, 34, 34.1), and Canada's Anti-Spam Legislation (**CASL** s. 6, s. 10(9), s. 13).

---

## 1. SEO, Metadata & Layout Requirements
- **Title Tag:** `Privacy Policy | contractbonding.ca — Nexus Insurance Brokers Ltd.`
- **Meta Description:** `Privacy Policy for contractbonding.ca, operated by Nexus Insurance Brokers Ltd. (Burnaby, BC). Learn how we collect, protect, store, and use commercial surety inquiry data under BC & Alberta PIPA.`
- **Meta Robots:** `index, follow`
- **Canonical URL:** `https://contractbonding.ca/privacy`
- **Shared Chrome:** Reuse `styles.css`, `app.js`, top utility bar (`604-420-2501`), primary navigation, Contact Us / Apply Now modals, and full Nexus Burnaby footer.

---

## 2. Required Page Structure & Content Outline

### Section 1: Who We Are (Operator Identification)
- Clearly identify **contractbonding.ca** as a commercial and construction surety bond portal operated by **Nexus Insurance Brokers Ltd.**
- Physical office address: `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`
- Phone: `604-420-2501` | Business Hours: `Mon–Fri, 8:30 AM – 4:30 PM PT`
- Note licensing status: Licensed in **British Columbia** and **Alberta**; inquiries outside BC/Alberta are handled strictly by referral to an appropriately licensed brokerage with the applicant's explicit consent.

### Section 2: Personal & Business Information We Collect
- **Contact Information:** Full name, company/legal business name, email address, phone number.
- **Business & Underwriting Details:** City, province/territory, years in business, business structure (Corporation/Partnership/Sole Proprietorship), bond type, bond/contract amount, obligee/project owner, required-by date, financial statement readiness, prior surety company, and project notes.
- **Consent & Compliance Metadata:** Privacy/referral consent status, commercial insurance cross-sell request flag, unbundled CASL marketing opt-in status, ISO consent timestamp, and CASL 6-month implied consent expiry tracking (`casl_implied_expires_at`).
- **Technical & Web Analytics:** Standard server/edge logs and privacy-friendly web analytics (`@vercel/analytics`), IP rate-limit security logs on `/api/auth`.

### Section 3: Purposes for Collection, Use & Disclosure (`BC PIPA s. 6, 7, 10`)
- Assessing preliminary surety bonding eligibility and underwriting readiness.
- Obtaining quotes and bonding facilities from licensed Canadian surety insurers and Managing General Agents (MGAs).
- Quoting or reviewing Commercial General Liability (CGL), Builders Risk, Tools, and Commercial Auto insurance **only if requested** via the optional cross-sell checkbox or direct request.
- Referring out-of-province inquiries (outside BC and AB) to a licensed partner brokerage in the applicant's jurisdiction **with express consent**.
- Responding to inquiries (CASL 6-month inquiry implied consent) and sending educational updates/guides **only if expressly opted in** via the unbundled CASL marketing checkbox.

### Section 4: Disclosure of Foreign / Cross-Border Service Providers (`AB PIPA s. 13.1 & s. 6(2)` — MANDATORY)
- Explicitly state:
  > *"To operate this website and store online lead submissions, Nexus Insurance Brokers Ltd. uses third-party cloud infrastructure and email service providers—including Vercel Inc. (website hosting and global edge network), Neon Inc. / AWS (database hosting), and transactional email providers (such as Resend). Primary serverless execution (`yyz1` — Toronto) and production database hosting (`aws-ca-central-1` — Montreal) are configured for Canadian regions where supported; however, certain operational logs, backups, edge routing, or support processing may occur outside Canada, including in the **United States**. Information processed outside Canada may be subject to the laws of that jurisdiction, including lawful access by foreign courts, law enforcement, or national security authorities. Nexus maintains contractual and technical safeguards (`PIPA s. 34`) to protect your information."*
- Confirm exact hosting/email regions once infrastructure tasks in Stage 2 are finalized.

### Section 5: Data Retention, Safeguards & Access/Correction Rights (`PIPA s. 23, 34, 35`)
- **Retention:** Commercial insurance and surety brokerage records are retained for a minimum of **7 years** (or longer where required by limitation periods, surety indemnity obligations, or Insurance Council rules). Unconverted marketing inquiries are tracked for CASL 6-month implied consent expiry.
- **Safeguards:** HTTPS/TLS encryption in transit, restricted password-protected `/admin` access with 12-hour session expiry and brute-force rate limiting, role/supervision audit fields.
- **Your Rights:** Right to request access to, correction of, or withdrawal of consent for personal information held by Nexus (subject to statutory/contractual retention requirements), and 1-click/instant unsubscribe from CASL marketing messages.

### Section 6: Designated Privacy Officer Contact (`BC PIPA s. 5 & 10`, `AB PIPA s. 6(2)`)
- **Title:** Designated Privacy Officer — Nexus Insurance Brokers Ltd.
- **Address:** `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`
- **Telephone:** `604-420-2501`
- **Email:** `[privacy@nexusinsurancebrokers.com]` *(confirm exact live mailbox with Nexus prior to publishing)*
- **Regulatory Escalation Note:** Inform BC residents of the Office of the Information and Privacy Commissioner for BC (OIPC BC) and Alberta residents of the Office of the Information and Privacy Commissioner of Alberta (OIPC AB).

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/privacy-policy/01-page-outline-and-requirements.md`.
- [x] Build `privacy.html` in the repository root using the shared site header/footer/modals and the approved outline above (using confirmed `info@nexusinsurancebrokers.com` Privacy Officer mailbox and `yul1` Montréal region).
- [ ] **[Human Broker Review]:** Confirm whether a named Designated Privacy Officer should be listed alongside `info@nexusinsurancebrokers.com` (already confirmed as the live mailbox).
- [ ] **[Human Broker Review]:** Verify exact cloud regions (`yul1` Vercel, `aws-ca-central-1` Neon, Resend US/EU/CA data residency) match production settings and have a licensed Nexus Level 3 broker approve the final `privacy.html` text.
- [ ] Uncomment `/privacy` in `sitemap.xml` once published.

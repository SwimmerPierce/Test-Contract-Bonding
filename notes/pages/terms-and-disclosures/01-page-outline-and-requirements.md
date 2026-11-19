# Page Outline & Requirements: Terms of Use & Financial Products Disclosure (`terms.html` / `/terms`)

- **Target URL (`cleanUrls`):** `https://contractbonding.ca/terms` (`terms.html` in root)
- **Status:** Built (`terms.html` in root with Option 1 Licensing Structure IP attribution) — **Pending human Level 3 broker review (`B.C. Reg. 573/2004`) before uncommenting in `sitemap.xml`**
- **Primary Legal Frameworks:** BC *Financial Products Disclosure Regulation* (**B.C. Reg. 573/2004** under the *Financial Institutions Act*), **Insurance Council of BC Rules & Code of Conduct**, **Alberta Insurance Act & AIC Guidelines**, **CISRO Principles of Conduct**, federal *Competition Act*.

---

## 1. SEO, Metadata & Layout Requirements
- **Title Tag:** `Terms of Use & Broker Disclosures | contractbonding.ca — Nexus Insurance Brokers Ltd.`
- **Meta Description:** `Terms of Use, jurisdictional licensing limits, and BC Financial Products Disclosure Regulation (B.C. Reg. 573/2004) disclosures for contractbonding.ca, operated by Nexus Insurance Brokers Ltd.`
- **Meta Robots:** `index, follow`
- **Canonical URL:** `https://contractbonding.ca/terms`
- **Shared Chrome:** Reuse `styles.css`, `app.js`, top utility bar (`604-420-2501`), primary navigation, Contact Us / Apply Now modals, and full Nexus Burnaby footer.

---

## 2. Required Page Structure & Content Outline

### Section 1: Entity & Jurisdictional Scope
- Identify **contractbonding.ca** as a surety bond portal operated by **Nexus Insurance Brokers Ltd.** (`#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, Tel: `604-420-2501`).
- State clearly: Nexus Insurance Brokers Ltd. is licensed to transact general insurance and surety bonds in **British Columbia and Alberta** only.
- Explain out-of-province handling: Submissions for businesses or projects outside BC and Alberta are not solicited or underwritten by Nexus directly; instead, with the applicant's express consent, Nexus refers the inquiry to an appropriately licensed partner brokerage in that jurisdiction.

### Section 2: BC Financial Products Disclosure Regulation (`B.C. Reg. 573/2004`) Notice — MANDATORY
Must include the four statutory disclosures required in BC prior to / at point of service:
1. **Insurer Representation:** Nexus Insurance Brokers Ltd. represents multiple independent, licensed Canadian surety and commercial insurance companies (rather than acting as a captive agent of a single insurer). *(Human broker to confirm exact list or descriptive wording—e.g., Intact, Trisura, Travelers, Aviva, Western Surety, Sovereign, etc.)*
2. **Insurer Ownership & Financial Interest Conflict Disclosure (`s. 2(1)(b)–(c)`):**
   - Draft text: *"No insurance company or surety insurer holds a direct or indirect ownership interest in Nexus Insurance Brokers Ltd., and Nexus Insurance Brokers Ltd. holds no ownership interest in any insurance or surety company."*
   - **[CONFIRMATION REQUIRED]:** Must be explicitly confirmed with Nexus's Principal / Level 3 Nominee (Father) before publishing.
3. **Broker Compensation (`s. 2(1)(a)`):**
   - Explain that Nexus is compensated primarily by commissions paid by the issuing surety or insurance company as a percentage of premium, and/or by written brokerage service fees disclosed and agreed to in writing with the client prior to binding.
4. **Out-of-Province Referral Fees:**
   - Disclose that where an applicant outside BC or Alberta consents to be referred to a licensed partner brokerage, Nexus may receive a disclosed referral fee from that partner brokerage (at no additional cost to the applicant unless disclosed in writing).

### Section 3: No Online Binding, Quotes & Surety Underwriting Disclaimer
- Explicitly state that **submitting any online form, inquiry, application, or checklist request does NOT bind, issue, or guarantee any surety bond, Consent of Surety, or insurance coverage**.
- No bond or Consent of Surety is in force until underwriting is completed, indemnity/agreements are executed, and the instrument is formally issued and sealed by an authorized Attorney-in-Fact of a licensed surety company.
- Reiterate that the **Surety Bond Rate Calculator** provides indicative CAD estimates only, subject to insurer minimum premiums (typically `$250–$500+ CAD`), credit/financial underwriting, and project complexity.
- Urgent tender warning: For Bid Bonds or Consents of Surety needed within 48 hours, users must call `604-420-2501` during business hours (`Mon–Fri, 8:30 AM – 4:30 PM PT`) rather than relying solely on an online submission.

### Section 4: Intellectual Property & Acceptable Use (Option 1 Licensing Structure)
- Standard website copyright & acceptable use terms (prohibiting scraping, automated spam submissions, unauthorized `/admin` access attempts).
- **Confirmed Attribution (`Option 1 Licensing Structure`):** `contractbonding.ca` domain, website source code, calculator logic, and digital assets are the intellectual property of **Chase Pierce Addison**, operated as an official online surety brokerage service under an exclusive operating license by **Nexus Insurance Brokers Ltd.**

### Section 5: Limitation of Liability & Governing Law
- Standard commercial limitation of liability for website uptime/calculator estimates to the extent permitted by Canadian law.
- **Governing Law:** Governed by the laws of the **Province of British Columbia** and applicable federal laws of Canada.

---

## 3. Subtasks Before Publishing
- [x] Create page outline in `notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md`.
- [x] Confirm ownership structure (Option 1 Licensing Structure finalized in `notes/legal_package/`) so IP/copyright attribution in Section 4 is accurate.
- [ ] **[Human Broker Review]:** Have Nexus's Level 3 Nominee confirm the `B.C. Reg. 573/2004` insurer ownership statement (no insurer ownership conflict) and list of represented surety markets.
- [x] Build `terms.html` in the repository root using the shared site header/footer/modals and verified disclosures.
- [ ] **[Human Broker Review]:** Final legal/regulatory sign-off by a licensed Nexus broker before deploying live and uncommenting `/terms` in `sitemap.xml`.

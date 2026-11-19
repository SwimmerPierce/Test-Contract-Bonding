# Website Branding, Disclaimers, Calculator Fixes, Privacy Policy & Form Checkboxes Spec

This document provides exact line-by-line edits, copy, and drop-in HTML/JS blueprints for [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html), [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js), and two new static pages (`privacy.html` and `terms.html`).

---

## Section 1: Update `index.html` Entity Branding & Contact Details

### Todo Checklist
- [x] **1.1 Update `<meta name="description">` ([index.html#L16-L19](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L16-L19)):** Updated to `"— a surety bond service operated by Nexus Insurance Brokers Ltd. in Burnaby, BC, serving British Columbia and Alberta."`
- [x] **1.2 Update Top Utility Bar ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Updated with `Operated by Nexus Insurance Brokers Ltd. (Burnaby, BC)` and clickable `tel:6044202501`.
- [x] **1.3 Update Hero Eyebrow & Lead Paragraph ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Updated eyebrow and lead paragraph to state operated by Nexus Insurance Brokers Ltd., licensed in BC & Alberta.
- [x] **1.4 Update Section 6 "Who Qualifies" Copy ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Changed `"We arrange bonding facilities..."` to `"Nexus Insurance Brokers Ltd. arranges bonding facilities..."`
- [x] **1.5 Rewrite Section 8 (`#trusted-partners`) to Eliminate Independent-Entity Framing ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Rewrote eyebrow, heading, subtext, banner tag, and address/phone copy.
- [x] **1.6 DELETE Placeholder Testimonials ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Removed both anonymous `blockquote.quote-card` blocks (*Competition Act s. 52 & s. 74.01* and *ICBCouncil Code of Conduct*).
  - [ ] **[Human Post-Launch Action]:** Collect 2–3 real client testimonials with signed written marketing consent before re-enabling testimonials.
- [x] **1.7 Update Footer With Full Legal Name, Address, Phone, Hours, Jurisdictions & Legal Links ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Added `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, `604-420-2501`, `Mon–Fri, 8:30 AM – 4:30 PM PT`, Privacy Officer contact, copyright, and links to `/privacy` and `/terms`.
  - [x] **Option 1 Copyright Owner Wording Updated:** Updated footer copyright/IP attribution in [index.html](file:///C:/Users/chase/OneDrive/Documents/GitHub/Test-Contract-Bonding/index.html) and [terms.html](file:///C:/Users/chase/OneDrive/Documents/GitHub/Test-Contract-Bonding/terms.html) to reflect the finalized Option 1 Licensing Structure (Platform IP owned by Chase Pierce Addison; operated under exclusive license by Nexus Insurance Brokers Ltd.).
  - [ ] **[Human Decision / Action]:** Confirm live Privacy Officer mailbox (`privacy@nexusinsurancebrokers.com` vs. `info@nexusinsurancebrokers.com`).
- [x] **1.8 Update Modal Eyebrows ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Replaced `"Trusted Broker Partner"` with `"Operated by Nexus Insurance Brokers Ltd. • Licensed in BC & Alberta"`.

---

## Section 2: Add Disclaimers & Fix Calculator Minimums

### Todo Checklist
- [x] **2.1 Update Calculator Logic in [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js#L115-L195):** Applied realistic minimum annual premiums per category (`contract: $500`, `bid: $250`, `administrative: $250`, `other: $350`):

```javascript
const RATE_TABLE = {
  contract: { minRate: 0.01, maxRate: 0.015, minCost: 500 },
  bid: { minRate: 0.004, maxRate: 0.0075, minCost: 250 },
  administrative: { minRate: 0.01, maxRate: 0.0175, minCost: 250 },
  other: { minRate: 0.0125, maxRate: 0.02, minCost: 350 },
};

function updateCalculator() {
  if (!calcValueInput || !calcTypeSelect) return;
  const rawValue = parseNumericInput(calcValueInput.value);
  const amount = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
  const typeKey = calcTypeSelect.value;
  const config = RATE_TABLE[typeKey] || { minRate: 0.01, maxRate: 0.015, minCost: 500 };

  const minPct = (config.minRate * 100).toFixed(2).replace(/\.?0+$/, "");
  const maxPct = (config.maxRate * 100).toFixed(2).replace(/\.?0+$/, "");
  calcRateRange.textContent = `${minPct}% – ${maxPct}%`;

  if (amount <= 0) {
    calcCostRange.textContent = "$0 CAD";
    return;
  }

  const rawMinCost = amount * config.minRate;
  const rawMaxCost = amount * config.maxRate;
  const minCost = Math.max(rawMinCost, config.minCost);
  const maxCost = Math.max(rawMaxCost, config.minCost);

  if (minCost === maxCost) {
    calcCostRange.textContent = `${formatCurrency(minCost)} CAD (subject to minimum premium)`;
  } else {
    calcCostRange.textContent = `${formatCurrency(minCost)} – ${formatCurrency(maxCost)} CAD`;
  }
}
```

- [x] **2.2 Upgrade Calculator Disclaimer ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Replaced `.calc-result__disclaimer` with minimum-premium and non-binding language.
- [x] **2.3 Add 48-Hour Urgent Tender Warning Box Near `Required By Date` ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Added inside both `#contact-form` and `#apply-form`.

```html
<div class="note-box" style="margin-top: 0.75rem; margin-bottom: 0.5rem;">
  <strong>Tender closing within 48 hours?</strong>
  <span>Do not rely solely on an online submission—call our Burnaby office directly at <a href="tel:6044202501">604-420-2501</a> (Mon–Fri, 8:30 AM – 4:30 PM PT).</span>
</div>
```

- [x] **2.4 Add "No Bond or Coverage Bound Online" Notice Inside Both Forms & Success Screens ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)):** Added `.no-bind-notice` directly above submit buttons and inside `#contact-success` / `#apply-success`.

---

## Section 3: Publish Privacy Policy (`privacy.html`) & Financial Products Disclosure / Terms (`terms.html`)

### Todo Checklist
- [x] **3.0 Create Page Outline Subfolders First (Per Project Workflow Rule):**
  - [notes/pages/privacy-policy/01-page-outline-and-requirements.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/pages/privacy-policy/01-page-outline-and-requirements.md)
  - [notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md)
- [ ] **3.1 Create `privacy.html` in the repository root** (`vercel.json` has `"cleanUrls": true`, so `/privacy` works automatically) using the compliant draft outline (`notes/pages/privacy-policy/01-page-outline-and-requirements.md`).
  - [ ] **[Human Broker Review]:** Confirm live Privacy Officer contact & final cloud residency details with a licensed Nexus Level 3 broker before publishing.
- [x] **3.2 Create `terms.html` in the repository root** (`/terms`) containing the **BC Financial Products Disclosure Regulation (`B.C. Reg. 573/2004`)** notice and website Terms of Use (`notes/pages/terms-and-disclosures/01-page-outline-and-requirements.md`).
  - [x] **Ownership Structure Confirmed:** Applied finalized Option 1 Licensing Structure copyright/IP attribution (Chase Pierce Addison owns platform IP; Nexus Insurance Brokers Ltd. operates under exclusive license) in `terms.html`.
  - [ ] **[Human Broker Review]:** Confirm no insurer ownership conflict (`B.C. Reg. 573/2004`) and represented surety markets with Nexus's Level 3 Nominee before publishing.
- [x] **3.3 Link `/privacy` and `/terms` in the Footer and inside `#contact-form`, `#apply-form`, and `#checklist-form`.**

### Ready-to-Use Content Blueprint for `privacy.html`
Must include all of the following sections (verified for **BC PIPA s. 5–10, 34** and **Alberta PIPA s. 6(2), 13.1, 34, 34.1**):
1. **Who We Are:** `contractbonding.ca` is operated by **Nexus Insurance Brokers Ltd.** (`#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`, Tel: `604-420-2501`).
2. **What Information We Collect:** Contact details (name, company, email, phone), business details (city, province, years in business, structure), and bond/project information (bond type, contract value, obligee, required-by date, financial statement readiness, prior surety, notes), plus consent timestamps and optional web analytics (`@vercel/analytics`).
3. **Why We Collect & Use Your Information (`BC PIPA s. 6, 7, 10`):**
   - Assessing eligibility for surety bonding and commercial insurance;
   - Obtaining quotes from licensed Canadian surety insurers and MGAs;
   - Referring out-of-province inquiries (outside BC and Alberta) to licensed partner brokerages **with your consent**;
   - Sending follow-up communications and (only if opted in) marketing updates under CASL.
4. **Disclosure of Foreign Service Providers (`Alberta PIPA s. 13.1 & s. 6(2)` — MANDATORY):**
   - Explicitly state: *"To operate this website and store online lead submissions, Nexus Insurance Brokers Ltd. uses third-party cloud infrastructure and email service providers—including Vercel Inc. (website hosting/edge network), Neon Inc. / AWS (database hosting), and transactional email providers. While primary production servers are configured for Canadian regions where supported, certain operational logs, backups, edge routing, or support processing may occur outside Canada, including in the **United States**. Information processed outside Canada may be subject to the laws of that jurisdiction (including lawful access by foreign authorities). Nexus maintains contractual and technical safeguards (`PIPA s. 34`) to protect your information."* *(Update exact regions once Section 2 of [02-backend-email-alerts-canada-hosting-and-admin-security.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/02-backend-email-alerts-canada-hosting-and-admin-security.md) pins Vercel to `yul1` and Neon to `aws-ca-central-1`.)*
5. **Retention, Security & Access Rights (`PIPA s. 23, 34, 35`):** Explain 7-year commercial insurance retention, encryption/access controls, right to request access/correction, and right to withdraw CASL/marketing consent.
6. **Designated Privacy Officer Contact (`BC PIPA s. 5/10`, `AB PIPA s. 6(2)`):**
   - **Privacy Officer, Nexus Insurance Brokers Ltd.**
   - `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`
   - Phone: `604-420-2501` | Email: `[privacy@nexusinsurancebrokers.com]`

### Ready-to-Use Content Blueprint for `terms.html` (`B.C. Reg. 573/2004` + Terms of Use)
Must include:
1. **Jurisdictional Scope:** Nexus Insurance Brokers Ltd. is licensed to sell general insurance and surety bonds in **British Columbia and Alberta** only. Inquiries from other Canadian provinces/territories are handled strictly by referral to an appropriately licensed brokerage in that jurisdiction.
2. **Financial Products Disclosure Regulation (`B.C. Reg. 573/2004`) Notice:**
   - **Insurer Representation:** Nexus Insurance Brokers Ltd. represents multiple independent licensed Canadian surety and commercial insurance companies.
   - **No Insurer Ownership Conflict:** No insurance or surety company holds an ownership interest in Nexus Insurance Brokers Ltd. (and vice versa) *[confirm with Father before publishing]*.
   - **Broker Compensation & Referral Fees:** Nexus is compensated by commissions paid by the issuing surety/insurance company and/or disclosed written brokerage fees agreed to prior to binding. Where a lead outside BC or Alberta is referred to a partner brokerage, Nexus may receive a disclosed referral fee from that brokerage.
3. **No Online Binding & Calculator Disclaimer:** Reiterate that calculator outputs and form submissions do not create a binder, policy, or surety obligation.
4. **Governing Law:** Governed by the laws of British Columbia and applicable federal laws of Canada.

---

## Section 4: Form Checkboxes, Province Selector & Commercial Insurance Cross-Sell

### Todo Checklist
- [x] **4.1 Replace/Upgrade Location Input With Explicit Province/Territory Dropdown** in `#contact-form`, `#apply-form`, and `#checklist-form` ([index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html)).
- [x] **4.2 Add the 3 Checkboxes Below** to `#contact-form`, `#apply-form`, and `#checklist-form`, updated [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js) to validate required consent and serialize all new fields, and updated [api/leads.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js) + [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js).

### Drop-In HTML Snippet for Forms (Province + Cross-Sell + Privacy/Referral + Unbundled CASL)

```html
<!-- Province Selector -->
<div class="form-group">
  <label for="form-province">Province / Territory of Business or Project <span class="req">*</span></label>
  <select id="form-province" name="province" required>
    <option value="">Select province...</option>
    <option value="BC">British Columbia</option>
    <option value="AB">Alberta</option>
    <option value="SK">Saskatchewan (Partner Referral)</option>
    <option value="MB">Manitoba (Partner Referral)</option>
    <option value="ON">Ontario (Partner Referral)</option>
    <option value="QC">Quebec (Partner Referral)</option>
    <option value="Atlantic">Atlantic Canada (NB/NS/PE/NL — Partner Referral)</option>
    <option value="Territories">Yukon / NWT / Nunavut (Partner Referral)</option>
  </select>
</div>

<!-- Checkboxes Block -->
<fieldset class="form-section" style="padding: 0.9rem 1rem; margin-top: 0.75rem;">
  <legend>Consent &amp; Coverage Options</legend>

  <!-- 1. Revenue Multiplier: Commercial Insurance Cross-Sell (Optional, Unchecked) -->
  <div class="form-group form-check">
    <label class="checkbox-label">
      <input type="checkbox" name="crossSellInsurance" value="true" />
      <span>
        <strong>Also review my Commercial Insurance:</strong> Have a Nexus broker quote or review my Commercial General Liability (CGL), Builders Risk, Tools, or Commercial Auto insurance for potential bundle savings.
      </span>
    </label>
  </div>

  <!-- 2. Mandatory Privacy, Cross-Border Storage & Out-of-Province Referral Consent -->
  <div class="form-group form-check">
    <label class="checkbox-label">
      <input type="checkbox" name="privacyConsent" value="true" required />
      <span>
        I understand that submitting this form does <strong>not</strong> bind coverage or guarantee a bond, and I agree to the <a href="/privacy" target="_blank" rel="noopener">Privacy Policy</a> and <a href="/terms" target="_blank" rel="noopener">Terms &amp; Broker Disclosures</a> (including cloud data processing in Canada/US per PIPA). If my business or project is outside BC or Alberta, I authorize <strong>Nexus Insurance Brokers Ltd.</strong> to refer my inquiry to a licensed partner brokerage in my jurisdiction and acknowledge Nexus may receive a referral fee. <span class="req">*</span>
      </span>
    </label>
  </div>

  <!-- 3. Unbundled CASL Express Marketing Opt-In (Optional, MUST Remain Unchecked by Default) -->
  <div class="form-group form-check" style="margin-bottom: 0;">
    <label class="checkbox-label">
      <input type="checkbox" name="marketingOptIn" value="true" />
      <span>
        Yes, I would like to receive bonding guides, tender updates, and commercial insurance offers by email/SMS from Nexus Insurance Brokers Ltd. (You may unsubscribe at any time.)
      </span>
    </label>
  </div>
</fieldset>
```

### App.js Validation Rules to Enforce
- Require `province` and `privacyConsent === true` before submitting either `#contact-form` or `#apply-form`.
- Never default `marketingOptIn` to checked (CASL requires an affirmative, unbundled action).
- Set `referral_consent = privacyConsent` and include `province`, `cross_sell_insurance`, `privacy_consent`, `referral_consent`, `marketing_opt_in`, and `consent_timestamp: new Date().toISOString()` in the `POST /api/leads` JSON payload.

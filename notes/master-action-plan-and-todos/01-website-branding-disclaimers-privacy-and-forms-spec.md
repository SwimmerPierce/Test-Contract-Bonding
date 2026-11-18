# Website Branding, Disclaimers, Calculator Fixes, Privacy Policy & Form Checkboxes Spec

This document provides exact line-by-line edits, copy, and drop-in HTML/JS blueprints for [index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html), [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js), and two new static pages (`privacy.html` and `terms.html`).

---

## Section 1: Update `index.html` Entity Branding & Contact Details

### Todo Checklist
- [ ] **1.1 Update `<meta name="description">` ([index.html#L16-L19](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L16-L19)):** Change `"with Trusted Broker Partner Nexus Insurance Brokers Ltd."` to `"— a surety bond service operated by Nexus Insurance Brokers Ltd. in Burnaby, BC, serving British Columbia and Alberta."`
- [ ] **1.2 Update Top Utility Bar ([index.html#L38](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L38)):**
  - *Replace:* `<span><strong>contractbonding.ca</strong> &bull; Trusted Broker Partner: Nexus Insurance Brokers Ltd. (Burnaby, BC)</span>`
  - *With:* `<span><strong>contractbonding.ca</strong> &bull; Operated by <strong>Nexus Insurance Brokers Ltd.</strong> (Burnaby, BC) &bull; <a href="tel:6044202501" style="color:inherit;text-decoration:underline;">604-420-2501</a></span>`
- [ ] **1.3 Update Hero Eyebrow & Lead Paragraph ([index.html#L101-L109](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L101-L109)):**
  - *Replace Line 101:* `contractbonding.ca &bull; Operated by Nexus Insurance Brokers Ltd.`
  - *Replace Lines 104–109:* `"<strong>contractbonding.ca</strong> is a commercial and construction surety service operated by <strong>Nexus Insurance Brokers Ltd.</strong> (Burnaby, BC), licensed in British Columbia and Alberta to arrange Bid, Contract, Performance, and Administrative bonds quickly and competitively."`
- [ ] **1.4 Update Section 6 "Who Qualifies" Copy ([index.html#L474](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L474)):**
  - Change `"We arrange bonding facilities..."` to `"Nexus Insurance Brokers Ltd. arranges bonding facilities..."`
- [ ] **1.5 Rewrite Section 8 (`#trusted-partners`) to Eliminate Independent-Entity Framing ([index.html#L560-L589](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L560-L589)):**
  - Replace `"Trusted Broker Partners"` / `"contractbonding.ca works with vetted, licensed surety brokerages"` with:
    - Eyebrow: `Operated by Nexus Insurance Brokers Ltd.`
    - Heading: `Backed by Licensed BC & Alberta Surety Specialists`
    - Subtext: `contractbonding.ca is operated by Nexus Insurance Brokers Ltd., a licensed insurance brokerage serving contractors, subtrades, and developers in British Columbia and Alberta (with licensed partner brokerage referrals across Canada).`
    - Banner tag (`L573`): `Licensed Brokerage Operator`
    - Banner paragraph (`L575-L579`): `Headquartered at #101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6 (Tel: 604-420-2501), Nexus Insurance Brokers Ltd. specializes in commercial insurance and construction surety bonds across British Columbia and Alberta.`
- [ ] **1.6 DELETE Placeholder Testimonials ([index.html#L591-L607](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L591-L607)):**
  - Remove both anonymous `blockquote.quote-card` blocks immediately (*Competition Act s. 52 & s. 74.01* and *ICBCouncil Code of Conduct*). Only add testimonials later when Nexus holds signed client consent and avoids confidential file details.
- [ ] **1.7 Update Footer With Full Legal Name, Address, Phone, Hours, Jurisdictions & Legal Links ([index.html#L613-L662](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L613-L662)):**
  - Add exact office address (`#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`), phone (`604-420-2501`), hours (`Mon–Fri, 8:30 AM – 4:30 PM PT`), copyright (`© 2026 Nexus Insurance Brokers Ltd. (contractbonding.ca). All rights reserved.`), and links to `/privacy` (`privacy.html`) and `/terms` (`terms.html`).
- [ ] **1.8 Update Modal Eyebrows ([index.html#L670](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L670) & [L741](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L741)):**
  - Replace `"Trusted Broker Partner: Nexus Insurance Brokers Ltd."` with `"Operated by Nexus Insurance Brokers Ltd. • Licensed in BC & Alberta"`.

---

## Section 2: Add Disclaimers & Fix Calculator Minimums

### Todo Checklist
- [ ] **2.1 Update Calculator Logic in [app.js#L115-L174](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js#L115-L174):**
  - Currently, entering `$10,000` (a TSBC electrical/gas bond or Alberta prepaid contractor bond) outputs `"$100 – $175 CAD"` (`1%–1.75%`), which is below typical minimum surety premiums (`$250–$500+`).
  - Update `RATE_TABLE` / `updateCalculator()` in [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js#L115-L174) to apply realistic minimum annual premiums per category:

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

- [ ] **2.2 Upgrade Calculator Disclaimer ([index.html#L449-L452](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L449-L452)):**
  - Replace `.calc-result__disclaimer` with:
    `"*Indicative estimate only and subject to insurer minimum premiums (typically $250–$500+ CAD) and formal surety underwriting. This calculator is not a quote, binder, or commitment to issue a bond."`
- [ ] **2.3 Add 48-Hour Urgent Tender Warning Box Near `Required By Date` ([index.html#L818-L821](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L818-L821)):**

```html
<div class="note-box" style="margin-top: 0.75rem; margin-bottom: 0.5rem;">
  <strong>Tender closing within 48 hours?</strong>
  <span>Do not rely solely on an online submission—call our Burnaby office directly at <a href="tel:6044202501">604-420-2501</a> (Mon–Fri, 8:30 AM – 4:30 PM PT).</span>
</div>
```

- [ ] **2.4 Add "No Bond or Coverage Bound Online" Notice Inside Both Forms & Success Screens ([index.html#L716-L731](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L716-L731), [L849-L864](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L849-L864)):**
  - Add directly above submit buttons and inside `#contact-success` / `#apply-success`:
    `<strong>Important Notice:</strong> Submitting this online form does not bind, issue, or guarantee any surety bond, Consent of Surety, or insurance coverage. No bond is in effect until underwritten and formally executed by an authorized Attorney-in-Fact of a licensed surety company.`

---

## Section 3: Publish Privacy Policy (`privacy.html`) & Financial Products Disclosure / Terms (`terms.html`)

### Todo Checklist
- [ ] **3.1 Create `privacy.html` in the repository root** (`vercel.json` has `"cleanUrls": true`, so `/privacy` works automatically) using the compliant draft text below.
- [ ] **3.2 Create `terms.html` in the repository root** (`/terms`) containing the **BC Financial Products Disclosure Regulation (`B.C. Reg. 573/2004`)** notice and website Terms of Use.
- [ ] **3.3 Link `/privacy` and `/terms` in the Footer and inside both `#contact-form` and `#apply-form`.**

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
   - Explicitly state: *"To operate this website and store online lead submissions, Nexus Insurance Brokers Ltd. uses third-party cloud infrastructure and email service providers—including Vercel Inc. (website hosting/edge network), Neon Inc. / AWS (database hosting), and transactional email providers. While primary production servers are configured for Canadian regions where supported, certain operational logs, backups, edge routing, or support processing may occur outside Canada, including in the **United States**. Information processed outside Canada may be subject to the laws of that jurisdiction (including lawful access by foreign authorities). Nexus maintains contractual and technical safeguards (`PIPA s. 34`) to protect your information."* *(Update exact regions once Section 2 of [02-backend-email-alerts-canada-hosting-and-admin-security.md](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/notes/master-action-plan-and-todos/02-backend-email-alerts-canada-hosting-and-admin-security.md) pins Vercel to `yyz1` and Neon to `aws-ca-central-1`.)*
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
- [ ] **4.1 Replace/Upgrade Location Input With Explicit Province/Territory Dropdown** in `#contact-form` ([index.html#L692-L707](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L692-L707)) and `#apply-form` ([index.html#L773-L777](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/index.html#L773-L777)).
- [ ] **4.2 Add the 3 Checkboxes Below** to **both** `#contact-form` and `#apply-form`, update [app.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/app.js#L301-L511) to validate required consent and serialize all new fields, and update [api/leads.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js) + [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js).

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

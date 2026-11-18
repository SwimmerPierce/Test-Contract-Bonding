# Channel 3 Execution Pack: Surgical Google Search Ads Campaign Blueprint & Verification Checklist

**Pre-Launch Gate:** Do **NOT** spend $1 on Google Ads until:
1. Tier 1 Launch Blockers (including `privacy.html` and `terms.html`) and `contractbonding.ca` DNS cutover are complete;
2. Google Ads **Financial Services / Advertiser Verification** is approved for **Nexus Insurance Brokers Ltd.**; and
3. Alberta licensing/routing (`AB Insurance Act s. 452`) is live before targeting Alberta clicks.

---

## 1. Google Ads Financial Services & Advertiser Verification Checklist
- [ ] Create / verify Google Ads billing profile under exact legal name: **Nexus Insurance Brokers Ltd.**
- [ ] Billing address must match Burnaby office NAP: `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`.
- [ ] Upload **Insurance Council of BC** corporate licence (and **Alberta Insurance Council** corporate licence if running Alberta ad groups).
- [ ] Verify domain ownership (`contractbonding.ca`) in Google Search Console / DNS TXT record.

---

## 2. Campaign Settings (Zero Budget Waste Configuration)
- **Campaign Type:** Search Network Only (**Disable** Search Partners and **Disable** Display Network expansion).
- **Locations:** Target `British Columbia, Canada` and `Alberta, Canada` *(disable Alberta ad group / geo until AIC licensing or routing is verified)*.
- **Location Options (CRITICAL):** Select **`Presence: People in or regularly in your targeted locations`** (NEVER "Presence or interest", which leaks budget to out-of-country searchers).
- **Ad Schedule:** Prioritize Monday–Friday `7:00 AM – 6:00 PM PT` (or run 24/7 with bid adjustments during Burnaby office hours `8:30 AM – 4:30 PM PT`).
- **Bidding Strategy:** Start with **Maximize Clicks (with Max CPC Cap)** or **Manual CPC** for the first 30 conversions, then transition to Maximize Conversions once lead tracking has sufficient volume.

---

## 3. Four Exact/Phrase Match Ad Groups & Compliant Ad Copy

> **Compliance Rule:** Never promise "guaranteed approval" or "instant binding online" in ad headlines or descriptions. Always route clicks to specific landing pages once published (or `/#calculator` for BC Contract/Bid initially).

### Ad Group 1: BC Contract & Bid Bonds
- **Landing URL (Pre-SEO Pages):** `https://contractbonding.ca/#calculator` *(Update to `https://contractbonding.ca/bid-bonds-bc` once published & reviewed)*
- **Keywords:**
  - `[contract bonding bc]`
  - `[construction bid bond vancouver]`
  - `"surety bond broker bc"`
  - `"performance bond bc"`
  - `"consent of surety bc"`
- **Ad Headlines (max 30 chars):**
  - `Construction Bonds in BC`
  - `Bid Bonds & Consent of Surety`
  - `Nexus Insurance Brokers Ltd.`
  - `Fast Digital E-Bonds`
  - `Performance & L&M Bonds`
  - `Call 604-420-2501 (Burnaby)`
- **Descriptions (max 90 chars):**
  - `Fast Bid, Performance & L&M Payment Bonds across BC. Calculate indicative rates online.`
  - `Operated by Nexus Insurance Brokers Ltd. (#101-4268 Lozells Ave, Burnaby). Apply today.`

### Ad Group 2: BC TSBC Licence Bonds
- **Landing URL (Gate):** `https://contractbonding.ca/bc-electrical-gas-contractor-bond` *(Hold ad group paused until page is published & broker-reviewed)*
- **Keywords:**
  - `[technical safety bc surety bond]`
  - `"electrical contractor bond bc"`
  - `"gas contractor bond bc"`
  - `"tsbc $10000 bond"`
- **Ad Headlines:**
  - `TSBC $10,000 Surety Bonds`
  - `Electrical & Gas Bonds BC`
  - `24–48 Hr Underwriting Review`
  - `Bundle Contractor CGL & Tools`
- **Descriptions:**
  - `Technical Safety BC $10,000 electrical & gas contractor bonds. Fast processing in BC.`
  - `Operated by Nexus Insurance Brokers Ltd. Ask about bundling $2M-$5M Contractor CGL.`

### Ad Group 3: Alberta Prepaid & Contract Bonds
- **Landing URL (Gate):** `https://contractbonding.ca/alberta-prepaid-contractor-bond` *(Hold ad group paused until AIC licensing/routing is active AND page is published)*
- **Keywords:**
  - `[alberta prepaid contractor bond]`
  - `"service alberta surety bond"`
  - `"contract bonding calgary"`
  - `"bid bond edmonton"`
- **Ad Headlines:**
  - `Alberta $10k Prepaid Bonds`
  - `Service Alberta Surety Bonds`
  - `Calgary & Edmonton Bonding`
  - `Nexus Insurance Brokers Ltd.`
- **Descriptions:**
  - `Service Alberta $10,000 Prepaid Contracting Licence Bonds & Bid/Performance facilities.`
  - `Licensed in BC & Alberta. Original documents couriered promptly. Request a quote.`

### Ad Group 4: Developer Subdivision Bonds
- **Landing URL (Gate):** `https://contractbonding.ca/developer-subdivision-bonds` *(Hold ad group paused until page is published & broker-reviewed)*
- **Keywords:**
  - `"subdivision bond bc"`
  - `"developer surety bond vancouver"`
  - `"replace letter of credit surety bond"`
- **Ad Headlines:**
  - `Subdivision Surety Bonds BC`
  - `Replace Bank Letters of Credit`
  - `Unlock Development Cash Flow`
  - `Metro Vancouver Surety Team`
- **Descriptions:**
  - `Free up cash & credit lines tied up in municipal Letters of Credit. Servicing & warranty.`
  - `Arranged by Nexus Insurance Brokers Ltd. in Burnaby, BC. Speak with a specialist.`

---

## 4. Master Negative Keyword List (Apply at Campaign Level Before Enabling Spend)
Paste verbatim into Google Ads Shared Negative Keyword List:
```text
bail
jail
prison
court
immigration
fidelity
employee dishonesty
janitorial
cleaning
title
motor vehicle
car
notary
us
usa
texas
california
definition
meaning
wikipedia
template
free
jobs
career
salary
```

---

## 5. Conversion Tracking Setup Checklist
- [ ] Track primary conversions ONLY on:
  1. Successful `POST /api/leads` response (`lead_type: "application"` or `"contact"`) — **Primary Conversion**;
  2. Successful `POST /api/leads` checklist download (`lead_type: "checklist"`) — **Secondary Conversion**;
  3. Clicks on `tel:6044202501` links (`Call Click`) — **Primary Conversion**.
- [ ] Do **NOT** count calculator button clicks or modal opens as conversions (avoid optimizing ad spend on window-shoppers).

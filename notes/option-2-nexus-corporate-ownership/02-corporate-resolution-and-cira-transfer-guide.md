# Corporate Director Resolution & CIRA / Infrastructure Migration Guide (Option 2)

---

## Document 2A: Written Resolution of the Sole Director of Nexus Insurance Brokers Ltd.

**NEXUS INSURANCE BROKERS LTD.**  
(the **"Corporation"**)  
British Columbia Incorporation No.: [BC_INC_NUMBER]  

**RESOLUTION OF THE SOLE DIRECTOR PURSUANT TO THE *BUSINESS CORPORATIONS ACT* (BRITISH COLUMBIA)**

**WHEREAS:**
1. Chase Addison, a licensed General Insurance Level 1 Salesperson sponsored by the Corporation, has developed the website platform and CIRA domain name **`contractbonding.ca`** (`Test-Contract-Bonding`) to generate construction surety bond and commercial contractor insurance leads in British Columbia, Alberta, and via interprovincial partner broker referrals across Canada;
2. To ensure seamless compliance with the *Financial Institutions Act* (RSBC 1996, c. 141), the Insurance Council of British Columbia Rules, the Alberta *Insurance Act* (RSA 2000, c. I-3), and the Corporation's Errors & Omissions insurance policy, the Corporation wishes to acquire legal ownership of `contractbonding.ca` and the Platform Assets subject to the Domain & IP Assignment, Producer Commission, and Asset Reversion Agreement dated **[DATE]** (the **"Agreement"**);

**NOW THEREFORE BE IT RESOLVED THAT:**
1. **Approval of Acquisition & Reversion Agreement:** The Corporation is authorized to enter into and execute the Agreement with Chase Addison, including the Schedule A Producer Commission Tiers and the binding Section 4 Asset Reversion and Change-of-Control Buyout covenants.
2. **Corporate Expense Assumption:** The Corporation is authorized to pay directly from corporate accounts all domain registration fees, Vercel/Neon cloud hosting fees, transactional email services, regulatory DBA filing fees, E&O endorsements, and pre-approved marketing/Google Ads expenditures associated with `contractbonding.ca`.
3. **Trade Name (DBA) & Regulatory Filings:** The President / Level 3 Nominee (**[Father's Full Legal Name]**) is authorized to register `"Contract Bonding"` / `"contractbonding.ca"` (if adopted as a DBA) with BC Registries and Online Services, Alberta Corporate Registries, the Insurance Council of BC (pursuant to Rule 7(3)(d)), the Alberta Insurance Council, and the Corporation's E&O insurer (pursuant to Rule 7(11)).
4. **BMS Commission Tracking:** Management shall establish tracking tag `CB-WEB` in the Corporation's Broker Management System to track all gross commissions, renewal commissions, and interprovincial referral fees originated through `contractbonding.ca`.

**DATED** as of **[DATE]**.

\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_  
**[Father's Full Legal Name]**, Sole Director  
Nexus Insurance Brokers Ltd.  

---

## Document 2B: Step-by-Step CIRA `.ca` Corporate Transfer & Cloud Migration Guide

### Part 1: CIRA `.ca` Domain Registrant Change (Individual -> Corporation)
Under CIRA (Canadian Internet Registration Authority) rules, `.ca` domains require meeting **Canadian Presence Requirements (CPR)**. A **British Columbia incorporated company (`Nexus Insurance Brokers Ltd.`)** fully satisfies CIRA CPR Category 2 (*"Corporation"*).

- [ ] **Step 1 (Pre-Check):** Confirm both the Director's Resolution (2A) and the Assignment & Reversion Agreement (`01-domain-ip-assignment-and-reversion-agreement.md`) are signed.
- [ ] **Step 2 (Initiate Registrant Update at Registrar):** Log into the registrar holding `contractbonding.ca` (e.g., GoDaddy, Namecheap, Rebel, Webnames.ca, or Cloudflare).
- [ ] **Step 3 (Select "Registrant / Owner Change"):**
  - **Legal Registrant Name:** `Nexus Insurance Brokers Ltd.`
  - **CIRA Legal Type:** `Corporation (CCO)`
  - **Registrant Address:** `#101 – 4268 Lozells Avenue, Burnaby, BC V5A 0C6`
  - **Administrative Contact:** `[Father's Name]` using official `@nexusinsurancebrokers.com` email.
  - **Technical Contact:** `Chase Addison` (so Chase retains full DNS/deployment operational control).
- [ ] **Step 4 (Approve CIRA Confirmation Emails):** Both Chase (current registrant) and the incoming corporate administrative contact must click the CIRA registrant-change approval emails within the registrar's window.
- [ ] **Step 5 (Save CIRA Confirmation Receipt):** Store the updated CIRA WHOIS/registration receipt in Nexus's corporate binder and enable **Registrar Transfer Lock + 2FA**. *(Note: Under CIRA/ICANN rules, a registrant change often triggers a 60-day transfer lock between registrars—do NOT change registrars and registrant owner at the same time; change owner first or transfer registrar first.)*

### Part 2: Vercel, Neon Postgres & Email API Corporate Billing Migration
- [ ] **GitHub (`SwimmerPierce/Test-Contract-Bonding`):** Either move the repository under a Nexus corporate GitHub Organization (with Chase as Owner/Maintainer) or grant a backup corporate recovery account read/admin access.
- [ ] **Vercel Account:** Transfer the project to a Vercel Team owned by `Nexus Insurance Brokers Ltd.` (or update Vercel billing entity/credit card to Nexus's corporate Visa/Mastercard) and keep `"regions": ["yyz1"]` (Toronto, Canada).
- [ ] **Neon Postgres:** Ensure the production Neon project (`aws-ca-central-1` Montreal) bills to Nexus's corporate card and share encrypted `.env` / emergency backup recovery keys in Nexus's password vault (1Password / Bitwarden).
- [ ] **Google Ads & Google Business Profile:** Set Nexus's corporate billing profile and BC incorporation info in Google Ads Payments Profile (this is critical because Google Ads **Financial Services Verification** requires matching the advertiser's corporate legal name and insurance brokerage licence to the paying entity!).

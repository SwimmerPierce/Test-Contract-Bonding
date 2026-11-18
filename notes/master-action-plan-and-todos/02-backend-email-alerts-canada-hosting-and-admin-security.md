# Backend Spec: Instant Email Alerts, Canada Hosting Pinning & `/admin` Security Hardening

This specification covers the exact backend, infrastructure, and `/admin` dashboard upgrades required for [api/leads.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js), [api/auth.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/auth.js), [lib/db.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js), [vercel.json](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/vercel.json), and [admin/index.html](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html).

---

## Section 1: Instant Email Alerts in `api/leads.js` (Zero-Dependency Resend / Postmark Integration)

### Todo Checklist
- [ ] **1.1 Choose Transactional Email Provider:** Recommended: **Resend** (`resend.com`, verified domain `contractbonding.ca` or `mail.contractbonding.ca` with SPF/DKIM/DMARC records) or **Postmark** (`postmarkapp.com`, Canadian-friendly deliverability). Using native Node 20 `fetch()` keeps [package.json](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/package.json) lightweight with zero extra npm dependencies.
- [ ] **1.2 Configure New Environment Variables** in `.env` and Vercel Project Settings -> Environment Variables:
  - `RESEND_API_KEY` (secret API key)
  - `ALERT_TO_EMAILS` (comma-separated, e.g., `chase@nexusinsurancebrokers.com,father@nexusinsurancebrokers.com`)
  - `ALERT_FROM_EMAIL` (e.g., `Contract Bonding Portal <alerts@contractbonding.ca>`)
- [ ] **1.3 Create `lib/email.js` helper** and invoke it inside `POST /api/leads` ([api/leads.js#L55-L79](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js#L55-L79)) right after `createLead(...)` succeeds (wrap email sending in `try/catch` or `Promise.allSettled` so an email outage never drops a lead that was already saved to Neon Postgres!).

### Drop-In Node.js Blueprint (`lib/email.js`)
```javascript
"use strict";

function isUrgentTender(lead) {
  if (!lead) return false;
  const isBid = String(lead.bond_type || "").toLowerCase() === "bid";
  if (!lead.required_date) return isBid;
  const dueMs = Date.parse(lead.required_date);
  if (Number.isNaN(dueMs)) return isBid;
  const daysRemaining = (dueMs - Date.now()) / (1000 * 60 * 60 * 24);
  return isBid || daysRemaining <= 7;
}

async function sendEmailViaResend({ to, subject, html, text, replyTo }) {
  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  const from = String(process.env.ALERT_FROM_EMAIL || "").trim();
  if (!apiKey || !from || !to || !to.length) return { skipped: true };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Email API error (${res.status}): ${errText}`);
  }
  return res.json();
}

async function sendLeadNotifications(lead) {
  const alertRecipients = String(process.env.ALERT_TO_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const urgentPrefix = isUrgentTender(lead) ? "[URGENT TENDER] " : "";
  const outOfProvinceTag =
    lead.province && !["BC", "AB"].includes(lead.province)
      ? ` [REFERRAL: ${lead.province}]`
      : "";
  const crossSellTag = lead.cross_sell_insurance ? " [+CGL CROSS-SELL]" : "";

  const internalSubject = `${urgentPrefix}New ${lead.bond_type} Lead (${lead.company_name})${outOfProvinceTag}${crossSellTag} — ${lead.reference_id}`;

  const internalText = [
    `Reference ID: ${lead.reference_id}`,
    `Type: ${lead.lead_type}`,
    `Company: ${lead.company_name}`,
    `Contact: ${lead.contact_name}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Province: ${lead.province || "Not specified"} | City: ${lead.city || "—"}`,
    `Bond Type: ${lead.bond_type} | Amount: ${lead.amount || "—"}`,
    `Required By Date: ${lead.required_date || "—"}`,
    `Cross-Sell Commercial Insurance Requested: ${lead.cross_sell_insurance ? "YES" : "No"}`,
    `CASL Marketing Opt-In: ${lead.marketing_opt_in ? "YES (Express)" : "No (6-mo Inquiry Implied Only)"}`,
    `Notes: ${lead.notes || "—"}`,
    "",
    "Review & record Level 2/3 supervision in /admin.",
  ].join("\n");

  const applicantSubject = `We Received Your Surety Inquiry (${lead.reference_id}) — Nexus Insurance Brokers Ltd.`;
  const applicantText = [
    `Hello ${lead.contact_name},`,
    "",
    `Thank you for contacting contractbonding.ca, operated by Nexus Insurance Brokers Ltd. (Reference #${lead.reference_id}).`,
    "",
    "IMPORTANT NOTICE:",
    "- Submitting an online inquiry or application does NOT bind coverage or guarantee issuance of any surety bond or Consent of Surety.",
    "- Need a Bid Bond within 48 hours? Please call our Burnaby office immediately at 604-420-2501 (Mon–Fri, 8:30 AM – 4:30 PM PT).",
    "",
    "Nexus Insurance Brokers Ltd.",
    "#101 - 4268 Lozells Avenue, Burnaby, BC V5A 0C6 | Tel: 604-420-2501",
    "Licensed in British Columbia & Alberta",
  ].join("\n");

  await Promise.allSettled([
    alertRecipients.length
      ? sendEmailViaResend({
          to: alertRecipients,
          subject: internalSubject,
          text: internalText,
          replyTo: lead.email,
        })
      : Promise.resolve(),
    lead.email
      ? sendEmailViaResend({
          to: [lead.email],
          subject: applicantSubject,
          text: applicantText,
        })
      : Promise.resolve(),
  ]);
}

module.exports = { sendLeadNotifications };
```

---

## Section 2: Pin Hosting & Database to Canada (Reducing PIPA Cross-Border Exposure)

### Todo Checklist
- [ ] **2.1 Provision Neon Postgres in `aws-ca-central-1` (Montreal, Canada):**
  1. In Vercel Marketplace / Neon Console (`console.neon.tech`), create the production database choosing **Region: AWS Canada (Central) — `ca-central-1` (Montreal)**.
  2. Update `DATABASE_URL` in Vercel Project Settings -> Environment Variables to the new Canadian Neon connection string.
  3. Re-run `npm test` or hit `/api/leads` so `ensureSchema()` initializes `surety_leads` cleanly in the Canadian database (or migrate existing test records if needed).
- [ ] **2.2 Pin Vercel Serverless Functions to Toronto (`yyz1`) & Add Security Headers in [vercel.json](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/vercel.json):**

```json
{
  "version": 2,
  "cleanUrls": true,
  "regions": ["yyz1"],
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/admin/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    },
    {
      "source": "/admin(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "noindex, nofollow" },
        { "key": "Cache-Control", "value": "no-store, no-cache, must-revalidate" }
      ]
    }
  ]
}
```

*(Note: Verify exact `regions` support on your Vercel plan tier—Vercel Pro/Hobby region defaults can also be checked in Vercel Project Settings -> Functions -> Function Region (`Toronto, Canada (yyz1)`). Also remember Alberta PIPA s. 13.1 still requires disclosing any US-based subprocessors like Vercel's global edge routing or US-based email APIs in `privacy.html`.)*

---

## Section 3: Harden `/admin` Security & Add Level 1 Supervision + CASL Schema

### 3.1 Database Schema Migration ([lib/db.js#L41-L68](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js#L41-L68))
Add non-destructive `ALTER TABLE` statements inside `ensureSchema()` so existing databases upgrade seamlessly:

```sql
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS province VARCHAR(32);
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS cross_sell_insurance BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS privacy_consent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS referral_consent BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS marketing_opt_in BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMPTZ;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS casl_implied_expires_at TIMESTAMPTZ;
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS assigned_broker VARCHAR(100);
ALTER TABLE surety_leads ADD COLUMN IF NOT EXISTS supervising_agent VARCHAR(100);
```

- When creating a lead in `createLead()`, automatically compute:
  - `casl_implied_expires_at = NOW() + INTERVAL '6 months'` (tracking CASL s. 10(9) 6-month inquiry consent expiry!).
- Update `updateLead()` ([lib/db.js#L203-L245](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/db.js#L203-L245)) and `PATCH /api/leads` ([api/leads.js#L111-L115](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js#L111-L115)) to allow updating `assigned_broker` and `supervising_agent`.

### 3.2 Brute-Force Protection on `/api/auth` ([api/auth.js#L31-L62](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/auth.js#L31-L62))
- [ ] Add an IP + Postgres-backed (or Upstash/KV) failed-login counter so after **5 failed attempts within 15 minutes**, `POST /api/auth` returns `HTTP 429 Too Many Requests` (`Retry-After: 900`). *(Tip: In serverless Vercel functions, in-memory Maps reset on cold starts—using a tiny `auth_attempts` table in Neon Postgres makes brute-force lockout persistent across all Vercel edge/lambda instances with zero extra services!)*
- [ ] Add a strong `ADMIN_PASSWORD` (20+ random characters) in Vercel Env Vars and rotate it quarterly.
- [ ] Consider shortening `SESSION_TTL_SECONDS` in [lib/auth.js#L16](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/lib/auth.js#L16) from 7 days (`60 * 60 * 24 * 7`) to **8 or 12 hours** (`60 * 60 * 12`) to match brokerage PIPA security standards (`BC/AB PIPA s. 34`).

### 3.3 Anti-Spam Protection on `POST /api/leads` ([api/leads.js#L19-L79](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/api/leads.js#L19-L79))
- [ ] Add a hidden CSS **honeypot field** (e.g., `name="website_url"`, visually hidden via `aria-hidden="true"` and `tabindex="-1"`) on `#contact-form` and `#apply-form`. If populated on `POST /api/leads`, silently reject (`400` or fake `201` without saving/emailing).
- [ ] Optional upgrade: Add **Cloudflare Turnstile** invisible challenge before launch if bots target public forms.

### 3.4 `/admin` Dashboard Supervision & CASL UI Additions ([admin/index.html#L218-L257](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/index.html#L218-L257) & [admin/admin.js](file:///C:/Users/ChaseAddison/Documents/GitHub/Test-Contract-Bonding/admin/admin.js))
- [ ] Add **`Assigned Broker`** dropdown (`Chase Addison (Level 1 — BC/AB)`, `[Father Name] (Level 3 Nominee — Signatory)`, `Out-of-Province Referral Partner`) and **`Supervising Level 2/3 Agent Sign-Off`** field to `#detail-update-form`.
- [ ] Display badges in the leads table for:
  - **Province** (`BC`, `AB`, or `REFERRAL: ON/SK/etc.`)
  - **`+CGL Cross-Sell`** when `cross_sell_insurance === true`
  - **CASL Status** (`Express Opt-In` vs. `Implied: Expires YYYY-MM-DD`) so no one emails an expired lead past 6 months.
- [ ] Update CSV Export in `admin/admin.js` to include `province`, `cross_sell_insurance`, `marketing_opt_in`, `casl_implied_expires_at`, `assigned_broker`, and `supervising_agent`.

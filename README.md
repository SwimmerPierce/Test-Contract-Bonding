# contractbonding.ca — Construction & Surety Bonds Website + Neon Postgres Lead Dashboard

Full-stack Vercel website for **contractbonding.ca** with Trusted Broker Partner **Nexus Insurance Brokers Ltd.** (Burnaby, BC), featuring serverless lead capture into **Vercel Neon Postgres** and a password-protected `/admin` dashboard.

## Architecture & Files

- [index.html](index.html) — Public homepage with hero section, surety fundamentals, 3 C's of Surety, benefits, bond types (Tender, Final, Administrative/Other), interactive rate calculator, 3-step workflow, testimonials, and modal dialogs for **Contact Us** and **Apply Now**.
- [styles.css](styles.css) — Responsive stylesheet for the public website.
- [app.js](app.js) — Client-side interactivity for navigation, the Surety Bond Rate Calculator, and submitting **Contact Us** and **Apply Now** leads to `POST /api/leads`.
- [admin/index.html](admin/index.html), [admin/admin.css](admin/admin.css), [admin/admin.js](admin/admin.js) — Password-protected `/admin` dashboard displaying KPI metrics, real-time search/filtering, pipeline status updates, broker underwriting notes, manual lead entry, and CSV export.
- [api/leads.js](api/leads.js) — Vercel Node.js serverless function handling `POST`, `GET`, `PATCH`, and `DELETE` operations on leads.
- [api/auth.js](api/auth.js) — Vercel Node.js serverless function handling `/admin` password verification and signed `HttpOnly` session cookies.
- [lib/db.js](lib/db.js) — `@neondatabase/serverless` Postgres connection layer with automatic `CREATE TABLE IF NOT EXISTS surety_leads` initialization (plus a local JSON fallback when running offline without `DATABASE_URL`).
- [lib/auth.js](lib/auth.js) — Constant-time password verification and HMAC-SHA256 session token signing.
- [vercel.json](vercel.json) — Vercel routing configuration (`cleanUrls: true` and `/admin` rewrite).

## Environment Variables (Vercel + Neon Free Tier)

Configure the following environment variables in your Vercel project settings (see [.env.example](.env.example)):

| Variable | Description |
| :--- | :--- |
| `DATABASE_URL` | Automatically injected when connecting a free **Neon Postgres** store from the Vercel Marketplace (**Storage → Create Database → Neon**). Also accepts `POSTGRES_URL` or `NEON_DATABASE_URL`. |
| `ADMIN_PASSWORD` | Password required to unlock the `/admin` dashboard (must be set in `.env` locally and in Vercel Project Settings → Environment Variables; no default fallback exists in source code). |

The `surety_leads` table and indexes are created automatically on the first request—no manual SQL migration is required.

## Local Development & Testing

Copy [.env.example](.env.example) to `.env` (which is gitignored) and set your `DATABASE_URL` and `ADMIN_PASSWORD`:

```powershell
Copy-Item .env.example .env
npm install
npm start
```

- Public website: `http://localhost:3000/`
- Admin dashboard: `http://localhost:3000/admin`

Run the automated end-to-end API and authentication test suite:

```powershell
npm test
```

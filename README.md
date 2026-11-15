# Nexus Insurance Brokers Ltd. — Construction & Surety Bonds Website

A static, responsive brokerage website for **Nexus Insurance Brokers Ltd.** (Burnaby, BC), modeled after the structure and visual tone of `https://www.bondconnect.ca/construction-bonds/`.

## Architecture & Files

- [index.html](file:///C:/Users/chase/OneDrive/Desktop/test%20with%20ken/index.html) — Homepage layout with hero section, surety fundamentals, 3 C's of Surety, benefits, bond types (Tender, Final, Administrative/Other), interactive rate calculator, 3-step workflow, testimonials, and modal dialogs for **Contact Us** and **Apply Now**.
- [styles.css](file:///C:/Users/chase/OneDrive/Desktop/test%20with%20ken/styles.css) — Responsive styling using a navy (`#2b3378`), steel blue (`#2974a3`), and warm gold (`#ead98a`) palette.
- [app.js](file:///C:/Users/chase/OneDrive/Desktop/test%20with%20ken/app.js) — Handles mobile navigation, modal open/close and bond-type pre-selection, Surety Bond Rate Calculator calculations, and form validation/confirmation summaries.

## Interactive Features

1. **Contact Us Modal**
   - Displays *"One of our professionals will reach out to you."*
   - Collects **Name**, **Email**, **Company Name**, **Phone Number**, **Type of Bond** (`Contract`, `Bid`, `Administrative`, `Other`), and optional notes.
2. **Apply Now Modal (Bond Application Form)**
   - Collects applicant/business info, bond & project details, and underwriting readiness, returning a reference summary upon submission.
3. **Surety Bond Rate Calculator**
   - Estimates indicative CAD bond rates and cost ranges by contract value, bond category, and financial profile.

## Usage

Open `index.html` directly in any modern web browser, or serve the folder locally:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

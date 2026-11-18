/**
 * Generates a clean, zero-dependency, print-ready 2-page PDF for:
 * assets/first-time-bonding-readiness-checklist.pdf
 * Content matches notes/master-action-plan-and-todos/04-first-time-bonding-readiness-checklist-lead-magnet.md
 */
"use strict";

const fs = require("fs");
const path = require("path");

function escPdf(text) {
  return String(text || "")
    .replace(/[^\x20-\x7E]/g, (ch) => {
      if (ch === "\u2013" || ch === "\u2014") return "-";
      if (ch === "\u2018" || ch === "\u2019") return "'";
      if (ch === "\u201C" || ch === "\u201D") return '"';
      if (ch === "\u2022") return "*";
      if (ch === "\u00A9") return "(c)";
      return " ";
    })
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapText(text, maxChars) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= maxChars) {
      current += " " + word;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function buildPage1Stream() {
  const cmds = [];
  // Top Navy Banner (#0B2545 -> 0.043 0.145 0.271)
  cmds.push("0.043 0.145 0.271 rg");
  cmds.push("0 704 612 88 re f");
  // Gold Accent Strip (#D4A017 -> 0.831 0.627 0.090)
  cmds.push("0.831 0.627 0.090 rg");
  cmds.push("0 700 612 4 re f");

  // Header Text
  cmds.push("BT /F2 9 Tf 0.831 0.627 0.090 rg 42 768 Td (" + escPdf("contractbonding.ca  -  Operated by Nexus Insurance Brokers Ltd. (Licensed in BC & Alberta)") + ") Tj ET");
  cmds.push("BT /F2 19 Tf 1 1 1 rg 42 742 Td (" + escPdf("First-Time Contractor Bonding Readiness Checklist") + ") Tj ET");
  cmds.push("BT /F1 10 Tf 0.86 0.92 0.97 rg 42 720 Td (" + escPdf("How Contractors in BC & Alberta Get Approved for Bid, Performance & Licence Bonds in 5-7 Business Days") + ") Tj ET");

  let y = 674;

  // Section 1: 3 C's
  cmds.push("BT /F2 12 Tf 0.043 0.145 0.271 rg 42 " + y + " Td (" + escPdf('1. Understand the "3 C\'s" Surety Underwriters Score') + ") Tj ET");
  y -= 16;
  const intro1 = wrapText(
    "Unlike traditional insurance, a surety bond is a three-party credit guarantee - the surety expects zero losses. Underwriters evaluate every contractor on:",
    94
  );
  for (const line of intro1) {
    cmds.push("BT /F1 9.5 Tf 0.18 0.23 0.28 rg 42 " + y + " Td (" + escPdf(line) + ") Tj ET");
    y -= 13;
  }
  y -= 4;

  const threeCs = [
    ["[ ] Character:", "Clean credit history (corporate & personal), strong trade references, zero unresolved lien/bond claims, and honest communication."],
    ["[ ] Capacity:", "Proven project management track record, equipment, key estimators/superintendents, and experience completing projects of similar scope and size."],
    ["[ ] Capital:", "Positive Working Capital (Current Assets minus Current Liabilities) and Net Worth / Equity sized appropriately for your target job size (rule of thumb: ~10%+ of total uncompleted bonded backlog, depending on trade & facility tier)."]
  ];

  for (const [label, body] of threeCs) {
    const wrapped = wrapText(body, 82);
    cmds.push("BT /F2 9.5 Tf 0.043 0.145 0.271 rg 48 " + y + " Td (" + escPdf(label) + ") Tj ET");
    for (let i = 0; i < wrapped.length; i++) {
      const xOff = i === 0 ? 124 : 66;
      cmds.push("BT /F1 9.5 Tf 0.18 0.23 0.28 rg " + xOff + " " + y + " Td (" + escPdf(wrapped[i]) + ") Tj ET");
      if (i < wrapped.length - 1) y -= 13;
    }
    y -= 17;
  }

  y -= 8;
  // Section 2: Financial Statement Tiers
  cmds.push("BT /F2 12 Tf 0.043 0.145 0.271 rg 42 " + y + " Td (" + escPdf("2. Financial Statement Tiers: What Level Do You Need?") + ") Tj ET");
  y -= 14;

  // Table header background
  cmds.push("0.043 0.145 0.271 rg 42 " + (y - 16) + " 528 20 re f");
  cmds.push("BT /F2 9 Tf 1 1 1 rg 50 " + (y - 9) + " Td (" + escPdf("Target Single Project / Aggregate Limit") + ") Tj ET");
  cmds.push("BT /F2 9 Tf 1 1 1 rg 255 " + (y - 9) + " Td (" + escPdf("Typical Financial Statement Requirement") + ") Tj ET");
  y -= 18;

  const tiers = [
    ["$10,000 Licence Bonds (TSBC Electrical/Gas or AB Prepaid Contractor)", "Credit-score / Express Underwriting - Often approved in 24-48 hrs via short application + credit check (no CPA financials needed)."],
    ["Small / Emerging Facility (Up to $250K - $500K)", "Compilation (CSRS 4200 / Notice to Reader) prepared by a CPA + personal net worth statement + credit check."],
    ["Standard Growth Facility ($500K - $2M+)", "Review Engagement Financial Statements prepared by an independent CPA (including Work-in-Progress / WIP schedule)."],
    ["Major Public & Civil Facilities ($5M+)", "Review Engagement or Audited Statements + full CPA-reviewed WIP schedule + confirmed bank operating line of credit."]
  ];

  for (let r = 0; r < tiers.length; r++) {
    const col1Lines = wrapText(tiers[r][0], 34);
    const col2Lines = wrapText(tiers[r][1], 56);
    const maxLines = Math.max(col1Lines.length, col2Lines.length);
    const rowH = maxLines * 12 + 10;

    if (r % 2 === 0) {
      cmds.push("0.93 0.95 0.97 rg 42 " + (y - rowH) + " 528 " + rowH + " re f");
    }
    cmds.push("0.83 0.88 0.92 RG 0.6 w 42 " + (y - rowH) + " 528 " + rowH + " re S");

    for (let i = 0; i < col1Lines.length; i++) {
      cmds.push("BT /F2 8.8 Tf 0.043 0.145 0.271 rg 50 " + (y - 13 - i * 12) + " Td (" + escPdf(col1Lines[i]) + ") Tj ET");
    }
    for (let i = 0; i < col2Lines.length; i++) {
      cmds.push("BT /F1 8.8 Tf 0.18 0.23 0.28 rg 255 " + (y - 13 - i * 12) + " Td (" + escPdf(col2Lines[i]) + ") Tj ET");
    }
    y -= rowH;
  }

  y -= 16;
  const tipLines = wrapText(
    "Tip: Still on Compilation statements and planning to bid $1M+ tenders? Ask Nexus to introduce you to a construction-specialized CPA early so you upgrade smoothly at year-end.",
    94
  );
  for (const line of tipLines) {
    cmds.push("BT /F1 8.8 Tf 0.30 0.38 0.46 rg 42 " + y + " Td (" + escPdf(line) + ") Tj ET");
    y -= 12;
  }

  // Footer
  cmds.push("0.85 0.89 0.93 RG 0.8 w 42 52 m 570 52 l S");
  cmds.push("BT /F1 7.6 Tf 0.35 0.42 0.48 rg 42 38 Td (" + escPdf("contractbonding.ca | Operated by Nexus Insurance Brokers Ltd. | #101-4268 Lozells Ave, Burnaby, BC | 604-420-2501") + ") Tj ET");
  cmds.push("BT /F1 7.6 Tf 0.35 0.42 0.48 rg 528 38 Td (" + escPdf("Page 1 of 2") + ") Tj ET");

  return cmds.join("\n");
}

function buildPage2Stream() {
  const cmds = [];
  // Top Navy Mini-Banner
  cmds.push("0.043 0.145 0.271 rg 0 742 612 50 re f");
  cmds.push("0.831 0.627 0.090 rg 0 738 612 4 re f");
  cmds.push("BT /F2 12 Tf 1 1 1 rg 42 762 Td (" + escPdf("First-Time Contractor Bonding Readiness Checklist (Continued)") + ") Tj ET");

  let y = 706;
  // Section 3: 6-Item Document Packet
  cmds.push("BT /F2 12 Tf 0.043 0.145 0.271 rg 42 " + y + " Td (" + escPdf('3. The 6-Item "Bond-Ready" Document Packet') + ") Tj ET");
  y -= 16;
  cmds.push("BT /F1 9.5 Tf 0.18 0.23 0.28 rg 42 " + y + " Td (" + escPdf("Gather these six items before tender week so your broker can negotiate the lowest rate tier (1%-1.5% vs. emergency rates):") + ") Tj ET");
  y -= 20;

  const items = [
    ["[ ] 1. Completed Contractor Questionnaire:", "Company history, ownership %, key staff resumes, and 3 largest completed jobs."],
    ["[ ] 2. Last 2-3 Years Fiscal Year-End Financial Statements:", "Plus most recent internal interim Balance Sheet & Income Statement if >6 months old."],
    ["[ ] 3. Current Work-in-Progress (WIP) Schedule:", "Contract price, billed to date, costs to date, and estimated cost to complete."],
    ["[ ] 4. Signed Personal Net Worth (PNW) Statement:", "Required for all shareholders owning 10%+ (used to support corporate indemnity)."],
    ["[ ] 5. Bank Line of Credit Confirmation:", "Credit limit, current utilization, and maturity date - unused operating lines strengthen capacity."],
    ["[ ] 6. Certificate of Insurance (COI):", "Showing active Commercial General Liability ($2M-$5M) and Builders Risk / Equipment coverage."]
  ];

  for (const [title, desc] of items) {
    cmds.push("0.96 0.97 0.99 rg 42 " + (y - 30) + " 528 38 re f");
    cmds.push("0.83 0.88 0.92 RG 0.5 w 42 " + (y - 30) + " 528 38 re S");
    cmds.push("BT /F2 9.5 Tf 0.043 0.145 0.271 rg 52 " + (y - 6) + " Td (" + escPdf(title) + ") Tj ET");
    cmds.push("BT /F1 9 Tf 0.22 0.28 0.34 rg 68 " + (y - 20) + " Td (" + escPdf(desc) + ") Tj ET");
    y -= 46;
  }

  y -= 10;
  // Section 4: Pre-Bid Timeline
  cmds.push("BT /F2 12 Tf 0.043 0.145 0.271 rg 42 " + y + " Td (" + escPdf("4. Know Your Pre-Bid Timeline (Avoid Missed Tenders!)") + ") Tj ET");
  y -= 18;
  const timeline = [
    "* Bid Bonds / Consents of Surety: Request facility setup at least 10-14 days before your first tender, and request project-specific E-Bonds at least 3-5 business days prior to tender closing.",
    "* Urgent Tender (<48 Hours)? Never rely solely on an email or web form - call 604-420-2501 immediately (Mon-Fri, 8:30 AM - 4:30 PM PT)."
  ];
  for (const item of timeline) {
    const wrapped = wrapText(item, 92);
    for (const line of wrapped) {
      cmds.push("BT /F1 9.5 Tf 0.18 0.23 0.28 rg 46 " + y + " Td (" + escPdf(line) + ") Tj ET");
      y -= 14;
    }
    y -= 4;
  }

  y -= 14;
  // CTA / Contact Box
  cmds.push("0.043 0.145 0.271 rg 42 " + (y - 108) + " 528 116 re f");
  cmds.push("0.831 0.627 0.090 rg 42 " + (y - 108) + " 6 116 re f");
  cmds.push("BT /F2 11 Tf 0.831 0.627 0.090 rg 58 " + (y - 16) + " Td (" + escPdf("Need Help Getting Bond-Ready or Benchmarking Your Current Surety Rate?") + ") Tj ET");
  cmds.push("BT /F2 10.5 Tf 1 1 1 rg 58 " + (y - 36) + " Td (" + escPdf("Nexus Insurance Brokers Ltd.  (contractbonding.ca)") + ") Tj ET");
  cmds.push("BT /F1 9.5 Tf 0.90 0.94 0.98 rg 58 " + (y - 52) + " Td (" + escPdf("#101 - 4268 Lozells Avenue, Burnaby, BC V5A 0C6  |  Tel: 604-420-2501  |  Mon-Fri, 8:30 AM - 4:30 PM PT") + ") Tj ET");
  const discLines = wrapText(
    "Licensed in British Columbia & Alberta (partner broker referrals across Canada). Indicative guidelines only; submitting an inquiry online does not bind coverage. Formal bond issuance requires underwriting and execution by a licensed surety company.",
    88
  );
  for (let i = 0; i < discLines.length; i++) {
    cmds.push("BT /F1 8.2 Tf 0.78 0.84 0.90 rg 58 " + (y - 72 - i * 11) + " Td (" + escPdf(discLines[i]) + ") Tj ET");
  }

  // Footer
  cmds.push("0.85 0.89 0.93 RG 0.8 w 42 52 m 570 52 l S");
  cmds.push("BT /F1 8 Tf 0.35 0.42 0.48 rg 42 38 Td (" + escPdf("© 2026 Nexus Insurance Brokers Ltd. (contractbonding.ca). All rights reserved.") + ") Tj ET");
  cmds.push("BT /F1 8 Tf 0.35 0.42 0.48 rg 535 38 Td (" + escPdf("Page 2 of 2") + ") Tj ET");

  return cmds.join("\n");
}

function buildPdfBuffer() {
  const s1 = buildPage1Stream();
  const s2 = buildPage2Stream();

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 7 0 R >>\nendobj\n",
    "4 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 8 0 R >>\nendobj\n",
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
    "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n",
    "7 0 obj\n<< /Length " + Buffer.byteLength(s1, "utf8") + " >>\nstream\n" + s1 + "\nendstream\nendobj\n",
    "8 0 obj\n<< /Length " + Buffer.byteLength(s2, "utf8") + " >>\nstream\n" + s2 + "\nendstream\nendobj\n"
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += "xref\n0 " + (objects.length + 1) + "\n";
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf += "trailer\n<< /Size " + (objects.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF\n";
  return Buffer.from(pdf, "utf8");
}

const outPath = path.join(__dirname, "..", "..", "assets", "first-time-bonding-readiness-checklist.pdf");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buildPdfBuffer());
console.log("Generated PDF:", outPath);

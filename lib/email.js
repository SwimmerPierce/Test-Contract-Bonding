/**
 * File: lib/email.js
 * Description: Zero-dependency transactional email alerts via Resend API using native Node 20 fetch().
 *              Sends internal [URGENT TENDER] / [AB ROUTING] / [+CGL CROSS-SELL] alerts and
 *              CASL-compliant applicant confirmation emails after lead capture.
 */

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
  if (!apiKey || !from || !to || !to.length) {
    return { skipped: true };
  }

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
      ...(html ? { html } : {}),
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
  if (!lead) return { skipped: true };

  const alertRecipients = String(process.env.ALERT_TO_EMAILS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const urgentPrefix = isUrgentTender(lead) ? "[URGENT TENDER] " : "";
  const albertaTag =
    lead.province === "AB" ? " [ALBERTA LEAD — ROUTE TO AIC-LICENSED BROKER]" : "";
  const outOfProvinceTag =
    lead.province && !["BC", "AB"].includes(lead.province)
      ? ` [REFERRAL: ${lead.province}]`
      : "";
  const crossSellTag = lead.cross_sell_insurance ? " [+CGL CROSS-SELL]" : "";

  const internalSubject = `${urgentPrefix}New ${lead.bond_type} Lead (${lead.company_name})${albertaTag}${outOfProvinceTag}${crossSellTag} — ${lead.reference_id}`;

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
    `Assigned Broker: ${lead.assigned_broker || "Unassigned"}`,
    `Cross-Sell Commercial Insurance Requested: ${lead.cross_sell_insurance ? "YES" : "No"}`,
    `CASL Marketing Opt-In: ${lead.marketing_opt_in ? "YES (Express)" : `No (6-mo Inquiry Implied Only — Expires ${lead.casl_implied_expires_at ? String(lead.casl_implied_expires_at).slice(0, 10) : "N/A"})`}`,
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
    "Mon–Fri, 8:30 AM – 4:30 PM PT | Licensed in British Columbia & Alberta",
  ].join("\n");

  const results = await Promise.allSettled([
    alertRecipients.length
      ? sendEmailViaResend({
          to: alertRecipients,
          subject: internalSubject,
          text: internalText,
          replyTo: lead.email,
        })
      : Promise.resolve({ skipped: true }),
    lead.email
      ? sendEmailViaResend({
          to: [lead.email],
          subject: applicantSubject,
          text: applicantText,
        })
      : Promise.resolve({ skipped: true }),
  ]);

  return results;
}

module.exports = {
  isUrgentTender,
  sendEmailViaResend,
  sendLeadNotifications,
};

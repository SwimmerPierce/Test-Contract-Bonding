/**
 * File: api/leads.js
 * Description: Serverless endpoint for lead submissions (POST) and admin lead management
 *              (GET, PATCH, DELETE) backed by Vercel Neon Postgres.
 */

"use strict";

const { createLead, listLeads, updateLead, deleteLead } = require("../lib/db");
const { isRequestAuthenticated } = require("../lib/auth");
const { sendJson, readJsonBody } = require("../lib/http");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const leadType = String(body.lead_type || body.leadType || "contact").trim().toLowerCase();

      const contactName = String(body.contact_name || body.contactName || body.name || "").trim();
      const companyName = String(body.company_name || body.company || "").trim();
      const email = String(body.email || "").trim();
      const phone = String(body.phone || "").trim();
      const bondType = String(body.bond_type || body.bondType || "").trim();

      if (!contactName || !companyName || !email || !phone || !bondType) {
        return sendJson(res, 400, {
          ok: false,
          error: "Please complete all required fields (Name, Company, Email, Phone, and Bond Type).",
        });
      }

      if (!isValidEmail(email)) {
        return sendJson(res, 400, {
          ok: false,
          error: "Please enter a valid email address.",
        });
      }

      if (leadType === "application") {
        const city = String(body.city || "").trim();
        const years = body.years_in_business ?? body.years;
        const amount = Number(body.amount || 0);
        if (!city || years === undefined || years === "" || !(amount > 0)) {
          return sendJson(res, 400, {
            ok: false,
            error: "Please complete all required business, location, and bond amount fields.",
          });
        }
      }

      const created = await createLead({
        reference_id: body.reference_id || body.referenceId,
        lead_type: leadType === "application" ? "application" : "contact",
        status: "New",
        contact_name: contactName,
        company_name: companyName,
        email,
        phone,
        bond_type: bondType,
        amount: body.amount,
        city: body.city,
        years_in_business: body.years_in_business ?? body.years,
        business_structure: body.business_structure || body.structure,
        obligee: body.obligee,
        required_date: body.required_date || body.requiredDate,
        financials: body.financials,
        prior_surety: body.prior_surety || body.priorSurety,
        notes: body.notes,
      });

      return sendJson(res, 201, {
        ok: true,
        lead: created,
      });
    }

    if (req.method === "GET") {
      if (!isRequestAuthenticated(req)) {
        return sendJson(res, 401, {
          ok: false,
          error: "Unauthorized. Please log in to view lead data.",
        });
      }

      const { leads, storage } = await listLeads();
      return sendJson(res, 200, {
        ok: true,
        storage,
        leads,
      });
    }

    if (req.method === "PATCH") {
      if (!isRequestAuthenticated(req)) {
        return sendJson(res, 401, {
          ok: false,
          error: "Unauthorized.",
        });
      }

      const body = await readJsonBody(req);
      const id = body.id;
      if (!id) {
        return sendJson(res, 400, { ok: false, error: "Missing lead id." });
      }

      const updated = await updateLead(id, {
        status: body.status,
        admin_notes: body.admin_notes,
      });

      if (!updated) {
        return sendJson(res, 404, { ok: false, error: "Lead not found." });
      }

      return sendJson(res, 200, {
        ok: true,
        lead: updated,
      });
    }

    if (req.method === "DELETE") {
      if (!isRequestAuthenticated(req)) {
        return sendJson(res, 401, {
          ok: false,
          error: "Unauthorized.",
        });
      }

      const urlObj = new URL(req.url, "http://localhost");
      let id = urlObj.searchParams.get("id");
      if (!id) {
        const body = await readJsonBody(req).catch(() => ({}));
        id = body.id;
      }

      if (!id) {
        return sendJson(res, 400, { ok: false, error: "Missing lead id." });
      }

      const deleted = await deleteLead(id);
      if (!deleted) {
        return sendJson(res, 404, { ok: false, error: "Lead not found." });
      }

      return sendJson(res, 200, { ok: true, id: Number(id) });
    }

    return sendJson(res, 405, { ok: false, error: "Method not allowed." });
  } catch (err) {
    console.error("[api/leads] Error:", err);
    return sendJson(res, 500, {
      ok: false,
      error: err.message || "Internal server error",
    });
  }
};

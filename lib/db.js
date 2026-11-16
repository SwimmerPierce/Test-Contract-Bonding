/**
 * File: lib/db.js
 * Description: Neon Serverless Postgres database client and schema auto-migration
 *              for contractbonding.ca lead capture and admin dashboard.
 *              Includes an automatic local JSON fallback when running locally without DATABASE_URL.
 */

"use strict";

const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");
const { loadLocalEnv } = require("./env");

loadLocalEnv();

function getDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.STORAGE_URL ||
    ""
  ).trim();
}

function getSql() {
  const url = getDatabaseUrl();
  if (!url) return null;
  return neon(url);
}

let schemaReadyPromise = null;

async function ensureSchema() {
  const sql = getSql();
  if (!sql) return false;

  if (!schemaReadyPromise) {
    schemaReadyPromise = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS surety_leads (
          id SERIAL PRIMARY KEY,
          reference_id VARCHAR(32) NOT NULL,
          lead_type VARCHAR(32) NOT NULL,
          status VARCHAR(32) NOT NULL DEFAULT 'New',
          contact_name VARCHAR(255) NOT NULL,
          company_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(100) NOT NULL,
          bond_type VARCHAR(100) NOT NULL,
          amount NUMERIC(15, 2),
          city VARCHAR(255),
          years_in_business INTEGER,
          business_structure VARCHAR(100),
          obligee VARCHAR(255),
          required_date VARCHAR(50),
          financials VARCHAR(100),
          prior_surety VARCHAR(255),
          notes TEXT,
          admin_notes TEXT,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`CREATE INDEX IF NOT EXISTS idx_surety_leads_created_at ON surety_leads (created_at DESC)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_surety_leads_status ON surety_leads (status)`;
      return true;
    })().catch((err) => {
      schemaReadyPromise = null;
      throw err;
    });
  }

  return schemaReadyPromise;
}

// Local JSON fallback store for offline/local testing when DATABASE_URL is not configured
const LOCAL_STORE_PATH = path.join(process.cwd(), ".local-leads.json");

function readLocalStore() {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, "utf8"));
    }
  } catch (_) {
    // Ignore read errors
  }
  return [];
}

function writeLocalStore(leads) {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(leads, null, 2), "utf8");
  } catch (_) {
    // Ignore write errors on read-only filesystems
  }
}

async function createLead(leadData) {
  const sql = getSql();
  const referenceId =
    leadData.reference_id || `NX-${Math.floor(100000 + Math.random() * 900000)}`;

  const record = {
    reference_id: referenceId,
    lead_type: String(leadData.lead_type || "contact").trim(),
    status: String(leadData.status || "New").trim(),
    contact_name: String(leadData.contact_name || "").trim(),
    company_name: String(leadData.company_name || "").trim(),
    email: String(leadData.email || "").trim(),
    phone: String(leadData.phone || "").trim(),
    bond_type: String(leadData.bond_type || "").trim(),
    amount:
      leadData.amount !== undefined && leadData.amount !== null && leadData.amount !== ""
        ? Number(leadData.amount)
        : null,
    city: leadData.city ? String(leadData.city).trim() : null,
    years_in_business:
      leadData.years_in_business !== undefined &&
      leadData.years_in_business !== null &&
      leadData.years_in_business !== ""
        ? parseInt(leadData.years_in_business, 10)
        : null,
    business_structure: leadData.business_structure
      ? String(leadData.business_structure).trim()
      : null,
    obligee: leadData.obligee ? String(leadData.obligee).trim() : null,
    required_date: leadData.required_date ? String(leadData.required_date).trim() : null,
    financials: leadData.financials ? String(leadData.financials).trim() : null,
    prior_surety: leadData.prior_surety ? String(leadData.prior_surety).trim() : null,
    notes: leadData.notes ? String(leadData.notes).trim() : null,
    admin_notes: leadData.admin_notes ? String(leadData.admin_notes).trim() : null,
  };

  if (sql) {
    await ensureSchema();
    const rows = await sql`
      INSERT INTO surety_leads (
        reference_id, lead_type, status, contact_name, company_name, email, phone,
        bond_type, amount, city, years_in_business, business_structure, obligee,
        required_date, financials, prior_surety, notes, admin_notes
      ) VALUES (
        ${record.reference_id},
        ${record.lead_type},
        ${record.status},
        ${record.contact_name},
        ${record.company_name},
        ${record.email},
        ${record.phone},
        ${record.bond_type},
        ${record.amount},
        ${record.city},
        ${record.years_in_business},
        ${record.business_structure},
        ${record.obligee},
        ${record.required_date},
        ${record.financials},
        ${record.prior_surety},
        ${record.notes},
        ${record.admin_notes}
      )
      RETURNING *
    `;
    return rows[0];
  }

  // Fallback for local testing when no Neon DB URL is provided
  const leads = readLocalStore();
  const nextId = leads.length > 0 ? Math.max(...leads.map((l) => l.id || 0)) + 1 : 1;
  const now = new Date().toISOString();
  const created = {
    id: nextId,
    ...record,
    created_at: now,
    updated_at: now,
  };
  leads.unshift(created);
  writeLocalStore(leads);
  return created;
}

async function listLeads() {
  const sql = getSql();
  if (sql) {
    await ensureSchema();
    const rows = await sql`
      SELECT * FROM surety_leads
      ORDER BY created_at DESC, id DESC
    `;
    return {
      leads: rows,
      storage: "neon-postgres",
    };
  }

  return {
    leads: readLocalStore(),
    storage: "local-fallback",
  };
}

async function updateLead(id, updates) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid lead ID");
  }

  const sql = getSql();
  if (sql) {
    await ensureSchema();
    const existingRows = await sql`SELECT * FROM surety_leads WHERE id = ${numericId}`;
    if (!existingRows.length) return null;
    const current = existingRows[0];
    const nextStatus =
      updates.status !== undefined ? String(updates.status).trim() : current.status;
    const nextAdminNotes =
      updates.admin_notes !== undefined
        ? String(updates.admin_notes).trim()
        : current.admin_notes;

    const updatedRows = await sql`
      UPDATE surety_leads
      SET status = ${nextStatus},
          admin_notes = ${nextAdminNotes},
          updated_at = NOW()
      WHERE id = ${numericId}
      RETURNING *
    `;
    return updatedRows[0] || null;
  }

  const leads = readLocalStore();
  const idx = leads.findIndex((l) => Number(l.id) === numericId);
  if (idx === -1) return null;
  if (updates.status !== undefined) {
    leads[idx].status = String(updates.status).trim();
  }
  if (updates.admin_notes !== undefined) {
    leads[idx].admin_notes = String(updates.admin_notes).trim();
  }
  leads[idx].updated_at = new Date().toISOString();
  writeLocalStore(leads);
  return leads[idx];
}

async function deleteLead(id) {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new Error("Invalid lead ID");
  }

  const sql = getSql();
  if (sql) {
    await ensureSchema();
    const rows = await sql`DELETE FROM surety_leads WHERE id = ${numericId} RETURNING id`;
    return rows.length > 0;
  }

  const leads = readLocalStore();
  const filtered = leads.filter((l) => Number(l.id) !== numericId);
  if (filtered.length === leads.length) return false;
  writeLocalStore(filtered);
  return true;
}

module.exports = {
  getDatabaseUrl,
  ensureSchema,
  createLead,
  listLeads,
  updateLead,
  deleteLead,
};

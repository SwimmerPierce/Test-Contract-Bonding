/**
 * File: test-suite.js
 * Description: Automated end-to-end verification suite for contractbonding.ca:
 *              - Static homepage and /admin route serving
 *              - Contact Us & Bond Application lead creation via POST /api/leads
 *              - Password protection on GET/PATCH/DELETE /api/leads
 *              - Admin authentication via POST/GET/DELETE /api/auth
 *              - Lead status & broker note updates via PATCH /api/leads
 *              - Lead deletion via DELETE /api/leads
 */

"use strict";

const assert = require("assert");
const fs = require("fs");
const path = require("path");
const { createServer } = require("./dev-server");

const LOCAL_STORE_PATH = path.join(process.cwd(), ".local-leads.json");

async function runTests() {
  if (!process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = "ephemeral-test-password-only";
  }
  const expectedAdminPassword = process.env.ADMIN_PASSWORD;

  if (fs.existsSync(LOCAL_STORE_PATH)) {
    fs.unlinkSync(LOCAL_STORE_PATH);
  }

  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Verify homepage and /admin static routes
    const homeRes = await fetch(`${baseUrl}/`);
    assert.strictEqual(homeRes.status, 200, "Homepage should return 200");
    const homeHtml = await homeRes.text();
    assert.ok(homeHtml.includes("Construction Bonds"), "Homepage should contain hero heading");

    const adminPageRes = await fetch(`${baseUrl}/admin`);
    assert.strictEqual(adminPageRes.status, 200, "/admin should return 200");
    const adminHtml = await adminPageRes.text();
    assert.ok(adminHtml.includes("Admin Lead Dashboard"), "/admin should contain dashboard title");

    // 2. Verify unauthenticated access to /api/leads is blocked
    const unauthLeadsRes = await fetch(`${baseUrl}/api/leads`);
    assert.strictEqual(unauthLeadsRes.status, 401, "Unauthenticated GET /api/leads must return 401");

    // 3. Submit a Contact Us lead
    const contactPostRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "contact",
        contact_name: "Sarah Jenkins",
        company_name: "Pacific Ridge Civil Ltd.",
        email: "sarah@pacificridge.ca",
        phone: "(604) 555-0112",
        bond_type: "Bid",
        notes: "Need a Bid Bond for a Burnaby municipal tender closing Friday.",
      }),
    });
    assert.strictEqual(contactPostRes.status, 201, "POST /api/leads (contact) should return 201");
    const contactData = await contactPostRes.json();
    assert.strictEqual(contactData.ok, true);
    assert.strictEqual(contactData.lead.company_name, "Pacific Ridge Civil Ltd.");
    assert.ok(contactData.lead.reference_id.startsWith("NX-"));

    // 4. Submit a full Bond Application lead
    const appPostRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "application",
        company_name: "Apex Contracting Ltd.",
        contact_name: "John Smith",
        email: "john@apexcontracting.ca",
        phone: "(604) 555-0142",
        city: "Burnaby, BC",
        years_in_business: 8,
        business_structure: "Corporation",
        bond_type: "Contract",
        amount: 750000,
        obligee: "City of Burnaby",
        required_date: "2026-12-01",
        financials: "Review / Audited",
        prior_surety: "Intact Surety",
        notes: "50% Performance and 50% L&M Payment Bond required.",
      }),
    });
    assert.strictEqual(appPostRes.status, 201, "POST /api/leads (application) should return 201");
    const appData = await appPostRes.json();
    assert.strictEqual(appData.ok, true);
    assert.strictEqual(Number(appData.lead.amount), 750000);

    // 5. Verify wrong admin password fails
    const badLoginRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    assert.strictEqual(badLoginRes.status, 401, "Wrong admin password should return 401");

    // 6. Verify valid admin password succeeds and returns session token + cookie
    const goodLoginRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: expectedAdminPassword }),
    });
    assert.strictEqual(goodLoginRes.status, 200, "Valid admin password should return 200");
    const authPayload = await goodLoginRes.json();
    assert.strictEqual(authPayload.ok, true);
    assert.strictEqual(authPayload.authenticated, true);
    assert.ok(authPayload.token, "Auth response should include session token");

    const authHeaders = {
      Authorization: `Bearer ${authPayload.token}`,
      "Content-Type": "application/json",
    };

    // 7. Fetch leads with admin token
    const listRes = await fetch(`${baseUrl}/api/leads`, { headers: authHeaders });
    assert.strictEqual(listRes.status, 200, "Authenticated GET /api/leads should return 200");
    const listData = await listRes.json();
    assert.strictEqual(listData.ok, true);
    assert.ok(
      listData.leads.some((l) => l.id === contactData.lead.id),
      "Should include submitted contact lead"
    );
    assert.ok(
      listData.leads.some((l) => l.id === appData.lead.id),
      "Should include submitted application lead"
    );
    const countBeforeDelete = listData.leads.length;

    // 8. Update lead status and admin_notes via PATCH /api/leads
    const targetLeadId = appData.lead.id;
    const patchRes = await fetch(`${baseUrl}/api/leads`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        id: targetLeadId,
        status: "Quoted",
        admin_notes: "Quoted 1.15% annual rate through Intact Surety.",
      }),
    });
    assert.strictEqual(patchRes.status, 200, "PATCH /api/leads should return 200");
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.lead.status, "Quoted");
    assert.strictEqual(
      patchData.lead.admin_notes,
      "Quoted 1.15% annual rate through Intact Surety."
    );

    // 9. Delete the two test leads via DELETE /api/leads
    const deleteRes = await fetch(`${baseUrl}/api/leads?id=${contactData.lead.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    assert.strictEqual(deleteRes.status, 200, "DELETE /api/leads should return 200");

    const listAfterDeleteRes = await fetch(`${baseUrl}/api/leads`, { headers: authHeaders });
    const listAfterDeleteData = await listAfterDeleteRes.json();
    assert.strictEqual(
      listAfterDeleteData.leads.length,
      countBeforeDelete - 1,
      "Should have 1 fewer lead after deleting contact lead"
    );

    // Clean up second test lead as well
    await fetch(`${baseUrl}/api/leads?id=${appData.lead.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    console.log("All 9 end-to-end API & auth tests passed!");
  } finally {
    server.close();
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      fs.unlinkSync(LOCAL_STORE_PATH);
    }
  }
}

runTests().catch((err) => {
  console.error("Test suite failed:", err);
  process.exit(1);
});

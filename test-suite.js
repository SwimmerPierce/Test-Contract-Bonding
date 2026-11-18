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
const { clearFailedAttempts } = require("./lib/auth");

const LOCAL_STORE_PATH = path.join(process.cwd(), ".local-leads.json");

async function runTests() {
  if (!process.env.ADMIN_PASSWORD) {
    process.env.ADMIN_PASSWORD = "ephemeral-test-password-only";
  }
  const expectedAdminPassword = process.env.ADMIN_PASSWORD;
  const bruteForceTestIp = "198.51.100.77";

  if (fs.existsSync(LOCAL_STORE_PATH)) {
    fs.unlinkSync(LOCAL_STORE_PATH);
  }
  await clearFailedAttempts(bruteForceTestIp).catch(() => {});

  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  try {
    // 1. Verify homepage, compliance content, JSON-LD, and /admin static routes
    const homeRes = await fetch(`${baseUrl}/`);
    assert.strictEqual(homeRes.status, 200, "Homepage should return 200");
    const homeHtml = await homeRes.text();
    assert.ok(homeHtml.includes("Construction Bonds"), "Homepage should contain hero heading");
    assert.ok(
      homeHtml.includes("Operated by <strong>Nexus Insurance Brokers Ltd.</strong>") ||
        homeHtml.includes("Operated by Nexus Insurance Brokers Ltd."),
      "Homepage should state operated by Nexus Insurance Brokers Ltd."
    );
    assert.ok(homeHtml.includes("4268 Lozells Avenue"), "Homepage should display Nexus Burnaby street address");
    assert.ok(homeHtml.includes("604-420-2501"), "Homepage should display Nexus phone number");
    assert.ok(homeHtml.includes('"@type": "InsuranceAgency"'), "Homepage should include InsuranceAgency JSON-LD schema");
    assert.ok(
      !homeHtml.includes("Commercial Electrical Contractor, Burnaby, BC") &&
        !homeHtml.includes("Civil &amp; Excavation Principal"),
      "Homepage must not contain placeholder testimonials"
    );
    assert.ok(homeHtml.includes('id="checklist-modal"'), "Homepage should include #checklist-modal");
    assert.ok(homeHtml.includes('name="province"'), "Homepage forms should include province selector");
    assert.ok(homeHtml.includes('name="privacyConsent"'), "Homepage forms should include privacyConsent checkbox");
    assert.ok(homeHtml.includes('name="marketingOptIn"'), "Homepage forms should include CASL marketingOptIn checkbox");

    const adminPageRes = await fetch(`${baseUrl}/admin`);
    assert.strictEqual(adminPageRes.status, 200, "/admin should return 200");
    const adminHtml = await adminPageRes.text();
    assert.ok(adminHtml.includes("Admin Lead Dashboard"), "/admin should contain dashboard title");
    assert.ok(adminHtml.includes("detail-assigned-broker"), "/admin should include assigned broker selector");
    assert.ok(adminHtml.includes("detail-supervising-agent"), "/admin should include supervising agent input");

    // 1a. Verify SEO & Lead Magnet PDF static files
    const robotsRes = await fetch(`${baseUrl}/robots.txt`);
    assert.strictEqual(robotsRes.status, 200, "/robots.txt should return 200");
    const robotsTxt = await robotsRes.text();
    assert.ok(robotsTxt.includes("Disallow: /admin"), "robots.txt should disallow /admin");

    const sitemapRes = await fetch(`${baseUrl}/sitemap.xml`);
    assert.strictEqual(sitemapRes.status, 200, "/sitemap.xml should return 200");
    const sitemapXml = await sitemapRes.text();
    assert.ok(sitemapXml.includes("https://contractbonding.ca/"), "sitemap.xml should include canonical root URL");

    const pdfRes = await fetch(`${baseUrl}/assets/first-time-bonding-readiness-checklist.pdf`);
    assert.strictEqual(pdfRes.status, 200, "Checklist PDF should return 200");
    assert.ok(
      (pdfRes.headers.get("content-type") || "").includes("application/pdf"),
      "Checklist PDF should serve application/pdf content-type"
    );

    // 1b. Verify private notes and internal markdown files return 404
    const notesRes = await fetch(`${baseUrl}/notes/README.md`);
    assert.strictEqual(notesRes.status, 404, "/notes/README.md should return 404");
    const notesDirRes = await fetch(`${baseUrl}/notes`);
    assert.strictEqual(notesDirRes.status, 404, "/notes should return 404");

    // 2. Verify unauthenticated access to /api/leads is blocked
    const unauthLeadsRes = await fetch(`${baseUrl}/api/leads`);
    assert.strictEqual(unauthLeadsRes.status, 401, "Unauthenticated GET /api/leads must return 401");

    // 2b. Verify honeypot spam rejection & privacy consent enforcement
    const spamRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "contact",
        contact_name: "Bot Spammer",
        company_name: "Spam LLC",
        email: "bot@spam.example",
        phone: "555-0199",
        bond_type: "Bid",
        province: "BC",
        privacy_consent: true,
        website_url: "https://spam.example",
      }),
    });
    assert.strictEqual(spamRes.status, 400, "Populated honeypot should return 400");

    const noConsentRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "contact",
        contact_name: "No Consent",
        company_name: "Test Co",
        email: "noconsent@test.ca",
        phone: "604-555-0100",
        bond_type: "Contract",
        province: "BC",
        privacy_consent: false,
      }),
    });
    assert.strictEqual(noConsentRes.status, 400, "Explicit privacy_consent=false should return 400");

    // 3. Submit a Contact Us lead (Alberta interim routing + cross-sell + CASL implied expiry)
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
        province: "AB",
        cross_sell_insurance: true,
        privacy_consent: true,
        referral_consent: true,
        marketing_opt_in: false,
        consent_timestamp: new Date().toISOString(),
        notes: "Need a Bid Bond for a Calgary municipal tender closing Friday.",
      }),
    });
    assert.strictEqual(contactPostRes.status, 201, "POST /api/leads (contact) should return 201");
    const contactData = await contactPostRes.json();
    assert.strictEqual(contactData.ok, true);
    assert.strictEqual(contactData.lead.company_name, "Pacific Ridge Civil Ltd.");
    assert.strictEqual(contactData.lead.province, "AB");
    assert.strictEqual(contactData.lead.cross_sell_insurance, true);
    assert.strictEqual(contactData.lead.marketing_opt_in, false);
    assert.ok(contactData.lead.casl_implied_expires_at, "Should compute CASL implied 6-mo expiry");
    assert.strictEqual(
      contactData.lead.assigned_broker,
      "AIC-Licensed Nexus Broker (Interim AB Routing)",
      "Alberta leads should auto-route to AIC-licensed Nexus broker"
    );
    assert.ok(contactData.lead.reference_id.startsWith("NX-"));

    // 4. Submit a full Bond Application lead (Out-of-Province referral routing + express CASL)
    const appPostRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "application",
        company_name: "Apex Contracting Ltd.",
        contact_name: "John Smith",
        email: "john@apexcontracting.ca",
        phone: "(604) 555-0142",
        city: "Toronto",
        province: "ON",
        years_in_business: 8,
        business_structure: "Corporation",
        bond_type: "Contract",
        amount: 750000,
        obligee: "City of Toronto",
        required_date: "2026-12-01",
        financials: "Review / Audited",
        prior_surety: "Intact Surety",
        cross_sell_insurance: false,
        privacy_consent: true,
        referral_consent: true,
        marketing_opt_in: true,
        notes: "50% Performance and 50% L&M Payment Bond required.",
      }),
    });
    assert.strictEqual(appPostRes.status, 201, "POST /api/leads (application) should return 201");
    const appData = await appPostRes.json();
    assert.strictEqual(appData.ok, true);
    assert.strictEqual(Number(appData.lead.amount), 750000);
    assert.strictEqual(appData.lead.province, "ON");
    assert.strictEqual(appData.lead.marketing_opt_in, true);
    assert.strictEqual(
      appData.lead.assigned_broker,
      "Out-of-Province Referral Partner",
      "Out-of-province leads should route to Out-of-Province Referral Partner"
    );

    // 4b. Submit a Checklist download lead
    const checklistPostRes = await fetch(`${baseUrl}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lead_type: "checklist",
        contact_name: "Alex Trades",
        company_name: "Maple Electric Inc.",
        email: "alex@mapleelectric.ca",
        bond_type: "Checklist",
        province: "BC",
        privacy_consent: true,
        marketing_opt_in: true,
      }),
    });
    assert.strictEqual(checklistPostRes.status, 201, "POST /api/leads (checklist) should return 201");
    const checklistData = await checklistPostRes.json();
    assert.strictEqual(checklistData.lead.lead_type, "checklist");
    assert.strictEqual(checklistData.lead.assigned_broker, "Chase Addison (Level 1 — BC)");

    // 5. Verify wrong admin password fails
    const badLoginRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong-password" }),
    });
    assert.strictEqual(badLoginRes.status, 401, "Wrong admin password should return 401");

    // 5b. Verify each of the 3 authorized broker logins (chase, ken, nathan)
    const brokerLogins = [
      { email: "chase@nexusinsurancebrokers.com", envKey: "ADMIN_PASSWORD_CHASE" },
      { email: "ken@nexusinsurancebrokers.com", envKey: "ADMIN_PASSWORD_KEN" },
      { email: "nathan@nexusinsurancebrokers.com", envKey: "ADMIN_PASSWORD_NATHAN" },
    ];
    for (const broker of brokerLogins) {
      const pwd = process.env[broker.envKey];
      if (pwd) {
        assert.strictEqual(pwd.length, 20, `${broker.envKey} should be 20 characters`);
        const brokerLoginRes = await fetch(`${baseUrl}/api/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: broker.email, password: pwd }),
        });
        assert.strictEqual(brokerLoginRes.status, 200, `Login for ${broker.email} should return 200`);
        const brokerPayload = await brokerLoginRes.json();
        assert.strictEqual(brokerPayload.ok, true);
        assert.strictEqual(brokerPayload.user.email, broker.email);

        // Verify session verification GET /api/auth returns user email
        const brokerCheckRes = await fetch(`${baseUrl}/api/auth`, {
          headers: { Authorization: `Bearer ${brokerPayload.token}` },
        });
        const brokerCheckData = await brokerCheckRes.json();
        assert.strictEqual(brokerCheckData.authenticated, true);
        assert.strictEqual(brokerCheckData.user.email, broker.email);
      }
    }

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
    assert.ok(
      listData.leads.some((l) => l.id === checklistData.lead.id),
      "Should include submitted checklist lead"
    );
    const countBeforeDelete = listData.leads.length;

    // 8. Update lead status, admin_notes, assigned_broker, and supervising_agent via PATCH /api/leads
    const targetLeadId = appData.lead.id;
    const patchRes = await fetch(`${baseUrl}/api/leads`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({
        id: targetLeadId,
        status: "Quoted",
        admin_notes: "Quoted 1.15% annual rate through Intact Surety.",
        assigned_broker: "Ken Addison (Level 3 Nominee — Signatory)",
        supervising_agent: "Ken Addison (Level 3) — Reviewed",
      }),
    });
    assert.strictEqual(patchRes.status, 200, "PATCH /api/leads should return 200");
    const patchData = await patchRes.json();
    assert.strictEqual(patchData.lead.status, "Quoted");
    assert.strictEqual(
      patchData.lead.admin_notes,
      "Quoted 1.15% annual rate through Intact Surety."
    );
    assert.strictEqual(patchData.lead.assigned_broker, "Ken Addison (Level 3 Nominee — Signatory)");
    assert.strictEqual(patchData.lead.supervising_agent, "Ken Addison (Level 3) — Reviewed");

    // 9. Delete test leads via DELETE /api/leads
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

    await fetch(`${baseUrl}/api/leads?id=${appData.lead.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });
    await fetch(`${baseUrl}/api/leads?id=${checklistData.lead.id}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    // 10. Verify brute-force lockout after 5 failed attempts returns HTTP 429
    for (let i = 0; i < 5; i++) {
      const attemptRes = await fetch(`${baseUrl}/api/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Forwarded-For": bruteForceTestIp,
        },
        body: JSON.stringify({ password: `wrong-${i}` }),
      });
      assert.strictEqual(attemptRes.status, 401, `Failed login attempt ${i + 1} should return 401`);
    }
    const lockedRes = await fetch(`${baseUrl}/api/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Forwarded-For": bruteForceTestIp,
      },
      body: JSON.stringify({ password: expectedAdminPassword }),
    });
    assert.strictEqual(lockedRes.status, 429, "6th attempt after 5 failures should return 429");
    assert.ok(lockedRes.headers.get("retry-after"), "429 response should include Retry-After header");

    console.log("All end-to-end compliance, API, security, and auth tests passed!");
  } finally {
    await clearFailedAttempts(bruteForceTestIp).catch(() => {});
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

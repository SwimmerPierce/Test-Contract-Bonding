/**
 * File: admin/admin.js
 * Description: Client-side controller for the password-protected /admin lead dashboard.
 *              Handles authentication, lead fetching, search/filtering, status updates,
 *              broker notes, manual lead creation, and CSV export.
 */

(function () {
  "use strict";

  const SESSION_TOKEN_KEY = "cb_admin_token";

  const loginView = document.getElementById("login-view");
  const dashboardView = document.getElementById("dashboard-view");
  const loginForm = document.getElementById("admin-login-form");
  const emailInput = document.getElementById("admin-email");
  const passwordInput = document.getElementById("admin-password");
  const loginError = document.getElementById("login-error");
  const loginSubmitBtn = document.getElementById("login-submit-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const adminUserBadge = document.getElementById("admin-user-badge");
  const dbStorageBadge = document.getElementById("db-storage-badge");
  const dashboardAlert = document.getElementById("dashboard-alert");

  const kpiTotal = document.getElementById("kpi-total");
  const kpiNewCount = document.getElementById("kpi-new-count");
  const kpiApplications = document.getElementById("kpi-applications");
  const kpiContacts = document.getElementById("kpi-contacts");
  const kpiVolume = document.getElementById("kpi-volume");

  const filterSearch = document.getElementById("filter-search");
  const filterType = document.getElementById("filter-type");
  const filterBond = document.getElementById("filter-bond");
  const filterStatus = document.getElementById("filter-status");
  const refreshLeadsBtn = document.getElementById("refresh-leads-btn");
  const createLeadBtn = document.getElementById("create-lead-btn");
  const exportCsvBtn = document.getElementById("export-csv-btn");
  const leadsTbody = document.getElementById("leads-tbody");

  const detailModal = document.getElementById("lead-detail-modal");
  const detailEyebrow = document.getElementById("detail-eyebrow");
  const detailTitle = document.getElementById("lead-detail-title");
  const detailSubtitle = document.getElementById("detail-subtitle");
  const detailGrid = document.getElementById("detail-grid");
  const detailUpdateForm = document.getElementById("detail-update-form");
  const detailLeadId = document.getElementById("detail-lead-id");
  const detailStatus = document.getElementById("detail-status");
  const detailReferenceReadonly = document.getElementById("detail-reference-readonly");
  const detailAssignedBroker = document.getElementById("detail-assigned-broker");
  const detailSupervisingAgent = document.getElementById("detail-supervising-agent");
  const detailAdminNotes = document.getElementById("detail-admin-notes");
  const detailDeleteBtn = document.getElementById("detail-delete-btn");

  const addLeadModal = document.getElementById("add-lead-modal");
  const addLeadForm = document.getElementById("add-lead-form");
  const manualLeadError = document.getElementById("manual-lead-error");

  let allLeads = [];

  function getAuthHeaders(extra = {}) {
    const headers = { ...extra };
    try {
      const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    } catch (_) {
      // Ignore storage access issues
    }
    return headers;
  }

  function formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === "" || Number(amount) <= 0) {
      return "—";
    }
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(Number(amount));
  }

  function formatDate(isoStr) {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    if (Number.isNaN(d.getTime())) return isoStr;
    return d.toLocaleString("en-CA", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function showBanner(msg) {
    if (!dashboardAlert) return;
    dashboardAlert.textContent = msg;
    dashboardAlert.hidden = false;
    setTimeout(() => {
      dashboardAlert.hidden = true;
    }, 4000);
  }

  function setAuthenticatedUI(isAuthenticated, user) {
    if (isAuthenticated) {
      loginView.hidden = true;
      dashboardView.hidden = false;
      logoutBtn.hidden = false;
      if (adminUserBadge && user && user.email) {
        adminUserBadge.textContent = user.email;
        adminUserBadge.hidden = false;
      }
    } else {
      loginView.hidden = false;
      dashboardView.hidden = true;
      logoutBtn.hidden = true;
      dbStorageBadge.hidden = true;
      if (adminUserBadge) {
        adminUserBadge.textContent = "";
        adminUserBadge.hidden = true;
      }
      setTimeout(() => (emailInput || passwordInput) && (emailInput || passwordInput).focus(), 50);
    }
  }

  async function checkSession() {
    try {
      const res = await fetch("/api/auth", {
        headers: getAuthHeaders(),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (data && data.authenticated) {
        setAuthenticatedUI(true, data.user);
        await fetchLeads();
      } else {
        setAuthenticatedUI(false);
      }
    } catch (_) {
      setAuthenticatedUI(false);
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = emailInput ? String(emailInput.value || "").trim() : "";
      const password = String(passwordInput.value || "").trim();

      if (!email) {
        loginError.textContent = "Please enter your administrator email address.";
        loginError.hidden = false;
        if (emailInput) emailInput.focus();
        return;
      }

      if (!password) {
        loginError.textContent = "Please enter your 20-character administrator password.";
        loginError.hidden = false;
        if (passwordInput) passwordInput.focus();
        return;
      }

      loginSubmitBtn.disabled = true;
      loginSubmitBtn.textContent = "Verifying...";
      loginError.hidden = true;

      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Invalid administrator credentials.");
        }

        if (data.token) {
          try {
            sessionStorage.setItem(SESSION_TOKEN_KEY, data.token);
          } catch (_) {}
        }

        passwordInput.value = "";
        setAuthenticatedUI(true, data.user);
        await fetchLeads();
      } catch (err) {
        loginError.textContent = err.message || "Authentication failed.";
        loginError.hidden = false;
      } finally {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.textContent = "Unlock Dashboard";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        sessionStorage.removeItem(SESSION_TOKEN_KEY);
      } catch (_) {}
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "same-origin",
      }).catch(() => {});
      allLeads = [];
      setAuthenticatedUI(false);
    });
  }

  async function fetchLeads() {
    try {
      const res = await fetch("/api/leads", {
        headers: getAuthHeaders(),
        credentials: "same-origin",
      });
      if (res.status === 401) {
        setAuthenticatedUI(false);
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to load leads.");
      }

      allLeads = Array.isArray(data.leads) ? data.leads : [];
      if (dbStorageBadge) {
        dbStorageBadge.hidden = false;
        dbStorageBadge.textContent =
          data.storage === "neon-postgres" ? "Neon Postgres Active" : "Local Dev Store";
      }

      updateKpis();
      renderTable();
    } catch (err) {
      leadsTbody.innerHTML = `<tr><td colspan="8" class="table-empty">Error loading leads: ${escapeHtml(
        err.message
      )}</td></tr>`;
    }
  }

  function updateKpis() {
    const total = allLeads.length;
    const newLeads = allLeads.filter((l) => (l.status || "New") === "New").length;
    const applications = allLeads.filter((l) => l.lead_type === "application").length;
    const contacts = allLeads.filter((l) => l.lead_type !== "application").length;
    const totalVolume = allLeads.reduce((sum, l) => {
      const val = Number(l.amount || 0);
      return sum + (Number.isFinite(val) && val > 0 ? val : 0);
    }, 0);

    kpiTotal.textContent = String(total);
    kpiNewCount.textContent = `${newLeads} new`;
    kpiApplications.textContent = String(applications);
    kpiContacts.textContent = String(contacts);
    kpiVolume.textContent = formatCurrency(totalVolume) === "—" ? "$0" : formatCurrency(totalVolume);
  }

  function getFilteredLeads() {
    const q = String(filterSearch.value || "").trim().toLowerCase();
    const typeVal = filterType.value;
    const bondVal = filterBond.value;
    const statusVal = filterStatus.value;

    return allLeads.filter((lead) => {
      if (typeVal !== "all" && lead.lead_type !== typeVal) return false;
      if (bondVal !== "all" && lead.bond_type !== bondVal) return false;
      if (statusVal !== "all" && (lead.status || "New") !== statusVal) return false;

      if (q) {
        const haystack = [
          lead.reference_id,
          lead.company_name,
          lead.contact_name,
          lead.email,
          lead.phone,
          lead.city,
          lead.province,
          lead.obligee,
          lead.assigned_broker,
          lead.supervising_agent,
          lead.notes,
          lead.admin_notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderTable() {
    const rows = getFilteredLeads();
    if (!rows.length) {
      leadsTbody.innerHTML =
        '<tr><td colspan="8" class="table-empty">No leads match your current filters.</td></tr>';
      return;
    }

    const statuses = ["New", "In Review", "Contacted", "Quoted", "Bound", "Archived"];

    leadsTbody.innerHTML = rows
      .map((lead) => {
        const isApp = lead.lead_type === "application";
        const isChecklist = lead.lead_type === "checklist";
        const typeBadge = isApp
          ? '<span class="badge badge--application">Application</span>'
          : isChecklist
            ? '<span class="badge badge--checklist">Checklist</span>'
            : '<span class="badge badge--contact">Inquiry</span>';

        const statusOptions = statuses
          .map(
            (st) =>
              `<option value="${escapeHtml(st)}" ${
                (lead.status || "New") === st ? "selected" : ""
              }>${escapeHtml(st)}</option>`
          )
          .join("");

        const prov = String(lead.province || "").trim();
        let provinceBadge = "";
        if (prov) {
          if (prov === "BC") {
            provinceBadge = '<span class="badge badge--province">BC</span>';
          } else if (prov === "AB") {
            provinceBadge = '<span class="badge badge--alberta">AB &bull; AIC Route</span>';
          } else {
            provinceBadge = `<span class="badge badge--referral">REFERRAL: ${escapeHtml(prov)}</span>`;
          }
        }

        const crossSellBadge = lead.cross_sell_insurance
          ? '<span class="badge badge--cross-sell">+CGL Cross-Sell</span>'
          : "";

        let caslBadge = "";
        if (lead.marketing_opt_in) {
          caslBadge = '<span class="badge badge--casl-express">Express Opt-In</span>';
        } else if (lead.casl_implied_expires_at) {
          const expDateStr = String(lead.casl_implied_expires_at).slice(0, 10);
          const isExpired = Date.parse(lead.casl_implied_expires_at) < Date.now();
          caslBadge = isExpired
            ? `<span class="badge badge--casl-expired">CASL Expired: ${escapeHtml(expDateStr)}</span>`
            : `<span class="badge badge--casl-implied">Implied: Expires ${escapeHtml(expDateStr)}</span>`;
        }

        const locationOrNotes = [
          lead.city ? `Location: ${lead.city}` : null,
          lead.obligee ? `Obligee: ${lead.obligee}` : null,
          lead.assigned_broker ? `Broker: ${lead.assigned_broker}` : null,
          lead.notes ? lead.notes : null,
        ]
          .filter(Boolean)
          .join(" • ");

        const badgesHtml = [provinceBadge, crossSellBadge, caslBadge].filter(Boolean).join("");

        return `
          <tr data-lead-id="${lead.id}">
            <td>
              <span class="cell-primary">${escapeHtml(formatDate(lead.created_at))}</span>
            </td>
            <td>
              <span class="ref-code">${escapeHtml(lead.reference_id || `#${lead.id}`)}</span>
            </td>
            <td>${typeBadge}</td>
            <td>
              <span class="cell-primary">${escapeHtml(lead.company_name)}</span>
              <span class="cell-sub">${escapeHtml(lead.contact_name)} &bull; <a href="mailto:${escapeHtml(
          lead.email
        )}">${escapeHtml(lead.email)}</a> &bull; ${escapeHtml(lead.phone)}</span>
            </td>
            <td>
              <span class="cell-primary">${escapeHtml(lead.bond_type)}</span>
              <span class="cell-sub">${escapeHtml(formatCurrency(lead.amount))}</span>
            </td>
            <td>
              <span class="cell-sub">${escapeHtml(locationOrNotes || "—")}</span>
              ${badgesHtml ? `<div class="cell-badges">${badgesHtml}</div>` : ""}
            </td>
            <td>
              <select class="status-select" data-status-lead-id="${lead.id}" aria-label="Lead status">
                ${statusOptions}
              </select>
            </td>
            <td class="text-right">
              <div class="row-actions">
                <button type="button" class="btn btn--outline btn--sm" data-view-lead-id="${
                  lead.id
                }">Details</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join("");
  }

  // Delegate table events
  if (leadsTbody) {
    leadsTbody.addEventListener("change", async (event) => {
      const select = event.target.closest("[data-status-lead-id]");
      if (!select) return;
      const id = Number(select.getAttribute("data-status-lead-id"));
      const newStatus = select.value;

      try {
        const res = await fetch("/api/leads", {
          method: "PATCH",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({ id, status: newStatus }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to update status.");
        }
        const idx = allLeads.findIndex((l) => Number(l.id) === id);
        if (idx !== -1) allLeads[idx] = data.lead;
        updateKpis();
        showBanner(`Updated lead ${data.lead.reference_id} status to "${newStatus}".`);
      } catch (err) {
        showBanner(`Error updating status: ${err.message}`);
        await fetchLeads();
      }
    });

    leadsTbody.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-view-lead-id]");
      if (!btn) return;
      const id = Number(btn.getAttribute("data-view-lead-id"));
      const lead = allLeads.find((l) => Number(l.id) === id);
      if (lead) openLeadDetailModal(lead);
    });
  }

  function openLeadDetailModal(lead) {
    detailLeadId.value = String(lead.id);
    detailStatus.value = lead.status || "New";
    detailReferenceReadonly.value = lead.reference_id || `#${lead.id}`;
    if (detailAssignedBroker) {
      const val = lead.assigned_broker || "";
      const hasOption = Array.from(detailAssignedBroker.options).some((opt) => opt.value === val);
      if (val && !hasOption) {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = val;
        detailAssignedBroker.appendChild(opt);
      }
      detailAssignedBroker.value = val;
    }
    if (detailSupervisingAgent) {
      detailSupervisingAgent.value = lead.supervising_agent || "";
    }
    detailAdminNotes.value = lead.admin_notes || "";

    detailEyebrow.textContent =
      lead.lead_type === "application"
        ? "Surety Bond Application"
        : lead.lead_type === "checklist"
          ? "Readiness Checklist Download"
          : "Contact Us Inquiry";
    detailTitle.textContent = lead.company_name || "Lead Record";
    detailSubtitle.textContent = `Submitted ${formatDate(lead.created_at)} • Reference ${
      lead.reference_id || `#${lead.id}`
    }`;

    const caslDisplay = lead.marketing_opt_in
      ? "Express Opt-In"
      : lead.casl_implied_expires_at
        ? `Implied (Expires ${String(lead.casl_implied_expires_at).slice(0, 10)})`
        : "—";

    const fields = [
      ["Contact Name", lead.contact_name],
      ["Company Name", lead.company_name],
      ["Email Address", lead.email],
      ["Phone Number", lead.phone],
      ["Bond Type", lead.bond_type],
      ["Estimated Bond Amount", formatCurrency(lead.amount)],
      ["City / Municipality", lead.city || "—"],
      ["Province / Territory", lead.province || "—"],
      [
        "Years in Business",
        lead.years_in_business !== null && lead.years_in_business !== undefined
          ? String(lead.years_in_business)
          : "—",
      ],
      ["Business Structure", lead.business_structure || "—"],
      ["Obligee / Project Owner", lead.obligee || "—"],
      ["Required By Date", lead.required_date || "—"],
      ["Financial Statements", lead.financials || "—"],
      ["Prior Surety", lead.prior_surety || "—"],
      ["Commercial Insurance Cross-Sell", lead.cross_sell_insurance ? "YES — Requested CGL/Bundle" : "No"],
      ["Privacy & Referral Consent", lead.privacy_consent ? "Confirmed" : "Not recorded"],
      ["CASL Marketing Status", caslDisplay],
      ["Assigned Broker", lead.assigned_broker || "Unassigned"],
      ["Supervising Level 2/3 Agent", lead.supervising_agent || "Pending sign-off"],
      ["Last Updated", formatDate(lead.updated_at)],
      ["Client Notes / Scope", lead.notes || "—", true],
    ];

    detailGrid.innerHTML = fields
      .map(
        ([label, val, full]) => `
        <div class="detail-item ${full ? "detail-item--full" : ""}">
          <span class="detail-item__label">${escapeHtml(label)}</span>
          <span class="detail-item__val">${escapeHtml(val)}</span>
        </div>
      `
      )
      .join("");

    detailModal.hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeAdminModals() {
    detailModal.hidden = true;
    addLeadModal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-close-admin-modal]").forEach((el) => {
    el.addEventListener("click", closeAdminModals);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAdminModals();
    }
  });

  if (detailUpdateForm) {
    detailUpdateForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const id = Number(detailLeadId.value);
      const status = detailStatus.value;
      const admin_notes = detailAdminNotes.value;
      const assigned_broker = detailAssignedBroker ? detailAssignedBroker.value : undefined;
      const supervising_agent = detailSupervisingAgent ? detailSupervisingAgent.value : undefined;

      try {
        const res = await fetch("/api/leads", {
          method: "PATCH",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify({
            id,
            status,
            admin_notes,
            assigned_broker,
            supervising_agent,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to save lead changes.");
        }

        const idx = allLeads.findIndex((l) => Number(l.id) === id);
        if (idx !== -1) allLeads[idx] = data.lead;
        updateKpis();
        renderTable();
        closeAdminModals();
        showBanner(`Saved changes for ${data.lead.reference_id}.`);
      } catch (err) {
        alert(err.message || "Error saving changes.");
      }
    });
  }

  if (detailDeleteBtn) {
    detailDeleteBtn.addEventListener("click", async () => {
      const id = Number(detailLeadId.value);
      if (!id) return;

      try {
        const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "same-origin",
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to delete lead.");
        }

        allLeads = allLeads.filter((l) => Number(l.id) !== id);
        updateKpis();
        renderTable();
        closeAdminModals();
        showBanner("Lead deleted.");
      } catch (err) {
        alert(err.message || "Failed to delete lead.");
      }
    });
  }

  // Manual Add Lead Modal
  if (createLeadBtn) {
    createLeadBtn.addEventListener("click", () => {
      manualLeadError.hidden = true;
      addLeadForm.reset();
      addLeadModal.hidden = false;
      document.body.style.overflow = "hidden";
    });
  }

  if (addLeadForm) {
    addLeadForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(addLeadForm);
      const payload = {
        lead_type: String(formData.get("lead_type") || "contact").trim(),
        bond_type: String(formData.get("bond_type") || "").trim(),
        company_name: String(formData.get("company_name") || "").trim(),
        contact_name: String(formData.get("contact_name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        city: String(formData.get("city") || "").trim() || "Burnaby",
        province: String(formData.get("province") || "BC").trim(),
        years_in_business: 5,
        amount: Number(formData.get("amount") || 100000),
        notes: String(formData.get("notes") || "").trim(),
        privacy_consent: true,
        consent_timestamp: new Date().toISOString(),
      };

      try {
        const res = await fetch("/api/leads", {
          method: "POST",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          credentials: "same-origin",
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error || "Failed to create lead.");
        }

        allLeads.unshift(data.lead);
        updateKpis();
        renderTable();
        closeAdminModals();
        showBanner(`Added lead ${data.lead.reference_id}.`);
      } catch (err) {
        manualLeadError.textContent = err.message || "Unable to create lead.";
        manualLeadError.hidden = false;
      }
    });
  }

  // Search and Filter listeners
  [filterSearch, filterType, filterBond, filterStatus].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", renderTable);
    el.addEventListener("change", renderTable);
  });

  if (refreshLeadsBtn) {
    refreshLeadsBtn.addEventListener("click", () => {
      fetchLeads();
      showBanner("Refreshed leads from database.");
    });
  }

  // Export CSV
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener("click", () => {
      const rows = getFilteredLeads();
      if (!rows.length) {
        showBanner("No leads available to export.");
        return;
      }

      const headers = [
        "ID",
        "Reference ID",
        "Type",
        "Status",
        "Company Name",
        "Contact Name",
        "Email",
        "Phone",
        "Bond Type",
        "Amount CAD",
        "City",
        "Province",
        "Years in Business",
        "Business Structure",
        "Obligee",
        "Required Date",
        "Financials",
        "Prior Surety",
        "Cross-Sell Insurance",
        "Privacy Consent",
        "Referral Consent",
        "Marketing Opt-In",
        "Consent Timestamp",
        "CASL Implied Expires At",
        "Assigned Broker",
        "Supervising Agent",
        "Client Notes",
        "Admin Notes",
        "Created At",
      ];

      const csvEscape = (val) => {
        const s = String(val ?? "");
        if (s.includes(",") || s.includes('"') || s.includes("\n")) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };

      const lines = [
        headers.join(","),
        ...rows.map((l) =>
          [
            l.id,
            l.reference_id,
            l.lead_type,
            l.status,
            l.company_name,
            l.contact_name,
            l.email,
            l.phone,
            l.bond_type,
            l.amount ?? "",
            l.city ?? "",
            l.province ?? "",
            l.years_in_business ?? "",
            l.business_structure ?? "",
            l.obligee ?? "",
            l.required_date ?? "",
            l.financials ?? "",
            l.prior_surety ?? "",
            l.cross_sell_insurance ? "true" : "false",
            l.privacy_consent ? "true" : "false",
            l.referral_consent ? "true" : "false",
            l.marketing_opt_in ? "true" : "false",
            l.consent_timestamp ?? "",
            l.casl_implied_expires_at ?? "",
            l.assigned_broker ?? "",
            l.supervising_agent ?? "",
            l.notes ?? "",
            l.admin_notes ?? "",
            l.created_at ?? "",
          ]
            .map(csvEscape)
            .join(",")
        ),
      ];

      const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contractbonding-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  checkSession();
})();

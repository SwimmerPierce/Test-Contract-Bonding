/**
 * File: app.js
 * Description: Client-side interactivity for Nexus Insurance Brokers Ltd. (Burnaby, BC),
 *              powering responsive navigation, the Surety Bond Rate Calculator, and the
 *              Contact Us & Apply Now modal forms with Neon Postgres persistence via /api/leads.
 * Dependencies: index.html DOM elements, styles.css modal/nav classes, /api/leads endpoint.
 * Role: Frontend behavioral controller.
 */

(function () {
  "use strict";

  const navToggle = document.getElementById("nav-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (navToggle && primaryNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    primaryNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Modal management
  let pendingCalcAmount = null;

  function openModal(modalId, preselectedBondType) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (modalId === "contact-modal") {
      pendingCalcAmount = null;
      const contactNotes = document.getElementById("contact-notes");
      if (contactNotes) contactNotes.value = "";
    }

    // Reset form/success state each time modal is opened
    const form = modal.querySelector("form");
    const success = modal.querySelector(".form-success");
    const errorBox = modal.querySelector(".form-error");
    if (form && success) {
      form.hidden = false;
      success.hidden = true;
      clearFormValidation(form);
    }
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = "";
    }

    if (preselectedBondType) {
      const bondSelect = modal.querySelector('select[name="bondType"]');
      if (bondSelect) {
        bondSelect.value = preselectedBondType;
      }
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";

    const firstInput = modal.querySelector(
      "input:not([tabindex='-1']):not([type='hidden']), select, textarea"
    );
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 40);
    }
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  document.querySelectorAll("[data-open-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const modalId = trigger.getAttribute("data-open-modal");
      const bondType = trigger.getAttribute("data-bond-type");
      openModal(modalId, bondType);
    });
  });

  document.querySelectorAll("[data-close-modal]").forEach((closer) => {
    closer.addEventListener("click", () => {
      const modal = closer.closest(".modal");
      closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal:not([hidden])").forEach(closeModal);
    }
  });

  // Surety Bond Rate Calculator
  const calcForm = document.getElementById("rate-calculator-form");
  const calcValueInput = document.getElementById("calc-contract-value");
  const calcTypeSelect = document.getElementById("calc-bond-type");
  const calcRateRange = document.getElementById("calc-rate-range");
  const calcCostRange = document.getElementById("calc-cost-range");
  const calcQuoteCta = document.getElementById("calc-quote-cta");

  const CALC_TO_FORM_BOND_TYPE = {
    contract: "Contract",
    bid: "Bid",
    administrative: "Administrative",
    other: "Other",
  };

  const RATE_TABLE = {
    contract: { minRate: 0.01, maxRate: 0.015, minCost: 500 },
    bid: { minRate: 0.004, maxRate: 0.0075, minCost: 250 },
    administrative: { minRate: 0.01, maxRate: 0.0175, minCost: 250 },
    other: { minRate: 0.0125, maxRate: 0.02, minCost: 350 },
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function parseNumericInput(val) {
    const digits = String(val || "").replace(/[^\d]/g, "");
    return digits ? Number(digits) : 0;
  }

  function formatNumberWithCommas(inputEl) {
    const raw = String(inputEl.value || "");
    const selStart = inputEl.selectionStart ?? raw.length;
    const digitsBeforeCursor = raw.slice(0, selStart).replace(/[^\d]/g, "").length;
    const allDigits = raw.replace(/[^\d]/g, "");

    if (!allDigits) {
      inputEl.value = "";
      return;
    }

    const formatted = Number(allDigits).toLocaleString("en-CA");
    inputEl.value = formatted;

    // Restore cursor position based on digit count before cursor
    let newCursor = 0;
    let seenDigits = 0;
    while (newCursor < formatted.length && seenDigits < digitsBeforeCursor) {
      if (/\d/.test(formatted[newCursor])) {
        seenDigits++;
      }
      newCursor++;
    }
    if (typeof inputEl.setSelectionRange === "function") {
      inputEl.setSelectionRange(newCursor, newCursor);
    }
  }

  function updateCalculator() {
    if (!calcValueInput || !calcTypeSelect) return;
    const rawValue = parseNumericInput(calcValueInput.value);
    const amount = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
    const typeKey = calcTypeSelect.value;
    const config = RATE_TABLE[typeKey] || { minRate: 0.01, maxRate: 0.015, minCost: 500 };

    const minPct = (config.minRate * 100).toFixed(2).replace(/\.?0+$/, "");
    const maxPct = (config.maxRate * 100).toFixed(2).replace(/\.?0+$/, "");
    calcRateRange.textContent = `${minPct}% – ${maxPct}%`;

    if (amount <= 0) {
      calcCostRange.textContent = "$0 CAD";
      return;
    }

    const rawMinCost = amount * config.minRate;
    const rawMaxCost = amount * config.maxRate;
    const minCost = Math.max(rawMinCost, config.minCost);
    const maxCost = Math.max(rawMaxCost, config.minCost);

    if (minCost === maxCost) {
      calcCostRange.textContent = `${formatCurrency(minCost)} CAD (subject to minimum premium)`;
    } else {
      calcCostRange.textContent = `${formatCurrency(minCost)} – ${formatCurrency(maxCost)} CAD`;
    }
  }

  if (calcForm) {
    calcForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateCalculator();
    });
    if (calcValueInput) {
      formatNumberWithCommas(calcValueInput);
      calcValueInput.addEventListener("input", () => {
        formatNumberWithCommas(calcValueInput);
        updateCalculator();
      });
      calcValueInput.addEventListener("change", updateCalculator);
    }
    if (calcTypeSelect) {
      calcTypeSelect.addEventListener("change", updateCalculator);
    }
    updateCalculator();
  }

  if (calcQuoteCta) {
    calcQuoteCta.addEventListener("click", () => {
      const typeKey = calcTypeSelect ? calcTypeSelect.value : "contract";
      const mappedBondType = CALC_TO_FORM_BOND_TYPE[typeKey] || "Contract";
      const bondLabel =
        calcTypeSelect && calcTypeSelect.selectedIndex >= 0
          ? calcTypeSelect.options[calcTypeSelect.selectedIndex].textContent.trim()
          : mappedBondType;
      const amount = parseNumericInput(calcValueInput ? calcValueInput.value : 0);
      const formattedAmount = amount > 0 ? `${formatCurrency(amount)} CAD` : "Not specified";
      const rateText = calcRateRange ? calcRateRange.textContent.trim() : "";
      const costText = calcCostRange ? calcCostRange.textContent.trim() : "";

      openModal("contact-modal", mappedBondType);
      pendingCalcAmount = amount > 0 ? amount : null;

      const contactNotes = document.getElementById("contact-notes");
      if (contactNotes) {
        contactNotes.value = [
          "Requesting a firm underwriting quote based on rate calculator estimate:",
          `- Bond Category: ${bondLabel}`,
          `- Contract / Project Value: ${formattedAmount}`,
          `- Indicative Estimate: ${costText} (${rateText})`,
        ].join("\n");
      }
    });
  }

  // Helper to safely render key-value summary lines
  function renderSummary(container, rows) {
    container.innerHTML = "";
    rows.forEach(([label, value]) => {
      const row = document.createElement("div");
      row.style.marginBottom = "0.35rem";
      const strong = document.createElement("strong");
      strong.textContent = `${label}: `;
      const span = document.createElement("span");
      span.textContent = value || "—";
      row.appendChild(strong);
      row.appendChild(span);
      container.appendChild(row);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearFormValidation(form) {
    if (!form) return;
    form.querySelectorAll(".is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
      el.removeAttribute("aria-invalid");
    });
  }

  function highlightInvalidFields(form, checks) {
    clearFormValidation(form);
    let firstInvalid = null;
    checks.forEach(([fieldName, isInvalid]) => {
      if (!isInvalid) return;
      const el = form.querySelector(`[name="${fieldName}"]`);
      if (el) {
        el.classList.add("is-invalid");
        el.setAttribute("aria-invalid", "true");
        if (!firstInvalid) firstInvalid = el;
      }
    });
    if (firstInvalid) firstInvalid.focus();
  }

  function attachLiveValidationReset(form) {
    if (!form) return;
    ["input", "change"].forEach((evt) => {
      form.addEventListener(evt, (event) => {
        const target = event.target;
        if (target && target.classList && target.classList.contains("is-invalid")) {
          target.classList.remove("is-invalid");
          target.removeAttribute("aria-invalid");
        }
      });
    });
  }

  async function submitLeadToApi(payload) {
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      throw new Error(data.error || "Unable to submit your request right now. Please try again.");
    }
    return data.lead;
  }

  // Contact Us Form
  const contactForm = document.getElementById("contact-form");
  const contactError = document.getElementById("contact-error");
  const contactSuccess = document.getElementById("contact-success");
  const contactSummary = document.getElementById("contact-success-summary");

  if (contactForm) {
    attachLiveValidationReset(contactForm);
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const company = String(data.get("company") || "").trim();
      const bondType = String(data.get("bondType") || "").trim();
      const province = String(data.get("province") || "").trim();
      const notes = String(data.get("notes") || "").trim();
      const websiteUrl = String(data.get("website_url") || "").trim();
      const crossSellInsurance = Boolean(data.get("crossSellInsurance"));
      const privacyConsent = Boolean(data.get("privacyConsent"));
      const marketingOptIn = Boolean(data.get("marketingOptIn"));

      if (!name || !email || !phone || !company || !bondType || !province) {
        highlightInvalidFields(contactForm, [
          ["name", !name],
          ["email", !email],
          ["phone", !phone],
          ["company", !company],
          ["bondType", !bondType],
          ["province", !province],
        ]);
        contactError.textContent =
          "Please complete all required fields (Name, Email, Phone Number, Company Name, Type of Bond, and Province).";
        contactError.hidden = false;
        return;
      }

      if (!isValidEmail(email)) {
        highlightInvalidFields(contactForm, [["email", true]]);
        contactError.textContent = "Please enter a valid email address.";
        contactError.hidden = false;
        return;
      }

      if (!privacyConsent) {
        highlightInvalidFields(contactForm, [["privacyConsent", true]]);
        contactError.textContent =
          "Please confirm the mandatory Privacy Policy, Broker Disclosures, and Referral Consent checkbox before submitting.";
        contactError.hidden = false;
        return;
      }

      clearFormValidation(contactForm);

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "Send Inquiry";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";
      }

      try {
        const consentTimestamp = new Date().toISOString();
        const leadPayload = {
          lead_type: "contact",
          contact_name: name,
          company_name: company,
          email,
          phone,
          bond_type: bondType,
          province,
          notes,
          cross_sell_insurance: crossSellInsurance,
          privacy_consent: privacyConsent,
          referral_consent: privacyConsent,
          marketing_opt_in: marketingOptIn,
          consent_timestamp: consentTimestamp,
          website_url: websiteUrl,
        };
        if (pendingCalcAmount && pendingCalcAmount > 0) {
          leadPayload.amount = pendingCalcAmount;
        }

        const savedLead = await submitLeadToApi(leadPayload);
        const submittedAmount = pendingCalcAmount;
        pendingCalcAmount = null;

        contactError.hidden = true;
        const summaryRows = [
          ["Reference #", savedLead.reference_id],
          ["Name", name],
          ["Email", email],
          ["Phone", phone],
          ["Company", company],
          ["Province", province],
          ["Bond Type", bondType],
        ];
        if (submittedAmount && submittedAmount > 0) {
          summaryRows.push(["Bond / Contract Value", `${formatCurrency(submittedAmount)} CAD`]);
        }
        if (crossSellInsurance) {
          summaryRows.push(["Commercial Insurance", "Requested CGL/Bundle Review"]);
        }
        renderSummary(contactSummary, summaryRows);

        contactForm.hidden = true;
        contactSuccess.hidden = false;
        contactForm.reset();
      } catch (err) {
        contactError.textContent = err.message || "Failed to submit inquiry. Please try again.";
        contactError.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Apply Now Form
  const applyForm = document.getElementById("apply-form");
  const applyAmountInput = document.getElementById("apply-amount");
  const applyError = document.getElementById("apply-error");
  const applySuccess = document.getElementById("apply-success");
  const applySummary = document.getElementById("apply-success-summary");

  if (applyAmountInput) {
    applyAmountInput.addEventListener("input", () => {
      formatNumberWithCommas(applyAmountInput);
    });
  }

  if (applyForm) {
    attachLiveValidationReset(applyForm);
    applyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(applyForm);
      const company = String(data.get("company") || "").trim();
      const contactName = String(data.get("contactName") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const city = String(data.get("city") || "").trim();
      const province = String(data.get("province") || "").trim();
      const years = String(data.get("years") || "").trim();
      const structure = String(data.get("structure") || "").trim();
      const bondType = String(data.get("bondType") || "").trim();
      const amount = parseNumericInput(data.get("amount"));
      const obligee = String(data.get("obligee") || "").trim();
      const requiredDate = String(data.get("requiredDate") || "").trim();
      const financials = String(data.get("financials") || "").trim();
      const priorSurety = String(data.get("priorSurety") || "").trim();
      const notes = String(data.get("notes") || "").trim();
      const websiteUrl = String(data.get("website_url") || "").trim();
      const crossSellInsurance = Boolean(data.get("crossSellInsurance"));
      const privacyConsent = Boolean(data.get("privacyConsent"));
      const marketingOptIn = Boolean(data.get("marketingOptIn"));

      if (
        !company ||
        !contactName ||
        !email ||
        !phone ||
        !city ||
        !province ||
        !years ||
        !bondType ||
        amount <= 0
      ) {
        highlightInvalidFields(applyForm, [
          ["company", !company],
          ["contactName", !contactName],
          ["email", !email],
          ["phone", !phone],
          ["city", !city],
          ["province", !province],
          ["years", !years],
          ["bondType", !bondType],
          ["amount", amount <= 0],
        ]);
        applyError.textContent =
          "Please complete all required business, contact, province, and bond detail fields.";
        applyError.hidden = false;
        return;
      }

      if (!isValidEmail(email)) {
        highlightInvalidFields(applyForm, [["email", true]]);
        applyError.textContent = "Please enter a valid email address.";
        applyError.hidden = false;
        return;
      }

      if (!privacyConsent) {
        highlightInvalidFields(applyForm, [["privacyConsent", true]]);
        applyError.textContent =
          "Please confirm the mandatory Privacy Policy, Broker Disclosures, and Referral Consent checkbox before submitting.";
        applyError.hidden = false;
        return;
      }

      clearFormValidation(applyForm);

      const submitBtn = applyForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "Submit Application";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";
      }

      const refId = `NX-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const consentTimestamp = new Date().toISOString();
        const savedLead = await submitLeadToApi({
          reference_id: refId,
          lead_type: "application",
          company_name: company,
          contact_name: contactName,
          email,
          phone,
          city,
          province,
          years_in_business: Number(years),
          business_structure: structure,
          bond_type: bondType,
          amount,
          obligee,
          required_date: requiredDate,
          financials,
          prior_surety: priorSurety,
          notes,
          cross_sell_insurance: crossSellInsurance,
          privacy_consent: privacyConsent,
          referral_consent: privacyConsent,
          marketing_opt_in: marketingOptIn,
          consent_timestamp: consentTimestamp,
          website_url: websiteUrl,
        });

        applyError.hidden = true;
        const summaryRows = [
          ["Reference #", savedLead.reference_id || refId],
          ["Business", company],
          ["Contact", `${contactName} (${email})`],
          ["Location", `${city}, ${province}`],
          ["Bond Type", bondType],
          ["Estimated Amount", `${formatCurrency(amount)} CAD`],
          ["Obligee / Owner", obligee || "Not specified"],
        ];
        if (crossSellInsurance) {
          summaryRows.push(["Commercial Insurance", "Requested CGL/Bundle Review"]);
        }
        renderSummary(applySummary, summaryRows);

        applyForm.hidden = true;
        applySuccess.hidden = false;
        applyForm.reset();
      } catch (err) {
        applyError.textContent = err.message || "Failed to submit application. Please try again.";
        applyError.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Readiness Checklist Lead Magnet Form
  const checklistForm = document.getElementById("checklist-form");
  const checklistError = document.getElementById("checklist-error");
  const checklistSuccess = document.getElementById("checklist-success");
  const checklistSummary = document.getElementById("checklist-success-summary");
  const checklistDownloadLink = document.getElementById("checklist-download-link");

  if (checklistForm) {
    attachLiveValidationReset(checklistForm);
    checklistForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(checklistForm);
      const name = String(data.get("name") || "").trim();
      const company = String(data.get("company") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const province = String(data.get("province") || "").trim();
      const websiteUrl = String(data.get("website_url") || "").trim();
      const crossSellInsurance = Boolean(data.get("crossSellInsurance"));
      const privacyConsent = Boolean(data.get("privacyConsent"));
      const marketingOptIn = Boolean(data.get("marketingOptIn"));

      if (!name || !company || !email || !province) {
        highlightInvalidFields(checklistForm, [
          ["name", !name],
          ["company", !company],
          ["email", !email],
          ["province", !province],
        ]);
        checklistError.textContent =
          "Please enter your Name, Company Name, Work Email, and Province to download the PDF.";
        checklistError.hidden = false;
        return;
      }

      if (!isValidEmail(email)) {
        highlightInvalidFields(checklistForm, [["email", true]]);
        checklistError.textContent = "Please enter a valid email address.";
        checklistError.hidden = false;
        return;
      }

      if (!privacyConsent) {
        highlightInvalidFields(checklistForm, [["privacyConsent", true]]);
        checklistError.textContent =
          "Please agree to the Privacy Policy and Broker Disclosures before downloading.";
        checklistError.hidden = false;
        return;
      }

      clearFormValidation(checklistForm);

      const submitBtn = checklistForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : "Get Checklist PDF";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Preparing PDF...";
      }

      try {
        const savedLead = await submitLeadToApi({
          lead_type: "checklist",
          contact_name: name,
          company_name: company,
          email,
          phone: phone || "Not provided",
          bond_type: "Checklist",
          province,
          notes: "Downloaded First-Time Contractor Bonding Readiness Checklist (PDF).",
          cross_sell_insurance: crossSellInsurance,
          privacy_consent: privacyConsent,
          referral_consent: privacyConsent,
          marketing_opt_in: marketingOptIn,
          consent_timestamp: new Date().toISOString(),
          website_url: websiteUrl,
        });

        checklistError.hidden = true;
        renderSummary(checklistSummary, [
          ["Reference #", savedLead.reference_id],
          ["Name", name],
          ["Company", company],
          ["Province", province],
        ]);

        checklistForm.hidden = true;
        checklistSuccess.hidden = false;
        checklistForm.reset();

        if (checklistDownloadLink) {
          checklistDownloadLink.click();
        }
      } catch (err) {
        checklistError.textContent =
          err.message || "Unable to unlock the checklist right now. Please try again.";
        checklistError.hidden = false;
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }
})();

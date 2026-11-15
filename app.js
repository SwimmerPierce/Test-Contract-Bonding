/**
 * File: app.js
 * Description: Client-side interactivity for Nexus Insurance Brokers Ltd. (Burnaby, BC),
 *              powering responsive navigation, the Surety Bond Rate Calculator, and the
 *              Contact Us & Apply Now modal forms with validation and confirmation summaries.
 * Dependencies: index.html DOM elements, styles.css modal/nav classes.
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
  function openModal(modalId, preselectedBondType) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Reset form/success state each time modal is opened
    const form = modal.querySelector("form");
    const success = modal.querySelector(".form-success");
    const errorBox = modal.querySelector(".form-error");
    if (form && success) {
      form.hidden = false;
      success.hidden = true;
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

    const firstInput = modal.querySelector("input, select, textarea");
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
  const calcProfileSelect = document.getElementById("calc-profile");
  const calcRateRange = document.getElementById("calc-rate-range");
  const calcCostRange = document.getElementById("calc-cost-range");

  const RATE_TABLE = {
    contract: {
      strong: [0.0085, 0.0125],
      standard: [0.0125, 0.0175],
      emerging: [0.0175, 0.025],
    },
    bid: {
      strong: [0.0025, 0.005],
      standard: [0.004, 0.0075],
      emerging: [0.006, 0.01],
    },
    administrative: {
      strong: [0.0075, 0.0125],
      standard: [0.01, 0.0175],
      emerging: [0.015, 0.025],
    },
    other: {
      strong: [0.01, 0.015],
      standard: [0.0125, 0.02],
      emerging: [0.0175, 0.0275],
    },
  };

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  function updateCalculator() {
    if (!calcValueInput || !calcTypeSelect || !calcProfileSelect) return;
    const rawValue = Number(calcValueInput.value);
    const amount = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : 0;
    const typeKey = calcTypeSelect.value;
    const profileKey = calcProfileSelect.value;
    const [minRate, maxRate] = (RATE_TABLE[typeKey] && RATE_TABLE[typeKey][profileKey]) || [0.0125, 0.0175];

    const minPct = (minRate * 100).toFixed(2).replace(/\.00$/, "");
    const maxPct = (maxRate * 100).toFixed(2).replace(/\.00$/, "");
    calcRateRange.textContent = `${minPct}% – ${maxPct}%`;
    calcCostRange.textContent = `${formatCurrency(amount * minRate)} – ${formatCurrency(amount * maxRate)} CAD`;
  }

  if (calcForm) {
    calcForm.addEventListener("submit", (event) => {
      event.preventDefault();
      updateCalculator();
    });
    [calcValueInput, calcTypeSelect, calcProfileSelect].forEach((el) => {
      if (el) el.addEventListener("change", updateCalculator);
    });
    updateCalculator();
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

  // Contact Us Form
  const contactForm = document.getElementById("contact-form");
  const contactError = document.getElementById("contact-error");
  const contactSuccess = document.getElementById("contact-success");
  const contactSummary = document.getElementById("contact-success-summary");

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const company = String(data.get("company") || "").trim();
      const bondType = String(data.get("bondType") || "").trim();

      if (!name || !email || !phone || !company || !bondType) {
        contactError.textContent = "Please complete all required fields (Name, Email, Phone Number, Company Name, and Type of Bond).";
        contactError.hidden = false;
        return;
      }

      if (!isValidEmail(email)) {
        contactError.textContent = "Please enter a valid email address.";
        contactError.hidden = false;
        return;
      }

      contactError.hidden = true;
      renderSummary(contactSummary, [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["Company", company],
        ["Bond Type", bondType],
      ]);

      contactForm.hidden = true;
      contactSuccess.hidden = false;
      contactForm.reset();
    });
  }

  // Apply Now Form
  const applyForm = document.getElementById("apply-form");
  const applyError = document.getElementById("apply-error");
  const applySuccess = document.getElementById("apply-success");
  const applySummary = document.getElementById("apply-success-summary");

  if (applyForm) {
    applyForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(applyForm);
      const company = String(data.get("company") || "").trim();
      const contactName = String(data.get("contactName") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const city = String(data.get("city") || "").trim();
      const years = String(data.get("years") || "").trim();
      const bondType = String(data.get("bondType") || "").trim();
      const amount = Number(data.get("amount") || 0);
      const obligee = String(data.get("obligee") || "").trim();

      if (!company || !contactName || !email || !phone || !city || !years || !bondType || amount <= 0) {
        applyError.textContent = "Please complete all required business, contact, and bond detail fields.";
        applyError.hidden = false;
        return;
      }

      if (!isValidEmail(email)) {
        applyError.textContent = "Please enter a valid email address.";
        applyError.hidden = false;
        return;
      }

      const refId = `NX-${Math.floor(100000 + Math.random() * 900000)}`;
      applyError.hidden = true;
      renderSummary(applySummary, [
        ["Reference #", refId],
        ["Business", company],
        ["Contact", `${contactName} (${email})`],
        ["Location", city],
        ["Bond Type", bondType],
        ["Estimated Amount", `${formatCurrency(amount)} CAD`],
        ["Obligee / Owner", obligee || "Not specified"],
      ]);

      applyForm.hidden = true;
      applySuccess.hidden = false;
      applyForm.reset();
    });
  }
})();

/* Enquiry form validation.
   Fields are checked on submit, then on blur once the visitor has tried to submit.
   Errors are written into each field's .field__error and linked with aria-describedby.
   Nothing is sent anywhere: this is a concept site. */

import { esc } from "./ui.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Accepts +91 98200 12345, 098200 12345, 9820012345 and similar
export function normaliseMobile(value) {
  let digits = String(value).replace(/[^\d]/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function labelFor(field) {
  return field.dataset.label || (field.labels && field.labels[0] ? field.labels[0].textContent.replace(/\s*\(.*\)\s*$/, "").trim().toLowerCase() : "this field");
}

// Returns an error message, or "" when the field is fine
export function checkField(field) {
  const value = field.type === "checkbox" ? field.checked : field.value.trim();
  const rule = field.dataset.validate;

  if (field.type === "checkbox") {
    return field.required && !value ? (field.dataset.msg || "Please tick this box to continue.") : "";
  }
  if (!value) {
    if (!field.required) return "";
    return field.tagName === "SELECT" ? `Please choose ${labelFor(field)}.` : `Please enter ${labelFor(field)}.`;
  }
  if (field.type === "email" && !EMAIL.test(value)) return "Please enter an email address like name@example.com.";
  if (rule === "mobile" && !normaliseMobile(value)) return "Please enter a 10-digit Indian mobile number, such as +91 98200 12345.";
  if (rule === "future-date" && value <= todayISO()) return "Please choose a date from tomorrow onwards.";
  if (rule === "number") {
    const n = Number(value.replace(/,/g, ""));
    const min = Number(field.dataset.min || 0);
    const max = Number(field.dataset.max || Infinity);
    if (!Number.isFinite(n)) return `Please enter ${labelFor(field)} as a number.`;
    if (n < min || n > max) return `Please enter a value between ${min.toLocaleString("en-IN")} and ${max.toLocaleString("en-IN")}.`;
  }
  return "";
}

function errorEl(field) {
  const wrap = field.closest(".field, .check");
  let el = wrap && wrap.querySelector(".field__error");
  if (!el && wrap) {
    el = document.createElement("p");
    el.className = "field__error";
    wrap.appendChild(el);
  }
  if (el && !el.id) el.id = (field.id || field.name) + "-error";
  return el;
}

export function showError(field, message) {
  const el = errorEl(field);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  if (!el) return;
  el.textContent = message;
  // data-hint names a help text element that stays linked whether or not there's an error
  const ids = [field.dataset.hint, message ? el.id : ""].filter(Boolean).join(" ");
  if (ids) field.setAttribute("aria-describedby", ids);
  else field.removeAttribute("aria-describedby");
}

function fields(form) {
  return Array.from(form.elements).filter(el => el.name && !el.closest(".hp") && /INPUT|SELECT|TEXTAREA/.test(el.tagName));
}

export function validateForm(form) {
  let first = null;
  fields(form).forEach(field => {
    const message = checkField(field);
    showError(field, message);
    if (message && !first) first = field;
  });
  return first;
}

/**
 * Wires up a form.
 * onSuccess(data, form) can return { title, body } to customise the thank-you panel.
 */
export function initForm(form, { onSuccess } = {}) {
  if (!form) return;
  form.noValidate = true;
  let attempted = false;

  form.querySelectorAll('[data-validate="future-date"]').forEach(input => { input.min = todayISO(); });

  form.addEventListener("focusout", e => {
    if (attempted && e.target.name) showError(e.target, checkField(e.target));
  });
  form.addEventListener("input", e => {
    // Clear an error as soon as it is fixed, but don't nag while typing
    if (e.target.getAttribute("aria-invalid") === "true" && !checkField(e.target)) showError(e.target, "");
  });
  form.addEventListener("change", e => {
    if (attempted && (e.target.type === "checkbox" || e.target.tagName === "SELECT")) showError(e.target, checkField(e.target));
  });

  form.addEventListener("submit", e => {
    e.preventDefault();
    attempted = true;
    const first = validateForm(form);
    if (first) {
      first.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    const honeypot = form.querySelector(".hp input");
    // A filled honeypot means a bot; it sees the same thank-you, and nothing else happens
    const custom = honeypot && honeypot.value ? null : (onSuccess && onSuccess(data, form));
    showSuccess(form, data, custom);
  });
}

function showSuccess(form, data, custom) {
  const first = (data.name || "").trim().split(/\s+/)[0];
  const panel = document.createElement("div");
  panel.className = "form-success";
  panel.setAttribute("role", "status");
  const title = (custom && custom.title) || (first ? `Thank you, ${first}.` : "Thank you.");
  const body = (custom && custom.body) || "An adviser would be in touch within a working day. This is a concept site, so nothing was actually sent.";
  panel.innerHTML = `<p class="label">(Received)</p><h3 class="form-success__title" tabindex="-1">${esc(title)}</h3><p class="form-success__body">${esc(body)}</p><button type="button" class="pill pill--outline">Send another</button>`;
  form.hidden = true;
  form.after(panel);
  panel.querySelector("h3").focus();
  panel.querySelector("button").addEventListener("click", () => {
    form.reset();
    fields(form).forEach(f => showError(f, ""));
    panel.remove();
    form.hidden = false;
    const firstField = fields(form)[0];
    if (firstField) firstField.focus();
  });
}

/* Valuation: the calculator, its result on the light sandstone panel, and the
   request form that the result can prefill. */

import { LOCALITIES, getLocality } from "../data/localities.js";
import { estimate, usesFloor, ADJUSTMENTS } from "../lib/valuation.js";
import { formatCrore, formatNumber } from "../lib/format.js";
import { initForm, validateForm, checkField, showError } from "../lib/forms.js";
import { $, $$, esc, ICONS, reducedMotion } from "../lib/ui.js";

const form = $("[data-valuation]");
const result = $("[data-result]");
const floorField = $("[data-floor-field]");
const floor = $("#v-floor");
const request = $('[data-form="valuation"]');
let estimated = false;
let last = null;

function read() {
  const data = Object.fromEntries(new FormData(form).entries());
  data.area = String(data.area || "").replace(/[,\s]/g, "");
  return data;
}

// Floor only matters for homes stacked in a building
function syncFloor() {
  const on = usesFloor(read().type);
  floor.disabled = !on;
  floorField.classList.toggle("is-off", !on);
}

// Counts the figures up from the last estimate, so changes feel connected
function tween(el, from, to, format) {
  if (reducedMotion() || from === to) { el.textContent = format(to); return; }
  const start = performance.now();
  const step = now => {
    const t = Math.min(1, (now - start) / 900);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = format(from + (to - from) * e);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const signed = cr => (cr >= 0 ? "+" : "−") + formatCrore(Math.abs(cr));

function render(data) {
  const locality = getLocality(data.locality);
  const r = estimate(data, locality);
  if (!r) return;
  const prev = last;
  last = r;
  const type = ADJUSTMENTS.type.options[data.type].label.toLowerCase();
  result.innerHTML = `
    <span class="label">(Your estimate)</span>
    <h2 class="visually-hidden" id="result-title">Your indicative range</h2>
    <p class="result__range" aria-hidden="true"><b data-low>${formatCrore(r.low)}</b> <span>to</span> <b data-high>${formatCrore(r.high)}</b></p>
    <p class="visually-hidden">Between ${formatCrore(r.low)} and ${formatCrore(r.high)}.</p>
    <p class="result__mid">Most likely around <strong>${formatCrore(r.mid)}</strong> for this ${esc(type)} in ${esc(locality.name)}, or about ₹${formatNumber(r.perSqft)} per sq ft.</p>
    <ol class="breakdown">
      ${r.lines.map((l, i) => `<li><span>${esc(l.label)}</span><small>${esc(l.detail)}${l.factor ? ` (×${l.factor.toFixed(2)})` : ""}</small><b>${i === 0 ? formatCrore(l.value) : Math.abs(l.value) < 0.005 ? "No change" : signed(l.value)}</b></li>`).join("")}
    </ol>
    <p class="result__note">Indicative only, from fictional rates for this concept site. A real valuation depends on the title, the light, the neighbours and recent sales, which only a visit can judge.</p>
    <a class="pill pill--fill" href="#request" data-request>Request a private valuation ${ICONS.arrowRight}</a>`;

  tween($("[data-low]", result), prev ? prev.low : 0, r.low, formatCrore);
  tween($("[data-high]", result), prev ? prev.high : 0, r.high, formatCrore);

  $("[data-request]", result).addEventListener("click", () => prefill(data, locality, r));
}

function prefill(data, locality, r) {
  const summary = $("[data-valuation-summary]", request);
  const parts = [
    `${ADJUSTMENTS.type.options[data.type].label} in ${locality.name}, ${locality.city}`,
    `${formatNumber(Number(data.area))} sq ft built-up`,
    ADJUSTMENTS.age.options[data.age].label.toLowerCase() + " old",
    ADJUSTMENTS.condition.options[data.condition].label.toLowerCase() + " condition",
    "view: " + ADJUSTMENTS.view.options[data.view].label.toLowerCase()
  ];
  summary.value = `${parts.join(", ")}. The online estimate was ${formatCrore(r.low)} to ${formatCrore(r.high)}.`;
  // Let the link scroll, then put the visitor straight into the form
  setTimeout(() => $("#r-name").focus({ preventScroll: true }), reducedMotion() ? 0 : 600);
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const first = validateForm(form);
  if (first) { first.focus(); return; }
  estimated = true;
  render(read());
  // On narrow screens the result sits below the form
  if (window.innerWidth < 1100) result.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
});

// After the first estimate, the result follows every change
form.addEventListener("input", onChange);
form.addEventListener("change", onChange);
function onChange(e) {
  if (e.target.name === "type") syncFloor();
  if (e.target.getAttribute("aria-invalid") === "true" && !checkField(e.target)) showError(e.target, "");
  if (!estimated) return;
  const fields = [$("#v-locality"), $("#v-area")];
  if (fields.every(f => !checkField(f))) render(read());
}

// Arriving from the home page teaser with a locality and an area
const q = new URLSearchParams(location.search);
if (q.get("locality") && LOCALITIES.some(l => l.id === q.get("locality"))) $("#v-locality").value = q.get("locality");
if (q.get("area")) $("#v-area").value = q.get("area");
syncFloor();
if (q.get("locality") && q.get("area") && !checkField($("#v-area"))) {
  estimated = true;
  render(read());
}

initForm(request);

/* Residences: filters kept in the address bar, editorial rows, and a map that
   follows the filters (split view on wide screens, its own view on phones). */

import { PROPERTIES, REGIONS, TYPES, LIFESTYLES } from "../data/properties.js";
import { parseQuery, toQuery, applyFilters, countActive, defaultState, SORTS, BUDGET_STEPS, BED_STEPS } from "../lib/filters.js";
import { picture } from "../lib/images.js";
import { formatPrice, formatSqft, formatLand, formatCrore, plural } from "../lib/format.js";
import { createMap, priceMarker } from "../lib/map.js";
import { $, $$, esc, ICONS, heartButton, trapFocus } from "../lib/ui.js";

const form = $("[data-filters]");
const panel = $("[data-filter-panel]");
const list = $("[data-list]");
const results = $("[data-results]");
const mapEl = $("[data-map]");
const sheetQuery = window.matchMedia("(max-width: 1099px)");

let state = parseQuery(location.search);
let shown = [];

/* ---------- Controls ---------- */

const option = (value, label) => `<option value="${esc(value)}">${esc(label)}</option>`;
const chip = (group, value, label) => `<button type="button" class="chip" data-group="${group}" data-value="${esc(value)}" aria-pressed="false">${esc(label)}</button>`;

$('[data-chips="region"]').innerHTML = REGIONS.map(r => chip("region", r.id, r.label)).join("");
$('[data-chips="life"]').innerHTML = LIFESTYLES.map(l => chip("life", l.id, l.label)).join("");
$("#f-type").innerHTML = option("", "Any type") + TYPES.map(t => option(t.id, t.label)).join("");
$("#f-min").innerHTML = option("", "No minimum") + BUDGET_STEPS.map(n => option(n, formatCrore(n))).join("");
$("#f-max").innerHTML = option("", "No maximum") + BUDGET_STEPS.map(n => option(n, formatCrore(n))).join("");
$("#f-beds").innerHTML = option("", "Any") + BED_STEPS.map(n => option(n, n + " or more")).join("");
$("#f-sort").innerHTML = SORTS.map(s => option(s.id, s.label)).join("");

function syncControls() {
  $$(".chip[data-group]", form).forEach(c => {
    c.setAttribute("aria-pressed", String(state[c.dataset.group].includes(c.dataset.value)));
  });
  $("#f-type").value = state.type;
  $("#f-min").value = state.min ? String(state.min) : "";
  $("#f-max").value = state.max ? String(state.max) : "";
  $("#f-beds").value = state.beds ? String(state.beds) : "";
  $("#f-sort").value = state.sort;
  $$("[data-view]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.view === state.view)));
  const more = $("[data-more]");
  if (sheetQuery.matches || state.life.length) more.open = true;
}

function update(patch) {
  state = { ...state, ...patch };
  // Keep the range sensible: a new minimum above the maximum clears the maximum, and vice versa
  if (state.min && state.max && state.min > state.max) {
    if ("min" in patch) state.max = null;
    else state.min = null;
  }
  history.replaceState(null, "", location.pathname + toQuery(state));
  syncControls();
  render();
}

form.addEventListener("submit", e => e.preventDefault());
form.addEventListener("click", e => {
  const c = e.target.closest(".chip[data-group]");
  if (!c) return;
  const group = c.dataset.group;
  const v = c.dataset.value;
  const on = state[group].includes(v);
  update({ [group]: on ? state[group].filter(x => x !== v) : state[group].concat(v) });
});
form.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "f-type") update({ type: t.value });
  if (t.id === "f-min") update({ min: t.value ? Number(t.value) : null });
  if (t.id === "f-max") update({ max: t.value ? Number(t.value) : null });
  if (t.id === "f-beds") update({ beds: t.value ? Number(t.value) : 0 });
  if (t.id === "f-sort") update({ sort: t.value });
});
$$("[data-clear]").forEach(b => b.addEventListener("click", () => {
  const d = defaultState();
  update({ region: d.region, type: d.type, min: d.min, max: d.max, beds: d.beds, life: d.life });
}));
$$("[data-view]").forEach(b => b.addEventListener("click", () => update({ view: b.dataset.view })));
window.addEventListener("popstate", () => { state = parseQuery(location.search); syncControls(); render(); });

/* ---------- Filter sheet (phones and small tablets) ---------- */

const openBtn = $("[data-filters-open]");
let release = null;

function openSheet() {
  panel.classList.add("is-open");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Filters");
  document.documentElement.classList.add("is-locked");
  openBtn.setAttribute("aria-expanded", "true");
  release = trapFocus(panel);
  $("[data-filters-close]", panel).focus();
}

function closeSheet() {
  if (!panel.classList.contains("is-open")) return;
  panel.classList.remove("is-open");
  ["role", "aria-modal", "aria-label"].forEach(a => panel.removeAttribute(a));
  document.documentElement.classList.remove("is-locked");
  openBtn.setAttribute("aria-expanded", "false");
  if (release) release();
  openBtn.focus();
}

openBtn.addEventListener("click", openSheet);
$$("[data-filters-close]").forEach(b => b.addEventListener("click", closeSheet));
panel.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });
sheetQuery.addEventListener("change", () => { if (!sheetQuery.matches) closeSheet(); syncControls(); });

/* ---------- Results ---------- */

function row(p) {
  const href = `residence.html?id=${esc(p.id)}`;
  return `<article class="row" data-id="${esc(p.id)}" data-vt-scope>
    <div class="row__media">
      <div class="frame">${picture(p.images[0].slot, { alt: "", sizes: "(min-width: 1100px) 50vw, 100vw" })}</div>
      ${heartButton(p)}
    </div>
    <div class="row__body">
      <p class="row__no"><b>No. ${esc(p.no)}</b> · ${esc(p.locality)}, ${esc(p.city)}</p>
      <h2 class="row__title"><a href="${href}">${esc(p.name)}</a></h2>
      <p class="row__tagline">${esc(p.tagline)}</p>
      <ul class="row__facts">
        <li>${esc(p.typeLabel)}</li>
        <li><strong>${p.beds}</strong> bedrooms</li>
        <li><strong>${formatSqft(p.builtUpSqft)}</strong></li>
        ${p.landSqft ? `<li><strong>${formatLand(p.landSqft)}</strong> of land</li>` : ""}
      </ul>
      <div class="row__foot">
        <p class="row__price">${esc(formatPrice(p))}</p>
        <span class="text-link row__cta" aria-hidden="true">View residence ${ICONS.arrowRight}</span>
      </div>
    </div>
  </article>`;
}

function empty() {
  return `<div class="empty">
    <span class="label">(No match)</span>
    <h2>No residence matches all of that. Try loosening the budget or a lifestyle, or describe what you're after to the concierge.</h2>
    <div class="empty__actions">
      <button class="pill pill--outline" type="button" data-clear-empty>Clear all filters</button>
      <button class="pill pill--fill" type="button" data-concierge-open>Ask the Concierge</button>
    </div>
  </div>`;
}

list.addEventListener("click", e => {
  if (e.target.closest("[data-clear-empty]")) $("[data-clear]").click();
});

function render() {
  shown = applyFilters(PROPERTIES, state);
  list.innerHTML = shown.length ? shown.map(row).join("") : empty();

  const n = shown.length;
  const active = countActive(state);
  $("[data-count-text]").innerHTML = `<strong>${n}</strong> ${n === 1 ? "residence" : "residences"}${active ? " match" : ""}`;
  $("[data-active-n]").textContent = active ? String(active) : "";
  $("[data-clear-bar]").hidden = !active;
  $("[data-show-count]").textContent = n ? `Show ${plural(n, "residence")}` : "No matches yet";

  results.classList.toggle("is-map", state.view === "map");
  if (state.view === "map") showMap();
}

/* ---------- Map ---------- */

let ctx = null;
let mapFailed = false;
const markers = new Map();

function fallback() {
  mapFailed = true;
  mapEl.innerHTML = `<div class="map-fallback">
    <p class="label">(Map unavailable)</p>
    <p>The map couldn't load here. These are the residences shown:</p>
    <ul>${shown.map(p => `<li><a href="residence.html?id=${esc(p.id)}">${esc(p.name)}</a><span>${esc(p.city)} · ${esc(formatPrice(p))}</span></li>`).join("")}</ul>
  </div>`;
}

function popup(p) {
  return `<a class="frame map-card__img" href="residence.html?id=${esc(p.id)}" tabindex="-1" aria-hidden="true">${picture(p.images[0].slot, { alt: "", sizes: "240px", width: 800 })}</a>
    <div class="map-card__body">
      <p class="card__meta">${esc(p.city)}</p>
      <h3>${esc(p.name)}</h3>
      <p>${esc(formatPrice(p))} · ${p.beds} bedrooms</p>
      <a class="text-link" href="residence.html?id=${esc(p.id)}">View residence ${ICONS.arrowRight}</a>
    </div>`;
}

function highlight(id, on) {
  const pin = mapEl.querySelector(`[data-pin="${CSS.escape(id)}"]`);
  if (pin) pin.classList.toggle("is-active", on);
  const r = list.querySelector(`.row[data-id="${CSS.escape(id)}"]`);
  if (r) r.classList.toggle("is-active", on);
}

function showMap() {
  if (mapFailed) return fallback();
  if (!ctx) {
    ctx = createMap(mapEl, { bounds: shown.map(p => p.coords), fit: { padding: [64, 64], maxZoom: 12 }, onFail: fallback });
    if (!ctx) return;
    ctx.map.on("zoomend", untangle);
  }
  // The container was hidden until now, so Leaflet re-measures it
  requestAnimationFrame(() => ctx.map.invalidateSize());
  markers.forEach(m => m.remove());
  markers.clear();
  shown.forEach(p => {
    const m = priceMarker(ctx, p);
    m.bindPopup(popup(p), { className: "map-card", maxWidth: 240, minWidth: 240, autoPanPadding: [24, 24] });
    m.on("mouseover", () => highlight(p.id, true));
    m.on("mouseout", () => highlight(p.id, false));
    markers.set(p.id, m);
  });
  if (shown.length) {
    const bounds = window.L.latLngBounds(shown.map(p => p.coords));
    requestAnimationFrame(() => {
      ctx.map.fitBounds(bounds, { padding: [64, 64], maxZoom: 12 });
      untangle();
    });
  }
}

// Neighbouring pins (Alibaug and Malabar Hill, at country zoom) would overlap:
// the southern one of a close pair hangs below its point instead
function untangle() {
  if (!ctx) return;
  const pts = shown.map(p => ({ id: p.id, pt: ctx.map.latLngToContainerPoint(p.coords) }));
  pts.forEach(a => {
    const crowded = pts.some(b => b !== a && b.pt.y < a.pt.y && Math.abs(b.pt.y - a.pt.y) < 40 && Math.abs(b.pt.x - a.pt.x) < 90);
    const pin = mapEl.querySelector(`[data-pin="${CSS.escape(a.id)}"]`);
    if (pin) pin.classList.toggle("is-below", crowded);
  });
}

// Hovering a row lights up its marker
list.addEventListener("mouseover", e => {
  const r = e.target.closest(".row");
  if (r && !r.contains(e.relatedTarget)) highlight(r.dataset.id, true);
});
list.addEventListener("mouseout", e => {
  const r = e.target.closest(".row");
  if (r && !r.contains(e.relatedTarget)) highlight(r.dataset.id, false);
});

syncControls();
render();

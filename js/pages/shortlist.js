/* Shortlist: saved residences, a compare table and a way into the concierge. */

import { getProperty, regionLabel } from "../data/properties.js";
import { getShortlist, removeSaved, onShortlistChange } from "../lib/favourites.js";
import { formatPrice, formatSqft, formatLand, plural } from "../lib/format.js";
import { card } from "../lib/cards.js";
import { openConcierge } from "../lib/concierge-ui.js";
import { $, esc, ICONS } from "../lib/ui.js";

const root = $("[data-shortlist]");
const lede = $("[data-shortlist-lede]");
const heading = $("h1");
heading.tabIndex = -1;

function compare(saved) {
  const best = (fn, pick) => {
    const vals = saved.map(fn);
    return pick(...vals);
  };
  const maxBeds = best(p => p.beds, Math.max);
  const maxArea = best(p => p.builtUpSqft, Math.max);
  const minPrice = best(p => p.price, Math.min);
  const rows = [
    ["Price", p => formatPrice(p), p => p.price === minPrice && !p.priceOnRequest],
    ["Where", p => `${p.locality}, ${p.city}`],
    ["Setting", p => regionLabel(p.region)],
    ["Type", p => p.typeLabel],
    ["Bedrooms", p => String(p.beds), p => p.beds === maxBeds],
    ["Bathrooms", p => String(p.baths)],
    ["Built-up", p => formatSqft(p.builtUpSqft), p => p.builtUpSqft === maxArea],
    ["Land", p => (p.landSqft ? formatLand(p.landSqft) : "None")],
    ["Year", p => (p.year < 1800 ? "c. " : "") + p.year]
  ];
  return `<section class="compare" aria-labelledby="compare-title">
    <div class="section__head">
      <span class="label">(Compare)</span>
      <h2 class="h3" id="compare-title">Side by side</h2>
    </div>
    <div class="compare__scroll" tabindex="0" role="region" aria-label="Comparison table, scrolls sideways">
      <table>
        <thead><tr><td></td>${saved.map(p => `<th scope="col">${esc(p.name)}</th>`).join("")}</tr></thead>
        <tbody>
          ${rows.map(([label, value, isBest]) => `<tr><th scope="row">${label}</th>${saved.map(p => {
            const top = isBest && saved.length > 1 && isBest(p);
            return `<td${top ? ' class="is-best"' : ""}>${esc(value(p))}${top ? '<span class="visually-hidden"> (best in this list)</span>' : ""}</td>`;
          }).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  </section>`;
}

function render() {
  const saved = getShortlist().map(getProperty).filter(Boolean);
  if (!saved.length) {
    lede.textContent = "Nothing saved yet. Tap the heart on any residence and it will wait for you here, on this device.";
    root.innerHTML = `<div class="empty">
      <span class="label">(Empty)</span>
      <h2>Your shortlist is empty.</h2>
      <div class="empty__actions">
        <a class="pill pill--fill" href="residences.html">Browse the residences</a>
        <button class="pill pill--outline" type="button" data-concierge-open>${ICONS.spark}Ask the Concierge</button>
      </div>
    </div>`;
    return;
  }
  lede.textContent = `${plural(saved.length, "residence")} saved on this device. Compare them, or ask the concierge for others in the same spirit.`;
  root.innerHTML = `
    <div class="saved-grid">
      ${saved.map(p => card(p, {
        heart: false,
        extra: `<button class="pill pill--outline pill--small card__remove" type="button" data-remove="${esc(p.id)}" aria-label="Remove ${esc(p.name)} from your shortlist">Remove</button>`
      })).join("")}
    </div>
    ${compare(saved)}
    <div class="ask-band">
      <span class="label">(Concierge)</span>
      <h2 class="h3">Find more homes like these</h2>
      <p>The concierge reads what your shortlist has in common and suggests other residences in the same spirit.</p>
      <button class="pill pill--fill" type="button" data-ask-shortlist>${ICONS.spark}Ask about my shortlist</button>
    </div>`;
}

root.addEventListener("click", e => {
  const remove = e.target.closest("[data-remove]");
  if (remove) {
    const i = Array.from(root.querySelectorAll("[data-remove]")).indexOf(remove);
    removeSaved(remove.dataset.remove); // re-renders straight away
    // Keep keyboard focus in the list instead of dropping it at the top of the page
    const left = Array.from(root.querySelectorAll("[data-remove]"));
    (left[Math.min(i, left.length - 1)] || heading).focus();
  }
  if (e.target.closest("[data-ask-shortlist]")) openConcierge("Based on my shortlist");
});

onShortlistChange(render);
render();

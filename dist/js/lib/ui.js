/* Small DOM helpers shared by every page. */

import { isSaved } from "./favourites.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export function esc(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, ch => ESC[ch]);
}

export const ICONS = {
  heart: '<svg class="icon icon--heart" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 20.3s-7.6-4.6-9.2-9.4C1.7 7.4 3.9 4.2 7.2 4.2c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.3 0 5.5 3.2 4.4 6.7-1.6 4.8-9.2 9.4-9.2 9.4z"/></svg>',
  arrowLeft: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M19 12H5m6-6-6 6 6 6"/></svg>',
  arrowRight: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  close: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  spark: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z"/></svg>',
  expand: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
  send: '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>'
};

// The heart that saves a residence. main.js keeps every copy on the page in sync.
export function heartButton(p, extraClass = "") {
  const saved = isSaved(p.id);
  return `<button type="button" class="heart ${extraClass}" data-fav="${esc(p.id)}" aria-pressed="${saved}" aria-label="Save ${esc(p.name)} to your shortlist">${ICONS.heart}</button>`;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// Keeps Tab and Shift+Tab inside an open panel. Returns a function that releases it.
export function trapFocus(container) {
  function onKey(e) {
    if (e.key !== "Tab") return;
    const items = $$(FOCUSABLE, container).filter(el => el.offsetParent !== null || el === document.activeElement);
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  container.addEventListener("keydown", onKey);
  return () => container.removeEventListener("keydown", onKey);
}

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

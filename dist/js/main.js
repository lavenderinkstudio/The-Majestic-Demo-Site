/* Shared by every page: header states, the mobile menu, the shortlist badge and hearts,
   the concierge launcher, photo upgrades and the motion bootstrap. */

import { $, $$ } from "./lib/ui.js";
import { getShortlist, toggleSaved, onShortlistChange } from "./lib/favourites.js";
import { upgradeStaticImages } from "./lib/images.js";
import { initConcierge } from "./lib/concierge-ui.js";
import { initMotion } from "./motion.js";

const root = document.documentElement;

/* ---------- Header ---------- */

const header = $("[data-header]");
if (header) {
  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// Marks the current section in the nav. Residence pages belong to Residences.
const page = location.pathname.split("/").pop() || "index.html";
const section = page === "residence.html" ? "residences.html" : page;
$$(".nav a, .menu__links a").forEach(a => {
  if (a.getAttribute("href") === section) a.setAttribute("aria-current", "page");
});
$$('a[href="shortlist.html"]').forEach(a => { if (page === "shortlist.html") a.setAttribute("aria-current", "page"); });

// "Book a viewing" goes to this page's own enquiry form when it has one
$$("[data-book-viewing]").forEach(a => { if ($("#enquire")) a.setAttribute("href", "#enquire"); });

/* ---------- Mobile menu ---------- */

const menu = $("[data-menu]");
const burger = $("[data-menu-open]");
if (menu && burger) {
  burger.addEventListener("click", () => {
    menu.showModal();
    burger.setAttribute("aria-expanded", "true");
  });
  menu.addEventListener("close", () => {
    burger.setAttribute("aria-expanded", "false");
    burger.focus();
  });
  $$("[data-menu-close]", menu).forEach(b => b.addEventListener("click", () => menu.close()));
  // Links to a part of this page close the menu as they go
  $$("a", menu).forEach(a => a.addEventListener("click", () => menu.close()));
  window.matchMedia("(min-width: 1100px)").addEventListener("change", e => { if (e.matches && menu.open) menu.close(); });
}

/* ---------- Shortlist ---------- */

const announcer = document.createElement("p");
announcer.className = "visually-hidden";
announcer.setAttribute("aria-live", "polite");
document.body.appendChild(announcer);

function announce(text) {
  announcer.textContent = "";
  requestAnimationFrame(() => { announcer.textContent = text; });
}

function syncShortlist(ids) {
  const n = ids.length;
  $$("[data-shortlist-count]").forEach(el => {
    el.textContent = n ? String(n) : "";
    el.dataset.count = String(n);
  });
  $$("[data-shortlist-link]").forEach(a => a.setAttribute("aria-label", `Shortlist, ${n} saved`));
  $$("[data-fav]").forEach(btn => btn.setAttribute("aria-pressed", String(ids.includes(btn.dataset.fav))));
}
syncShortlist(getShortlist());
onShortlistChange(syncShortlist);

// One listener serves every heart, including ones rendered later
document.addEventListener("click", e => {
  const btn = e.target.closest("[data-fav]");
  if (!btn) return;
  e.preventDefault();
  const saved = toggleSaved(btn.dataset.fav);
  const name = (btn.getAttribute("aria-label") || "").replace(/^Save | to your shortlist$/g, "");
  btn.classList.remove("is-popping");
  if (saved) requestAnimationFrame(() => btn.classList.add("is-popping"));
  announce(saved ? `${name} saved to your shortlist.` : `${name} removed from your shortlist.`);
});

/* ---------- Page transitions ---------- */

// The clicked residence image morphs into the detail page's hero (browsers with
// cross-document view transitions; others simply navigate)
document.addEventListener("click", e => {
  const link = e.target.closest('a[href^="residence.html?id="]');
  if (!link || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const scope = link.closest("[data-vt-scope]") || link.closest("article, li");
  const img = scope && scope.querySelector("img");
  if (img) img.style.viewTransitionName = "residence-hero";
});
// Coming back via bfcache, the old name must not linger
window.addEventListener("pageshow", () => {
  $$("img").forEach(img => { if (img.style.viewTransitionName) img.style.viewTransitionName = ""; });
});

/* ---------- Concierge, photos, motion ---------- */

initConcierge();
upgradeStaticImages();

// Page scripts render their content before DOMContentLoaded, so motion sees all of it
document.addEventListener("DOMContentLoaded", () => {
  upgradeStaticImages();
  initMotion();
});

export { announce, root };

/* Home: the featured slider, the hero search, the concierge prompt and the enquiry form. */

import { PROPERTIES, regionLabel } from "../data/properties.js";
import { picture } from "../lib/images.js";
import { formatPrice, formatSqft } from "../lib/format.js";
import { initForm } from "../lib/forms.js";
import { openConcierge } from "../lib/concierge-ui.js";
import { $, $$, esc, heartButton } from "../lib/ui.js";

/* ---------- Featured residences: one at a time, looping ---------- */

const featured = PROPERTIES.filter(p => p.featured);
const stage = $("[data-featured]");

function feature(p, i) {
  const href = `residence.html?id=${esc(p.id)}`;
  return `<article class="feature${i === 0 ? " is-active" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${featured.length}: ${esc(p.name)}" data-vt-scope>
    <a class="feature__media" href="${href}" tabindex="-1" aria-hidden="true">${picture(p.images[0].slot, { alt: "", sizes: "(min-width: 900px) 64vw, 100vw" })}</a>
    <div class="feature__text">
      <p class="feature__no">No. ${esc(p.no)} · ${esc(p.locality)}, ${esc(p.city)}</p>
      <h3 class="feature__name">${esc(p.name)}</h3>
      <p>${esc(p.tagline)}</p>
      <dl class="feature__facts">
        <div><dt>Price</dt><dd>${esc(formatPrice(p))}</dd></div>
        <div><dt>Bedrooms</dt><dd>${p.beds}</dd></div>
        <div><dt>Built-up</dt><dd>${formatSqft(p.builtUpSqft)}</dd></div>
        <div><dt>Setting</dt><dd>${esc(regionLabel(p.region))}</dd></div>
      </dl>
      <div class="feature__actions">
        <a class="pill pill--fill" href="${href}">View residence</a>
        ${heartButton(p)}
      </div>
    </div>
  </article>`;
}

if (stage) {
  stage.innerHTML = featured.map(feature).join("");
  const slides = $$(".feature", stage);
  const count = $("[data-feat-count]");
  const bar = $(".featured__bar span");
  let current = 0;
  let leaveTimer = 0;

  const show = n => {
    const next = (n + slides.length) % slides.length;
    if (next === current) return;
    const prev = slides[current];
    clearTimeout(leaveTimer);
    slides.forEach(s => s.classList.remove("is-leaving"));
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    slides[next].classList.add("is-active");
    leaveTimer = setTimeout(() => prev.classList.remove("is-leaving"), 1200);
    current = next;
    count.textContent = `${String(next + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    bar.style.setProperty("--p", (next + 1) / slides.length);
  };
  bar.style.setProperty("--p", 1 / slides.length);
  $("[data-feat-prev]").addEventListener("click", () => show(current - 1));
  $("[data-feat-next]").addEventListener("click", () => show(current + 1));

  // Swipe on touch screens
  let x0 = null;
  stage.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

/* ---------- Hero search: drop empty choices from the address ---------- */

const search = $("[data-search]");
if (search) {
  search.addEventListener("submit", e => {
    e.preventDefault();
    const q = new URLSearchParams();
    new FormData(search).forEach((v, k) => { if (v) q.set(k, v); });
    location.href = "residences.html" + (q.toString() ? "?" + q : "");
  });
}

/* ---------- Concierge prompt ---------- */

const prompt = $("[data-prompt]");
if (prompt) {
  prompt.addEventListener("submit", e => {
    e.preventDefault();
    const input = prompt.querySelector("input");
    const text = input.value.trim();
    openConcierge(text);
    input.value = "";
  });
}

/* ---------- Forms ---------- */

$$('[data-form="general"]').forEach(form => initForm(form));

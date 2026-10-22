/* One template for every residence: residence.html?id=<slug>.
   Everything on the page comes from data/properties.js. */

import { PROPERTIES, getProperty, regionLabel } from "../data/properties.js";
import { getAgent } from "../data/agents.js";
import { picture } from "../lib/images.js";
import { formatPrice, formatSqft, formatLand } from "../lib/format.js";
import { createSlider } from "../lib/slider.js";
import { initForm } from "../lib/forms.js";
import { createMap, homeMarker, placeMarker } from "../lib/map.js";
import { card } from "../lib/cards.js";
import { $, $$, esc, ICONS, heartButton } from "../lib/ui.js";

const main = $("[data-detail]");
const id = new URLSearchParams(location.search).get("id");
const p = getProperty(id);

function setMeta(title, description) {
  document.title = title;
  const meta = (sel, value) => { const el = $(sel); if (el) el.setAttribute("content", value); };
  meta('meta[name="description"]', description);
  meta('meta[property="og:title"]', title);
  meta('meta[property="og:description"]', description);
}

/* ---------- Not found ---------- */

function notFound() {
  setMeta("Residence not found | The Majestic", "This residence isn't in the collection.");
  main.innerHTML = `<div class="wrap not-found-state">
    <span class="label">(Not found)</span>
    <h1 class="h2">We couldn't find <em>that residence.</em></h1>
    <p class="lede">It may have been sold privately, or the link may be incomplete. The rest of the collection is a click away.</p>
    <div class="empty__actions">
      <a class="pill pill--fill" href="residences.html">See all residences</a>
      <button class="pill pill--outline" type="button" data-concierge-open>Ask the Concierge</button>
    </div>
  </div>`;
}

/* ---------- Similar residences ---------- */

// Same region and type count most, then shared lifestyle, then how close the price is
function similar(base, n = 3) {
  return PROPERTIES.filter(x => x.id !== base.id)
    .map(x => {
      const shared = x.lifestyle.filter(l => base.lifestyle.includes(l)).length;
      const price = 1 - Math.min(1, Math.abs(Math.log(x.price / base.price)) / Math.log(10));
      return { x, s: (x.region === base.region ? 3 : 0) + (x.type === base.type ? 2 : 0) + shared * 0.6 + price * 2 };
    })
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(r => r.x);
}

/* ---------- Page ---------- */

function facts() {
  const land = p.landSqft
    ? ["Land", formatLand(p.landSqft)]
    : p.specs.Terrace ? ["Terrace", p.specs.Terrace] : ["Garden", p.specs.Garden || "None"];
  const year = p.year < 1900 ? ["Built", (p.year < 1800 ? "c. " : "") + p.year] : [p.year < 2000 ? "Built" : "Completed", String(p.year)];
  return [
    ["Price", formatPrice(p)],
    ["Bedrooms", String(p.beds)],
    ["Bathrooms", String(p.baths)],
    ["Built-up", formatSqft(p.builtUpSqft)],
    land,
    year
  ].map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("");
}

function enquiryForm() {
  return `<form class="form" data-form="residence" novalidate>
    <div class="field"><label for="q-name">Full name</label><input id="q-name" name="name" autocomplete="name" required data-label="your name"></div>
    <div class="field"><label for="q-email">Email</label><input id="q-email" name="email" type="email" autocomplete="email" required data-label="your email address"></div>
    <div class="field"><label for="q-mobile">Mobile</label><input id="q-mobile" name="mobile" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91 98200 12345" required data-validate="mobile" data-label="your mobile number"></div>
    <fieldset>
      <legend>Preferred contact</legend>
      <div class="radio-row">
        <input type="radio" id="q-c-phone" name="contact" value="Phone" checked><label for="q-c-phone">Phone</label>
        <input type="radio" id="q-c-whatsapp" name="contact" value="WhatsApp"><label for="q-c-whatsapp">WhatsApp</label>
        <input type="radio" id="q-c-email" name="contact" value="Email"><label for="q-c-email">Email</label>
      </div>
    </fieldset>
    <div class="field"><label for="q-date">Preferred viewing date</label><input id="q-date" name="date" type="date" required data-validate="future-date" data-label="a viewing date"></div>
    <div class="field"><label for="q-message">Message (optional)</label><textarea id="q-message" name="message" rows="3">I'd like to arrange a private viewing of ${esc(p.name)}.</textarea></div>
    <div class="hp" aria-hidden="true"><label for="q-website">Leave this empty</label><input id="q-website" name="website" tabindex="-1" autocomplete="off"></div>
    <div class="check"><input type="checkbox" id="q-consent" name="consent" required data-msg="Please tick this box so we can arrange the viewing."><label for="q-consent">I agree to be contacted about this residence.</label></div>
    <button class="pill pill--fill pill--block" type="submit">Request a viewing</button>
    <p class="form__note">Concept site: nothing is actually sent.</p>
  </form>`;
}

function render() {
  const agent = getAgent(p.agentId);
  const i = PROPERTIES.indexOf(p);
  const prev = PROPERTIES[(i - 1 + PROPERTIES.length) % PROPERTIES.length];
  const next = PROPERTIES[(i + 1) % PROPERTIES.length];
  setMeta(`${p.name}, ${p.city} | The Majestic`, `${p.typeLabel} in ${p.locality}, ${p.city}. ${p.tagline}`);

  main.innerHTML = `
  <section class="gallery" data-slider aria-label="Photographs of ${esc(p.name)}">
    <div class="gallery__frame">
      <div class="slider__track" aria-label="Photos, use the arrow keys to move between them">
        ${p.images.map((im, n) => `<figure class="slider__slide">${picture(im.slot, { alt: im.alt, eager: n === 0, sizes: "100vw", width: 2400 })}</figure>`).join("")}
      </div>
      <div class="gallery__shade" aria-hidden="true"></div>
      <div class="gallery__title">
        <ol class="crumbs"><li><a href="residences.html">Residences</a></li><li><a href="residences.html?region=${esc(p.region)}">${esc(regionLabel(p.region))}</a></li></ol>
        <h1 data-reveal="lines">${esc(p.name)}</h1>
        <p class="gallery__where">No. ${esc(p.no)} · ${esc(p.locality)}, ${esc(p.city)} · ${esc(p.state)}</p>
      </div>
      <div class="gallery__controls">
        <span class="gallery__count" data-slider-count aria-live="polite"></span>
        <button class="round-btn" type="button" data-slider-prev aria-label="Previous photo">${ICONS.arrowLeft}</button>
        <button class="round-btn" type="button" data-slider-next aria-label="Next photo">${ICONS.arrowRight}</button>
        <button class="round-btn" type="button" data-lightbox-open aria-label="View photos full screen">${ICONS.expand}</button>
        ${heartButton(p)}
      </div>
    </div>
    <div class="thumbs" role="group" aria-label="Choose a photo">
      ${p.images.map((im, n) => `<button type="button" data-slider-thumb aria-label="Photo ${n + 1}: ${esc(im.alt)}">${picture(im.slot, { alt: "", sizes: "112px", width: 800 })}</button>`).join("")}
    </div>
  </section>

  <div class="wrap">
    <dl class="facts-strip" data-reveal="stagger">${facts()}</dl>

    <div class="detail">
      <div class="detail__main">
        <section class="detail__block" aria-labelledby="story-title">
          <span class="label">(The house)</span>
          <h2 class="h3" id="story-title">${esc(p.tagline)}</h2>
          <div class="prose">${p.story.map(s => `<p>${esc(s)}</p>`).join("")}</div>
        </section>

        <section class="detail__block" aria-labelledby="highlights-title">
          <span class="label" id="highlights-title">(Highlights)</span>
          <ol class="highlights">${p.highlights.map(h => `<li>${esc(h)}</li>`).join("")}</ol>
        </section>

        <section class="detail__block" aria-labelledby="specs-title">
          <span class="label" id="specs-title">(Specifications)</span>
          <dl class="specs">
            <div><dt>Type</dt><dd>${esc(p.typeLabel)}</dd></div>
            ${Object.entries(p.specs).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          </dl>
        </section>

        <section class="detail__block" aria-labelledby="amenities-title">
          <span class="label" id="amenities-title">(Amenities)</span>
          <ul class="chips">${p.amenities.map(a => `<li class="chip chip--static">${esc(a)}</li>`).join("")}</ul>
        </section>

        <section class="detail__block locality" aria-labelledby="locality-title">
          <span class="label">(Locality)</span>
          <h2 class="h3" id="locality-title">In and around ${esc(p.locality)}</h2>
          <div class="locality__map map" data-locality-map role="region" aria-label="Map of ${esc(p.name)} and nearby places"></div>
          <ul class="nearby">${p.nearby.map(n => `<li>${esc(n.name)}<span>${esc(n.time)}</span></li>`).join("")}</ul>
        </section>

        ${agent ? `<section class="adviser" aria-labelledby="adviser-title">
          <div class="frame">${picture(agent.slot, { alt: `Portrait of ${agent.name}`, sizes: "96px", width: 800 })}</div>
          <div>
            <p class="label">(Your adviser)</p>
            <h2 id="adviser-title">${esc(agent.name)}</h2>
            <p class="adviser__role">${esc(agent.role)}</p>
            <p class="adviser__links"><a href="tel:${esc(agent.phone.replace(/\s/g, ""))}">${esc(agent.phone)}</a><a href="mailto:${esc(agent.email)}">Email ${esc(agent.name.split(" ")[0])}</a></p>
          </div>
        </section>` : ""}
      </div>

      <aside class="detail__aside" id="enquire" aria-labelledby="enquire-title">
        <div class="enquiry-card">
          <div class="enquiry-card__head">
            <div>
              <p class="label" id="enquire-title">(Private viewing)</p>
              <p class="enquiry-card__price">${esc(formatPrice(p))}</p>
            </div>
            ${heartButton(p)}
          </div>
          ${enquiryForm()}
        </div>
      </aside>
    </div>
  </div>

  <section class="similar" aria-labelledby="similar-title">
    <div class="wrap">
      <div class="section__head section__head--split">
        <div>
          <span class="label">(Similar residences)</span>
          <h2 class="h2" id="similar-title" data-reveal="lines">In the same <em>spirit</em></h2>
        </div>
        <a class="text-link" href="residences.html">All residences ${ICONS.arrowRight}</a>
      </div>
      <div class="card-grid card-grid--3">${similar(p).map(x => card(x)).join("")}</div>
    </div>
  </section>

  <nav class="wrap pager" aria-label="More residences">
    <a href="residence.html?id=${esc(prev.id)}"><span>Previous</span><strong>${esc(prev.name)}</strong></a>
    <a href="residence.html?id=${esc(next.id)}"><span>Next</span><strong>${esc(next.name)}</strong></a>
  </nav>

  <div class="enquire-bar" data-enquire-bar>
    <p class="enquire-bar__price"><span>${esc(p.name)}</span>${esc(formatPrice(p))}</p>
    ${heartButton(p)}
    <a class="pill pill--fill pill--small" href="#enquire">Arrange a viewing</a>
  </div>`;

  // The first photo is the one the residence card morphs into
  const first = $(".slider__slide img", main);
  if (first) first.style.viewTransitionName = "residence-hero";

  const slider = createSlider($("[data-slider]", main));
  lightbox(slider);
  initForm($('[data-form="residence"]', main), {
    onSuccess: data => ({
      title: `Thank you${data.name ? ", " + data.name.trim().split(/\s+/)[0] : ""}.`,
      body: `${getAgent(p.agentId).name.split(" ")[0]} would call you to confirm a viewing of ${p.name}. This is a concept site, so nothing was actually sent.`
    })
  });
  localityMap();
  enquireBar();
}

/* ---------- Lightbox ---------- */

function lightbox(slider) {
  const box = $("[data-lightbox]");
  const stage = $("[data-lightbox-stage]", box);
  const caption = $("[data-lightbox-caption]", box);
  const countEl = $("[data-lightbox-count]", box);
  let n = 0;
  const show = i => {
    n = (i + p.images.length) % p.images.length;
    const im = p.images[n];
    stage.innerHTML = picture(im.slot, { alt: im.alt, sizes: "100vw", width: 2400, eager: true });
    caption.textContent = im.alt;
    countEl.textContent = `${n + 1} / ${p.images.length}`;
  };
  $("[data-lightbox-open]", main).addEventListener("click", () => {
    show(slider.index);
    box.showModal();
  });
  // Double-click (or double-tap) a photo to open it full screen
  $(".slider__track", main).addEventListener("dblclick", () => { show(slider.index); box.showModal(); });
  $("[data-lightbox-close]", box).addEventListener("click", () => box.close());
  $("[data-lightbox-prev]", box).addEventListener("click", () => show(n - 1));
  $("[data-lightbox-next]", box).addEventListener("click", () => show(n + 1));
  box.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(n - 1);
    if (e.key === "ArrowRight") show(n + 1);
  });
  box.addEventListener("close", () => slider.goTo(n));
}

/* ---------- Locality map ---------- */

function localityMap() {
  const el = $("[data-locality-map]", main);
  const ctx = createMap(el, {
    bounds: [p.coords, ...p.nearby.map(x => x.coords)],
    fit: { padding: [56, 56], maxZoom: 15 },
    scrollWheelZoom: false,
    onFail: () => {
      el.innerHTML = `<div class="map-fallback"><p class="label">(Map unavailable)</p><p>The map couldn't load here. ${esc(p.name)} is in ${esc(p.locality)}, ${esc(p.city)}; the places nearby are listed below.</p></div>`;
    }
  });
  if (!ctx) return;
  homeMarker(ctx, p);
  p.nearby.forEach(place => placeMarker(ctx, place));
}

/* ---------- Phones: the enquiry bar ---------- */

function enquireBar() {
  const bar = $("[data-enquire-bar]", main);
  const gallery = $(".gallery", main);
  const aside = $("#enquire", main);
  const seen = { gallery: true, aside: false };
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { seen[e.target === gallery ? "gallery" : "aside"] = e.isIntersecting; });
    bar.classList.toggle("is-shown", !seen.gallery && !seen.aside);
  });
  io.observe(gallery);
  io.observe(aside);
}

if (p) render();
else notFound();

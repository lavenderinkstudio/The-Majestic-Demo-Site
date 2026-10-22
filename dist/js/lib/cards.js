/* The residence card used for similar residences and the shortlist. */

import { picture } from "./images.js";
import { formatPrice, formatSqft } from "./format.js";
import { esc, heartButton } from "./ui.js";

export function card(p, { sizes = "(min-width: 1100px) 30vw, (min-width: 700px) 45vw, 100vw", extra = "", heart = true } = {}) {
  return `<article class="card" data-vt-scope>
    <div class="card__media">
      <div class="frame">${picture(p.images[0].slot, { alt: "", sizes })}</div>
      ${heart ? heartButton(p) : ""}
    </div>
    <p class="card__meta">No. ${esc(p.no)} · ${esc(p.locality)}, ${esc(p.city)}</p>
    <h3 class="card__title"><a href="residence.html?id=${esc(p.id)}">${esc(p.name)}</a></h3>
    <p class="card__facts"><span>${esc(p.typeLabel)}</span><span>${p.beds} bedrooms</span><span>${formatSqft(p.builtUpSqft)}</span></p>
    <p class="card__price">${esc(formatPrice(p))}</p>
    ${extra}
  </article>`;
}

/* Builds the image for a photo slot.
   tools/process-photos.sh lists each processed slot, with its widths, in data/photos.js.
   A listed slot gets an AVIF/JPEG <picture>; any other slot shows its dark placeholder. */

import { PHOTOS } from "../data/photos.js";
import { esc } from "./ui.js";

// Resolved from this file, so it works from pages at any depth (such as the 404 page)
const BASE = new URL("../../images/", import.meta.url).href;

export function hasPhoto(slot) {
  return Array.isArray(PHOTOS[slot]) && PHOTOS[slot].length > 0;
}

export function placeholderSrc(slot) {
  return BASE + "placeholders/" + encodeURIComponent(slot) + ".svg";
}

export function photoSrc(slot, width) {
  const widths = PHOTOS[slot] || [];
  const w = widths.find(n => n >= width) || widths[widths.length - 1];
  return w ? BASE + slot + "-" + w + ".jpg" : placeholderSrc(slot);
}

function srcset(slot, ext) {
  return PHOTOS[slot].map(w => `${BASE}${slot}-${w}.${ext} ${w}w`).join(", ");
}

export function picture(slot, opts = {}) {
  const { alt = "", sizes = "100vw", cls = "", eager = false, width = 1600 } = opts;
  const loading = eager ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const classAttr = cls ? ` class="${esc(cls)}"` : "";
  if (!hasPhoto(slot)) {
    return `<img${classAttr} src="${placeholderSrc(slot)}" alt="${esc(alt)}" width="1600" height="1067" ${loading} decoding="async" data-slot="${esc(slot)}">`;
  }
  return `<picture><source type="image/avif" srcset="${srcset(slot, "avif")}" sizes="${esc(sizes)}">` +
    `<img${classAttr} src="${photoSrc(slot, width)}" srcset="${srcset(slot, "jpg")}" sizes="${esc(sizes)}" alt="${esc(alt)}" width="1600" height="1067" ${loading} decoding="async" data-slot="${esc(slot)}"></picture>`;
}

// Static pages write placeholder <img data-slot> tags; this swaps in real photos once they exist
export function upgradeStaticImages(root = document) {
  root.querySelectorAll("img[data-slot]").forEach(img => {
    const slot = img.dataset.slot;
    if (!hasPhoto(slot) || img.closest("picture")) return;
    const tmp = document.createElement("div");
    tmp.innerHTML = picture(slot, {
      alt: img.alt,
      sizes: img.getAttribute("sizes") || "100vw",
      cls: img.className,
      eager: img.loading === "eager"
    });
    img.replaceWith(tmp.firstChild);
  });
}

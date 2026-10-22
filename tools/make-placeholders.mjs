// Writes a dark tonal placeholder SVG for every photo slot into images/placeholders/.
// Each one is kohl-to-ebony with a warm glow, a faint jaali lattice and the slot name,
// so the site looks finished until real photos are processed.
//   node tools/make-placeholders.mjs

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PROPERTIES } from "../js/data/properties.js";
import { AGENTS } from "../js/data/agents.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "images", "placeholders");
mkdirSync(OUT, { recursive: true });

export const SLOTS = [
  "home-hero", "home-house",
  "destination-coast", "destination-heritage", "destination-hills", "destination-city",
  "principles", "concierge", "agency-hero", "valuation-hero",
  ...PROPERTIES.flatMap(p => p.images.map(i => i.slot)),
  ...AGENTS.map(a => a.slot)
];

// Small stable hash so each slot gets its own glow position
function hash(s) {
  let h = 2166136261;
  for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

function svg(slot) {
  const h = hash(slot);
  const gx = 25 + (h % 50);
  const gy = 20 + ((h >> 8) % 45);
  const angle = (h >> 16) % 2 ? "0 0 1 1" : "1 0 0 1";
  const [x1, y1, x2, y2] = angle.split(" ");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1067" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="g" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">
      <stop offset="0" stop-color="#211E1A"/>
      <stop offset="1" stop-color="#12110F"/>
    </linearGradient>
    <radialGradient id="glow" cx="${gx}%" cy="${gy}%" r="60%">
      <stop offset="0" stop-color="#B39364" stop-opacity=".2"/>
      <stop offset=".5" stop-color="#B39364" stop-opacity=".05"/>
      <stop offset="1" stop-color="#B39364" stop-opacity="0"/>
    </radialGradient>
    <pattern id="jaali" width="64" height="64" patternUnits="userSpaceOnUse">
      <path d="M32 4c5 12 15 23 28 28-13 5-23 16-28 28-5-12-15-23-28-28C17 27 27 16 32 4z" fill="none" stroke="#E8DFD2" stroke-opacity=".05"/>
      <circle cx="32" cy="32" r="5" fill="none" stroke="#E8DFD2" stroke-opacity=".05"/>
    </pattern>
    <radialGradient id="fade" cx="50%" cy="45%" r="70%">
      <stop offset="0" stop-color="#fff"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <mask id="m"><rect width="1600" height="1067" fill="url(#fade)"/></mask>
  </defs>
  <rect width="1600" height="1067" fill="url(#g)"/>
  <rect width="1600" height="1067" fill="url(#glow)"/>
  <rect width="1600" height="1067" fill="url(#jaali)" mask="url(#m)"/>
  <text x="800" y="560" text-anchor="middle" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="15" letter-spacing="5" fill="#E8DFD2" fill-opacity=".3">PHOTO · ${slot.toUpperCase()}</text>
</svg>
`;
}

for (const slot of SLOTS) writeFileSync(join(OUT, slot + ".svg"), svg(slot));
console.log(`Wrote ${SLOTS.length} placeholders to images/placeholders/`);

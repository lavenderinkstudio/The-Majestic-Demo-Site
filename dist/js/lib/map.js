/* Leaflet maps on Esri's World Dark Gray canvas (no key needed), warmed with a CSS
   filter (see .map in styles.css).
   Leaflet is loaded from cdnjs by each page that has a map. If it or the tiles are
   blocked, onFail runs so the page can show its plain list of places instead. */

import { esc } from "./ui.js";
import { formatPrice } from "./format.js";

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/";
const BASE = ESRI + "World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const LABELS = ESRI + "World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}";
const ATTRIBUTION = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const TILE_TIMEOUT = 8000;

export function leafletReady() {
  return typeof window.L === "object" && typeof window.L.map === "function";
}

// bounds: [[lat, lng], ...] to frame from the start, so no tiles load at a throwaway zoom
export function createMap(el, { center = [22.5, 78.5], zoom = 5, bounds, fit = {}, scrollWheelZoom = false, onFail } = {}) {
  if (!leafletReady()) {
    if (onFail) onFail("leaflet");
    return null;
  }
  const L = window.L;
  const map = L.map(el, {
    scrollWheelZoom,
    zoomControl: false,
    attributionControl: true,
    dragging: !L.Browser.mobile,
    tap: false
  });
  if (bounds && bounds.length) map.fitBounds(L.latLngBounds(bounds), fit);
  else map.setView(center, zoom);
  L.control.zoom({ position: "bottomright" }).addTo(map);
  map.attributionControl.setPrefix(false);

  let loaded = 0;
  let failed = 0;
  let gaveUp = false;
  const fail = reason => {
    if (gaveUp || loaded) return;
    gaveUp = true;
    if (onFail) onFail(reason);
  };
  const layer = L.tileLayer(BASE, { attribution: ATTRIBUTION, maxNativeZoom: 16, maxZoom: 18 })
    .on("tileload", () => { loaded++; })
    .on("tileerror", () => { failed++; if (failed >= 6) fail("tiles"); })
    .addTo(map);
  L.tileLayer(LABELS, { maxNativeZoom: 16, maxZoom: 18 }).addTo(map);
  setTimeout(() => fail("timeout"), TILE_TIMEOUT);

  // On touch screens a swipe over the map keeps scrolling the page; a tap unlocks panning
  if (L.Browser.mobile) map.on("click", () => map.dragging.enable());

  return { map, layer, L };
}

// A brass price pill. Its element gets data-id so cards and markers can light each other up.
export function priceMarker(ctx, p, { onSelect } = {}) {
  const { L, map } = ctx;
  const label = p.priceOnRequest ? "On request" : formatPrice(p);
  const icon = L.divIcon({
    className: "pin",
    html: `<span class="pin__pill" data-pin="${esc(p.id)}">${esc(label)}</span>`,
    iconSize: null,
    iconAnchor: [0, 0]
  });
  const marker = L.marker(p.coords, { icon, keyboard: true, title: p.name, alt: p.name, riseOnHover: true }).addTo(map);
  if (onSelect) marker.on("click", () => onSelect(p, marker));
  return marker;
}

// A small brass dot for places near a residence
export function placeMarker(ctx, place) {
  const { L, map } = ctx;
  const icon = L.divIcon({ className: "pin", html: `<span class="pin__dot" aria-hidden="true"></span>`, iconSize: null, iconAnchor: [0, 0] });
  return L.marker(place.coords, { icon, keyboard: false, title: place.name })
    .bindTooltip(`${esc(place.name)}<span>${esc(place.time)}</span>`, { direction: "top", offset: [0, -10], className: "pin-tip" })
    .addTo(map);
}

export function homeMarker(ctx, p) {
  const { L, map } = ctx;
  const icon = L.divIcon({ className: "pin", html: `<span class="pin__home">${esc(p.name)}</span>`, iconSize: null, iconAnchor: [0, 0] });
  return L.marker(p.coords, { icon, keyboard: false, title: p.name, zIndexOffset: 1000 }).addTo(map);
}

/* Residence filters: pure functions, so they run in the browser and in Node tests.
   The state round-trips through the query string, which keeps shared links,
   back/forward and the home page search all pointing at the same results. */

export const SORTS = [
  { id: "featured", label: "Our selection" },
  { id: "price-desc", label: "Price, highest first" },
  { id: "price-asc", label: "Price, lowest first" },
  { id: "size-desc", label: "Largest first" }
];

export const BUDGET_STEPS = [5, 10, 15, 20, 30, 40, 50, 75, 100];
export const BED_STEPS = [3, 4, 5, 6];

export function defaultState() {
  return { region: [], type: "", min: null, max: null, beds: 0, life: [], sort: "featured", view: "list" };
}

function list(value) {
  return value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
}

function num(value) {
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function parseQuery(search) {
  const q = new URLSearchParams(search);
  const state = defaultState();
  state.region = list(q.get("region"));
  state.type = q.get("type") || "";
  state.min = num(q.get("min"));
  state.max = num(q.get("max"));
  state.beds = num(q.get("beds")) || 0;
  state.life = list(q.get("life"));
  if (SORTS.some(s => s.id === q.get("sort"))) state.sort = q.get("sort");
  if (q.get("view") === "map") state.view = "map";
  return state;
}

// Only non-default values go in the URL, in a fixed order
export function toQuery(state) {
  const q = new URLSearchParams();
  if (state.region.length) q.set("region", state.region.join(","));
  if (state.type) q.set("type", state.type);
  if (state.min) q.set("min", String(state.min));
  if (state.max) q.set("max", String(state.max));
  if (state.beds) q.set("beds", String(state.beds));
  if (state.life.length) q.set("life", state.life.join(","));
  if (state.sort !== "featured") q.set("sort", state.sort);
  if (state.view === "map") q.set("view", "map");
  const s = q.toString().replace(/%2C/g, ",");
  return s ? "?" + s : "";
}

// "Price on request" homes only appear when there is no upper limit.
// Their internal price still counts for the minimum and for sorting.
export function matches(p, state) {
  if (state.region.length && !state.region.includes(p.region)) return false;
  if (state.type && p.type !== state.type) return false;
  if (state.max && (p.priceOnRequest || p.price > state.max)) return false;
  if (state.min && p.price < state.min) return false;
  if (state.beds && p.beds < state.beds) return false;
  if (state.life.length && !state.life.every(l => p.lifestyle.includes(l))) return false;
  return true;
}

const sorters = {
  "featured": (a, b) => a.no.localeCompare(b.no),
  "price-desc": (a, b) => b.price - a.price,
  "price-asc": (a, b) => a.price - b.price,
  "size-desc": (a, b) => b.builtUpSqft - a.builtUpSqft
};

export function applyFilters(properties, state) {
  return properties.filter(p => matches(p, state)).sort(sorters[state.sort] || sorters.featured);
}

// How many filters are set (sort and view don't count)
export function countActive(state) {
  return state.region.length + state.life.length +
    (state.type ? 1 : 0) + (state.min ? 1 : 0) + (state.max ? 1 : 0) + (state.beds ? 1 : 0);
}

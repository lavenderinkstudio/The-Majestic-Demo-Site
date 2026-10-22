/* The concierge's local matcher, used whenever the AI endpoint isn't available.
   It reads budget, places, size and lifestyle from plain English, scores every
   residence and explains its top picks. Pure: no DOM, so it runs in Node tests. */

import { formatCrore } from "./format.js";

const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
const NUM = "(\\d+(?:\\.\\d+)?|" + Object.keys(WORDS).join("|") + ")";

function toNumber(s) {
  return WORDS[s] !== undefined ? WORDS[s] : parseFloat(s);
}

// Amounts default to crore; "lakh" / "L" divides by 100
function toCrore(n, unit) {
  return /^l/i.test(unit || "") ? n / 100 : n;
}

// Place names live in PLACE_WORDS; these are the words for a kind of place
const REGION_WORDS = {
  coast: ["beach", "coast", "coastal", "seaside", "shore", "waterfront"],
  heritage: ["heritage", "haveli", "historic", "history", "character", "colonial", "palace", "period home", "old house", "restored"],
  hills: ["hill", "hills", "mountain", "mountains", "cool climate", "cooler", "plantation", "coffee", "himalaya", "himalayan", "snow", "ghats"],
  city: ["city", "urban", "downtown", "metro"]
};

const PLACE_WORDS = {
  "saal-villa": ["alibaug", "awas", "konkan"],
  "casa-azulejo": ["goa", "assagao", "anjuna"],
  "malabar-residence": ["mumbai", "bombay", "malabar"],
  "amaltas-house": ["delhi", "golf links", "lutyens"],
  "jharokha-haveli": ["udaipur", "pichola", "rajasthan", "mewar"],
  "cardamom-hill-estate": ["coorg", "kodagu", "madikeri"],
  "deodar-house": ["kasauli", "himachal", "chandigarh"],
  "the-lavelle": ["bengaluru", "bangalore", "lavelle", "cubbon"]
};

const TYPE_WORDS = {
  villa: ["villa"],
  penthouse: ["penthouse", "apartment", "flat", "duplex", "high-rise", "high rise"],
  bungalow: ["bungalow", "cottage"],
  haveli: ["haveli"],
  estate: ["estate", "plantation", "farm", "acreage"],
  residence: ["garden residence", "garden apartment"]
};

const LIFESTYLE_WORDS = {
  "water-view": ["sea view", "sea-view", "sea facing", "sea-facing", "ocean", "lake", "water", "the sea", "by the sea", "sunset"],
  heritage: ["heritage", "history", "historic", "character", "old-world", "old world", "patina"],
  garden: ["garden", "lawn", "green", "trees", "orchard", "outdoor space"],
  pool: ["pool", "swim", "swimming"],
  weekend: ["weekend", "getaway", "second home", "holiday home", "escape", "retreat"],
  family: ["family", "kids", "children", "school", "parents"],
  entertaining: ["entertain", "entertaining", "parties", "party", "hosting", "host", "guests", "dinners", "weddings"],
  privacy: ["privacy", "private", "secluded", "quiet", "discreet", "gated"],
  wellness: ["wellness", "yoga", "spa", "calm", "peace", "peaceful", "meditation", "slow"],
  nature: ["nature", "forest", "walks", "walking", "birds", "wildlife", "mist", "fresh air"],
  work: ["work from home", "wfh", "remote work", "office", "study", "studio", "writing"],
  city: ["nightlife", "restaurants", "culture", "walkable", "central", "city life"]
};

// How a matched lifestyle reads in a residence's reason line
const FEATURE = {
  "water-view": "water views", heritage: "real history", garden: "a garden", pool: "a pool",
  weekend: "made for weekends", family: "room for a family", entertaining: "built for entertaining",
  privacy: "great privacy", wellness: "a slower pace", nature: "nature on the doorstep",
  work: "room to work", city: "the city on the doorstep"
};

// How a wanted lifestyle reads in the reply's summary of the request
const WANT = {
  "water-view": "with water views", heritage: "with real history", garden: "with a garden", pool: "with a pool",
  weekend: "for weekends", family: "for family life", entertaining: "for entertaining", privacy: "with privacy",
  wellness: "for a slower pace", nature: "close to nature", work: "with room to work", city: "for city life"
};

const REGION_PHRASE = { coast: "on the coast", heritage: "with heritage", hills: "in the hills", city: "in the city" };

function has(text, word) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("(^|[^a-z])" + escaped + "s?($|[^a-z])", "i").test(text);
}

function anyOf(text, words) {
  return words.some(w => has(text, w));
}

function emptyRequest() {
  return { budgetMin: null, budgetMax: null, regions: [], places: [], types: [], beds: null, lifestyles: [], shortlist: false, softCoast: false };
}

export function parseRequest(raw) {
  const text = " " + String(raw || "").toLowerCase().replace(/₹/g, " ₹").replace(/\s+/g, " ") + " ";
  const out = emptyRequest();
  const money = `(?:₹|rs\\.?|inr)?\\s*${NUM}\\s*(?:(crores?|cr|c|lakhs?|lacs?|l)(?![a-z]))?`;

  let m = text.match(new RegExp(`${money}\\s*(?:-|–|to|and)\\s*${money}`));
  if (m && (m[2] || m[4])) {
    out.budgetMin = toCrore(toNumber(m[1]), m[2] || m[4]);
    out.budgetMax = toCrore(toNumber(m[3]), m[4] || m[2]);
  } else if ((m = text.match(new RegExp(`(?:under|below|less than|up to|upto|within|max(?:imum)?|no more than|not more than|budget of|budget is|budget)\\s*${money}`)))) {
    out.budgetMax = toCrore(toNumber(m[1]), m[2]);
  } else if ((m = text.match(new RegExp(`(?:over|above|more than|at least|minimum|from)\\s*${money}`))) && m[2]) {
    out.budgetMin = toCrore(toNumber(m[1]), m[2]);
  } else if ((m = text.match(new RegExp(`(?:around|about|roughly|approximately|near|~)\\s*${money}`))) && (m[2] || /₹/.test(m[0]))) {
    const n = toCrore(toNumber(m[1]), m[2]);
    out.budgetMin = n * 0.75;
    out.budgetMax = n * 1.2;
  } else if ((m = text.match(/(?:₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?|l)?|(\d+(?:\.\d+)?)\s*(crores?|cr|lakhs?|lacs?)\b/))) {
    // A bare figure such as "₹30 Cr" is read as a ceiling with a little headroom
    out.budgetMax = toCrore(parseFloat(m[1] || m[3]), m[2] || m[4]) * 1.1;
  }

  const beds = text.match(new RegExp(`${NUM}\\s*(?:-|\\s)?(?:bed(?:room)?s?|bhk|br)\\b`));
  if (beds) out.beds = toNumber(beds[1]);
  const family = text.match(new RegExp(`family of ${NUM}`));
  if (family) {
    out.beds = Math.max(out.beds || 0, Math.max(3, toNumber(family[1]) - 1));
    out.lifestyles.push("family");
  }

  Object.entries(REGION_WORDS).forEach(([id, words]) => { if (anyOf(text, words)) out.regions.push(id); });
  Object.entries(PLACE_WORDS).forEach(([id, words]) => { if (anyOf(text, words)) out.places.push(id); });
  Object.entries(TYPE_WORDS).forEach(([id, words]) => { if (anyOf(text, words)) out.types.push(id); });
  Object.entries(LIFESTYLE_WORDS).forEach(([id, words]) => {
    if (anyOf(text, words) && !out.lifestyles.includes(id)) out.lifestyles.push(id);
  });
  // "sea" on its own leans towards the coast, though a city flat can face the sea too
  out.softCoast = /\bsea\b|\bocean\b/.test(text) && !out.regions.length;
  out.shortlist = /shortlist|saved|favourite|favorite|i liked/.test(text);
  return out;
}

export function signalCount(q) {
  return (q.budgetMin ? 1 : 0) + (q.budgetMax ? 1 : 0) + q.regions.length + q.places.length + q.types.length +
    (q.beds ? 1 : 0) + q.lifestyles.length + (q.softCoast ? 1 : 0);
}

// Later messages refine earlier ones: each dimension they mention replaces the old value
export function mergeRequests(list) {
  return list.reduce((acc, q) => {
    if (q.budgetMin || q.budgetMax) { acc.budgetMin = q.budgetMin; acc.budgetMax = q.budgetMax; }
    if (q.regions.length || q.places.length) { acc.regions = q.regions; acc.places = q.places; acc.softCoast = q.softCoast; }
    else if (q.softCoast) acc.softCoast = true;
    if (q.types.length) acc.types = q.types;
    if (q.beds) acc.beds = q.beds;
    q.lifestyles.forEach(l => { if (!acc.lifestyles.includes(l)) acc.lifestyles.push(l); });
    acc.shortlist = q.shortlist;
    return acc;
  }, emptyRequest());
}

function score(p, q, properties, { quietBudget = false } = {}) {
  let s = 0;
  let relevant = 0;
  let excluded = false;
  let overBudget = false;
  const tail = [];

  if (q.budgetMax) {
    if (p.priceOnRequest && q.budgetMax < 100) { excluded = overBudget = true; }
    else if (p.price <= q.budgetMax) { s += 3; if (!quietBudget) tail.push(`${p.priceOnRequest ? "price on request" : formatCrore(p.price)}, within budget`); }
    else if (p.price <= q.budgetMax * 1.15) { s += 0.5; tail.push(`${formatCrore(p.price)}, a touch over budget`); }
    else excluded = overBudget = true;
  }
  if (q.budgetMin && p.price < q.budgetMin * 0.9) excluded = true;

  // A named place scores highest; its neighbours in the same region come next
  const placeRegions = q.places.map(id => (properties.find(x => x.id === id) || {}).region);
  if (q.places.includes(p.id)) { s += 6; relevant++; }
  else if (q.regions.includes(p.region)) { s += 4; relevant++; }
  else if (placeRegions.includes(p.region)) { s += 2; relevant++; }
  else if (q.regions.length || q.places.length) s -= 6;
  if (q.softCoast && p.region === "coast") { s += 2; relevant++; }

  if (q.types.includes(p.type)) { s += 3; relevant++; }

  if (q.beds) {
    if (p.beds >= q.beds) { s += 2; relevant++; tail.unshift(`${p.beds} bedrooms`); }
    else if (p.beds === q.beds - 1) s -= 2;
    else excluded = true;
  }

  const shared = q.lifestyles.filter(l => p.lifestyle.includes(l));
  s += shared.length * 2;
  relevant += shared.length;

  // A whisper of a tie-break towards the houses we lead with
  if (p.featured) s += 0.2;

  const lead = p.typeLabel + " in " + p.city + (shared.length ? ": " + shared.slice(0, 2).map(l => FEATURE[l]).join(", ") : "");
  const reason = lead + "." + (tail.length ? " " + tail.join(", ").replace(/^./, c => c.toUpperCase()) + "." : "");
  return { p, s, relevant, excluded, overBudget, reason };
}

function describe(q, properties) {
  const bits = [];
  const cities = q.places.map(id => (properties.find(p => p.id === id) || {}).city).filter(Boolean);
  if (cities.length) bits.push("in or near " + cities.join(" or "));
  else if (q.regions.length) bits.push(q.regions.map(r => REGION_PHRASE[r]).join(" or "));
  if (q.beds) bits.push(`with ${q.beds} or more bedrooms`);
  if (q.budgetMax && q.budgetMin) bits.push(`between ${formatCrore(q.budgetMin)} and ${formatCrore(q.budgetMax)}`);
  else if (q.budgetMax) bits.push(`under ${formatCrore(q.budgetMax)}`);
  else if (q.budgetMin) bits.push(`over ${formatCrore(q.budgetMin)}`);
  const wants = q.lifestyles.filter(l => !(l === "heritage" && q.regions.includes("heritage")));
  if (wants.length) bits.push(wants.slice(0, 3).map(l => WANT[l]).join(", "));
  return bits.join(", ");
}

// What a shortlist says about someone's taste, as a request
function profileFromShortlist(ids, properties) {
  const saved = properties.filter(p => ids.includes(p.id));
  const tally = {};
  saved.forEach(p => p.lifestyle.forEach(l => { tally[l] = (tally[l] || 0) + 1; }));
  const lifestyles = Object.keys(tally).sort((a, b) => tally[b] - tally[a]).slice(0, 3);
  const top = Math.max(...saved.map(p => p.price));
  return { ...emptyRequest(), budgetMax: top * 1.3, lifestyles, shortlist: true };
}

const COUNT = ["", "One", "Two", "Three"];

/**
 * messages: the visitor's messages so far, oldest first (strings)
 * Returns { reply, picks: [{ id, reason }], followUp }
 */
export function recommend(messages, { properties, shortlist = [] }) {
  const recent = (Array.isArray(messages) ? messages : [messages]).slice(-4);
  const latest = parseRequest(recent[recent.length - 1] || "");
  let q = mergeRequests(recent.map(parseRequest));
  let intro = "";

  if (latest.shortlist) {
    if (!shortlist.length) {
      return {
        reply: "Your shortlist is empty for now. Tap the heart on any residence to save it, and I'll suggest others in the same spirit. Meanwhile, here are three we often begin with.",
        picks: properties.filter(p => p.featured).slice(0, 3).map(p => ({ id: p.id, reason: p.tagline }))
      };
    }
    q = profileFromShortlist(shortlist, properties);
    const names = properties.filter(p => shortlist.includes(p.id)).map(p => p.name);
    intro = `Your shortlist (${names.join(", ")}) leans towards ${q.lifestyles.slice(0, 2).map(l => WANT[l].replace(/^(for|with) /, "")).join(" and ")}. These share that spirit:`;
  } else if (signalCount(q) === 0) {
    return {
      reply: "Happy to help. Tell me a little more: is this a weekend house or a home for every day? Do you picture the sea, the hills, a city, or a house with history? A rough budget helps too.",
      picks: [],
      followUp: true
    };
  }

  const pool = latest.shortlist ? properties.filter(p => !shortlist.includes(p.id)) : properties;
  const opts = { quietBudget: latest.shortlist };
  const scored = pool.map(p => score(p, q, properties, opts)).sort((a, b) => b.s - a.s);
  // When the request says more than a budget, each pick must answer some of it
  const needsRelevance = signalCount({ ...q, budgetMin: null, budgetMax: null }) > 0;
  let fits = scored.filter(r => !r.excluded && r.s > 0 && (!needsRelevance || r.relevant > 0));
  let relaxed = false;
  if (!fits.length) {
    relaxed = true;
    fits = pool.map(p => score(p, { ...q, budgetMin: null, budgetMax: null, beds: null }, properties)).sort((a, b) => b.s - a.s);
  }
  const picks = fits.slice(0, 3).map(r => ({ id: r.p.id, reason: r.reason }));

  // The best match that the budget alone ruled out is worth a mention
  let nearMiss = "";
  if (!relaxed && q.budgetMax && needsRelevance) {
    const ideal = pool.map(p => score(p, { ...q, budgetMin: null, budgetMax: null }, properties)).filter(r => !r.excluded).sort((a, b) => b.s - a.s)[0];
    // Compared without the +3 a pick earns for fitting the budget
    const top = fits[0];
    if (ideal && !picks.some(x => x.id === ideal.p.id) && ideal.s > top.s - 3) {
      nearMiss = ` ${ideal.p.name} (${ideal.p.priceOnRequest ? "price on request" : formatCrore(ideal.p.price)}) would suit you well too, but sits above that budget.`;
    }
  }

  const wanted = describe(q, properties);
  let reply;
  if (intro) reply = intro;
  else if (relaxed) reply = `Nothing in the collection matches all of that${q.budgetMax ? ", and the budget is the tightest part" : ""}. These are the closest, and an adviser may know of homes that aren't listed.`;
  else reply = `${COUNT[picks.length]} ${picks.length === 1 ? "residence" : "residences"}${wanted ? " " + wanted : " to begin with"}:`;
  if (nearMiss) reply = reply.replace(/:$/, ".") + nearMiss;
  return { reply, picks };
}

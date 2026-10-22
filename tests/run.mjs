// Unit checks for the pure modules. Run from the-majestic/:  node tests/run.mjs
import assert from "node:assert/strict";
import { PROPERTIES } from "../js/data/properties.js";
import { getLocality } from "../js/data/localities.js";
import { estimate, roundCrore } from "../js/lib/valuation.js";
import { recommend, parseRequest } from "../js/lib/concierge-engine.js";
import { parseQuery, toQuery, applyFilters, countActive } from "../js/lib/filters.js";
import { formatCrore, formatNumber, formatLand } from "../js/lib/format.js";
import { normaliseMobile } from "../js/lib/forms.js";

let passed = 0;
const failures = [];
function check(name, fn) {
  try { fn(); passed++; } catch (e) { failures.push(`${name}\n    ${e.message.split("\n")[0]}`); }
}
const ids = r => r.picks.map(p => p.id);
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

/* ---------- Format ---------- */

check("Indian digit grouping", () => assert.equal(formatNumber(1829520), "18,29,520"));
check("crore precision", () => {
  assert.equal(formatCrore(38), "₹38 Cr");
  assert.equal(formatCrore(9.4), "₹9.4 Cr");
  assert.equal(formatCrore(9.45), "₹9.45 Cr");
  assert.equal(formatCrore(22.35), "₹22.4 Cr");
  assert.equal(formatCrore(160), "₹160 Cr");
  assert.equal(formatCrore(0.85), "₹85 L");
});
check("land in acres or sq ft", () => {
  assert.equal(formatLand(69700), "1.6 acres");
  assert.equal(formatLand(1829520), "42 acres");
  assert.equal(formatLand(19500), "19,500 sq ft");
});

/* ---------- Forms ---------- */

check("Indian mobile numbers", () => {
  assert.equal(normaliseMobile("+91 98200 12345"), "9820012345");
  assert.equal(normaliseMobile("098200-12345"), "9820012345");
  assert.equal(normaliseMobile("9820012345"), "9820012345");
  assert.equal(normaliseMobile("5820012345"), null); // must start 6–9
  assert.equal(normaliseMobile("98200 1234"), null);
});

/* ---------- Valuation (hand-worked) ---------- */

check("apartment in Bandra West", () => {
  // 3,200 × 65,000 = ₹20.8 Cr; age 5–15 ×0.95 = 19.76; balcony ×1.02 = 20.1552; + 1 space ₹45 L = 20.6052
  const r = estimate({ type: "apartment", area: 3200, age: "recent", view: "none", condition: "good", floor: "mid", parking: 1, outdoor: "balcony" }, getLocality("bandra-west"));
  near(r.lines[0].value, 20.8);
  near(r.mid, 20.6);
  near(r.low, roundCrore(20.6052 * 0.92));
  near(r.high, roundCrore(20.6052 * 1.08));
  assert.equal(r.perSqft, 64391);
});
check("heritage home keeps its age", () => {
  // 14,200 × 30,000 = 42.6; heritage ×1.12 = 47.712; age not marked down; water ×1.15 = 54.8688; renovated ×1.06 = 58.160928
  const r = estimate({ type: "heritage", area: 14200, age: "old", view: "water", condition: "renovated", floor: "low", parking: 2, outdoor: "terrace" }, getLocality("udaipur-lakeside"));
  const age = r.lines.find(l => l.label === "Age");
  assert.equal(age.factor, 1);
  assert.ok(!r.lines.some(l => l.label === "Floor"), "floor ignored for houses");
  assert.ok(!r.lines.some(l => l.label === "Parking"), "no parking premium where it is plentiful");
  near(r.mid, roundCrore(58.160928 * 1.06));
});
check("penthouse floor premium", () => {
  const r = estimate({ type: "penthouse", area: 9200, age: "new", view: "water", condition: "designer", floor: "top", parking: 4, outdoor: "terrace" }, getLocality("malabar-hill"));
  const floor = r.lines.find(l => l.label === "Floor");
  assert.equal(floor.factor, 1.09);
  assert.ok(r.mid > 150 && r.mid < 200, `got ${r.mid}`);
});
check("unusable input", () => {
  assert.equal(estimate({ area: "" }, getLocality("coorg")), null);
  assert.equal(estimate({ area: 1000 }, null), null);
});

/* ---------- Filters ---------- */

check("query round-trip", () => {
  const q = "?region=coast,hills&type=villa&min=10&max=40&beds=4&life=pool,garden&sort=price-desc&view=map";
  assert.equal(toQuery(parseQuery(q)), q);
  assert.equal(toQuery(parseQuery("")), "");
  assert.equal(toQuery(parseQuery("?region=&type=&max=")), "");
});
check("filter counts", () => {
  const run = q => applyFilters(PROPERTIES, parseQuery(q)).map(p => p.id);
  assert.equal(run("").length, 8);
  assert.deepEqual(run("?region=coast"), ["saal-villa", "casa-azulejo"]);
  assert.deepEqual(run("?region=heritage"), ["amaltas-house", "jharokha-haveli"]);
  assert.deepEqual(run("?max=20").sort(), ["cardamom-hill-estate", "deodar-house", "the-lavelle"].sort());
  assert.ok(!run("?max=100").includes("amaltas-house"), "price on request hidden once there's a maximum");
  assert.ok(run("?min=100").includes("amaltas-house"), "price on request counts for the minimum");
  assert.deepEqual(run("?beds=6"), ["saal-villa", "amaltas-house", "jharokha-haveli"]);
  assert.deepEqual(run("?life=water-view,pool"), ["saal-villa"]);
  assert.deepEqual(run("?region=city&sort=price-asc"), ["the-lavelle", "malabar-residence"]);
  assert.equal(run("?region=hills&type=penthouse").length, 0);
  assert.equal(countActive(parseQuery("?region=coast,city&beds=4&sort=price-asc")), 3);
});

/* ---------- Concierge engine ---------- */

const ask = (msgs, shortlist = []) => recommend(Array.isArray(msgs) ? msgs : [msgs], { properties: PROPERTIES, shortlist });
const cases = [
  ["Sea-facing weekend home", r => assert.equal(ids(r)[0], "saal-villa")],
  ["Heritage with character", r => assert.deepEqual(ids(r).sort(), ["amaltas-house", "jharokha-haveli"])],
  ["Under ₹20 Cr", r => assert.ok(ids(r).every(id => PROPERTIES.find(p => p.id === id).price <= 20))],
  ["For a family of five", r => assert.ok(ids(r).every(id => PROPERTIES.find(p => p.id === id).beds >= 4))],
  ["a 4 bedroom place in the hills under 15 crore", r => assert.deepEqual(ids(r), ["deodar-house"])],
  ["penthouse in mumbai", r => assert.equal(ids(r)[0], "malabar-residence")],
  ["a haveli on a lake in Udaipur", r => assert.equal(ids(r)[0], "jharokha-haveli")],
  ["coffee estate in coorg", r => assert.equal(ids(r)[0], "cardamom-hill-estate")],
  ["quiet garden home in bangalore near good schools", r => assert.equal(ids(r)[0], "the-lavelle")],
  ["somewhere cool in the mountains to write, under 15 cr", r => assert.equal(ids(r)[0], "deodar-house")],
  ["Goa, between 20 and 30 crore", r => assert.equal(ids(r)[0], "casa-azulejo")],
  ["Lutyens bungalow in Delhi", r => assert.equal(ids(r)[0], "amaltas-house")],
  ["something nice", r => { assert.equal(r.picks.length, 0); assert.ok(r.followUp); }],
  ["a 50 lakh flat", r => assert.match(r.reply, /Nothing in the collection/)],
  [["by the sea please", "under 25 crore"], r => { assert.equal(ids(r)[0], "casa-azulejo"); assert.match(r.reply, /Saal Villa/); }]
];
cases.forEach(([msg, test]) => check(`concierge: ${[].concat(msg).join(" → ")}`, () => test(ask(msg))));
check("concierge: shortlist taste", () => {
  const r = ask("Based on my shortlist", ["saal-villa", "casa-azulejo"]);
  assert.match(r.reply, /Saal Villa, Casa Azulejo/);
  assert.ok(!ids(r).includes("saal-villa") && !ids(r).includes("casa-azulejo"));
  assert.equal(r.picks.length, 3);
});
check("concierge: empty shortlist", () => assert.match(ask("Based on my shortlist").reply, /shortlist is empty/));
check("concierge: budget parsing", () => {
  assert.equal(parseRequest("under 20 crore").budgetMax, 20);
  assert.equal(parseRequest("below ₹15 Cr").budgetMax, 15);
  assert.equal(parseRequest("max 80 lakh").budgetMax, 0.8);
  assert.equal(parseRequest("over 50 cr").budgetMin, 50);
  near(parseRequest("₹30 Cr").budgetMax, 33);
});

console.log(`${passed} passed, ${failures.length} failed`);
failures.forEach(f => console.log("  ✗ " + f));
process.exit(failures.length ? 1 : 0);

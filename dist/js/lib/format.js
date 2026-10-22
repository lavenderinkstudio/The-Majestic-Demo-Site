/* Indian-style number and price formatting.
   1,25,000 grouping comes from the en-IN locale. Prices are stored in crore. */

const grouping = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
const ACRE = 43560;

export function formatNumber(n) {
  return grouping.format(Math.round(n));
}

// Trims to a sensible precision for the size: ₹9.45 Cr, ₹38.5 Cr, ₹160 Cr
export function formatCrore(cr) {
  if (!Number.isFinite(cr)) return "";
  if (cr < 1) return "₹" + formatNumber(cr * 100) + " L";
  const places = cr < 10 ? 2 : cr < 100 ? 1 : 0;
  const text = cr.toFixed(places).replace(/\.0+$|(\.\d*?)0+$/, "$1");
  return "₹" + text + " Cr";
}

export function formatPrice(p) {
  return p.priceOnRequest ? "Price on request" : formatCrore(p.price);
}

export function formatSqft(n) {
  return formatNumber(n) + " sq ft";
}

// Large plots read better in acres; small ones stay in sq ft
export function formatLand(sqft) {
  if (!sqft) return "";
  if (sqft >= ACRE * 0.5) {
    const acres = sqft / ACRE;
    return (acres >= 10 ? Math.round(acres) : acres.toFixed(1).replace(/\.0$/, "")) + " acres";
  }
  return formatSqft(sqft);
}

export function plural(n, one, many) {
  return n + " " + (n === 1 ? one : many || one + "s");
}

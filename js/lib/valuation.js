/* Valuation maths: pure, so it can be checked in Node.
   estimate = built-up area × locality rate × each adjustment, plus parking, ±8%.
   Indicative only, from fictional rates. */

export const ADJUSTMENTS = {
  type: {
    label: "Type",
    options: {
      apartment: { label: "Apartment", f: 1 },
      penthouse: { label: "Penthouse", f: 1.15 },
      villa: { label: "Villa", f: 1.05 },
      bungalow: { label: "Bungalow", f: 1.1 },
      heritage: { label: "Heritage home", f: 1.12 }
    }
  },
  age: {
    label: "Age",
    options: {
      new: { label: "Under 5 years", f: 1 },
      recent: { label: "5 to 15 years", f: 0.95 },
      mature: { label: "15 to 30 years", f: 0.89 },
      old: { label: "Over 30 years", f: 0.83 }
    }
  },
  view: {
    label: "View",
    options: {
      none: { label: "No particular view", f: 1 },
      garden: { label: "Garden or greenery", f: 1.04 },
      city: { label: "City skyline", f: 1.06 },
      water: { label: "Sea or lake", f: 1.15 }
    }
  },
  condition: {
    label: "Condition",
    options: {
      "needs-work": { label: "Needs work", f: 0.86 },
      good: { label: "Good", f: 1 },
      renovated: { label: "Recently renovated", f: 1.06 },
      designer: { label: "Architect-designed interiors", f: 1.12 }
    }
  },
  floor: {
    label: "Floor",
    options: {
      low: { label: "Floors 1 to 5", f: 0.96 },
      mid: { label: "Floors 6 to 15", f: 1 },
      high: { label: "Floors 16 to 30", f: 1.05 },
      top: { label: "Above the 30th floor", f: 1.09 }
    }
  },
  outdoor: {
    label: "Outdoor space",
    options: {
      none: { label: "None", f: 1 },
      balcony: { label: "Balcony", f: 1.02 },
      terrace: { label: "Private terrace", f: 1.06 },
      garden: { label: "Private garden", f: 1.08 }
    }
  }
};

export const RANGE = 0.08;
const STACKED = ["apartment", "penthouse"];

export function usesFloor(type) {
  return STACKED.includes(type);
}

// Rounds to a tidy figure: 0.05 Cr under 10 Cr, 0.1 Cr above
export function roundCrore(cr) {
  const step = cr < 10 ? 0.05 : 0.1;
  return Math.round(cr / step) * step;
}

/**
 * input: { type, area, age, view, condition, floor, parking, outdoor }
 * locality: { name, rate, parkingLakh }
 * Returns crore figures and a line-by-line breakdown, or null if the input is unusable.
 */
export function estimate(input, locality) {
  const area = Number(input.area);
  if (!locality || !Number.isFinite(area) || area <= 0) return null;

  const base = (area * locality.rate) / 1e7;
  const lines = [{ label: "Base value", detail: `${area.toLocaleString("en-IN")} sq ft × ₹${locality.rate.toLocaleString("en-IN")} in ${locality.name}`, value: base }];
  let running = base;

  const steps = ["type", "age", "view", "condition", "floor", "outdoor"];
  steps.forEach(key => {
    if (key === "floor" && !usesFloor(input.type)) return;
    const opt = ADJUSTMENTS[key].options[input[key]];
    if (!opt) return;
    let f = opt.f;
    let detail = opt.label;
    // Age is part of a heritage home's appeal, so it isn't marked down
    if (key === "age" && input.type === "heritage" && f < 1) {
      f = 1;
      detail += ", which a heritage home carries well";
    }
    const change = running * (f - 1);
    running *= f;
    lines.push({ label: ADJUSTMENTS[key].label, detail, factor: f, value: change });
  });

  const spaces = Math.max(0, Math.min(10, Math.round(Number(input.parking) || 0)));
  if (spaces && locality.parkingLakh) {
    const add = (spaces * locality.parkingLakh) / 100;
    running += add;
    lines.push({ label: "Parking", detail: `${spaces} covered space${spaces === 1 ? "" : "s"} at ₹${locality.parkingLakh} L each`, value: add });
  }

  return {
    mid: roundCrore(running),
    low: roundCrore(running * (1 - RANGE)),
    high: roundCrore(running * (1 + RANGE)),
    perSqft: Math.round((running * 1e7) / area),
    lines
  };
}

/* Indicative base rates for the valuation calculator.
   rate: ₹ per sq ft of built-up area for a typical, good-condition home.
   parkingLakh: what one extra covered space adds, in lakh (0 where parking is plentiful).
   Fictional figures, loosely shaped like the real market; not advice. */

export const LOCALITIES = [
  { id: "malabar-hill", name: "Malabar Hill", city: "Mumbai", rate: 105000, parkingLakh: 60 },
  { id: "worli", name: "Worli Sea Face", city: "Mumbai", rate: 72000, parkingLakh: 50 },
  { id: "bandra-west", name: "Bandra West", city: "Mumbai", rate: 65000, parkingLakh: 45 },
  { id: "alibaug", name: "Alibaug coast", city: "Raigad", rate: 32000, parkingLakh: 0 },
  { id: "golf-links", name: "Golf Links", city: "New Delhi", rate: 115000, parkingLakh: 0 },
  { id: "vasant-vihar", name: "Vasant Vihar", city: "New Delhi", rate: 60000, parkingLakh: 0 },
  { id: "golf-course-road", name: "Golf Course Road", city: "Gurugram", rate: 28000, parkingLakh: 15 },
  { id: "lavelle-road", name: "Lavelle Road", city: "Bengaluru", rate: 27000, parkingLakh: 20 },
  { id: "indiranagar", name: "Indiranagar", city: "Bengaluru", rate: 22000, parkingLakh: 12 },
  { id: "assagao", name: "Assagao", city: "North Goa", rate: 30000, parkingLakh: 0 },
  { id: "udaipur-lakeside", name: "Lake Pichola", city: "Udaipur", rate: 30000, parkingLakh: 0 },
  { id: "coorg", name: "Coorg", city: "Kodagu", rate: 18000, parkingLakh: 0 },
  { id: "kasauli", name: "Kasauli", city: "Himachal Pradesh", rate: 24000, parkingLakh: 0 }
];

export function getLocality(id) {
  return LOCALITIES.find(l => l.id === id) || null;
}

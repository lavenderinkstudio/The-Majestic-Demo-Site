/* The advisers. Fictional people; the phone numbers use a reserved-looking pattern
   and the email domain is not real. */

export const AGENTS = [
  {
    id: "meher",
    name: "Meher Kapadia",
    role: "Senior adviser, Mumbai and the coast",
    office: "mumbai",
    phone: "+91 22 4000 0101",
    email: "meher@themajestic.example",
    languages: ["English", "Hindi", "Gujarati", "Marathi"],
    bio: "Meher has sold houses on Malabar Hill and the Konkan coast for fourteen years. She knows most of the buildings on the ridge by their first owners.",
    slot: "adviser-1"
  },
  {
    id: "arjun",
    name: "Arjun Rathore",
    role: "Partner, heritage and the north",
    office: "delhi",
    phone: "+91 11 4000 0102",
    email: "arjun@themajestic.example",
    languages: ["English", "Hindi", "Rajasthani"],
    bio: "Arjun trained as a conservation architect before joining The Majestic. He looks after the havelis, the Lutyens bungalows and the hill houses.",
    slot: "adviser-2"
  },
  {
    id: "tara",
    name: "Tara Nanjappa",
    role: "Senior adviser, Bengaluru and the south",
    office: "bengaluru",
    phone: "+91 80 4000 0103",
    email: "tara@themajestic.example",
    languages: ["English", "Kannada", "Kodava", "Tamil"],
    bio: "Tara grew up on a coffee estate in Coorg. She handles plantation sales and central Bengaluru, and is happiest walking a boundary in the rain.",
    slot: "adviser-3"
  }
];

export const OFFICES = [
  { id: "mumbai", city: "Mumbai", address: "4th floor, Readymoney Terrace, Worli Sea Face, Mumbai 400018", phone: "+91 22 4000 0100", hours: "Mon–Sat, 10am–7pm" },
  { id: "delhi", city: "New Delhi", address: "12 Amrita Shergil Marg, New Delhi 110003", phone: "+91 11 4000 0100", hours: "Mon–Sat, 10am–7pm" },
  { id: "bengaluru", city: "Bengaluru", address: "2nd floor, 24 Vittal Mallya Road, Bengaluru 560001", phone: "+91 80 4000 0100", hours: "Mon–Sat, 10am–7pm" },
  { id: "goa", city: "Goa", address: "House 211, Assagao, Bardez, Goa 403507", phone: "+91 832 400 0100", hours: "By appointment" }
];

export function getAgent(id) {
  return AGENTS.find(a => a.id === id) || null;
}

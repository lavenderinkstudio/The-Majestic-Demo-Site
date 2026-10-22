/* The Majestic: the residences.
   Everything here is fictional: houses, prices, people and stories.
   Prices are in crore (₹1 Cr = ₹1,00,00,000). Areas are in square feet. */

export const REGIONS = [
  { id: "coast", label: "Coast", places: "Alibaug & Goa" },
  { id: "heritage", label: "Heritage", places: "Udaipur & New Delhi" },
  { id: "hills", label: "Hills", places: "Coorg & Kasauli" },
  { id: "city", label: "City", places: "Mumbai & Bengaluru" }
];

export const TYPES = [
  { id: "villa", label: "Villa" },
  { id: "penthouse", label: "Penthouse" },
  { id: "bungalow", label: "Bungalow" },
  { id: "haveli", label: "Haveli" },
  { id: "estate", label: "Plantation estate" },
  { id: "residence", label: "Garden residence" }
];

export const LIFESTYLES = [
  { id: "water-view", label: "Sea or lake views" },
  { id: "heritage", label: "Heritage" },
  { id: "garden", label: "Garden" },
  { id: "pool", label: "Pool" },
  { id: "weekend", label: "Weekend home" },
  { id: "family", label: "Family living" },
  { id: "entertaining", label: "Entertaining" },
  { id: "privacy", label: "Privacy" },
  { id: "wellness", label: "Wellness" },
  { id: "nature", label: "Nature" },
  { id: "work", label: "Room to work" },
  { id: "city", label: "City life" }
];

export const PROPERTIES = [
  {
    id: "saal-villa",
    no: "01",
    name: "Saal Villa",
    locality: "Awas",
    city: "Alibaug",
    state: "Maharashtra",
    region: "coast",
    coords: [18.7052, 72.8726],
    type: "villa",
    typeLabel: "Sea-facing villa",
    price: 38,
    priceOnRequest: false,
    beds: 6,
    baths: 7,
    builtUpSqft: 11800,
    landSqft: 69700,
    year: 2019,
    featured: true,
    tagline: "Sal timber, black basalt and a lawn that runs out to the tide line.",
    lifestyle: ["water-view", "weekend", "pool", "entertaining", "privacy", "family"],
    amenities: ["Infinity pool", "Beach access", "Staff quarters", "Outdoor kitchen", "Guest pavilion", "Solar array", "Backup power", "Gated drive"],
    story: [
      "Saal Villa sits on a mile of quiet beach north of Alibaug, twenty minutes by speedboat from the Gateway of India. Its architects built it from the two materials the Konkan does best: sal timber, oiled until it glows, and the black basalt that breaks the shore below.",
      "The house is a long, low pavilion with every principal room facing west. In the dry months the glass slides away entirely and the living room becomes a verandah. When the monsoon arrives, deep eaves and copper gutters turn the rain into the main event.",
      "A separate guest pavilion with two suites stands at the end of the lawn, so a full house never feels like one."
    ],
    highlights: [
      "Sixty metres of private frontage onto Awas beach",
      "A 22-metre pool set level with the horizon",
      "Every principal room faces the sunset",
      "A two-suite guest pavilion with its own kitchen",
      "Twenty minutes to the Gateway by speedboat, or an hour on the Ro-Ro ferry"
    ],
    specs: {
      "Construction": "Basalt and sal timber on an RCC frame",
      "Architect": "Studio Dhruv Rao, 2019",
      "Plot": "1.6 acres, freehold",
      "Floors": "Ground and one",
      "Parking": "Six cars, covered",
      "Staff": "Quarters for four"
    },
    nearby: [
      { name: "Awas beach", time: "2 min walk", coords: [18.7088, 72.8662] },
      { name: "Kihim beach", time: "15 min drive", coords: [18.7224, 72.8651] },
      { name: "Mandwa jetty", time: "18 min drive", coords: [18.8071, 72.8812] },
      { name: "Alibaug town", time: "20 min drive", coords: [18.6414, 72.8722] }
    ],
    agentId: "meher",
    images: [
      { slot: "saal-villa-1", alt: "Saal Villa at dusk, its rooms lit behind the palms and a still pool in front" },
      { slot: "saal-villa-2", alt: "The living room's tall glass walls opening onto the tropical garden" },
      { slot: "saal-villa-3", alt: "The infinity pool at sunset, level with the treetops" },
      { slot: "saal-villa-4", alt: "A principal suite in dark timber, a canopy over the bed" },
      { slot: "saal-villa-5", alt: "Detail of local stone laid between courses of old timber" }
    ]
  },
  {
    id: "casa-azulejo",
    no: "02",
    name: "Casa Azulejo",
    locality: "Assagao",
    city: "North Goa",
    state: "Goa",
    region: "coast",
    coords: [15.5946, 73.7752],
    type: "villa",
    typeLabel: "Restored Portuguese villa",
    price: 21,
    priceOnRequest: false,
    beds: 5,
    baths: 5,
    builtUpSqft: 6400,
    landSqft: 19500,
    year: 1894,
    featured: false,
    tagline: "An 1890s balcão house, restored tile by tile in Assagao's green heart.",
    lifestyle: ["heritage", "garden", "pool", "weekend", "entertaining"],
    amenities: ["Courtyard pool", "Mango and jackfruit orchard", "Restored balcão", "Chapel room", "Library", "Outdoor shower", "Staff cottage"],
    story: [
      "Casa Azulejo was built in 1894 for a family of Goan merchants who traded in cashew and salt. It kept its shape for a century and a half: the pillared balcão facing the road, the long sala behind it, and rooms arranged around a shaded courtyard.",
      "Its restoration took three years. The oyster-shell windows were reglazed by hand, and the lime plaster was mixed on site. The blue and white azulejos that give the house its name were cleaned, numbered and set back exactly where they had been.",
      "The new work is quiet: a long pool in the old courtyard, modern bathrooms behind original doors, and a kitchen that opens onto the orchard."
    ],
    highlights: [
      "Original azulejo tilework throughout the sala",
      "Oyster-shell windows, reglazed by hand",
      "A courtyard pool under a 120-year-old mango tree",
      "Ten minutes to Anjuna and Vagator",
      "Completely restored in 2021, including wiring and drainage"
    ],
    specs: {
      "Construction": "Laterite and lime plaster, Mangalore tile roof",
      "Restoration": "Completed 2021",
      "Plot": "19,500 sq ft, freehold",
      "Floors": "Single storey, with an attic study",
      "Parking": "Three cars",
      "Heritage status": "Listed as a heritage structure"
    },
    nearby: [
      { name: "Assagao church", time: "4 min drive", coords: [15.5991, 73.7713] },
      { name: "Mapusa market", time: "12 min drive", coords: [15.5915, 73.8101] },
      { name: "Anjuna beach", time: "10 min drive", coords: [15.5795, 73.7397] },
      { name: "Vagator beach", time: "15 min drive", coords: [15.6006, 73.7362] }
    ],
    agentId: "meher",
    images: [
      { slot: "casa-azulejo-1", alt: "The ochre front of Casa Azulejo, its steps lined with potted palms" },
      { slot: "casa-azulejo-2", alt: "A cool arcade lined with blue and white azulejo tiles" },
      { slot: "casa-azulejo-3", alt: "The pool beside a tiled-roof pavilion in the garden" },
      { slot: "casa-azulejo-4", alt: "A whitewashed room, its wooden shutters open to the garden" },
      { slot: "casa-azulejo-5", alt: "Detail of hand-painted blue and white tiles" }
    ]
  },
  {
    id: "malabar-residence",
    no: "03",
    name: "The Malabar Residence",
    locality: "Malabar Hill",
    city: "Mumbai",
    state: "Maharashtra",
    region: "city",
    coords: [18.9548, 72.8034],
    type: "penthouse",
    typeLabel: "Duplex penthouse",
    price: 95,
    priceOnRequest: false,
    beds: 5,
    baths: 6,
    builtUpSqft: 9200,
    landSqft: null,
    year: 2023,
    featured: true,
    tagline: "Two floors above the Arabian Sea, with the whole of Marine Drive below.",
    lifestyle: ["water-view", "city", "entertaining", "privacy", "wellness"],
    amenities: ["2,100 sq ft terrace", "Plunge pool", "Private lift lobby", "Home cinema", "Steam and gym", "Wine room", "Four car spaces", "24-hour concierge"],
    story: [
      "The Malabar Residence occupies the 31st and 32nd floors of a slim tower on Ridge Road, one of the last new buildings the hill is likely to see. From the living room the view runs from Haji Ali to the curve of the Queen's Necklace.",
      "The lower floor is for living: a double-height salon, a dining room that seats sixteen and a kitchen behind a pantry that can cater a party. Upstairs are four suites and the principal apartment, which has its own study, dressing room and a terrace with a plunge pool.",
      "Finishes are restrained and very good: Indian walnut, honed Makrana marble and bronze hardware cast in Moradabad."
    ],
    highlights: [
      "Unobstructed views over Back Bay and Marine Drive",
      "A double-height salon with 7.2-metre glazing",
      "Private lift lobby on both floors",
      "Terrace with a heated plunge pool",
      "Four car spaces and two staff rooms"
    ],
    specs: {
      "Floors": "31st and 32nd of 33",
      "Completed": "2023",
      "Carpet area": "7,350 sq ft",
      "Terrace": "2,100 sq ft",
      "Parking": "Four spaces",
      "Society": "Ten residences in the building"
    },
    nearby: [
      { name: "Hanging Gardens", time: "4 min walk", coords: [18.9568, 72.8051] },
      { name: "Banganga Tank", time: "7 min drive", coords: [18.9464, 72.7943] },
      { name: "Breach Candy Hospital", time: "8 min drive", coords: [18.9692, 72.8053] },
      { name: "Marine Drive", time: "10 min drive", coords: [18.9432, 72.8231] }
    ],
    agentId: "meher",
    images: [
      { slot: "malabar-residence-1", alt: "The salon at night, its glass walls full of the city's lights" },
      { slot: "malabar-residence-2", alt: "The terrace pool lit at night above the city" },
      { slot: "malabar-residence-3", alt: "The dining room in marble and warm timber" },
      { slot: "malabar-residence-4", alt: "The library, lined with books, paintings and lamplit armchairs" },
      { slot: "malabar-residence-5", alt: "The principal bedroom, a wall of glass over the water at night" }
    ]
  },
  {
    id: "amaltas-house",
    no: "04",
    name: "Amaltas House",
    locality: "Golf Links",
    city: "New Delhi",
    state: "Delhi",
    region: "heritage",
    coords: [28.5995, 77.2318],
    type: "bungalow",
    typeLabel: "Lutyens-era bungalow",
    price: 160,
    priceOnRequest: true,
    beds: 7,
    baths: 8,
    builtUpSqft: 12500,
    landSqft: 17400,
    year: 1938,
    featured: false,
    tagline: "A 1938 bungalow behind a hedge of amaltas, two minutes from Lodhi Garden.",
    lifestyle: ["heritage", "garden", "family", "privacy", "city", "entertaining"],
    amenities: ["Front and rear lawns", "Verandah on three sides", "Library", "Basement entertainment level", "Staff block", "Separate guest entrance", "Mature trees"],
    story: [
      "Amaltas House was among the first bungalows built in Golf Links, when the colony was still being laid out as part of Lutyens' Delhi. It takes its name from the row of amaltas trees along the boundary, which turn the street yellow every May.",
      "The bones are 1938: fourteen-foot ceilings, lime-washed walls, Burma teak floors and a verandah that wraps three sides of the house. A careful renovation in 2017 added a basement level for entertaining and a modern kitchen, and left the plan of the main rooms almost untouched.",
      "It has been in one family for three generations. They are selling privately, and viewings are arranged with them in person."
    ],
    highlights: [
      "A rare original 1938 bungalow in Golf Links",
      "17,400 sq ft plot with front and rear lawns",
      "Burma teak floors and fourteen-foot ceilings",
      "A basement level with a screening room and bar",
      "Walking distance to Lodhi Garden and Khan Market"
    ],
    specs: {
      "Built": "1938, renovated 2017",
      "Plot": "17,400 sq ft, leasehold converted to freehold",
      "Floors": "Basement, ground and one",
      "Parking": "Five cars in the drive",
      "Staff": "Separate block for six",
      "Viewings": "With the owners, by appointment"
    },
    nearby: [
      { name: "Delhi Golf Club", time: "3 min drive", coords: [28.5962, 77.2341] },
      { name: "Khan Market", time: "5 min drive", coords: [28.6003, 77.2271] },
      { name: "Lodhi Garden", time: "6 min walk", coords: [28.5931, 77.2197] },
      { name: "India Gate", time: "12 min drive", coords: [28.6129, 77.2295] }
    ],
    agentId: "arjun",
    images: [
      { slot: "amaltas-house-1", alt: "A great amaltas tree in flower in front of the house" },
      { slot: "amaltas-house-2", alt: "The verandah with cane chairs and a red-oxide floor" },
      { slot: "amaltas-house-3", alt: "The drawing room, high-ceilinged and cool" },
      { slot: "amaltas-house-4", alt: "The original teak staircase in the hall" },
      { slot: "amaltas-house-5", alt: "Amaltas blossom in May, hanging in golden chains" }
    ]
  },
  {
    id: "jharokha-haveli",
    no: "05",
    name: "Jharokha Haveli",
    locality: "Lake Pichola",
    city: "Udaipur",
    state: "Rajasthan",
    region: "heritage",
    coords: [24.5799, 73.6826],
    type: "haveli",
    typeLabel: "Lakeside haveli",
    price: 45,
    priceOnRequest: false,
    beds: 9,
    baths: 10,
    builtUpSqft: 14200,
    landSqft: 21000,
    year: 1780,
    featured: true,
    tagline: "An eighteenth-century haveli with its own ghat on Lake Pichola.",
    lifestyle: ["water-view", "heritage", "entertaining", "privacy", "wellness"],
    amenities: ["Private ghat and boat", "Rooftop terrace", "Three courtyards", "Hammam", "Restored frescoes", "Lift", "Staff of eight available"],
    story: [
      "Jharokha Haveli was built around 1780 for a minister at the Mewar court. It rises straight out of Lake Pichola in four storeys of lime and sandstone, and its carved jharokhas look across the water to the City Palace.",
      "Inside, the house folds around three courtyards, each cooler than the last. A ten-year restoration brought back the frescoes in the zenana and the mirror work in the upper rooms. It also added things the minister never had: a hammam, a lift and plumbing you would not know was new.",
      "The private ghat has a wooden boat. On festival nights, the whole lake is lit with diyas."
    ],
    highlights: [
      "A private ghat and boat on Lake Pichola",
      "Direct views of the City Palace and Jag Mandir",
      "Original frescoes and mirror work, conserved in 2018",
      "Nine suites, each with its own jharokha",
      "Rooftop terrace for a hundred guests"
    ],
    specs: {
      "Built": "c. 1780, restored 2008–2018",
      "Plot": "21,000 sq ft, freehold",
      "Floors": "Four, with lift",
      "Courtyards": "Three",
      "Approach": "By lane or by boat",
      "Heritage status": "Protected facade"
    },
    nearby: [
      { name: "Gangaur Ghat", time: "3 min walk", coords: [24.5801, 73.6838] },
      { name: "Bagore ki Haveli", time: "4 min walk", coords: [24.5795, 73.6831] },
      { name: "City Palace", time: "7 min by boat", coords: [24.5764, 73.6835] },
      { name: "Jag Mandir", time: "12 min by boat", coords: [24.5677, 73.6787] }
    ],
    agentId: "arjun",
    images: [
      { slot: "jharokha-haveli-1", alt: "Jharokha Haveli rising from Lake Pichola at sunset" },
      { slot: "jharokha-haveli-2", alt: "The inner courtyard, its sandstone arcades around a garden" },
      { slot: "jharokha-haveli-3", alt: "Carved sandstone arches framing the old city across the lake" },
      { slot: "jharokha-haveli-4", alt: "A painted blue corridor under a brass lantern" },
      { slot: "jharokha-haveli-5", alt: "Carved sandstone jharokha balconies on the facade" }
    ]
  },
  {
    id: "cardamom-hill-estate",
    no: "06",
    name: "Cardamom Hill Estate",
    locality: "Near Madikeri",
    city: "Coorg",
    state: "Karnataka",
    region: "hills",
    coords: [12.3705, 75.7992],
    type: "estate",
    typeLabel: "Plantation bungalow",
    price: 18,
    priceOnRequest: false,
    beds: 4,
    baths: 5,
    builtUpSqft: 5800,
    landSqft: 1829520,
    year: 1926,
    featured: false,
    tagline: "A planter's bungalow on 42 acres of shade-grown coffee and cardamom.",
    lifestyle: ["nature", "garden", "wellness", "privacy", "weekend", "family"],
    amenities: ["42-acre working estate", "Spring-fed stream", "Pepper and orange groves", "Estate manager's cottage", "Fireplaces", "Drying yards", "Walking trails"],
    story: [
      "Cardamom Hill Estate has grown coffee since the 1920s, under a canopy of silver oak and old rosewood that keeps the bushes cool. The bungalow sits on the highest ground, with a red-oxide verandah that looks out over the valley towards Madikeri.",
      "The house is generous and simple: four bedrooms with fireplaces, a long dining room and a kitchen built around a wood-fired range. A stream runs through the lower estate, and the morning mist usually lifts by nine.",
      "The estate earns its keep. A resident manager runs the coffee, pepper and cardamom, and will stay on if the new owner wishes."
    ],
    highlights: [
      "42 acres of shade-grown arabica, pepper and cardamom",
      "A 1926 bungalow on the estate's highest point",
      "A working estate with a resident manager",
      "A spring-fed stream and private trails",
      "Two and a half hours from Mysuru"
    ],
    specs: {
      "Built": "1926, roof and services renewed 2020",
      "Land": "42 acres, agricultural",
      "Crops": "Arabica coffee, black pepper, cardamom",
      "Floors": "Single storey",
      "Water": "Spring and two borewells",
      "Staff": "Estate manager and five workers"
    },
    nearby: [
      { name: "Raja's Seat", time: "22 min drive", coords: [12.4212, 75.7368] },
      { name: "Madikeri town", time: "25 min drive", coords: [12.4244, 75.7382] },
      { name: "Abbey Falls", time: "35 min drive", coords: [12.4563, 75.7161] },
      { name: "Dubare camp", time: "30 min drive", coords: [12.3667, 75.9064] }
    ],
    agentId: "tara",
    images: [
      { slot: "cardamom-hill-estate-1", alt: "The planter's bungalow on its ridge in the morning mist" },
      { slot: "cardamom-hill-estate-2", alt: "The long verandah between brick walls and the forest" },
      { slot: "cardamom-hill-estate-3", alt: "A timber-lined sitting room with the fire lit" },
      { slot: "cardamom-hill-estate-4", alt: "Coffee bushes heavy with cherries under tall shade trees" },
      { slot: "cardamom-hill-estate-5", alt: "Ripe coffee cherries on the branch" }
    ]
  },
  {
    id: "deodar-house",
    no: "07",
    name: "Deodar House",
    locality: "Upper Mall",
    city: "Kasauli",
    state: "Himachal Pradesh",
    region: "hills",
    coords: [30.8957, 76.9688],
    type: "bungalow",
    typeLabel: "Hill retreat",
    price: 12,
    priceOnRequest: false,
    beds: 4,
    baths: 4,
    builtUpSqft: 4600,
    landSqft: 32670,
    year: 2016,
    featured: false,
    tagline: "Stone, slate and glass in a stand of deodars, an hour and a half from Chandigarh.",
    lifestyle: ["nature", "weekend", "wellness", "privacy", "work", "family"],
    amenities: ["Wood-burning stove", "Glass studio", "Forest terrace", "Underfloor heating", "Orchard", "Rainwater harvesting", "Two car spaces"],
    story: [
      "Deodar House was built in 2016 by a Delhi writer who wanted somewhere to finish a book and never quite left. It stands on three-quarters of an acre on Kasauli's upper ridge, among deodars that are older than the town's church.",
      "The house is built of local stone with a slate roof. Its west side is almost entirely glass, so the forest is the main thing you see from inside. A separate glass studio at the edge of the trees makes a good office, and in winter the snowline is visible beyond it.",
      "Heated floors and a large wood-burning stove keep it comfortable in December. In May, it is ten degrees cooler than the plains."
    ],
    highlights: [
      "Three-quarters of an acre among old deodars",
      "A glass studio built for working",
      "Views across the Shivaliks to the snowline",
      "Underfloor heating throughout",
      "Ninety minutes from Chandigarh airport"
    ],
    specs: {
      "Built": "2016",
      "Plot": "32,670 sq ft (0.75 acre)",
      "Construction": "Local stone, slate roof, timber frame",
      "Floors": "Ground and one, plus studio",
      "Heating": "Underfloor and wood-burning stove",
      "Parking": "Two cars"
    },
    nearby: [
      { name: "Christ Church", time: "6 min walk", coords: [30.8984, 76.9636] },
      { name: "Kasauli Club", time: "8 min walk", coords: [30.8995, 76.9651] },
      { name: "Gilbert Trail", time: "10 min walk", coords: [30.9029, 76.9578] },
      { name: "Monkey Point", time: "15 min drive", coords: [30.9101, 76.9594] }
    ],
    agentId: "arjun",
    images: [
      { slot: "deodar-house-1", alt: "Deodar House in stone among the dark trees" },
      { slot: "deodar-house-2", alt: "The sitting room at dusk, its stove and windows onto the trees" },
      { slot: "deodar-house-3", alt: "Houses on the ridge above the plains at dusk" },
      { slot: "deodar-house-4", alt: "A bedroom with a wall of rough local stone" },
      { slot: "deodar-house-5", alt: "A timber-shuttered window set in a dressed stone wall" }
    ]
  },
  {
    id: "the-lavelle",
    no: "08",
    name: "The Lavelle",
    locality: "Lavelle Road",
    city: "Bengaluru",
    state: "Karnataka",
    region: "city",
    coords: [12.9696, 77.5979],
    type: "residence",
    typeLabel: "Garden residence",
    price: 14,
    priceOnRequest: false,
    beds: 4,
    baths: 5,
    builtUpSqft: 5200,
    landSqft: null,
    year: 2022,
    featured: false,
    tagline: "A garden-level residence a minute from Cubbon Park, with rain trees overhead.",
    lifestyle: ["garden", "city", "family", "work", "wellness"],
    amenities: ["3,000 sq ft private garden", "Two studies", "Lap pool (shared)", "Gym", "Three car spaces", "Staff room", "EV charging"],
    story: [
      "The Lavelle is one of only four residences in a low building on Lavelle Road, set back behind the rain trees that make central Bengaluru feel like a garden city. It takes the whole ground floor and has the building's only private garden.",
      "Inside, the rooms are calm and well proportioned: a long living and dining room opening onto the lawn, two studies for a working couple, and four bedrooms arranged away from the street. The garden was planted by a landscape studio from Auroville with native shrubs and a frangipani walk.",
      "Cubbon Park is a minute away on foot, and the city's best schools are within ten minutes."
    ],
    highlights: [
      "The building's only private garden, 3,000 sq ft",
      "A one-minute walk to Cubbon Park",
      "Two studies, each with garden light",
      "Only four residences in the building",
      "Within ten minutes of Bishop Cotton and Baldwin schools"
    ],
    specs: {
      "Floor": "Ground and garden level",
      "Completed": "2022",
      "Carpet area": "4,300 sq ft",
      "Garden": "3,000 sq ft, private",
      "Parking": "Three spaces with EV charging",
      "Society": "Four residences"
    },
    nearby: [
      { name: "UB City", time: "4 min walk", coords: [12.9719, 77.5963] },
      { name: "Cubbon Park", time: "1 min walk", coords: [12.9732, 77.5937] },
      { name: "Bishop Cotton Boys' School", time: "6 min drive", coords: [12.9668, 77.6003] },
      { name: "MG Road", time: "8 min drive", coords: [12.9755, 77.6067] }
    ],
    agentId: "tara",
    images: [
      { slot: "the-lavelle-1", alt: "The garden front of The Lavelle across the lawn" },
      { slot: "the-lavelle-2", alt: "The living room's wide windows onto the garden" },
      { slot: "the-lavelle-3", alt: "A planted courtyard bringing light into the house" },
      { slot: "the-lavelle-4", alt: "A teak desk in the study" },
      { slot: "the-lavelle-5", alt: "A quiet corner by a window onto the garden" }
    ]
  }
];

export function getProperty(id) {
  return PROPERTIES.find(p => p.id === id) || null;
}

export function regionLabel(id) {
  const r = REGIONS.find(r => r.id === id);
  return r ? r.label : id;
}

export function typeLabel(id) {
  const t = TYPES.find(t => t.id === id);
  return t ? t.label : id;
}

export function lifestyleLabel(id) {
  const l = LIFESTYLES.find(l => l.id === id);
  return l ? l.label : id;
}

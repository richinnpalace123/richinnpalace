import { SITE_CONFIG } from "./config";

export interface Branch {
  id: string;
  name: string;
  description: string;
  address: string;
}

export interface Room {
  id: string;
  slug: string;
  name: string;
  tag: string;
  price: number;
  priceDisplay: string;
  size: string;
  guests: string;
  description: string;
  longDescription: string;
  image: string;
  video?: string;
  gallery: string[];
  amenities: string[];
  specs: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  attractions: { name: string; distance: string }[];
  branches: Branch[];
}

export const hotelDetails = {
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  subTitle: SITE_CONFIG.subTitle,
  description: "A quiet retreat where old craft, still hands, and slow evenings become the story you take home.",
  phone: SITE_CONFIG.contact.phone,
  email: SITE_CONFIG.contact.email,
  address: SITE_CONFIG.contact.address,
  googleMapsLink: SITE_CONFIG.contact.googleMapsUrl,
};

export const stats = [
  { value: "5.0", label: "Customer Reviews", subLabel: "★★★★★" },
  { value: "12,000+", label: "SATISFIED GUESTS", subLabel: "TRUSTED EXPERIENCES" },
  { value: "25", label: "YEARS OF SERVICE", subLabel: "ESTABLISHED 2001" },
  { value: "Award-Winning", label: "EXCELLENT HOSPITALITY", subLabel: "EXCELLENCE AWARDS" },
];

export const rooms: Room[] = [
  {
    id: "haveli-room",
    slug: "haveli-room",
    name: "Haveli Chamber",
    tag: "COURTYARD VIEW",
    price: 12800,
    priceDisplay: "₹12,800",
    size: "480 SF",
    guests: "2 Guests",
    description: "Heritage, softly rewritten.",
    longDescription: "Our Haveli Rooms offer a gentle entry into the spirit of heritage living. Featuring hand-polished lime plaster walls, low-slung teak furnishings, and traditional arches that filter the morning sun, these rooms overlook our central stone courtyard. A personal sanctuary designed for rest, complete with an ensuite stone bathtub and organic linen.",
    image: "/images/photo1.avif",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340853/t_nagar_2.mp4",
    gallery: [
      "/images/photo1.avif",
      "/images/photos4.jpg",
      "/images/photos8.jpg",
    ],
    amenities: [
      "24-Hour Butler Service",
      "Organic Linen & Silk Robes",
      "Handcrafted Stone Soaking Tub",
      "In-room Espresso & Herbal Teas",
      "Wireless Audio System",
      "Curated Local Minibar",
      "Twice-Daily Housekeeping & Turndown",
      "High-speed Wi-Fi & Work Bureau",
    ],
    specs: [
      { label: "Bed Configuration", value: "King size custom pillow-top" },
      { label: "Room Size", value: "480 sq ft / 45 sq m" },
      { label: "Maximum Occupancy", value: "2 Adults" },
      { label: "Bathroom", value: "Ensuite with rain shower and freestanding bath" },
      { label: "View", value: "Central Courtyard & Frangipani trees" },
    ],
    faqs: [
      {
        question: "Is airport pickup included with this room?",
        answer: "Yes, all room bookings at Rich Inn Palace include complimentary private airport transfers in our luxury electric sedans."
      },
      {
        question: "Can we add an extra bed in the Haveli Room?",
        answer: "To maintain the spatial layout and peaceful atmosphere of the room, Haveli Rooms are strictly limited to an occupancy of 2 adults. For larger groups, we recommend our Suites or Villa options."
      },
      {
        question: "Does this room have private outdoor space?",
        answer: "While the Haveli Room features beautiful arched windows looking directly onto the courtyard, it does not have a private terrace. For private outdoor spaces, consider the Garden Suite or Terrace Suite."
      }
    ],
    attractions: [
      { name: "Pondy Bazaar", distance: "5 mins walk" },
      { name: "Valluvar Kottam", distance: "10 mins drive" },
      { name: "Kapaleeshwarar Temple", distance: "15 mins drive" },
      { name: "Express Avenue", distance: "15 mins drive" }
    ],
    branches: [
      {
        id: "tnagar-grand",
        name: "Rich Inn Palace — T.Nagar Grand",
        description: "Our landmark heritage wing featuring high arched ceilings, located on G.N. Chetty Road.",
        address: "No. 12, G.N. Chetty Road, T. Nagar, Chennai, Tamil Nadu 600017"
      },
      {
        id: "tnagar-south",
        name: "Rich Inn Palace — T.Nagar South",
        description: "A contemporary luxury retreat with customized butler service, located near Venkatnarayana Road.",
        address: "No. 45, Venkatnarayana Road, T. Nagar, Chennai, Tamil Nadu 600017"
      }
    ]
  },
  {
    id: "garden-suite",
    slug: "garden-suite",
    name: "Garden Suite",
    tag: "PRIVATE GARDEN",
    price: 18500,
    priceDisplay: "₹18,500",
    size: "650 SF",
    guests: "2 Guests",
    description: "Nature and stillness, seamlessly merged.",
    longDescription: "Spacious suites featuring a walled, private courtyard garden where jasmine and bougainvillea climb. Inside, natural fabrics, local sandstone slabs, and custom ambient lighting create a sense of profound quiet. Enjoy your morning tea under the shade of a private neem tree or run a bath in the outdoor copper tub under the stars.",
    image: "/images/photos2.avif",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
    gallery: [
      "/images/photos2.avif",
      "/images/photos5.jpg",
      "/images/photos9.jpg",
    ],
    amenities: [
      "Private Walled Garden",
      "Outdoor Copper Soaking Tub",
      "Dedicated Butler Service",
      "Organic Bedding & Fine Silk Dressing Gowns",
      "Espresso Machine & In-Suite Tea Sommelier",
      "Pillow Menu Selection",
      "Premium Soundbar System",
      "Complimentary Laundry Service (2 items daily)",
    ],
    specs: [
      { label: "Bed Configuration", value: "Imperial King Size" },
      { label: "Room Size", value: "650 sq ft / 60 sq m + private garden" },
      { label: "Maximum Occupancy", value: "2 Adults & 1 Child (under 12)" },
      { label: "Bathroom", value: "Double vanities, indoor rain shower + outdoor copper tub" },
      { label: "View", value: "Private walled garden courtyard" },
    ],
    faqs: [
      {
        question: "Is the outdoor copper bathtub private?",
        answer: "Yes, the copper tub is located inside your private, high-walled garden courtyard, ensuring absolute privacy from other guests."
      },
      {
        question: "Is breakfast included in the rate?",
        answer: "All direct bookings on our website include a bespoke daily breakfast served either in our dining room or directly in your private garden suite."
      }
    ],
    attractions: [
      { name: "Vadapalani Murugan Temple", distance: "5 mins walk" },
      { name: "Forum Vijaya Mall", distance: "10 mins walk" },
      { name: "Chennai T.Nagar Shopping Hub", distance: "10 mins drive" }
    ],
    branches: [
      {
        id: "vadapalani-central",
        name: "Rich Inn Palace — Vadapalani Central",
        description: "An urban sanctuary with lush inner courtyards, located off Arcot Road.",
        address: "No. 88, Arcot Road, Vadapalani, Chennai, Tamil Nadu 600026"
      },
      {
        id: "vadapalani-west",
        name: "Rich Inn Palace — Vadapalani West",
        description: "Private garden suites and rooftop lounges offering absolute privacy, located on Saligramam Link Road.",
        address: "No. 15, Saligramam Link Road, Vadapalani, Chennai, Tamil Nadu 600026"
      }
    ]
  },
  {
    id: "signature-sanctuary",
    slug: "signature-sanctuary",
    name: "Signature Sanctuary",
    tag: "PLUNGE POOL",
    price: 26000,
    priceDisplay: "₹26,000",
    size: "920 SF",
    guests: "4 Guests",
    description: "An expanse of quiet luxury, bounded only by the horizon.",
    longDescription: "Our signature residence offers the ultimate luxury of space. A sprawling layout features a separate bedroom, a light-filled living room with custom craft artifacts, and a private sun terrace with a heated plunge pool overlooking the city skyline. Plastered wall finishes and stone arches complete the minimalist editorial design.",
    image: "/images/photos3.jpg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340925/t_nagar_5bhk.mp4",
    gallery: [
      "/images/photos3.jpg",
      "/images/photos6.jpg",
      "/images/photos8.jpg",
    ],
    amenities: [
      "Private Heated Plunge Pool",
      "Sun Terrace with Loungers",
      "Separate Living Room & Study Bureau",
      "24-Hour Premium Butler & Chef Service",
      "Walk-in Dressing Room",
      "Complimentary Mini-Bar (replenished daily)",
      "Daily yoga mats and wellness kit",
      "Luxury airport transfer both ways",
    ],
    specs: [
      { label: "Bed Configuration", value: "Ultra King Size & optional Daybed" },
      { label: "Room Size", value: "920 sq ft / 85 sq m" },
      { label: "Maximum Occupancy", value: "4 Adults or 2 Adults & 2 Children" },
      { label: "Bathroom", value: "His-and-Hers marble vanities, steam shower & stone bath" },
      { label: "View", value: "Panoramic city skyline and sunset views" },
    ],
    faqs: [
      {
        question: "Is the plunge pool heated?",
        answer: "Yes, the private plunge pool is climate-controlled and heated to a comfortable 28°C (82°F) year-round."
      },
      {
        question: "What wellness activities are available in-room?",
        answer: "We provide high-quality organic yoga mats, resistance bands, and a guided mindfulness tablet. You can also book a private massage therapist or yoga instructor to visit your terrace."
      }
    ],
    attractions: [
      { name: "Marina Beach", distance: "15 mins drive" },
      { name: "Elliot's Beach (Besant Nagar)", distance: "20 mins drive" },
      { name: "San Thome Basilica", distance: "15 mins drive" }
    ],
    branches: [
      {
        id: "tnagar-club",
        name: "Rich Inn Palace — T.Nagar Club",
        description: "Exclusive boutique estate featuring custom plunge pool suites, located on 2nd Avenue.",
        address: "No. 102, 2nd Avenue, T. Nagar, Chennai, Tamil Nadu 600017"
      },
      {
        id: "tnagar-heights",
        name: "Rich Inn Palace — T.Nagar Heights",
        description: "Premium penthouses with private decks and panoramic city skyline views, located on 5th Avenue.",
        address: "No. 7, 5th Avenue, T. Nagar, Chennai, Tamil Nadu 600017"
      }
    ]
  },
  {
    id: "royal-palace-suite",
    slug: "royal-palace-suite",
    name: "Royal Palace Suite",
    tag: "City Skyline View",
    price: 34500,
    priceDisplay: "₹34,500",
    size: "1200 SF",
    guests: "4 Guests",
    description: "An editorial tribute to royal living.",
    longDescription: "A masterpiece of design combining heritage architecture with clean modern lines. Features high vaulted ceilings, custom curated local artwork, a private dining room, and two terraces offering unobstructed views of the city skyline. Enjoy tailored dinners prepared in-suite by our executive chef.",
    image: "/images/photos5.jpg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
    gallery: [
      "/images/photos5.jpg",
      "/images/photos7.jpg",
      "/images/photos9.jpg",
    ],
    amenities: [
      "In-suite Private Dining Room",
      "Two Private Panoramic Terraces",
      "Private Chef Dining Experience (upon request)",
      "24-Hour Butler & Concierge Service",
      "Luxury Pillow Menu & Linens",
      "Premium Wine Cabinet Selection",
      "Complementary Spa Treatment (60 mins for 2 guests)",
    ],
    specs: [
      { label: "Bed Configuration", value: "Grand Imperial King Size" },
      { label: "Room Size", value: "1,200 sq ft / 111 sq m" },
      { label: "Maximum Occupancy", value: "4 Adults" },
      { label: "Bathroom", value: "Full white marble bathroom with steam room & copper tub" },
      { label: "View", value: "Panoramic skyline & heritage gardens" },
    ],
    faqs: [
      {
        question: "Are spa treatments included?",
        answer: "Yes, guests staying in the Royal Palace Suite receive a complimentary 60-minute therapeutic massage for two guests in our sanctuary spa or in-suite."
      }
    ],
    attractions: [
      { name: "Mylapore Cultural Zone", distance: "15 mins drive" },
      { name: "East Coast Road (ECR)", distance: "25 mins drive" }
    ],
    branches: [
      {
        id: "royal-palace-chennai",
        name: "Rich Inn Palace — T.Nagar",
        description: "Our signature urban luxury estate set in the heart of Chennai.",
        address: "Usman Road, T.Nagar, Chennai, Tamil Nadu 600017"
      },
      {
        id: "royal-palace-beach",
        name: "Rich Inn Palace — Heritage Club",
        description: "A premium private sanctuary near the scenic East Coast Road.",
        address: "ECR, Chennai, Tamil Nadu 600115"
      }
    ]
  }
];

export const manifesto = [
  {
    num: "01",
    title: "Executive & Suite Tariffs in T. Nagar",
    text: "Transparent luxury rates at Rajabather Street (Pondy Bazaar) & Rangan Street, T. Nagar. Executive Rooms Single ₹3,200 / Double ₹3,800; Suite Rooms Single ₹4,800 / Double ₹5,600. Extra bed ₹700.",
  },
  {
    num: "02",
    title: "Weekend Special Offer — ₹2,999 ONLY",
    text: "Experience luxury stays with our special weekend rate of ₹2,999 (actual price ₹3,500). Ideal for weekend staycations and business trips in T. Nagar, Chennai.",
  },
  {
    num: "03",
    title: "True 24-Hour Check-In & Check-Out",
    text: "Enjoy ultimate flexibility with our 24 hours check-in and check-out policy at both Pondy Bazaar and Rangan Street properties. Stay full 24 hours from your arrival time.",
  },
  {
    num: "04",
    title: "Complimentary South Indian Veg Buffet Breakfast",
    text: "Every direct stay includes an authentic complimentary South Indian vegetarian buffet breakfast, along with high-speed Wi-Fi and complimentary guest parking.",
  },
  {
    num: "05",
    title: "24/7 Room Service & In-Room Mini Bar",
    text: "24/7 front desk support, round-the-clock room service, custom mini bar setups in every room, and optional extra bed accommodations (₹700) for family stays.",
  },
  {
    num: "06",
    title: `Prime Locations & Direct Helpline (${SITE_CONFIG.contact.phone})`,
    text: `Located in Chennai's heart on Rajabather Street (Pondy Bazaar) and Rangan Street, T. Nagar. Contact our direct booking desk at ${SITE_CONFIG.contact.phone} for instant reservations.`,
  },
];

export const testimonials = [
  {
    quote: "A masterclass in restraint. Rich Inn Palace is not about gold taps, but about the stillness, the shadow, the smell of fresh jasmine, and the extraordinary butler who knew what I needed before I did.",
    author: "Elena Rostova",
    role: "Architectural Writer",
    rating: 5,
    avatar: "/images/photos8.jpg",
    stayDate: "Stayed Oct 2001",
    verified: true,
  },
  {
    quote: "I came for a weekend and stayed for a month. The quiet is absolute. The food is clean and comforting, tasting of the soil here. Rich Inn Palace is a sanctuary for the creative spirit.",
    author: "Julian Thorne",
    role: "Creative Director",
    rating: 5,
    avatar: "/images/photos9.jpg",
    stayDate: "Stayed Jan 2001",
    verified: true,
  },
  {
    quote: "A rare resort where the reality exceeds the photographs. The attention to detail in the lime plaster walls and local arches is breathtaking. Truly luxury in its purest form.",
    author: "Meera Nair",
    role: "Editorial Designer",
    rating: 5,
    avatar: "/images/photos3.jpg",
    stayDate: "Stayed May 2001",
    verified: true,
  },
];

export const whyChooseUs = [
  {
    icon: "Compass",
    title: "Curated Excursions",
    description: "Private walks through historic heritage sites led by local historians and architects.",
  },
  {
    icon: "Sparkles",
    title: "Holistic Wellness",
    description: "Ayurvedic therapy and guided sound bath healing overlooking coastal sanctuaries.",
  },
  {
    icon: "ChefHat",
    title: "Heirloom Dining",
    description: "Custom tasting menus showcasing seasonal South Indian ingredients from farm to table.",
  },
  {
    icon: "ShieldCheck",
    title: "Absolute Seclusion",
    description: "Walled estate structure ensuring complete privacy and safety for high-profile stays.",
  },
];

export const galleryImages = [
  { src: "/images/photos4.jpg", title: "The Sanctuary Lounge" },
  { src: "/images/photos5.jpg", title: "Morning Light in Courtyard" },
  { src: "/images/photos6.jpg", title: "Detail of Lime Plaster Arch" },
  { src: "/images/photos7.jpg", title: "The Heated Pool at Sunset" },
  { src: "/images/photos8.jpg", title: "Sanctuary Bathroom Detail" },
  { src: "/images/photos9.jpg", title: "Jasmine Climbing Courtyard Walls" },
];

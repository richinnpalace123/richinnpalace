import { SITE_CONFIG } from "./config";

export interface RoomVariety {
  id: string;
  name: string;
  roomType: "Executive Room" | "Suite Room";
  occupancy: "Single" | "Double";
  price: number;
  priceDisplay: string;
  size: string;
  bed: string;
  maxGuests: string;
  image: string;
  video?: string;
  description: string;
}

export interface Branch {
  id: string;
  slug: string;
  name: string;
  title: string;
  area: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  startingPrice: number;
  startingPriceDisplay: string;
  image: string;
  video?: string;
  gallery: string[];
  googleMapsUrl: string;
  extraBedRate: number;
  inclusions: string[];
  roomVarieties: RoomVariety[];
}

export interface RoomBranchTariff {
  branchId: string;
  branchName: string;
  singlePrice: number;
  doublePrice: number;
  extraBedPrice: number;
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
  inclusions: string[];
  amenities: string[];
  specs: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  attractions: { name: string; distance: string }[];
  branches: Branch[];
  tariffs: RoomBranchTariff[];
}

export const EXTRA_BED_RATE = 700;

export const branches: Branch[] = [
  {
    id: "tnagar-rangan",
    slug: "rangan-street-tnagar",
    title: "Rich Inn Palace Rangon Street",
    name: "Rich Inn Palace Rangon Street",
    area: "T. Nagar",
    tagline: "Prime shopping and central heritage comfort in T. Nagar.",
    description: "Located on Rangan Street in the heart of T. Nagar, near Chennai's primary shopping streets and transit terminals.",
    address: "29, Rangan St, Postal Colony, T. Nagar, Chennai, Greater Chennai, Tamil Nadu 600017",
    phone: "+91 98847 62222",
    startingPrice: 3200,
    startingPriceDisplay: "₹3,200",
    image: "/images/rangon_street/4.jpeg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340925/t_nagar_5bhk.mp4",
    gallery: [
      "/images/rangon_street/4.jpeg",
      "/images/rangon_street/1.jpeg",
      "/images/rangon_street/2.jpeg",
      "/images/rangon_street/3.jpeg",
    ],
    googleMapsUrl: "https://maps.app.goo.gl/QeTYk12QWFBQT5C89",
    extraBedRate: 700,
    inclusions: [
      "Including buffet breakfast (south indian)",
      "WiFi",
      "24/7 room service",
      "Mini bar set up in rooms",
    ],
    roomVarieties: [
      {
        id: "rangan-exec-single",
        name: "EXECUTIVE ROOM SINGLE",
        roomType: "Executive Room",
        occupancy: "Single",
        price: 3200,
        priceDisplay: "RS 3200",
        size: "360 SF",
        bed: "Queen Plush Bed",
        maxGuests: "1 Guest",
        image: "/images/rangon_street/4.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340925/t_nagar_5bhk.mp4",
        description: "Elegant single occupancy room with work desk, in-room mini bar, high-speed WiFi, and 24/7 room service.",
      },
      {
        id: "rangan-exec-double",
        name: "EXECUTIVE ROOMS DOUBLE",
        roomType: "Executive Room",
        occupancy: "Double",
        price: 3800,
        priceDisplay: "RS 3800",
        size: "360 SF",
        bed: "Queen / Twin Plush Bed",
        maxGuests: "2 Guests",
        image: "/images/rangon_street/2.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340925/t_nagar_5bhk.mp4",
        description: "Comfortable double occupancy room with premium linens, mini bar, complimentary South Indian buffet breakfast.",
      },
      {
        id: "rangan-suit-single",
        name: "SUIT ROOMS SINGLE",
        roomType: "Suite Room",
        occupancy: "Single",
        price: 4800,
        priceDisplay: "RS 4800",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "1 Guest",
        image: "/images/rangon_street/3.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
        description: "Spacious luxury suite with separate sitting lounge, king bedding, curated mini bar, and 24-hr check-in.",
      },
      {
        id: "rangan-suit-double",
        name: "SUIT ROOMS DOUBLE",
        roomType: "Suite Room",
        occupancy: "Double",
        price: 5600,
        priceDisplay: "RS 5600",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "2-3 Guests",
        image: "/images/rangon_street/4.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
        description: "Master suite layout with expansive living quarters, extra bed option (₹700), and South Indian buffet breakfast.",
      },
    ],
  },
  {
    id: "tnagar-pondy",
    slug: "rajabather-street-pondybazar",
    title: "Rich Inn Palace Pondy Bazar",
    name: "Rich Inn Palace Pondy Bazar",
    area: "T. Nagar",
    tagline: "Steps away from Pondy Bazaar with quiet boutique luxury.",
    description: "Situated on Rajabather Street right off Pondy Bazaar, offering premium tranquility and immediate access to shopping & dining.",
    address: "50, Raja Badar Street, Parthasarathi Puram, T. Nagar, Chennai, Tamil Nadu 600017",
    phone: "+91 98847 62222",
    startingPrice: 3200,
    startingPriceDisplay: "₹3,200",
    image: "/images/pondy_bazaar/1.jpeg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340853/t_nagar_2.mp4",
    gallery: [
      "/images/pondy_bazaar/1.jpeg",
      "/images/pondy_bazaar/2.jpeg",
      "/images/pondy_bazaar/3.jpeg",
      "/images/pondy_bazaar/4.jpeg",
      "/images/pondy_bazaar/5.jpeg",
      "/images/pondy_bazaar/6.jpeg",
      "/images/pondy_bazaar/7.jpeg",
      "/images/pondy_bazaar/8.jpeg",
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rich+Inn+Palace+50+Raja+Badar+Street+Parthasarathi+Puram+T+Nagar+Chennai+Tamil+Nadu+600017",
    extraBedRate: 700,
    inclusions: [
      "Including buffet breakfast (south indian)",
      "WiFi",
      "24/7 room service",
      "Mini bar set up in rooms",
    ],
    roomVarieties: [
      {
        id: "pondy-exec-single",
        name: "EXECUTIVE ROOM SINGLE",
        roomType: "Executive Room",
        occupancy: "Single",
        price: 3200,
        priceDisplay: "RS 3200",
        size: "360 SF",
        bed: "Queen Plush Bed",
        maxGuests: "1 Guest",
        image: "/images/pondy_bazaar/1.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340853/t_nagar_2.mp4",
        description: "Boutique single executive room off Pondy Bazaar with mini bar, smart TV, WiFi, and South Indian buffet breakfast.",
      },
      {
        id: "pondy-exec-double",
        name: "EXECUTIVE ROOMS DOUBLE",
        roomType: "Executive Room",
        occupancy: "Double",
        price: 3800,
        priceDisplay: "RS 3800",
        size: "360 SF",
        bed: "Queen / Twin Bed",
        maxGuests: "2 Guests",
        image: "/images/pondy_bazaar/2.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340853/t_nagar_2.mp4",
        description: "Double executive room with custom mini bar setup, 24/7 room service, air conditioning, and 24-hr check-in.",
      },
      {
        id: "pondy-suit-single",
        name: "SUIT ROOMS SINGLE",
        roomType: "Suite Room",
        occupancy: "Single",
        price: 4800,
        priceDisplay: "RS 4800",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "1 Guest",
        image: "/images/pondy_bazaar/3.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
        description: "Private suite with executive lounge space, complimentary South Indian breakfast, and dedicated desk concierge.",
      },
      {
        id: "pondy-suit-double",
        name: "SUIT ROOMS DOUBLE",
        roomType: "Suite Room",
        occupancy: "Double",
        price: 5600,
        priceDisplay: "RS 5600",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "2-3 Guests",
        image: "/images/pondy_bazaar/4.jpeg",
        video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
        description: "Spacious Pondy Bazaar suite for double occupancy, extra bed option (₹700), luxury amenities, and 24/7 service.",
      },
    ],
  },
  {
    id: "vadapalani-saligramam",
    slug: "saligramam-vadapalani",
    title: "Rich Inn Palace Vadapalani",
    name: "Rich Inn Palace Vadapalani",
    area: "Vadapalani",
    tagline: "Conveniently located near Vadapalani Murugan Temple & SIMS Hospital.",
    description: "Located in Saligramam, Vadapalani, offering quick connectivity to Arcot Road, Forum Vijaya Mall, and Chennai metro.",
    address: "Richinn palace, no.9,10, 2nd St, Dhanalakshmi Colony, Thangal karai, Saligramam, Chennai, Greater Chennai, Tamil Nadu 600026",
    phone: "+91 98847 62222",
    startingPrice: 2800,
    startingPriceDisplay: "₹2,800",
    image: "/images/vadapalani/1.jpg",
    gallery: [
      "/images/vadapalani/1.jpg",
      "/images/vadapalani/2.jpg",
      "/images/vadapalani/3.jpg",
    ],
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Richinn+palace+no+9+10+2nd+St+Dhanalakshmi+Colony+Thangal+karai+Saligramam+Chennai+Greater+Chennai+Tamil+Nadu+600026",
    extraBedRate: 700,
    inclusions: [
      "Including buffet breakfast (south indian)",
      "WiFi",
      "24/7 room service",
      "Mini bar set up in rooms",
    ],
    roomVarieties: [
      {
        id: "vadapalani-exec-single",
        name: "EXECUTIVE ROOM SINGLE",
        roomType: "Executive Room",
        occupancy: "Single",
        price: 2800,
        priceDisplay: "RS 2800",
        size: "360 SF",
        bed: "Queen Plush Bed",
        maxGuests: "1 Guest",
        image: "/images/vadapalani/1.jpg",
        description: "Budget luxury single room in Vadapalani with mini bar setup, fast WiFi, 24/7 room service & South Indian breakfast.",
      },
      {
        id: "vadapalani-exec-double",
        name: "EXECUTIVE ROOMS DOUBLE",
        roomType: "Executive Room",
        occupancy: "Double",
        price: 3200,
        priceDisplay: "RS 3200",
        size: "360 SF",
        bed: "Queen / Twin Bed",
        maxGuests: "2 Guests",
        image: "/images/vadapalani/2.jpg",
        description: "Executive double room in Saligramam with 24-hr check-in, mini bar, climate control, and buffet breakfast.",
      },
      {
        id: "vadapalani-suit-single",
        name: "SUIT ROOMS SINGLE",
        roomType: "Suite Room",
        occupancy: "Single",
        price: 3200,
        priceDisplay: "RS 3200",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "1 Guest",
        image: "/images/vadapalani/3.jpg",
        description: "Spacious single suite at extraordinary rate (₹3,200) with private living area, smart TV, mini bar, and 24/7 service.",
      },
      {
        id: "vadapalani-suit-double",
        name: "SUIT ROOMS DOUBLE",
        roomType: "Suite Room",
        occupancy: "Double",
        price: 3600,
        priceDisplay: "RS 3600",
        size: "540 SF",
        bed: "Imperial King Bed",
        maxGuests: "2-3 Guests",
        image: "/images/vadapalani/1.jpg",
        description: "Full suite room for 2 guests with optional extra bed (₹700), complimentary South Indian buffet breakfast & 24/7 support.",
      },
    ],
  },
];

export const hotelDetails = {
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  subTitle: SITE_CONFIG.subTitle,
  description: "A sanctuary of comfort and hospitality across Chennai's premier locations — T. Nagar and Vadapalani.",
  phone: SITE_CONFIG.contact.phone,
  email: SITE_CONFIG.contact.email,
  address: "T. Nagar (Rangan St & Pondy Bazaar) & Vadapalani (Saligramam), Chennai",
  googleMapsLink: SITE_CONFIG.contact.googleMapsUrl,
};

export const stats = [
  { value: "5.0", label: "Customer Reviews", subLabel: "★★★★★" },
  { value: "15,000+", label: "SATISFIED GUESTS", subLabel: "TRUSTED EXPERIENCES" },
  { value: "3", label: "PRIME CHENNAI BRANCHES", subLabel: "T. NAGAR & VADAPALANI" },
  { value: "24/7", label: "ROOM SERVICE & CHECK-IN", subLabel: "ROUND-THE-CLOCK CARE" },
];

export const rooms: Room[] = [
  {
    id: "executive-room",
    slug: "executive-room",
    name: "Executive Room",
    tag: "POPULAR CHOICE",
    price: 3200,
    priceDisplay: "From ₹2,800",
    size: "360 SF",
    guests: "2 Guests + 1 Extra Bed",
    description: "Refined comfort with modern amenities, ideal for business travelers and couples.",
    longDescription: "Our Executive Rooms provide an oasis of elegance and modern convenience. Each room is meticulously appointed with comfortable bedding, ambient lighting, work desk, in-room mini bar, high-speed Wi-Fi, and 24/7 room service. Enjoy our complimentary South Indian vegetarian buffet breakfast every morning.",
    image: "/images/rangon_street/1.jpeg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786340853/t_nagar_2.mp4",
    gallery: [
      "/images/rangon_street/1.jpeg",
      "/images/pondy_bazaar/1.jpeg",
      "/images/vadapalani/1.jpg",
    ],
    inclusions: [
      "Complimentary South Indian Veg Buffet Breakfast",
      "High-Speed Wi-Fi Access",
      "24/7 Dedicated Room Service",
      "In-Room Mini Bar Setup",
      "24-Hour Flexible Check-in & Check-out",
    ],
    amenities: [
      "Complimentary South Indian Veg Buffet Breakfast",
      "High-Speed Wi-Fi Access",
      "24/7 Room Service & Front Desk",
      "Mini Bar Setup in Rooms",
      "24-Hour Check-in & Check-out",
      "Individually Controlled Air Conditioning",
      "Extra Bed Available (₹700 / night)",
      "Daily Housekeeping & Linen Care",
      "Flat Screen HD Smart TV",
      "Tea & Coffee Maker Set",
    ],
    specs: [
      { label: "Bed Configuration", value: "Queen / Twin Plush Bed" },
      { label: "Room Size", value: "360 sq ft / 33 sq m" },
      { label: "Max Occupancy", value: "2 Adults (Extra Bed +1)" },
      { label: "T. Nagar Tariff", value: "Single ₹3,200 | Double ₹3,800" },
      { label: "Vadapalani Tariff", value: "Single ₹2,800 | Double ₹3,200" },
      { label: "Extra Bed Rate", value: "₹700 per night" },
      { label: "Breakfast", value: "South Indian Buffet Included" },
      { label: "Room Service", value: "Available 24/7" },
    ],
    faqs: [
      {
        question: "Is South Indian buffet breakfast included?",
        answer: "Yes! All room bookings include a complimentary authentic South Indian vegetarian buffet breakfast served daily."
      },
      {
        question: "What is the tariff difference between branches?",
        answer: "At our T. Nagar branches (Rangan St & Rajabather St), the Executive Room is ₹3,200 for Single and ₹3,800 for Double. At our Vadapalani branch (Saligramam), it is ₹2,800 for Single and ₹3,200 for Double."
      },
      {
        question: "Can an extra bed be added?",
        answer: "Yes, an extra rollaway bed can be added for ₹700 per night."
      },
      {
        question: "Is 24-hour check-in available?",
        answer: "Yes, we offer true 24-hour check-in and check-out flexibility so you can check in at your convenience."
      }
    ],
    attractions: [
      { name: "Pondy Bazaar Shopping District", distance: "2 mins walk" },
      { name: "T. Nagar Shopping Hub", distance: "3 mins walk" },
      { name: "Vadapalani Murugan Temple", distance: "5 mins (Vadapalani branch)" },
      { name: "Chennai Central / Airport", distance: "25-30 mins drive" }
    ],
    branches: branches,
    tariffs: [
      {
        branchId: "tnagar-rangan",
        branchName: "Rangan Street, T. Nagar",
        singlePrice: 3200,
        doublePrice: 3800,
        extraBedPrice: 700,
      },
      {
        branchId: "tnagar-pondy",
        branchName: "Rajabather Street (Pondy Bazaar), T. Nagar",
        singlePrice: 3200,
        doublePrice: 3800,
        extraBedPrice: 700,
      },
      {
        branchId: "vadapalani-saligramam",
        branchName: "Saligramam, Vadapalani",
        singlePrice: 2800,
        doublePrice: 3200,
        extraBedPrice: 700,
      },
    ],
  },
  {
    id: "suite-room",
    slug: "suite-room",
    name: "Suite Room",
    tag: "LUXURY SUITE",
    price: 4800,
    priceDisplay: "From ₹3,200",
    size: "540 SF",
    guests: "2-3 Guests + 1 Extra Bed",
    description: "Expansive suite featuring a dedicated living lounge, luxury bathroom, and curated mini bar.",
    longDescription: "Our Suite Rooms provide an elevated stay experience featuring expansive living quarters, a plush king-sized bed, seating area, dedicated work station, and premium ensuite bathroom. Complete with our signature South Indian buffet breakfast, 24/7 room service, in-room mini bar, and 24-hour flexible check-in.",
    image: "/images/pondy_bazaar/3.jpeg",
    video: "https://res.cloudinary.com/u4u9xqwy/video/upload/q_auto,f_auto/v1786341698/reel_2_v.mp4",
    gallery: [
      "/images/pondy_bazaar/3.jpeg",
      "/images/rangon_street/3.jpeg",
      "/images/vadapalani/3.jpg",
    ],
    inclusions: [
      "Complimentary South Indian Veg Buffet Breakfast",
      "High-Speed Wi-Fi Access",
      "24/7 Dedicated Room Service",
      "In-Room Mini Bar Setup",
      "24-Hour Flexible Check-in & Check-out",
    ],
    amenities: [
      "Complimentary South Indian Veg Buffet Breakfast",
      "High-Speed Wi-Fi Access",
      "24/7 Dedicated Room Service & Concierge",
      "In-Room Mini Bar Setup",
      "Spacious Separate Living & Sitting Lounge",
      "24-Hour Check-in & Check-out Service",
      "Extra Bed Provision (₹700 / night)",
      "Premium Bathroom with Deluxe Toiletries",
      "Large HD Smart Television with OTT",
      "Complimentary Bottled Water & Beverage Station",
    ],
    specs: [
      { label: "Bed Configuration", value: "Imperial King Size Bed" },
      { label: "Room Size", value: "540 sq ft / 50 sq m" },
      { label: "Max Occupancy", value: "3 Adults or 2 Adults + 2 Kids" },
      { label: "T. Nagar Tariff", value: "Single ₹4,800 | Double ₹5,600" },
      { label: "Vadapalani Tariff", value: "Single ₹3,200 | Double ₹3,600" },
      { label: "Extra Bed Rate", value: "₹700 per night" },
      { label: "Breakfast", value: "South Indian Buffet Included" },
      { label: "Room Service", value: "Available 24/7" },
    ],
    faqs: [
      {
        question: "What is included with the Suite Room booking?",
        answer: "Your stay includes a complimentary South Indian vegetarian buffet breakfast, high-speed Wi-Fi, 24/7 room service, in-room mini bar, and 24-hour flexible check-in & check-out."
      },
      {
        question: "What are the Suite Room tariffs across branches?",
        answer: "At T. Nagar (Rangan St & Rajabather St), the Suite is ₹4,800 for Single and ₹5,600 for Double. At Vadapalani (Saligramam), the Suite is ₹3,200 for Single and ₹3,600 for Double."
      },
      {
        question: "Can we request an extra bed for family?",
        answer: "Yes, an extra bed is available for ₹700 per night. The spacious suite layout easily accommodates the extra bed."
      }
    ],
    attractions: [
      { name: "Pondy Bazaar & Rangan Street", distance: "Immediate access" },
      { name: "Vadapalani Murugan Temple", distance: "5 mins (Vadapalani)" },
      { name: "Forum Vijaya Mall", distance: "8 mins drive" },
      { name: "Chennai Airport (MAA)", distance: "25 mins drive" }
    ],
    branches: branches,
    tariffs: [
      {
        branchId: "tnagar-rangan",
        branchName: "Rangan Street, T. Nagar",
        singlePrice: 4800,
        doublePrice: 5600,
        extraBedPrice: 700,
      },
      {
        branchId: "tnagar-pondy",
        branchName: "Rajabather Street (Pondy Bazaar), T. Nagar",
        singlePrice: 4800,
        doublePrice: 5600,
        extraBedPrice: 700,
      },
      {
        branchId: "vadapalani-saligramam",
        branchName: "Saligramam, Vadapalani",
        singlePrice: 3200,
        doublePrice: 3600,
        extraBedPrice: 700,
      },
    ],
  },
];

/**
 * Calculates the room price given roomId, branchId, and occupancy ('single' or 'double')
 */
export function getRoomPrice(
  roomId: string,
  branchId: string = "tnagar-rangan",
  occupancy: "single" | "double" = "double"
): number {
  const room = rooms.find((r) => r.id === roomId || r.slug === roomId) || rooms[0];
  if (!room) return 3200;

  const tariff = room.tariffs?.find((t) => t.branchId === branchId) || room.tariffs?.[0];
  if (tariff) {
    return occupancy === "single" ? tariff.singlePrice : tariff.doublePrice;
  }
  return room.price;
}

/**
 * Helper to get branch by id or slug
 */
export function getBranchById(branchId: string): Branch {
  return (
    branches.find((b) => b.id === branchId || b.slug === branchId) || branches[0]
  );
}

export const manifesto = [
  {
    num: "01",
    title: "RANGON street",
    text: "1) EXECUTIVE ROOM SINGLE RS 3200 · 2) EXECUTIVE ROOMS DOUBLE RS 3800 · 3) SUIT ROOMS SINGLE RS 4800 · 4) SUIT ROOMS DOUBLE RS 5600 · Extra bed rs 700. Includes buffet breakfast (south indian), WiFi, 24/7 room service & mini bar. Phone: 9884762222.",
  },
  {
    num: "02",
    title: "RICH INN PALACE (RAJABATHER STREET PONDYBAZAR) t nagar",
    text: "1) EXECUTIVE ROOM SINGLE RS 3200 · 2) EXECUTIVE ROOMS DOUBLE RS 3800 · 3) SUIT ROOMS SINGLE RS 4800 · 4) SUIT ROOMS DOUBLE RS 5600 · Extra bed rs 700. Includes buffet breakfast (south indian), WiFi, 24/7 room service & mini bar. Phone: 9884762222.",
  },
  {
    num: "03",
    title: "3. RICH INN PALACE (Saligramam Vadapalani)",
    text: "1) EXECUTIVE ROOM SINGLE RS 2800 · 2) EXECUTIVE ROOMS DOUBLE RS 3200 · 3) SUIT ROOMS SINGLE RS 3200 · 4) SUIT ROOMS DOUBLE RS 3600 · Extra bed rs 700. Includes buffet breakfast (south indian), WiFi, 24/7 room service & mini bar.",
  },
  {
    num: "04",
    title: "Complimentary South Indian Veg Buffet Breakfast",
    text: "Every direct stay includes an authentic complimentary South Indian vegetarian buffet breakfast freshly prepared each morning.",
  },
  {
    num: "05",
    title: "24/7 Room Service & In-Room Mini Bar",
    text: "Round-the-clock room service and curated in-room mini bar setups in every room for seamless convenience.",
  },
  {
    num: "06",
    title: `Direct Reservations Desk (${SITE_CONFIG.contact.phone})`,
    text: `Reach our central desk directly at ${SITE_CONFIG.contact.phone} for instant bookings, corporate rates, and custom group arrangements.`,
  },
];

export const testimonials = [
  {
    quote: "Exceptional stay at Rich Inn Palace in T. Nagar. The 24-hour check-in policy made our late arrival effortless, and the South Indian buffet breakfast was outstanding.",
    author: "Karthik Subramanian",
    role: "Business Traveler",
    rating: 5,
    avatar: "/images/rangon_street/2.jpeg",
    stayDate: "Stayed Feb 2026",
    verified: true,
  },
  {
    quote: "Very clean executive room with 24/7 room service and mini bar. Centrally located right near Pondy Bazaar. Best value for money in Chennai.",
    author: "Ananya Rao",
    role: "Corporate Executive",
    rating: 5,
    avatar: "/images/pondy_bazaar/2.jpeg",
    stayDate: "Stayed Jan 2026",
    verified: true,
  },
  {
    quote: "We booked the Suite Room at Vadapalani for a family trip. The extra bed arrangement and breakfast were seamless. Highly recommended!",
    author: "Dr. Rajesh Varma",
    role: "Family Guest",
    rating: 5,
    avatar: "/images/vadapalani/2.jpg",
    stayDate: "Stayed Dec 2025",
    verified: true,
  },
];

export const whyChooseUs = [
  {
    icon: "Utensils",
    title: "South Indian Buffet Breakfast",
    description: "Complimentary authentic vegetarian breakfast buffet included with all bookings.",
  },
  {
    icon: "Clock",
    title: "True 24-Hour Check-In",
    description: "Check in anytime and enjoy a full 24-hour stay with 24/7 front desk and room service.",
  },
  {
    icon: "Wifi",
    title: "High-Speed Wi-Fi & Mini Bar",
    description: "Seamless connectivity and in-room mini bar setups for maximum comfort.",
  },
  {
    icon: "MapPin",
    title: "3 Prime Chennai Locations",
    description: "Rangan Street & Pondy Bazaar in T. Nagar, and Saligramam in Vadapalani.",
  },
];

export const galleryImages = [
  { src: "/images/rangon_street/1.jpeg", title: "Executive Room — Rangon Street" },
  { src: "/images/pondy_bazaar/1.jpeg", title: "Pondy Bazaar Executive Room" },
  { src: "/images/vadapalani/1.jpg", title: "Vadapalani Executive Room" },
  { src: "/images/rangon_street/2.jpeg", title: "Rangon Street Deluxe Suite" },
  { src: "/images/pondy_bazaar/2.jpeg", title: "Pondy Bazaar Suite Lounge" },
  { src: "/images/vadapalani/2.jpg", title: "Vadapalani Suite Room" },
];

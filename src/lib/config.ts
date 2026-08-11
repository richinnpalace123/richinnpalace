/**
 * Centralized Site Configuration & Production Environment Constants
 */
export const SITE_CONFIG = {
  name: "Rich Inn Palace",
  tagline: "Luxury, redefined.",
  subTitle: "ESTD. 2001 | CHENNAI · IN",
  domain: process.env.NEXT_PUBLIC_SITE_URL || "https://richinnpalace.com",
  canonicalUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://richinnpalace.com",
  contact: {
    email: process.env.NEXT_PUBLIC_HOTEL_EMAIL || "reservations@richinnpalace.com",
    phone: "+91 98847 62222",
    altPhone: "+91 98847 62222",
    address: "Rich Inn Palace, T.Nagar & Vadapalani, Chennai, Tamil Nadu, 600017, India",
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Rich+Inn+Palace+T.Nagar+Chennai",
  },
};

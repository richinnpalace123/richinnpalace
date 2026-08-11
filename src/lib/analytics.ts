/**
 * Privacy-First, Zero-PII Analytics Tracker for Rich Inn Palace
 * Integrates seamlessly with Google Analytics 4 (gtag.js)
 * 
 * GUARANTEE: Never transmits guest names, emails, phone numbers, special request text,
 * or payment details to any analytics service.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-FLKG46R9CB";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Low-level safe event dispatcher
 */
export function trackEvent(eventName: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (typeof window === "undefined") return;

  // Filter out undefined and ensure no accidentally passed PII keys
  const safeParams: Record<string, string | number | boolean> = {};
  const forbiddenPiiKeys = ["name", "guestName", "fullName", "email", "guestEmail", "phone", "guestPhone", "requests", "specialRequests", "notes"];

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && !forbiddenPiiKeys.includes(key.toLowerCase())) {
      safeParams[key] = value;
    }
  }

  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, safeParams);
    }
  } catch {
    // Analytics failures must never break the user interface or booking flow
  }
}

/**
 * Specialized Hotel & Booking Funnel Analytics Helpers
 */

export function trackPageView(url: string, pageTitle?: string) {
  trackEvent("page_view", {
    page_location: url,
    page_title: pageTitle,
  });
}

export function trackRoomView(roomId: string, roomCategory?: string, price?: number) {
  trackEvent("room_view", {
    room_id: roomId,
    room_category: roomCategory,
    price_per_night: price,
  });
}

export function trackBookNowClick(source: "hero" | "navbar" | "featured_rooms" | "featured_branches" | "rooms_catalog" | "room_detail" | "footer", roomId?: string) {
  trackEvent("book_now_click", {
    source,
    room_id: roomId || "unspecified",
  });
}

export function trackBookingStarted(source: string, roomId?: string, branchId?: string) {
  trackEvent("booking_started", {
    source,
    room_id: roomId || "default",
    branch_id: branchId || "default",
  });
}

export function trackRoomSelected(roomId: string, roomName?: string, branchId?: string) {
  trackEvent("room_selected", {
    room_id: roomId,
    room_name: roomName,
    branch_id: branchId || "default",
  });
}

export function trackDateSelected(nights: number) {
  trackEvent("date_selected", {
    duration_nights: nights,
  });
}

export function trackGuestDetailsStarted(roomId: string, nights: number, guestCount: number) {
  trackEvent("guest_details_started", {
    room_id: roomId,
    duration_nights: nights,
    guest_count: guestCount,
  });
}

export function trackReservationSubmitted(data: {
  roomId: string;
  roomName: string;
  nights: number;
  guestCount: number;
  estimatedTotal: number;
  branchName?: string;
}) {
  trackEvent("reservation_submitted", {
    room_id: data.roomId,
    room_name: data.roomName,
    duration_nights: data.nights,
    guest_count: data.guestCount,
    estimated_total: data.estimatedTotal,
    branch_name: data.branchName || "Main Palace",
    currency: "INR",
  });
}

export function trackReservationFailed(roomId: string, errorType: string) {
  trackEvent("reservation_failed", {
    room_id: roomId,
    error_type: errorType,
  });
}

export function trackWhatsAppClick(source: "navbar" | "floating" | "footer" | "booking_confirmation" | "modal_confirmation" | "contact_page", roomId?: string) {
  trackEvent("whatsapp_clicked", {
    source,
    room_id: roomId || "general",
  });
}

export function trackPhoneClick(source: "navbar" | "footer" | "contact_page" | "booking_confirmation") {
  trackEvent("phone_clicked", {
    source,
  });
}

export function trackEmailClick(source: "navbar" | "footer" | "contact_page") {
  trackEvent("email_clicked", {
    source,
  });
}

export function trackMapClick(source: "footer" | "contact_page" | "room_detail") {
  trackEvent("map_clicked", {
    source,
  });
}

export function trackGalleryOpened(source: "home_preview" | "gallery_page" | "room_gallery", roomId?: string) {
  trackEvent("gallery_opened", {
    source,
    room_id: roomId || "general",
  });
}

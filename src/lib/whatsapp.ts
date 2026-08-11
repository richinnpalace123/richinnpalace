export interface WhatsAppReservationData {
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  roomName: string;
  roomTag?: string;
  propertyName?: string;
  occupancyType?: string; // "Single Occupancy" | "Double Occupancy"
  extraBeds?: number;
  checkIn: string;
  checkOut: string;
  duration: string;
  guests: string | number;
  specialRequests?: string;
  estimatedTotal: string;
  branchPhone?: string;
}

/**
 * Retrieves the hotel WhatsApp number from environment variables or falls back to the official phone number 9884762222.
 */
export function getHotelWhatsAppNumber(): string {
  const envNumber = process.env.NEXT_PUBLIC_HOTEL_WHATSAPP_NUMBER || "";
  const cleaned = envNumber.replace(/[^0-9]/g, "");
  return cleaned || "919884762222";
}

/**
 * Builds the structured WhatsApp reservation enquiry message.
 */
export function buildWhatsAppReservationMessage(data: WhatsAppReservationData): string {
  const lines: string[] = [
    "Hello Rich Inn Palace,",
    "",
    "I would like to enquire about a room reservation request.",
    "",
    `👤 Guest Name: ${data.guestName}`,
    `🏨 Branch: ${data.propertyName || "Rich Inn Palace Chennai"}`,
    `🛏️ Room Type: ${data.roomName}${data.roomTag ? ` (${data.roomTag})` : ""}`,
  ];

  if (data.occupancyType) {
    lines.push(`👥 Occupancy: ${data.occupancyType}`);
  }

  if (data.extraBeds && data.extraBeds > 0) {
    lines.push(`🛏️ Extra Bed(s): ${data.extraBeds} (₹${data.extraBeds * 700}/night)`);
  }

  lines.push(
    `📅 Check-in: ${data.checkIn}`,
    `📅 Check-out: ${data.checkOut} (${data.duration})`,
    `👨‍👩‍👧‍👦 Total Guests: ${data.guests} Guest(s)`
  );

  if (data.guestPhone) {
    lines.push(`📞 Contact: ${data.guestPhone}`);
  }

  if (data.specialRequests && data.specialRequests.trim()) {
    lines.push(`📝 Special Requests: ${data.specialRequests.trim()}`);
  }

  lines.push(
    `💰 Estimated Total: ${data.estimatedTotal} (incl. buffet breakfast, wifi & 24/7 service)`,
    "",
    "Please let me know the availability and confirmation details. Thank you!"
  );

  return lines.join("\n");
}

/**
 * Constructs the full WhatsApp click-to-chat URL.
 */
export function buildWhatsAppUrl(data: WhatsAppReservationData): string {
  const phone = data.branchPhone ? data.branchPhone.replace(/[^0-9]/g, "") : getHotelWhatsAppNumber();
  const message = buildWhatsAppReservationMessage(data);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedText}`;
}


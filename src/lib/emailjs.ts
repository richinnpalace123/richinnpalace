import emailjs from "@emailjs/browser";

export interface ReservationEmailParams {
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  property_name: string;
  room_name: string;
  check_in: string;
  check_out: string;
  duration: string;
  guests: string | number;
  occupancy_type?: string;
  extra_bed?: string;
  special_requests: string;
  base_rate: string;
  gst: string;
  estimated_total: string;
  subject?: string;
}

export const EMAILJS_CONFIG = {
  get serviceId() {
    return process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
  },
  get templateId() {
    return process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
  },
  get publicKey() {
    return process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
  },
};

/**
 * Sends reservation request email via EmailJS client SDK without exposing any secret keys.
 */
export async function sendReservationEmail(params: ReservationEmailParams): Promise<boolean> {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || EMAILJS_CONFIG.serviceId;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || EMAILJS_CONFIG.templateId;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || EMAILJS_CONFIG.publicKey;

  if (!serviceId || !templateId || !publicKey) {
    console.error(
      "EmailJS configuration missing. Please ensure NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, and NEXT_PUBLIC_EMAILJS_PUBLIC_KEY are set in .env.local."
    );
    throw new Error("Reservation email service is unconfigured. Please configure environment variables in .env.local.");
  }

  const templateParams: Record<string, unknown> = {
    ...params,
    subject: params.subject || `New Reservation Request — ${params.room_name} — ${params.check_in}`,
  };

  const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
  return response.status === 200;
}

"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { sanitizePhoneInput, validateIndianPhoneNumber } from "@/lib/utils";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneInput(e.target.value);
    setPhone(sanitized);
    const err = validateIndianPhoneNumber(sanitized);
    if (err) {
      setPhoneError(err);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phErr = validateIndianPhoneNumber(phone);
    if (phErr) {
      setPhoneError(phErr);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4 bg-bg-dark/40 rounded-xl border border-gold/30">
        <div className="w-12 h-12 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto">
          <Check size={20} />
        </div>
        <h3 className="font-serif text-xl text-text-offwhite">Inquiry Received</h3>
        <p className="text-xs text-text-gray font-light">
          Thank you for reaching out. Our central reservations concierge will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4 text-xs font-sans" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider text-text-gray font-medium">Your Name</label>
          <input
            type="text"
            required
            placeholder="Karthik Subramanian"
            className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 text-text-offwhite focus:outline-none focus:border-gold transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider text-text-gray font-medium">Email Address</label>
          <input
            type="email"
            required
            placeholder="karthik@domain.com"
            className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 text-text-offwhite focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider text-text-gray font-medium">Phone Number</label>
          <input
            type="tel"
            required
            maxLength={15}
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+91 98847 62222"
            className={`w-full bg-bg-dark border rounded-lg p-3 text-text-offwhite focus:outline-none transition-colors ${
              phoneError ? "border-red-500 bg-red-500/5" : "border-border-dark focus:border-gold"
            }`}
          />
          {phoneError && (
            <span className="text-[10px] text-red-400 font-medium">{phoneError}</span>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase tracking-wider text-text-gray font-medium">Preferred Branch</label>
          <select className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 text-text-offwhite focus:outline-none focus:border-gold transition-colors cursor-pointer">
            <option value="rangan">Rich Inn Palace Rangon Street</option>
            <option value="pondy">Rich Inn Palace Pondy Bazar</option>
            <option value="saligramam">Rich Inn Palace Vadapalani</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[9px] uppercase tracking-wider text-text-gray font-medium">Message</label>
        <textarea
          rows={4}
          required
          placeholder="How may our concierge assist your upcoming stay, room selection, or corporate booking..."
          className="w-full bg-bg-dark border border-border-dark rounded-lg p-3 text-text-offwhite focus:outline-none focus:border-gold transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gold text-bg-dark uppercase tracking-widest font-medium rounded-lg hover:bg-gold-hover transition-colors cursor-pointer"
      >
        Submit Concierge Inquiry
      </button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Plane, Utensils, Clock, DollarSign, BedDouble, Tv, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const homeFAQs = [
  {
    icon: MapPin,
    question: "What is the distance between the city centre and the Rich Inn Palace Tnagar?",
    answer: "The Rich Inn Palace Tnagar is located right in the centre of Chennai, offering convenient access to major shopping districts, corporate hubs, and cultural landmarks."
  },
  {
    icon: Plane,
    question: "What is the nearest airport from Rich Inn Palace Tnagar?",
    answer: "The nearest airport is Chennai International Airport (MAA), located within 5 km from Rich Inn Palace Tnagar. We offer private executive car transfers to and from the airport."
  },
  {
    icon: Utensils,
    question: "Are there any restaurants near the hotel?",
    answer: "Guests can enjoy authentic regional cuisine at Karaikudi Chettinad Mess, serving exquisite Indian dishes just a short walk from the hotel. Additional luxury dining options are also nearby."
  },
  {
    icon: Clock,
    question: "What is the time for check-in and check-out at the 3-star Rich Inn Palace Tnagar?",
    answer: "At Rich Inn Palace Tnagar, check-in is welcome from 12:00 PM, and check-out is requested by 11:00 AM. Requests for early arrival or late departure are subject to unhurried availability."
  },
  {
    icon: DollarSign,
    question: "What is the minimum price of a room in Rich Inn Palace Tnagar?",
    answer: "Room rates at Rich Inn Palace Tnagar start from $34 per night. Rates may vary based on seasonal selections and availability."
  },
  {
    icon: BedDouble,
    question: "What room options does the inn offer?",
    answer: "Our chambers feature multiple premium formats tailored to your comfort, including: the Family Suite, the Executive Suite, and the Deluxe Queen Room."
  },
  {
    icon: Tv,
    question: "What are the room amenities at Rich Inn Palace Tnagar?",
    answer: "Most rooms at Rich Inn Palace Tnagar are meticulously furnished with a writing table, a flat-screen TV with satellite channels, high-speed Wi-Fi, and a climate-control air conditioner."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFAQs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section id="faq" className="py-12 md:py-32 bg-bg-dark border-b border-border-dark">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">

          {/* Left Column: Title */}
          <div className="lg:col-span-4 lg:sticky lg:top-1/2 lg:-translate-y-1/2 lg:h-fit text-left flex flex-col items-start justify-center">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
              05 · FAQ
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-[1.15] mb-6">
              Frequently <br />
              Asked Questions.
            </h2>
            <p className="font-sans text-xs tracking-wide leading-relaxed text-text-gray/80 font-light max-w-sm">
              A brief guide to your stay, dining, directions, and accommodations at our Chennai sanctuary.
            </p>
          </div>

          {/* Right Column: FAQ Accordion */}
          <div className="lg:col-span-8 lg:pl-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              {homeFAQs.map((faq, index) => {
                const Icon = faq.icon;
                const isOpen = openIndex === index;

                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="border border-border-dark/60 rounded-xl bg-surface-dark/20 overflow-hidden transition-all duration-300 hover:border-gold/20"
                  >
                    {/* Header */}
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full flex items-center justify-between p-5 text-left font-serif text-base text-text-offwhite font-light hover:text-gold transition-colors duration-300 focus:outline-none cursor-pointer group"
                    >
                      <div className="flex items-center space-x-4">
                        <Icon size={16} className="text-gold shrink-0 transition-transform group-hover:scale-110 duration-300" />
                        <span>{faq.question}</span>
                      </div>
                      <ChevronDown
                        size={16}
                        className={cn(
                          "text-gold/60 transition-transform duration-500 ease-out shrink-0",
                          isOpen && "transform rotate-180 text-gold"
                        )}
                      />
                    </button>

                    {/* Answer */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div className="p-5 pt-0 pl-14 border-t border-border-dark/30 font-sans text-xs md:text-sm text-text-gray font-light leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

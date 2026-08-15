"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { MapPin, Utensils, Clock, DollarSign, BedDouble, Wifi, ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const homeFAQs = [
  {
    icon: MapPin,
    question: "Where are the 3 Rich Inn Palace branches located in Chennai?",
    answer: "We have two branches in T. Nagar: Rangan Street (T. Nagar) and Rajabather Street (Pondy Bazaar, T. Nagar), and our third branch in Saligramam (Vadapalani), near Murugan Temple and SIMS Hospital."
  },
  {
    icon: DollarSign,
    question: "What are the room tariffs across branches?",
    answer: "At our T. Nagar branches, Executive Rooms are ₹3,200 (Single) / ₹3,800 (Double) and Suite Rooms are ₹4,800 (Single) / ₹5,600 (Double). At our Vadapalani branch, Executive Rooms are ₹2,800 (Single) / ₹3,200 (Double) and Suite Rooms are ₹3,200 (Single) / ₹3,600 (Double). Extra beds are ₹700 per night."
  },
  {
    icon: Utensils,
    question: "Is complimentary breakfast included in the stay?",
    answer: "Yes! Every direct booking includes an authentic complimentary South Indian vegetarian buffet breakfast freshly prepared each morning."
  },
  {
    icon: Clock,
    question: "What is your check-in and check-out policy?",
    answer: "We offer true 24-hour flexible check-in and check-out across all branches, allowing you to enjoy a full 24-hour stay starting from your arrival time."
  },
  {
    icon: BedDouble,
    question: "Can an extra bed be added for children or additional guests?",
    answer: "Yes, rollaway extra beds can easily be added to both Executive and Suite rooms for ₹700 per night."
  },
  {
    icon: Wifi,
    question: "What in-room amenities and services are provided?",
    answer: "All rooms include high-speed Wi-Fi, 24/7 room service, in-room mini bar setups, individually controlled air conditioning, smart HD TVs, and daily housekeeping."
  },
  {
    icon: Phone,
    question: "How can I make an instant reservation or contact the desk?",
    answer: "You can book directly on our website or contact our 24/7 central desk directly via phone at +91 98847 62222 or WhatsApp at +91 81899 99227."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
              05 · FREQUENTLY ASKED
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-[1.15] mb-6">
              Essential Stay <br />
              Information.
            </h2>
            <p className="font-sans text-xs tracking-wide leading-relaxed text-text-gray/80 font-light max-w-sm">
              Answers regarding our 3 Chennai branches, single/double tariffs, breakfast inclusions, 24/7 room service, and booking policies.
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

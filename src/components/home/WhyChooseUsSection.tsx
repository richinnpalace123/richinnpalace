"use client";

import { motion, Variants } from "framer-motion";
import { whyChooseUs } from "@/lib/data";
import { Utensils, Clock, Wifi, MapPin, Compass, Sparkles, ChefHat, ShieldCheck } from "lucide-react";

export default function WhyChooseUsSection() {
  const iconMap = {
    Utensils: Utensils,
    Clock: Clock,
    Wifi: Wifi,
    MapPin: MapPin,
    Compass: Compass,
    Sparkles: Sparkles,
    ChefHat: ChefHat,
    ShieldCheck: ShieldCheck,
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="py-24 md:py-32 bg-bg-dark border-b border-border-dark">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Section Header */}
        <div className="mb-16 md:mb-20 text-center max-w-xl mx-auto">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold font-sans font-medium mb-3 block">
            06 · EXPERIENCE & WELLNESS
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-text-offwhite font-light tracking-wide leading-tight">
            Curated encounters in our sanctuary.
          </h2>
        </div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {whyChooseUs.map((item, idx) => {
            // Dynamically select the icon
            const Icon = iconMap[item.icon as keyof typeof iconMap] || Compass;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-surface-dark/50 border border-transparent hover:border-border-dark/60 transition-all duration-500 group"
              >
                {/* Icon wrapper */}
                <div className="w-14 h-14 rounded-full border border-border-dark flex items-center justify-center text-gold group-hover:border-gold group-hover:bg-gold group-hover:text-bg-dark transition-all duration-500">
                  <Icon size={20} className="stroke-[1.25]" />
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl text-text-offwhite font-light group-hover:text-gold transition-colors duration-300">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-xs md:text-sm text-text-gray/80 font-light leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

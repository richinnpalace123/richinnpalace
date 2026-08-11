"use client";

import { motion, Variants } from "framer-motion";
import { stats } from "@/lib/data";

export default function StatsSection() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="stats" className="py-8 md:py-18 bg-bg-dark border-border-dark relative z-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 md:gap-12"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="flex flex-col items-start space-y-2 group"
            >
              {/* Stat Value */}
              <div className="font-serif text-4xl md:text-5xl text-text-offwhite font-light tracking-wide flex flex-col items-start">
                <span>{stat.value}</span>
                {stat.label === "GOOGLE RATING" && (
                  <span className="text-gold text-xs tracking-wider mt-1.5" aria-hidden="true">
                    ★★★★★
                  </span>
                )}
              </div>

              {/* Labels */}
              <div className="space-y-0.5">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold font-medium block">
                  {stat.label}
                </span>
                <span className="text-[9px] uppercase tracking-[0.15em] text-text-gray font-light block">
                  {stat.subLabel}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

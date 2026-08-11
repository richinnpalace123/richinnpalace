"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  X,
  Sparkles,
} from "lucide-react";

interface LuxuryImageSliderProps {
  images: string[];
  title: string;
  badge?: string;
  autoPlayInterval?: number;
}

export default function LuxuryImageSlider({
  images = [],
  title,
  badge = "Exclusive Sanctuary Gallery",
  autoPlayInterval = 5000,
}: LuxuryImageSliderProps) {
  const validImages = images.length > 0 ? images : ["/images/photos4.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isAutoPlaying || isHovered || isFullscreen) return;
    const timer = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, isFullscreen, autoPlayInterval, nextSlide]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeThumb = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  return (
    <>
      <div
        className="relative w-full rounded-3xl overflow-hidden bg-surface-dark border border-border-dark/80 shadow-2xl group select-none"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Cinema Viewport */}
        <div className="relative w-full h-[320px] sm:h-[440px] md:h-[520px] overflow-hidden bg-bg-dark">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 w-full h-full cursor-zoom-in"
              onClick={() => setIsFullscreen(true)}
            >
              <Image
                src={validImages[currentIndex]}
                alt={`${title} - Photo ${currentIndex + 1}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 85vw"
                className="object-cover"
              />
              {/* Subtle Luxury Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-bg-dark/40 pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Top Bar: Badge & Action Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
            {/* Gallery Badge */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-bg-dark/70 backdrop-blur-md border border-gold/30 text-[9px] uppercase tracking-[0.2em] font-sans font-medium text-gold">
              <Sparkles size={11} className="text-gold animate-pulse" />
              <span>{badge}</span>
            </div>

            {/* Top Right: Counter & Fullscreen button */}
            <div className="flex items-center space-x-2">
              <div className="px-3 py-1.5 rounded-full bg-bg-dark/70 backdrop-blur-md border border-border-dark text-[10px] font-mono text-text-offwhite font-medium">
                <span className="text-gold">{String(currentIndex + 1).padStart(2, "0")}</span>
                <span className="text-text-gray/50 mx-1">/</span>
                <span>{String(validImages.length).padStart(2, "0")}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFullscreen(true);
                }}
                className="w-8 h-8 rounded-full bg-bg-dark/70 backdrop-blur-md border border-border-dark hover:border-gold text-text-gray hover:text-gold flex items-center justify-center transition-all cursor-pointer"
                title="View Fullscreen"
              >
                <Maximize2 size={13} />
              </button>
            </div>
          </div>

          {/* Side Navigation Arrow Buttons */}
          <div className="absolute inset-y-0 left-3 flex items-center z-20 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prevSlide();
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bg-dark/65 backdrop-blur-md border border-border-dark/80 hover:border-gold hover:bg-gold hover:text-bg-dark text-text-offwhite flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg group/btn cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} className="group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-3 flex items-center z-20 pointer-events-auto">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                nextSlide();
              }}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-bg-dark/65 backdrop-blur-md border border-border-dark/80 hover:border-gold hover:bg-gold hover:text-bg-dark text-text-offwhite flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg group/btn cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight size={20} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Bottom Overlay Title & Auto-Play Controller */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between pointer-events-none">
            <div className="pointer-events-auto">
              <h3 className="font-serif text-lg sm:text-2xl text-text-offwhite font-light drop-shadow-md">
                {title}
              </h3>
              <p className="text-[10px] text-text-gray/90 font-light hidden sm:block">
                High-Resolution Sanctuary Photography ({validImages.length} verified views)
              </p>
            </div>

            <div className="pointer-events-auto flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsAutoPlaying((prev) => !prev)}
                className="px-3 py-1.5 rounded-full bg-bg-dark/70 backdrop-blur-md border border-border-dark hover:border-gold text-[9px] uppercase tracking-wider text-text-gray hover:text-gold flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {isAutoPlaying ? <Pause size={10} /> : <Play size={10} />}
                <span className="hidden sm:inline">{isAutoPlaying ? "Pause" : "Play"}</span>
              </button>
            </div>
          </div>

          {/* Autoplay Progress Bar */}
          {isAutoPlaying && !isHovered && (
            <motion.div
              key={currentIndex}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold/60 via-gold to-gold/60 origin-left z-30 pointer-events-none"
            />
          )}
        </div>

        {/* Interactive Thumbnail Strip */}
        <div className="p-3 sm:p-4 bg-surface-dark border-t border-border-dark/60">
          <div
            ref={thumbnailsRef}
            className="flex items-center space-x-2.5 overflow-x-auto no-scrollbar py-1 scroll-smooth"
          >
            {validImages.map((img, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  className={`relative w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden shrink-0 border transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "border-gold ring-2 ring-gold/40 scale-105 shadow-md"
                      : "border-border-dark/60 opacity-60 hover:opacity-100 hover:border-gold/40"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-gold/10 pointer-events-none" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-bg-dark/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between z-10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold font-mono block">
                  {title}
                </span>
                <span className="text-xs text-text-gray font-light">
                  Viewing photo {currentIndex + 1} of {validImages.length}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFullscreen(false)}
                  className="w-10 h-10 rounded-full bg-surface-dark border border-border-dark hover:border-gold text-text-offwhite hover:text-gold flex items-center justify-center transition-all cursor-pointer"
                  title="Close Fullscreen"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Center Main High-Res Image */}
            <div className="relative flex-1 my-4 flex items-center justify-center">
              <div className="relative w-full h-full max-w-5xl max-h-[75vh]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={validImages[currentIndex]}
                      alt={`${title} - Photo ${currentIndex + 1}`}
                      fill
                      sizes="100vw"
                      className="object-contain"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prev / Next Chevrons in Fullscreen */}
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 sm:left-6 w-12 h-12 rounded-full bg-surface-dark/80 border border-border-dark hover:border-gold hover:bg-gold hover:text-bg-dark text-text-offwhite flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft size={22} />
              </button>

              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 sm:right-6 w-12 h-12 rounded-full bg-surface-dark/80 border border-border-dark hover:border-gold hover:bg-gold hover:text-bg-dark text-text-offwhite flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight size={22} />
              </button>
            </div>

            {/* Bottom Thumbnail Strip in Fullscreen */}
            <div className="flex justify-center z-10">
              <div className="flex items-center space-x-2 overflow-x-auto max-w-3xl py-2 px-4 bg-surface-dark/80 border border-border-dark/60 rounded-2xl backdrop-blur-md">
                {validImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`relative w-14 h-10 rounded-lg overflow-hidden shrink-0 border transition-all ${
                      idx === currentIndex
                        ? "border-gold ring-2 ring-gold/40 scale-105"
                        : "border-border-dark opacity-50 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt={`Thumb ${idx + 1}`} fill sizes="60px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

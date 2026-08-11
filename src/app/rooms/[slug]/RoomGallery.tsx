"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface RoomGalleryProps {
  roomName: string;
  initialImages: string[];
}

export default function RoomGallery({ roomName, initialImages }: RoomGalleryProps) {
  const [images, setImages] = useState(initialImages);

  const handleSwap = (indexToSwap: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const temp = newImages[0];
      newImages[0] = newImages[indexToSwap];
      newImages[indexToSwap] = temp;
      return newImages;
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8 md:mb-16">
      <div className="md:col-span-2 relative aspect-[16/9] md:aspect-[16/10] rounded-2xl overflow-hidden bg-surface-dark">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[0]}
            initial={{ opacity: 0.5, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.98 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={images[0]}
              alt={roomName}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-3 md:gap-4">
        {[1, 2].map((idx) => {
          if (!images[idx]) return null;
          return (
            <div 
              key={images[idx]} 
              className="relative aspect-[16/9] md:aspect-[16/9.5] rounded-2xl overflow-hidden bg-surface-dark cursor-pointer group"
              onClick={() => handleSwap(idx)}
            >
              <Image
                src={images[idx]}
                alt={`${roomName} gallery ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

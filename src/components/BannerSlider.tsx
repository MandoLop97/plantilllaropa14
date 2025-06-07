
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBannerSlider } from '../hooks/useBannerSlider';

const bannerImages = [
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80'
];

export const BannerSlider: React.FC = () => {
  const { current, next, prev } = useBannerSlider(bannerImages);

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-8 rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-48 sm:h-64">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={bannerImages[current]}
            src={bannerImages[current]}
            alt={`Banner ${current + 1}`}
            className="absolute w-full h-48 sm:h-64 object-cover"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </AnimatePresence>
      </div>
      
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 rounded-full p-2 shadow-md"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-6 h-6 text-primary-500" />
      </motion.button>
      
      <motion.button
        whileTap={{ scale: 0.92 }}
        whileHover={{ scale: 1.08 }}
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-neutral-50 rounded-full p-2 shadow-md"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-6 h-6 text-primary-500" />
      </motion.button>
      
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {bannerImages.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              idx === current ? 'bg-primary-500' : 'bg-neutral-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

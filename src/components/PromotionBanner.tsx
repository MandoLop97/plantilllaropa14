
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Tag, Timer } from 'lucide-react';

export const PromotionBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const bannerRef = useRef(null);

  // Set up intersection observer for animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }
    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  // Countdown timer logic
  useEffect(() => {
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const distance = endDate.getTime() - currentTime;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(distance % (1000 * 60 * 60 * 24) / (1000 * 60 * 60)),
          minutes: Math.floor(distance % (1000 * 60 * 60) / (1000 * 60)),
          seconds: Math.floor(distance % (1000 * 60) / 1000)
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section ref={bannerRef} className="py-8 bg-gradient-to-br from-neutral-50 to-primary-50/20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="relative bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl overflow-hidden shadow-xl border border-primary-400/20" 
          variants={containerVariants} 
          initial="hidden" 
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Subtle background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-transparent"></div>
          
          <div className="relative z-10 p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left side - Promotion details */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-primary-100 font-medium mb-4">
                  <Gift size={16} />
                  <span className="text-sm">Oferta Especial</span>
                </div>
                
                <h4 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  25% OFF
                </h4>
                
                <p className="text-lg text-primary-100 mb-4 leading-relaxed">
                  En toda la tienda. Aprovecha esta oportunidad única.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center lg:items-start lg:justify-start justify-center mb-6">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Tag size={14} className="text-primary-200" />
                    <span className="text-primary-100 font-mono font-semibold text-sm">URBAN25</span>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="bg-white text-primary-700 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span>Comprar Ahora</span>
                  <Sparkles size={16} />
                </motion.button>
              </motion.div>
              
              {/* Right side - Countdown Timer */}
              <motion.div variants={itemVariants} className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-primary-100 font-medium mb-4">
                  <Timer size={16} />
                  <span className="text-sm">Termina en:</span>
                </div>
                
                <div className="grid grid-cols-4 gap-3 max-w-xs mx-auto">
                  {[
                    { label: 'DÍAS', value: timeLeft.days.toString().padStart(2, '0') },
                    { label: 'HRS', value: timeLeft.hours.toString().padStart(2, '0') },
                    { label: 'MIN', value: timeLeft.minutes.toString().padStart(2, '0') },
                    { label: 'SEG', value: timeLeft.seconds.toString().padStart(2, '0') }
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="bg-white/25 backdrop-blur-md rounded-xl py-3 px-2 mb-2 shadow-lg border border-white/20">
                        <span className="text-2xl md:text-3xl font-bold text-white block">
                          {item.value}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-primary-200 uppercase tracking-wide">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

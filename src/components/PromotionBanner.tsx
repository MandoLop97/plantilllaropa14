
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
    // Set promotion end date (end of current month for better context)
    const now = new Date();
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of current month

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
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section ref={bannerRef} className="py-16 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100">
      <div className="container mx-auto px-4">
        <motion.div 
          className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-3xl overflow-hidden shadow-2xl border border-primary-400/20" 
          variants={containerVariants} 
          initial="hidden" 
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-300/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-800/30 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
            {/* Header with icon */}
            <motion.div className="flex items-center justify-center gap-3 mb-8" variants={itemVariants}>
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Sparkles size={28} className="text-primary-100" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  ¡Oferta Especial!
                </h3>
                <p className="text-primary-100 text-lg">Por tiempo limitado</p>
              </div>
            </motion.div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left side - Promotion details */}
              <motion.div variants={itemVariants} className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-primary-100 font-medium mb-6">
                  <Gift size={18} />
                  <span>Descuento Exclusivo</span>
                </div>
                
                <h4 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  25% OFF
                </h4>
                
                <p className="text-xl text-primary-100 mb-6 leading-relaxed">
                  En toda la tienda. Aprovecha esta oportunidad única para renovar tu estilo con nuestros productos de calidad premium.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start lg:justify-start justify-center mb-8">
                  <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Tag size={16} className="text-primary-200" />
                    <span className="text-primary-100 font-mono font-semibold">URBAN25</span>
                  </div>
                  <span className="text-primary-200 text-sm">Código de descuento</span>
                </div>
                
                <motion.button 
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                  }} 
                  whileTap={{
                    scale: 0.98
                  }} 
                  className="bg-white text-primary-700 font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 inline-flex items-center gap-3"
                >
                  <span>Comprar Ahora</span>
                  <Sparkles size={20} />
                </motion.button>
              </motion.div>
              
              {/* Right side - Countdown Timer */}
              <motion.div variants={itemVariants} className="text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-primary-100 font-medium mb-6">
                  <Timer size={18} />
                  <span>La oferta termina en:</span>
                </div>
                
                <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                  {[
                    { label: 'DÍAS', value: timeLeft.days.toString().padStart(2, '0') },
                    { label: 'HORAS', value: timeLeft.hours.toString().padStart(2, '0') },
                    { label: 'MIN', value: timeLeft.minutes.toString().padStart(2, '0') },
                    { label: 'SEG', value: timeLeft.seconds.toString().padStart(2, '0') }
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center" 
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.08,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="bg-white/25 backdrop-blur-md rounded-2xl py-4 px-2 mb-3 shadow-lg border border-white/20">
                        <motion.span 
                          className="text-3xl md:text-4xl font-bold text-white block"
                          animate={{
                            scale: item.label === 'SEG' ? [1, 1.1, 1] : 1
                          }}
                          transition={{
                            duration: 1,
                            repeat: item.label === 'SEG' ? Infinity : 0
                          }}
                        >
                          {item.value}
                        </motion.span>
                      </div>
                      <span className="text-xs font-semibold text-primary-200 uppercase tracking-wider">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-primary-200 text-sm mt-6 opacity-90">
                  * Aplica a productos seleccionados. Términos y condiciones disponibles en tienda.
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
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
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-12 md:py-16" ref={bannerRef}>
      <div className="container mx-auto px-4">
        <motion.div 
          className="bg-gradient-to-r from-urban-500 to-urban-600 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
          
          <div className="relative z-10">
            <motion.div 
              className="flex items-center space-x-3 mb-4"
              variants={itemVariants}
            >
              <span className="text-3xl">🔥</span>
              <h3 className="text-2xl md:text-3xl font-bold">Descuento de Temporada</h3>
            </motion.div>
            
            <motion.div 
              className="md:flex items-center justify-between"
              variants={itemVariants}
            >
              <div className="mb-6 md:mb-0 md:w-1/2 pr-4">
                <p className="text-lg md:text-xl font-medium mb-3">
                  ¡Aprovecha nuestro descuento por tiempo limitado!
                </p>
                <p className="opacity-90 mb-4">
                  Toda la tienda con un <span className="font-bold text-xl">20% OFF</span> en todos los productos. 
                  Usa el código <span className="bg-white/20 px-2 py-1 rounded-md font-mono">URBAN20</span> al finalizar tu compra.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-urban-600 font-bold py-3 px-6 rounded-full shadow-md hover:shadow-lg transition-all"
                >
                  Comprar Ahora
                </motion.button>
              </div>
              
              {/* Countdown Timer */}
              <div className="md:w-1/2">
                <p className="text-sm font-medium uppercase tracking-wider mb-3 opacity-75">La oferta termina en:</p>
                <div className="grid grid-cols-4 gap-3 max-w-md">
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
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-2 mb-2 shadow-inner">
                        <span className="text-3xl md:text-4xl font-bold">{item.value}</span>
                      </div>
                      <span className="text-xs font-medium opacity-75">{item.label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Store Image with Caption */}
        <motion.div 
          className="mt-10 rounded-3xl overflow-hidden shadow-lg relative group"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop"
            alt="Nuestra tienda física"
            className="w-full h-56 md:h-80 object-cover transition-transform duration-5000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h4 className="text-xl md:text-2xl font-bold mb-2">Visita Nuestra Tienda</h4>
            <p className="max-w-md opacity-90">Av. Corrientes 1234, Buenos Aires. Lunes a Sábados de 10:00 a 20:00 hs.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
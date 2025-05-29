
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useBusinessConfig } from '../config/business';
import { useHeroAspectRatio } from '../hooks/useHeroAspectRatio';
import { HeroSkeleton } from './HeroSkeleton';

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const businessConfig = useBusinessConfig();
  const ratio = useHeroAspectRatio();

  useEffect(() => {
    if (businessConfig.loading) return;

    const img = new Image();
    img.src = businessConfig.banner.url;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [businessConfig.loading, businessConfig.banner.url]);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  if (businessConfig.loading) {
    return <HeroSkeleton ratio={ratio} />;
  }

  if (businessConfig.error) {
    return <section className="py-16">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{businessConfig.error}</p>
        </div>
      </section>;
  }

  return (
    <section className="relative mb-15 py-0">
      {/* Banner principal con imagen dinámica */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-3xl shadow-xl">
        <AspectRatio ratio={ratio} className="bg-gradient-to-br from-picton-blue-100 to-picton-blue-200 rounded-b-3xl">
          <div className="relative w-full h-full overflow-hidden rounded-b-3xl" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <motion.div 
              role="img" 
              aria-label={businessConfig.banner.alt} 
              initial={{
                opacity: 0,
                scale: 1.1
              }} 
              animate={{
                opacity: isLoaded ? 1 : 0,
                scale: isHovered ? 1.04 : 1
              }} 
              transition={{
                duration: 0.8
              }} 
              className="absolute inset-0 bg-cover bg-center rounded-b-3xl" 
              style={{
                backgroundImage: `url('${businessConfig.banner.url}')`,
                transformOrigin: 'center'
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none rounded-b-3xl" />
              <div className="absolute inset-0 bg-picton-blue-800/10 pointer-events-none rounded-b-3xl" />
            </motion.div>
          </div>
        </AspectRatio>
      </div>

      {/* Avatar destacado con logo dinámico */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-20 z-30 relative">
          <div className="rounded-full bg-white shadow-xl ring-2 ring-picton-blue-100/60 p-1.5">
            <Avatar className="h-32 w-32 border-2 border-white shadow-md bg-white">
              <AvatarImage src={businessConfig.logo.url} alt={businessConfig.logo.alt} className="object-cover" loading="lazy" />
              <AvatarFallback className="text-5xl text-picton-blue-800 font-bold bg-picton-blue-500/10">
                {businessConfig.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Nombre y descripción dinámicos con diseño gradiente */}
      <div className="text-center mt-2 mb-8">
        <h1 
          style={{
            fontFamily: 'var(--font-secondary)'
          }} 
          className="text-4xl md:text-5xl font-extrabold text-picton-blue-800 mb-3 tracking-tight drop-shadow-sm py-[6px]"
        >
          {businessConfig.name}
        </h1>
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gradient-to-br from-picton-blue-50/90 via-picton-blue-100/90 to-picton-blue-200/90 backdrop-blur-md rounded-2xl p-8 shadow-md border border-picton-blue-100/40">
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
              {businessConfig.description}. {/*{businessConfig.tagline}*/}
            </p>
            <div className="flex flex-row justify-center gap-3 mt-2">
              <span className="inline-block bg-picton-blue-200/80 text-picton-blue-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-picton-blue-200/60">
                Calidad premium
              </span>
              <span className="inline-block bg-picton-blue-200/80 text-picton-blue-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-picton-blue-200/60">
                Diseños exclusivos
              </span>
              <span className="inline-block bg-picton-blue-200/80 text-picton-blue-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-picton-blue-200/60">
                Tendencias actuales
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useBusinessConfig } from '../config/business';

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const businessConfig = useBusinessConfig();

  useEffect(() => {
    setIsLoaded(true);
    // Preload hero image for better performance
    const img = new Image();
    img.src = businessConfig.banner.url;
  }, [businessConfig.banner.url]);

  return (
    <section className="relative mb-15 py-0">
      {/* Banner principal */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-3xl shadow-xl">
        <AspectRatio ratio={window.innerWidth < 768 ? 16 / 9 : 24 / 9} className="bg-gradient-to-br from-urban-100 to-urban-200 rounded-b-3xl">
          <div className="relative w-full h-full overflow-hidden rounded-b-3xl" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            <motion.div initial={{
            opacity: 0,
            scale: 1.1
          }} animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isHovered ? 1.04 : 1
          }} transition={{
            duration: 0.8
          }} className="absolute inset-0 bg-cover bg-center rounded-b-3xl" style={{
            backgroundImage: `url('${businessConfig.banner.url}')`,
            transformOrigin: 'center'
          }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none rounded-b-3xl" />
              <div className="absolute inset-0 bg-urban-800/10 pointer-events-none rounded-b-3xl" />
            </motion.div>
          </div>
        </AspectRatio>
      </div>

      {/* Avatar destacado */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-20 z-30 relative">
          <div className="rounded-full bg-white shadow-xl ring-2 ring-urban-100/60 p-1.5">
            <Avatar className="h-32 w-32 border-2 border-white shadow-md bg-white">
              <AvatarImage src={businessConfig.logo.url} alt={businessConfig.logo.alt} className="object-cover" />
              <AvatarFallback className="text-5xl text-urban-800 font-bold bg-urban-500/10">
                {businessConfig.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Nombre y descripción */}
      <div className="text-center mt-8 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-urban-800 mb-3 tracking-tight drop-shadow-sm">
          {businessConfig.name}
        </h1>
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gradient-to-br from-urban-50/90 via-urban-100/90 to-urban-200/90 backdrop-blur-md rounded-2xl p-8 shadow-md border border-urban-100/40">
            <p className="text-gray-700 text-base leading-relaxed mb-6 font-medium">
              {businessConfig.description}. Somos tu destino para encontrar prendas únicas que reflejan tu personalidad y estilo de vida moderno.
            </p>
            <div className="flex flex-row justify-center gap-3 mt-2">
              <span className="inline-block bg-urban-200/80 text-urban-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-urban-200/60">
                Calidad premium
              </span>
              <span className="inline-block bg-urban-200/80 text-urban-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-urban-200/60">
                Diseños exclusivos
              </span>
              <span className="inline-block bg-urban-200/80 text-urban-700 px-4 py-1 rounded-full text-xs font-semibold shadow border border-urban-200/60">
                Tendencias actuales
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

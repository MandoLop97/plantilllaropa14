import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
import { useHeroAspectRatio } from '../hooks/useHeroAspectRatio';
import { useThemeConfigData } from '../contexts/ThemeConfigContext';
import { HeroSkeleton } from './HeroSkeleton';
export const HeroSection = () => {
  const [isBannerLoaded, setIsBannerLoaded] = useState(false);
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const businessConfig = useDynamicBusinessConfig();
  const ratio = useHeroAspectRatio();
  const {
    config: themeConfig,
    isLoading: themeLoading
  } = useThemeConfigData();
  const heroRef = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: heroRef
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  useEffect(() => {
    if (businessConfig.loading) return;
    const bannerImg = new Image();
    bannerImg.src = businessConfig.banner.url;
    bannerImg.onload = () => setIsBannerLoaded(true);
    bannerImg.onerror = () => setIsBannerLoaded(true);
    const logoImg = new Image();
    logoImg.src = businessConfig.logo.url;
    logoImg.onload = () => setIsLogoLoaded(true);
    logoImg.onerror = () => setIsLogoLoaded(true);
    return () => {
      bannerImg.onload = null;
      bannerImg.onerror = null;
      logoImg.onload = null;
      logoImg.onerror = null;
    };
  }, [businessConfig.loading, businessConfig.banner.url, businessConfig.logo.url]);
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Mostrar skeleton hasta que tanto los datos del negocio como el tema estén cargados
  if (businessConfig.loading || themeLoading || !isBannerLoaded || !isLogoLoaded) {
    return <HeroSkeleton ratio={ratio} />;
  }
  if (businessConfig.error) {
    return <section className="py-8">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{businessConfig.error}</p>
        </div>
      </section>;
  }
  return <section ref={heroRef} className="relative mb-8 py-0">
      {/* Banner principal con imagen dinámica */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-3xl shadow-xl">
        <AspectRatio ratio={ratio} className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-b-3xl">
          <div className="relative w-full h-full overflow-hidden rounded-b-3xl" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <motion.div role="img" aria-label={businessConfig.banner.alt} initial={{
            opacity: 0,
            scale: 1.1
          }} animate={{
            opacity: isBannerLoaded ? 1 : 0,
            scale: isHovered ? 1.04 : 1
          }} transition={{
            duration: 0.8
          }} style={{
            backgroundImage: `url('${businessConfig.banner.url}')`,
            transformOrigin: 'center',
            imageRendering: 'auto',
            y
          }} className="absolute inset-0 bg-cover bg-center rounded-b-3xl mx-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none rounded-b-3xl" />
              <div className="absolute inset-0 bg-primary-300/10 pointer-events-none rounded-b-3xl" />
            </motion.div>
          </div>
        </AspectRatio>
      </div>

      {/* Avatar destacado con logo dinámico y blur más suave */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-16 z-30 relative">
          <div className="rounded-full bg-white p-1.5" style={{
          boxShadow: `
                0 8px 16px -6px color-mix(in srgb, hsl(var(--color-primary-500)) 20%, transparent),
                0 0 0 2px color-mix(in srgb, hsl(var(--color-primary-100)) 40%, transparent)
              `
        }}>
            <Avatar className="h-28 w-28 border-2 border-white bg-white" style={{
            boxShadow: `
                  0 4px 8px -2px color-mix(in srgb, hsl(var(--color-primary-300)) 20%, transparent)
                `
          }}>
              <AvatarImage src={businessConfig.logo.url} alt={businessConfig.logo.alt} className="object-cover" loading="lazy" onLoad={() => setIsLogoLoaded(true)} />
              <AvatarFallback className="text-4xl font-bold" style={{
              backgroundColor: `color-mix(in srgb, hsl(var(--color-primary-500)) 5%, transparent)`,
              color: `hsl(var(--color-primary-800))`
            }}>
                {businessConfig.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      {/* Nombre y descripción dinámicos con diseño gradiente */}
      <div className="text-center mt-2 mb-4">
        <h1 style={{
        fontFamily: 'var(--font-secondary)'
      }} className="text-3xl md:text-4xl font-extrabold text-primary-800 mb-2 tracking-tight drop-shadow-sm py-[4px]">
          {businessConfig.name}
        </h1>

        <div className="max-w-2xl mx-auto px-6">
          <div className="backdrop-blur-md rounded-2xl p-4 shadow-md" style={{
          background: `linear-gradient(135deg,
                color-mix(in srgb, hsl(var(--color-primary-50, 248 250 252)) 90%, #f8fafc),
                color-mix(in srgb, hsl(var(--color-primary-100, 241 245 249)) 90%, #f1f5f9),
                color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 90%, #e2e8f0)
              )`,
          border: `1px solid color-mix(in srgb, hsl(var(--color-primary-100, 241 245 249)) 40%, #e5e7eb)`
        }}>
            <p className="text-sm leading-relaxed mb-3 font-medium" style={{
            color: `hsl(var(--color-primary-700, 51 65 85))`
          }}>
              {businessConfig.description}
            </p>

            <div className="flex flex-row justify-center gap-2 mt-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold shadow" style={{
              backgroundColor: `color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 80%, #f3f4f6)`,
              color: `hsl(var(--color-primary-700, 51 65 85))`,
              border: `1px solid color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 60%, #e5e7eb)`
            }}>
                Calidad premium
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold shadow" style={{
              backgroundColor: `color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 80%, #f3f4f6)`,
              color: `hsl(var(--color-primary-700, 51 65 85))`,
              border: `1px solid color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 60%, #e5e7eb)`
            }}>
                Diseños exclusivos
              </span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold shadow" style={{
              backgroundColor: `color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 80%, #f3f4f6)`,
              color: `hsl(var(--color-primary-700, 51 65 85))`,
              border: `1px solid color-mix(in srgb, hsl(var(--color-primary-200, 226 232 240)) 60%, #e5e7eb)`
            }}>
                Tendencias actuales
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
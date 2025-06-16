
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Skeleton, ResponsiveSkeleton } from '@/components/ui/skeleton';

interface HeroSkeletonProps {
  ratio: number;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ ratio }) => {
  return (
    <section className="relative mb-8 sm:mb-12 lg:mb-15 py-0">
      {/* Banner principal responsivo */}
      <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-2xl sm:rounded-b-3xl shadow-xl">
        <AspectRatio ratio={ratio} className="rounded-b-2xl sm:rounded-b-3xl">
          <Skeleton className="w-full h-full rounded-b-2xl sm:rounded-b-3xl" />
        </AspectRatio>
      </div>
      
      {/* Avatar responsivo */}
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-12 sm:-mt-16 lg:-mt-20 z-30 relative">
          <ResponsiveSkeleton
            height="h-32"
            mobileWidth="w-32"
            tabletWidth="sm:w-32"
            desktopWidth="lg:w-32"
            className="rounded-full shadow-md"
          />
        </div>
      </div>
      
      {/* Contenido de texto responsivo */}
      <div className="text-center mt-4 sm:mt-6 lg:mt-8 mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6">
        {/* Título principal */}
        <ResponsiveSkeleton 
          height="h-8 sm:h-10 lg:h-12"
          mobileWidth="w-48"
          tabletWidth="sm:w-56"
          desktopWidth="lg:w-64"
          className="mx-auto mb-3 sm:mb-4 lg:mb-6"
        />
        
        {/* Contenedor de descripción sin borde */}
        <div className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
          <div className="bg-gray-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md space-y-2 sm:space-y-3">
            {/* Líneas de descripción responsivas */}
            <ResponsiveSkeleton height="h-3 sm:h-4" className="bg-gray-200 rounded" />
            <ResponsiveSkeleton 
              height="h-3 sm:h-4" 
              mobileWidth="w-5/6"
              tabletWidth="sm:w-4/5"
              desktopWidth="lg:w-full"
              className="bg-gray-200 rounded" 
            />
            <ResponsiveSkeleton 
              height="h-3 sm:h-4" 
              mobileWidth="w-3/4"
              tabletWidth="sm:w-5/6"
              desktopWidth="lg:w-4/5"
              className="bg-gray-200 rounded" 
            />
            
            {/* Tags responsivos */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              <ResponsiveSkeleton 
                height="h-5 sm:h-6" 
                mobileWidth="w-16"
                tabletWidth="sm:w-20"
                desktopWidth="lg:w-24"
                className="bg-gray-200 rounded-full" 
              />
              <ResponsiveSkeleton 
                height="h-5 sm:h-6" 
                mobileWidth="w-20"
                tabletWidth="sm:w-24"
                desktopWidth="lg:w-28"
                className="bg-gray-200 rounded-full" 
              />
              <ResponsiveSkeleton 
                height="h-5 sm:h-6" 
                mobileWidth="w-24"
                tabletWidth="sm:w-28"
                desktopWidth="lg:w-32"
                className="bg-gray-200 rounded-full" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


import React from 'react';
import { ResponsiveSkeleton } from '@/components/ui/skeleton';
import { PageSkeleton, HeaderSkeleton, FooterSkeleton } from './PageSkeleton';

export const ProductsPageSkeleton = () => {
  return (
    <PageSkeleton>
      <HeaderSkeleton />
      
      <main className="flex-grow pb-20 py-[10px]">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Banner Slider Skeleton - Responsivo */}
          <div className="mb-6 sm:mb-8">
            <ResponsiveSkeleton className="w-full h-32 sm:h-48 md:h-64 rounded-xl sm:rounded-2xl" />
          </div>

          {/* Page Title Skeleton */}
          <div className="text-center mb-6 sm:mb-8">
            <ResponsiveSkeleton 
              height="h-10 sm:h-12" 
              mobileWidth="w-48"
              tabletWidth="sm:w-64"
              className="mx-auto mb-2" 
            />
            <ResponsiveSkeleton 
              height="h-4 sm:h-5" 
              mobileWidth="w-64"
              tabletWidth="sm:w-80"
              desktopWidth="lg:w-96"
              className="mx-auto" 
            />
          </div>

          {/* Controls Skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="max-w-3xl mx-auto w-full">
              <div className="flex flex-col sm:flex-row items-center justify-between bg-white/80 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 shadow-sm gap-3 sm:gap-0">
                <ResponsiveSkeleton 
                  height="h-3 sm:h-4" 
                  mobileWidth="w-32"
                  tabletWidth="sm:w-40"
                />
                <div className="flex items-center gap-2">
                  <ResponsiveSkeleton 
                    height="h-7 sm:h-8" 
                    mobileWidth="w-16"
                    tabletWidth="sm:w-20"
                    className="rounded-full" 
                  />
                  <ResponsiveSkeleton 
                    height="h-7 sm:h-8" 
                    mobileWidth="w-12"
                    tabletWidth="sm:w-16"
                    className="rounded-full" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Sidebar Skeleton - Solo desktop */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                <div className="space-y-3">
                  <ResponsiveSkeleton height="h-4 sm:h-5" mobileWidth="w-16" tabletWidth="sm:w-20" />
                  <ResponsiveSkeleton height="h-7 sm:h-8" className="rounded-lg" />
                </div>
                <div className="space-y-3">
                  <ResponsiveSkeleton height="h-4 sm:h-5" mobileWidth="w-20" tabletWidth="sm:w-24" />
                  <div className="space-y-2">
                    {[...Array(4)].map((_, idx) => (
                      <ResponsiveSkeleton key={idx} height="h-7 sm:h-8" className="rounded-lg" />
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <ResponsiveSkeleton height="h-4 sm:h-5" mobileWidth="w-12" tabletWidth="sm:w-16" />
                  <ResponsiveSkeleton height="h-5 sm:h-6" />
                  <div className="flex justify-between">
                    <ResponsiveSkeleton height="h-3 sm:h-4" mobileWidth="w-6" tabletWidth="sm:w-8" />
                    <ResponsiveSkeleton height="h-3 sm:h-4" mobileWidth="w-6" tabletWidth="sm:w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid Skeleton - Completamente responsivo */}
            <div className="flex-1">
              <div className="max-w-5xl mx-auto px-2 sm:px-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {[...Array(15)].map((_, index) => (
                    <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                      <ResponsiveSkeleton className="aspect-square" />
                      <div className="p-2 sm:p-3 space-y-2">
                        <ResponsiveSkeleton height="h-3 sm:h-4" />
                        <ResponsiveSkeleton 
                          height="h-5 sm:h-6" 
                          mobileWidth="w-16"
                          tabletWidth="sm:w-20"
                        />
                        <ResponsiveSkeleton 
                          height="h-7 sm:h-8" 
                          className="rounded-lg" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <FooterSkeleton />
    </PageSkeleton>
  );
};

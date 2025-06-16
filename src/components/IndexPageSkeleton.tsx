
import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { ResponsiveSkeleton } from '@/components/ui/skeleton';
import { PageSkeleton, HeaderSkeleton, FooterSkeleton } from './PageSkeleton';
import { useHeroAspectRatio } from '../hooks/useHeroAspectRatio';

export const IndexPageSkeleton = () => {
  const ratio = useHeroAspectRatio();
  return (
    <PageSkeleton>
      <HeaderSkeleton />
      
      <main className="flex-grow pb-0">
        {/* Hero Section Skeleton */}
        <section className="relative mb-8 sm:mb-12 lg:mb-15 py-0">
          <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-2xl sm:rounded-b-3xl shadow-xl">
            <AspectRatio ratio={ratio} className="rounded-b-2xl sm:rounded-b-3xl">
              <ResponsiveSkeleton className="w-full h-full rounded-b-2xl sm:rounded-b-3xl" />
            </AspectRatio>
          </div>
          <div className="relative">
            <div className="max-w-4xl mx-auto flex justify-center -mt-12 sm:-mt-16 lg:-mt-20 z-30 relative">
              <ResponsiveSkeleton
                className="rounded-full"
                height="h-32"
                mobileWidth="w-32"
                tabletWidth="sm:w-32"
                desktopWidth="lg:w-32"
              />
            </div>
          </div>
          <div className="text-center mt-4 sm:mt-6 lg:mt-8 mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-6">
            <ResponsiveSkeleton 
              height="h-8 sm:h-10 lg:h-12"
              mobileWidth="w-48"
              tabletWidth="sm:w-56"
              desktopWidth="lg:w-64"
              className="mx-auto mb-3 sm:mb-4"
            />
            <div className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
              <div className="bg-neutral-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-md border border-neutral-200 space-y-3 sm:space-y-4">
                <ResponsiveSkeleton height="h-3 sm:h-4" className="bg-neutral-200" />
                <ResponsiveSkeleton 
                  height="h-3 sm:h-4" 
                  mobileWidth="w-5/6"
                  tabletWidth="sm:w-4/5"
                  className="bg-neutral-200" 
                />
                <ResponsiveSkeleton 
                  height="h-3 sm:h-4" 
                  mobileWidth="w-3/4"
                  tabletWidth="sm:w-5/6"
                  className="bg-neutral-200" 
                />
                <div className="flex justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
                  <ResponsiveSkeleton 
                    height="h-5 sm:h-6" 
                    mobileWidth="w-16"
                    tabletWidth="sm:w-20"
                    className="rounded-full bg-neutral-200" 
                  />
                  <ResponsiveSkeleton 
                    height="h-5 sm:h-6" 
                    mobileWidth="w-20"
                    tabletWidth="sm:w-24"
                    className="rounded-full bg-neutral-200" 
                  />
                  <ResponsiveSkeleton 
                    height="h-5 sm:h-6" 
                    mobileWidth="w-24"
                    tabletWidth="sm:w-28"
                    className="rounded-full bg-neutral-200" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section Skeleton */}
        <section className="py-0">
          <div className="container mx-auto px-4 sm:px-6">
            {/* Category Selector Skeleton */}
            <div className="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar py-2 px-2 mb-6 sm:mb-8">
              {[...Array(5)].map((_, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <ResponsiveSkeleton
                    height="h-20 sm:h-28 lg:h-32"
                    mobileWidth="w-20"
                    tabletWidth="sm:w-28"
                    desktopWidth="lg:w-32"
                    className="rounded-full"
                  />
                  <ResponsiveSkeleton
                    height="h-3 sm:h-4"
                    mobileWidth="w-16"
                    tabletWidth="sm:w-20"
                    desktopWidth="lg:w-24"
                  />
                </div>
              ))}
            </div>

            {/* Section Header Skeleton */}
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 px-2">
              <ResponsiveSkeleton 
                height="h-12 sm:h-14" 
                mobileWidth="w-12"
                tabletWidth="sm:w-14"
                className="rounded-xl sm:rounded-2xl" 
              />
              <div className="space-y-2">
                <ResponsiveSkeleton 
                  height="h-5 sm:h-6" 
                  mobileWidth="w-32"
                  tabletWidth="sm:w-40"
                />
                <ResponsiveSkeleton 
                  height="h-3 sm:h-4" 
                  mobileWidth="w-48"
                  tabletWidth="sm:w-64"
                />
              </div>
            </div>

            {/* Products Grid Skeleton - Responsivo */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-md overflow-hidden">
                  <ResponsiveSkeleton className="aspect-square" />
                  <div className="p-2 sm:p-3 space-y-2">
                    <ResponsiveSkeleton height="h-3 sm:h-4" />
                    <ResponsiveSkeleton 
                      height="h-5 sm:h-6" 
                      mobileWidth="w-16"
                      tabletWidth="sm:w-20"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <ResponsiveSkeleton 
                height="h-5 sm:h-6" 
                mobileWidth="w-24"
                tabletWidth="sm:w-32"
                className="mx-auto" 
              />
            </div>
          </div>
        </section>

        {/* Promotion Banner Skeleton */}
        <section className="py-8 sm:py-10 lg:py-12">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-neutral-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="space-y-4 sm:space-y-6">
                <ResponsiveSkeleton 
                  height="h-6 sm:h-8" 
                  mobileWidth="w-48"
                  tabletWidth="sm:w-64"
                />
                <div className="md:flex items-center justify-between space-y-4 md:space-y-0">
                  <div className="md:w-1/2 pr-0 md:pr-4 space-y-3">
                    <ResponsiveSkeleton height="h-5 sm:h-6" />
                    <ResponsiveSkeleton 
                      height="h-3 sm:h-4" 
                      mobileWidth="w-5/6"
                      tabletWidth="sm:w-4/5"
                    />
                    <ResponsiveSkeleton 
                      height="h-8 sm:h-10" 
                      mobileWidth="w-28"
                      tabletWidth="sm:w-32"
                      className="rounded-full" 
                    />
                  </div>
                  <div className="md:w-1/2">
                    <ResponsiveSkeleton 
                      height="h-3 sm:h-4" 
                      mobileWidth="w-32"
                      tabletWidth="sm:w-40"
                      className="mb-3" 
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-md">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="text-center">
                          <ResponsiveSkeleton 
                            height="h-12 sm:h-16" 
                            className="rounded-lg sm:rounded-xl mb-2" 
                          />
                          <ResponsiveSkeleton 
                            height="h-2 sm:h-3" 
                            mobileWidth="w-6"
                            tabletWidth="sm:w-8"
                            className="mx-auto" 
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 sm:mt-10 rounded-2xl sm:rounded-3xl overflow-hidden">
              <ResponsiveSkeleton className="w-full h-40 sm:h-56 md:h-80" />
            </div>
          </div>
        </section>
      </main>
      
      <FooterSkeleton />
    </PageSkeleton>
  );
};

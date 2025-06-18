
import React, { useEffect } from 'react';
import { ResponsiveSkeleton } from '@/components/ui/skeleton';

interface PageSkeletonProps {
  children: React.ReactNode;
}

export const PageSkeleton: React.FC<PageSkeletonProps> = ({ children }) => {
  // While the skeleton is visible, remove the dynamic background image
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.getPropertyValue('--dynamic-background-image');
    root.style.setProperty('--dynamic-background-image', 'none');
    return () => {
      if (prev) {
        root.style.setProperty('--dynamic-background-image', prev);
      } else {
        root.style.removeProperty('--dynamic-background-image');
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col animate-pulse"
      style={{ background: 'hsl(var(--dynamic-background-color))' }}
    >
      {children}
    </div>
  );
};

export const HeaderSkeleton = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-14 sm:h-16">
        <div className="flex items-center gap-2 sm:gap-3">
          <ResponsiveSkeleton 
            height="h-7 sm:h-8" 
            mobileWidth="w-7"
            tabletWidth="sm:w-8"
            className="rounded-full" 
          />
          <ResponsiveSkeleton 
            height="h-5 sm:h-6" 
            mobileWidth="w-24"
            tabletWidth="sm:w-32"
          />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ResponsiveSkeleton 
            height="h-7 sm:h-8" 
            mobileWidth="w-7"
            tabletWidth="sm:w-8"
            className="rounded-full" 
          />
          <ResponsiveSkeleton 
            height="h-7 sm:h-8" 
            mobileWidth="w-7"
            tabletWidth="sm:w-8"
            className="rounded-full" 
          />
        </div>
      </div>
    </div>
  </header>
);

export const FooterSkeleton = () => (
  <footer className="bg-neutral-50 border-t border-neutral-200 py-6 sm:py-8">
    <div className="container mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="space-y-3">
          <ResponsiveSkeleton 
            height="h-4 sm:h-5" 
            mobileWidth="w-20"
            tabletWidth="sm:w-24"
          />
          <ResponsiveSkeleton height="h-3 sm:h-4" />
          <ResponsiveSkeleton 
            height="h-3 sm:h-4" 
            mobileWidth="w-3/4"
            tabletWidth="sm:w-4/5"
          />
        </div>
        <div className="space-y-3">
          <ResponsiveSkeleton 
            height="h-4 sm:h-5" 
            mobileWidth="w-16"
            tabletWidth="sm:w-20"
          />
          <ResponsiveSkeleton 
            height="h-3 sm:h-4" 
            mobileWidth="w-2/3"
            tabletWidth="sm:w-3/4"
          />
          <ResponsiveSkeleton 
            height="h-3 sm:h-4" 
            mobileWidth="w-1/2"
            tabletWidth="sm:w-2/3"
          />
        </div>
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <ResponsiveSkeleton 
            height="h-4 sm:h-5" 
            mobileWidth="w-24"
            tabletWidth="sm:w-28"
          />
          <ResponsiveSkeleton height="h-3 sm:h-4" />
          <ResponsiveSkeleton 
            height="h-3 sm:h-4" 
            mobileWidth="w-5/6"
            tabletWidth="sm:w-4/5"
          />
        </div>
      </div>
    </div>
  </footer>
);

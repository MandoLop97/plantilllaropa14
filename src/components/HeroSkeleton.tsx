import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface HeroSkeletonProps {
  ratio: number;
}

export const HeroSkeleton: React.FC<HeroSkeletonProps> = ({ ratio }) => {
  return (
    <section className="relative mb-15 py-0 animate-pulse">
      <div className="w-full max-w-7xl mx-auto overflow-hidden relative rounded-b-3xl shadow-xl">
        <AspectRatio ratio={ratio} className="bg-gray-200 rounded-b-3xl" />
      </div>
      <div className="relative">
        <div className="max-w-4xl mx-auto flex justify-center -mt-20 z-30 relative">
          <div className="h-32 w-32 rounded-full bg-gray-200 shadow-md" />
        </div>
      </div>
      <div className="text-center mt-8 mb-12 space-y-4">
        <div className="h-10 w-48 mx-auto bg-gray-200 rounded" />
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gray-100 rounded-2xl p-8 shadow-md border border-picton-blue-100/40 space-y-2">
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </section>
  );
};

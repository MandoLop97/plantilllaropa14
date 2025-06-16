
import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <div className="w-full h-full">
      {children}
    </div>
  );
}

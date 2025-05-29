
import React from 'react';

interface SectionHeaderProps {
  icon: string;
  title: string;
  description: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  description
}) => {
  return (
    <div className="flex items-center gap-4 mb-8 px-2">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-picton-blue-100 to-picton-blue-200 shadow-inner">
        <span className="text-3xl">{icon}</span>
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
          {title}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
};

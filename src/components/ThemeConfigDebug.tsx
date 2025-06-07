
import React from 'react';
import { useTemaConfig } from '../hooks/useTemaConfig';
import { useDynamicBusinessId } from '../contexts/DynamicBusinessIdContext';

export const ThemeConfigDebug: React.FC = () => {
  const { businessId, subdomain, isLoading: businessLoading } = useDynamicBusinessId();
  const { config, isLoading: themeLoading, error } = useTemaConfig(businessId || '');

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-md z-50">
      <h4 className="font-bold mb-2">Debug Info</h4>
      
      <div className="mb-2">
        <strong>Business ID:</strong> {businessId || 'Loading...'}
      </div>
      
      <div className="mb-2">
        <strong>Subdomain:</strong> {subdomain || 'None detected'}
      </div>
      
      <div className="mb-2">
        <strong>Loading:</strong> Business: {businessLoading.toString()}, Theme: {themeLoading.toString()}
      </div>
      
      {error && <p className="text-red-300 mb-2">Error: {error}</p>}
      
      {config && (
        <details className="mt-2">
          <summary className="cursor-pointer">Theme Config</summary>
          <pre className="overflow-auto max-h-40 mt-1">
            {JSON.stringify(config, null, 2)}
          </pre>
        </details>
      )}
      
      {!config && !themeLoading && !error && (
        <p className="text-yellow-300">No theme config found</p>
      )}
    </div>
  );
};

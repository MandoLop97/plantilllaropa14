
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useBusinessBySubdomain } from '../hooks/useBusinessBySubdomain';
import { logger } from '../utils/logger';

interface DynamicBusinessIdContextValue {
  businessId: string | null;
  isLoading: boolean;
  error: string | null;
  subdomain: string | null;
  businessData: any | null;
}

const DynamicBusinessIdContext = createContext<DynamicBusinessIdContextValue>({
  businessId: null,
  isLoading: true,
  error: null,
  subdomain: null,
  businessData: null,
});

export const useDynamicBusinessId = () => useContext(DynamicBusinessIdContext);

// Function to extract subdomain from hostname (subdomain-based URLs only)
const extractSubdomainFromHostname = (): string | null => {
  const hostname = window.location.hostname;
  
  // Skip localhost and IP addresses for development
  if (hostname === 'localhost' || hostname.startsWith('127.0.0.1') || hostname.includes('lovable.app')) {
    logger.debug('🌐 Development environment detected, skipping subdomain extraction');
    return null;
  }
  
  // Extract subdomain from hostname (subdomain.domain.com)
  const parts = hostname.split('.');
  if (parts.length >= 3 && parts[0] !== 'www') {
    const subdomain = parts[0].toLowerCase().trim();
    logger.debug('🌐 Subdominio extraído del hostname:', { subdomain, hostname });
    return subdomain;
  }
  
  logger.debug('🌐 No se encontró subdominio en hostname:', { hostname });
  return null;
};

// Main subdomain detection function - only uses hostname
const detectSubdomain = (): string | null => {
  // Only method: Extract from hostname (for subdomain-based URLs)
  const hostnameSubdomain = extractSubdomainFromHostname();
  if (hostnameSubdomain) {
    return hostnameSubdomain;
  }
  
  logger.debug('🌐 No se encontró subdominio en hostname');
  return null;
};

interface DynamicBusinessIdProviderProps {
  children: React.ReactNode;
  fallbackBusinessId?: string;
}

export const DynamicBusinessIdProvider: React.FC<DynamicBusinessIdProviderProps> = ({ 
  children, 
  fallbackBusinessId = import.meta.env.VITE_BUSINESS_ID ?? '2dbaf455-6ad4-4224-a929-41057d23e9ca'
}) => {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);
  
  useEffect(() => {
    const performSubdomainDetection = () => {
      setIsDetecting(true);
      const detectedSubdomain = detectSubdomain();
      setSubdomain(detectedSubdomain);
      setIsDetecting(false);
      
      logger.info('🌐 Subdominio detectado:', { 
        subdomain: detectedSubdomain,
        hostname: window.location.hostname
      });
    };

    // Initial detection
    performSubdomainDetection();
    
    // Listen for navigation changes
    const handleLocationChange = () => {
      const newSubdomain = detectSubdomain();
      if (newSubdomain !== subdomain) {
        setSubdomain(newSubdomain);
        logger.info('🌐 Cambio de subdominio detectado:', { 
          oldSubdomain: subdomain, 
          newSubdomain 
        });
      }
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener('popstate', handleLocationChange);
    
    // Listen for pushstate/replacestate (programmatic navigation)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;
    
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      setTimeout(handleLocationChange, 0);
    };
    
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      setTimeout(handleLocationChange, 0);
    };
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [subdomain]);

  // Use the hook to fetch business data by subdomain
  const { data: business, isLoading: businessLoading, error } = useBusinessBySubdomain(subdomain || undefined);

  // Determine the final businessId and loading state
  const businessId = business?.id || fallbackBusinessId;
  const isLoading = isDetecting || businessLoading;

  // Enhanced error handling
  const contextError = error?.message || null;

  const contextValue: DynamicBusinessIdContextValue = {
    businessId,
    isLoading,
    error: contextError,
    subdomain,
    businessData: business,
  };

  logger.debug('🌐 DynamicBusinessIdContext valor:', {
    businessId,
    isLoading,
    error: contextError,
    subdomain,
    hasBusiness: !!business
  });

  return (
    <DynamicBusinessIdContext.Provider value={contextValue}>
      {children}
    </DynamicBusinessIdContext.Provider>
  );
};

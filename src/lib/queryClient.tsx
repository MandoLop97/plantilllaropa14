
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create the query client instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

interface QueryClientWrapperProps {
  children: React.ReactNode;
}

export function QueryClientWrapper({ children }: QueryClientWrapperProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

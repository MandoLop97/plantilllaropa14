
/**
 * Configuración de variables de entorno y configuración flexible
 * @module Environment
 */

interface EnvironmentConfig {
  supabase: {
    url: string;
    anonKey: string;
    projectId: string;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    enableDebug: boolean;
    enableAnalytics: boolean;
  };
  performance: {
    enableLazyLoading: boolean;
    cacheTimeout: number;
    retryAttempts: number;
  };
}

/**
 * Configuración por defecto del entorno
 */
export const ENV_CONFIG: EnvironmentConfig = {
  supabase: {
    url: "https://yxrkezxytovaxlpjnbda.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4cmtlenh5dG92YXhscGpuYmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NTczMzQsImV4cCI6MjA2MzQzMzMzNH0.JWzIz01JTcrqBvGixAjMP19jN36nNYZhRCWLWstuURE",
    projectId: "yxrkezxytovaxlpjnbda"
  },
  app: {
    name: 'Urban Style',
    version: '2.1.0',
    environment: import.meta.env.DEV ? 'development' : 'production',
    enableDebug: import.meta.env.DEV,
    enableAnalytics: !import.meta.env.DEV
  },
  performance: {
    enableLazyLoading: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutos
    retryAttempts: 3
  }
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 */
export function validateEnvironment(): boolean {
  const required = [
    ENV_CONFIG.supabase.url,
    ENV_CONFIG.supabase.anonKey,
    ENV_CONFIG.supabase.projectId
  ];

  const missing = required.filter(value => !value);
  
  if (missing.length > 0) {
    console.error('Variables de entorno faltantes:', missing);
    return false;
  }
  
  return true;
}

/**
 * Obtiene configuración específica del entorno actual
 */
export function getEnvironmentConfig() {
  if (!validateEnvironment()) {
    throw new Error('Configuración de entorno inválida');
  }
  
  return ENV_CONFIG;
}

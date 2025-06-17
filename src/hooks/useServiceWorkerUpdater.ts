import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { logger } from '../utils/logger';

/**
 * Registers the service worker and automatically updates
 * the application when a new version is available.
 */
export const useServiceWorkerUpdater = () => {
  useEffect(() => {
    const updateSW = registerSW({
      immediate: true,
      onRegisteredSW(swUrl, registration) {
        logger.info('✅ Service worker registered', {
          swUrl,
          scope: registration?.scope,
        });
      },
      onNeedRefresh() {
        logger.info('🔄 New service worker available, updating...');
        updateSW(true);
      },
      onOfflineReady() {
        logger.info('📦 App ready for offline usage');
      },
      onRegisterError(error) {
        logger.error('❌ Service worker registration failed', undefined, error as Error);
      },
    });
  }, []);
};

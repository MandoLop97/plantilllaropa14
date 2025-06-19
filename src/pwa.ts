import { registerSW } from 'virtual:pwa-register';
import { logger } from './utils/logger';

export function initPWA() {
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
}


import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useDynamicBusinessConfig } from '../hooks/useDynamicBusinessConfig';
import { logger } from '../utils/logger';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const businessConfig = useDynamicBusinessConfig();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallBanner(true);
      logger.info('💾 PWA install prompt available');
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      logger.info('✅ PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        logger.info('✅ User accepted PWA install');
      } else {
        logger.info('❌ User dismissed PWA install');
      }
      
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    } catch (error) {
      logger.error('❌ Error during PWA install:', undefined, error as Error);
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    setDeferredPrompt(null);
  };

  if (!showInstallBanner || !deferredPrompt || businessConfig.loading) {
    return null;
  }

  return (
    <Card className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 p-4 shadow-lg z-50 bg-background border">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <img
            src={businessConfig.logo.url}
            alt={businessConfig.logo.alt}
            className="w-10 h-10 rounded-lg object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground mb-1">
            Instalar {businessConfig.name}
          </h3>
          <p className="text-xs text-muted-foreground mb-3">
            Instala nuestra app para una experiencia más rápida y acceso offline
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              size="sm"
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              Instalar
            </Button>
            <Button 
              onClick={handleDismiss}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

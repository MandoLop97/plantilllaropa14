/// <reference lib="webworker" />

import { clientsClaim } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{url: string, revision?: string}>;
};

self.skipWaiting();
clientsClaim();

const PRECACHE = 'precache-v1';
const PRECACHE_URLS = self.__WB_MANIFEST.map((entry: any) => entry.url);

function precacheAssets() {
  caches.open(PRECACHE).then((cache) => {
    cache.addAll(PRECACHE_URLS).then(async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.postMessage({ type: 'PWA_OFFLINE_READY' }));
    });
  });
}

self.addEventListener('activate', () => {
  precacheAssets();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resp) => resp || fetch(event.request))
  );
});

// Runtime caching rules
registerRoute(
  /^https:\/\/yxrkezxytovaxlpjnbda\.supabase\.co\/.*$/,
  new NetworkFirst({
    cacheName: 'supabase-api',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24,
      }),
    ],
  })
);

registerRoute(
  /^https:\/\/fonts\.googleapis\.com\/.*$/,
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

registerRoute(
  /^https:\/\/fonts\.gstatic\.com\/.*$/,
  new CacheFirst({
    cacheName: 'gstatic-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 60 * 60 * 24 * 365,
      }),
    ],
  })
);

let baseUrl = 'https://gutix.site';

self.addEventListener('message', (event: ExtendableMessageEvent) => {
  if (!event.data) return;
  if (event.data.type === 'SET_BASE_URL') {
    baseUrl = event.data.baseUrl || '';
  }
});

function resolveUrl(url?: string) {
  if (!url) return url;
  try {
    return new URL(url, baseUrl || self.location.origin).toString();
  } catch {
    return url;
  }
}

self.addEventListener('push', (event: PushEvent) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Nueva notificación';
  const options: NotificationOptions = {
    body: data.body,
    icon: '/pwa-192x192.png',
    badge: '/pwa-192x192.png',
    data: {
      ...data.data,
      url: resolveUrl(data.data?.url),
    },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const targetUrl = resolveUrl(event.notification.data?.url || '/');

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === targetUrl && 'focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});

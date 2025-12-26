// ============================================
// SERVICE WORKER - OFFLINE PODPORA
// ============================================
// Verze: 1.0.0
// Strategie: Cache First s Network Fallback
// ============================================

const CACHE_NAME = 'vodohospodarstvo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/data.js',
  '/firebase-config.js',
  '/manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
  'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
  'https://unpkg.com/leaflet.heat@0.2.0/dist/leaflet-heat.js',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js'
];

// Instalace Service Workeru
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalace...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cachování souborů');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('❌ Chyba při cachování:', err))
  );
  self.skipWaiting();
});

// Aktivace Service Workeru
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Aktivace');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Service Worker: Mazání staré cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch strategie: Cache First, pak Network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(err => {
          console.log('⚠️ Offline režim pro:', event.request.url);
          return caches.match('/index.html');
        });
      })
  );
});

// Push notifikace
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Vodohospodářské areály';
  const options = {
    body: data.body || 'Nová notifikace',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Kliknutí na notifikaci
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data)
  );
});

console.log('✅ Service Worker načten');
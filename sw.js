/**
 * ShopEasy Service Worker
 * 
 * Provides offline fallback and basic caching for faster loading.
 * GitHub Pages static site — caches HTML, CSS, JS, and images.
 */

const CACHE_NAME = 'shopeasy-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/about.html',
  '/contact.html',
  '/auth.html',
  '/blog.html',
  '/compare.html',
  '/wishlist.html',
  '/payment.html',
  '/order-history.html',
  '/order-confirmed.html',
  '/product-detail.html',
  '/products/index.html',
  '/sitemap.xml',
  '/robots.txt',
  '/css/style.css',
  '/js/main.js',
  '/js/products_data.js',
  '/js/cart-system.js',
  '/js/checkout.js',
  '/js/stripe-integration.js',
  '/js/paypal-integration.js',
  '/js/ux-enhancements.js',
  '/js/product-detail.js',
  '/js/search.js',
  '/js/compare.js',
  '/js/wishlist.js',
  '/js/blog.js',
  '/js/reviews.js',
  '/js/auth.js',
  '/js/i18n.js',
  '/js/fix.js',
  '/js/error-diagnostics.js',
  '/images/favicon.ico',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== CACHE_NAME;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  // Skip non-GET and API calls
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        // Cache successful responses for future offline use
        if (response && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return new Response('Offline', { status: 503 });
      });
    })
  );
});

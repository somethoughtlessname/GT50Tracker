// GT50 Service Worker - bare-bones shell
const VERSION = '3.0.1';
const CACHE_NAME = 'gt50-cache-' + VERSION;

// Detect if we're on GitHub Pages
const isGitHubPages = self.location.hostname.includes('github.io');
const BASE_PATH = new URL('./', self.location).pathname;

console.log('========================================');
console.log('[SW] Service Worker v' + VERSION + ' STARTING');
console.log('[SW] Location:', self.location.href);
console.log('[SW] Is GitHub Pages:', isGitHubPages);
console.log('[SW] Base path:', BASE_PATH);
console.log('========================================');

// Files to cache - ALL LOWERCASE for GitHub Pages
const STATIC_CACHE_URLS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'shell/styles.js',
  BASE_PATH + 'shell/registry.js',
  BASE_PATH + 'shell/utils.js',
  BASE_PATH + 'shell/header.js',
  BASE_PATH + 'shell/footer.js',
  BASE_PATH + 'comp/comp-list.js',
  BASE_PATH + 'pwa/manifest.json'
];

// Install - cache files individually to see failures
self.addEventListener('install', event => {
  console.log('[SW] INSTALL - version', VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching', STATIC_CACHE_URLS.length, 'files');
        
        const cachePromises = STATIC_CACHE_URLS.map((url, i) => {
          return cache.add(url)
            .then(() => console.log('[SW] ✓', (i+1) + '/' + STATIC_CACHE_URLS.length, url))
            .catch(err => console.error('[SW] ✗ FAILED:', url, err));
        });
        
        return Promise.all(cachePromises);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - claim clients immediately
self.addEventListener('activate', event => {
  console.log('[SW] ACTIVATE - version', VERSION);
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => Promise.all(
        cacheNames.map(name => {
          if (name.startsWith('gt50-') && name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      ))
      .then(() => self.clients.claim())
      .then(() => console.log('[SW] ✓ ACTIVATED'))
  );
});

// Fetch - NETWORK FIRST for JS/HTML (cache busting), cache first for others
self.addEventListener('fetch', event => {
  const url = event.request.url;
  
  // Skip non-GET and cross-origin
  if (event.request.method !== 'GET' || !url.startsWith(self.location.origin)) {
    return;
  }
  
  // Network-first for .js and .html files to bust cache
  const isJsOrHtml = url.endsWith('.js') || url.endsWith('.html') || url.endsWith('/');
  
  if (isJsOrHtml) {
    // NETWORK FIRST for code files
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            console.log('[SW] NETWORK (fresh):', url);
            caches.open(CACHE_NAME).then(cache => 
              cache.put(event.request, response.clone())
            );
          }
          return response;
        })
        .catch(err => {
          console.log('[SW] NETWORK FAIL, trying cache:', url);
          return caches.match(event.request)
            .then(cached => cached || Promise.reject(err));
        })
    );
  } else {
    // CACHE FIRST for assets (images, etc)
    event.respondWith(
      caches.match(event.request)
        .then(cached => {
          if (cached) {
            console.log('[SW] CACHE:', url);
            return cached;
          }
          
          console.log('[SW] NETWORK:', url);
          return fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                caches.open(CACHE_NAME).then(cache => 
                  cache.put(event.request, response.clone())
                );
              }
              return response;
            });
        })
    );
  }
});

// Messages
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: VERSION, basePath: BASE_PATH });
  }
});

console.log('[SW] Ready');

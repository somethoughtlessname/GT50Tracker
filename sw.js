// The Joystick Journal service worker: keeps the app's files so it works fully offline.
// Same approach as Stack Tracker. Bump VERSION whenever files change so phones pick up the update.
const VERSION = 'joystick-journal-v624';
const FILES = [
  "./",
  "./index.html",
  "./app.webmanifest",
  "./shell/splash.js",
  "./fonts/playfair-display-latin-700-normal.woff2",
  "./shell/registry.js",
  "./shell/icons.js",
  "./shell/fit-text.js",
  "./shell/search.js",
  "./shell/styles.js",
  "./shell/parts.js",
  "./shell/header.js",
  "./shell/insert.js",
  "./shell/impex.js",
  "./shell/settings.js",
  "./shell/import-registry.js",
  "./templates/list.js",
  "./shell/import-loader.js",
  "./shell/create-new.js",
  "./shell/utility.js",
  "./shell/footer.js",
  "./shell/format-gt50.js",
  "./shell/format-encrypted.js",
  "./shell/format-import.js",
  "./shell/tabs.js",
  "./shell/info.js",
  "./shell/sort-filter.js",
  "./shell/summary.js",
  "./shell/nest.js",
  "./shell/sort.js",
  "./shell/main-bar.js",
  "./shell/backup.js",
  "./comp/comp-list.js",
  "./comp/comp-progress.js",
  "./comp/comp-checklist.js",
  "./comp/comp-radio.js",
  "./comp/comp-threshold.js",
  "./comp/comp-accumulation.js",
  "./comp/comp-history.js",
  "./comp/comp-tier.js",
  "./comp/comp-divider.js",
  "./comp/comp-text.js",
  "./comp/comp-scale.js",
  "./comp/comp-cycle.js",
  "./comp/comp-import.js",
  "./templates/game-gta5.js",
  "./templates/game-hogwarts.js",
  "./templates/game-holygoshdarn.js",
  "./templates/game-infamous1.js",
  "./templates/game-infamous2.js",
  "./templates/game-legoharrypottercollection.js",
  "./templates/game-spiderman2.js",
  "./templates/game-splitfiction.js",
  "./templates/game-stray.js",
  "./templates/game-thelongdark.js",
  "./templates/game-uncharted1.js",
  "./templates/import-example-rpg.js",
  "./templates/template-game-tracker.js",
  "./pwa/icons/icon-128.png",
  "./pwa/icons/icon-144.png",
  "./pwa/icons/icon-152.png",
  "./pwa/icons/icon-16.png",
  "./pwa/icons/icon-192.png",
  "./pwa/icons/icon-32.png",
  "./pwa/icons/icon-384.png",
  "./pwa/icons/icon-512.png",
  "./pwa/icons/icon-72.png",
  "./pwa/icons/icon-96.png"
];

self.addEventListener('install', e => {
  // cache: 'reload' skips the browser's HTTP cache, so a fresh upload is what gets stored.
  // Each file is cached on its own, so one missing file can't stop the app installing.
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.allSettled(FILES.map(f => c.add(new Request(f, {cache: 'reload'})))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// cached copy first (instant, and works offline); refresh it in the background when online.
// The page itself, the manifest and this file always try the network first.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const hit = await cache.match(e.request, {ignoreSearch: true});
    const path = new URL(e.request.url).pathname;
    if (e.request.mode === 'navigate' || path.endsWith('.webmanifest') || path.endsWith('/sw.js')) {
      try { const r = await fetch(e.request, {cache: 'no-cache'}); if (r.ok) cache.put(e.request, r.clone()); return r; }
      catch (err) { return hit || cache.match('./index.html'); }
    }
    const fresh = fetch(e.request).then(r => { if (r.ok) cache.put(e.request, r.clone()); return r; }).catch(() => null);
    return hit || (await fresh) || (e.request.mode === 'navigate' ? cache.match('./index.html') : Response.error());
  }));
});

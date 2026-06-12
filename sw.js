const WFH_CACHE = 'wallflixhub-v398';
const CORE_ASSETS = ['/', '/index.html', '/manifest.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(WFH_CACHE).then(cache => cache.addAll(CORE_ASSETS)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== WFH_CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      if (res.ok && (req.url.includes('wallflixhub.github.io') || req.url.includes('res.cloudinary.com'))) {
        caches.open(WFH_CACHE).then(cache => cache.put(req, copy)).catch(()=>{});
      }
      return res;
    }).catch(() => caches.match('/')))
  );
});

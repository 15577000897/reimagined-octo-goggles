const CACHE = 'heatstats-v4';
const FILES = [
  './','./index.html','./manifest.json',
  './icon-192.png','./icon-512.png',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))
    )).then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', e=>{
  e.respondWith(
    caches.match(e.request).then(r=>r || fetch(e.request).then(resp=>{
      const copy = resp.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
      return resp;
    }).catch(()=>caches.match('./index.html')))
  );
});

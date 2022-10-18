const cache = "app.hsalux.timely.cache";
const files = ['index.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cache).then(c => c.addAll(files))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
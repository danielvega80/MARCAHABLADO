// Service worker: red primero, caché solo de respaldo si no hay conexión.
// (así siempre ves la versión más reciente en cuanto la subes a GitHub;
// el modo offline sigue funcionando gracias a la copia en caché).
const CACHE_NAME = 'marcador-voley-playa-v2';
const ASSETS = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // guarda siempre la versión más reciente en caché para el modo offline
        const copy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return networkResponse;
      })
      .catch(() =>
        // sin conexión: usa lo que haya en caché como último recurso
        caches.match(event.request)
      )
  );
});

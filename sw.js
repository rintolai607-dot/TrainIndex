// Transit Index service worker: caches the app shell so it opens instantly and works offline.
// Live data (TfL, National Rail) and map tiles always go to the network and are never cached here.
const CACHE = "transit-index-v2";
const SHELL = ["./", "index.html", "styles.css", "app.js", "data.js", "live.js", "manifest.webmanifest", "icons/favicon.svg", "icons/icon-192.png", "icons/icon-512.png"];
const STATIC_HOSTS = ["unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;
  if (!sameOrigin && !STATIC_HOSTS.includes(url.hostname)) return;
  // Stale-while-revalidate: answer from cache straight away, refresh it in the background.
  event.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(request, { ignoreSearch: sameOrigin });
    const network = fetch(request).then(response => { if (response.ok) cache.put(request, response.clone()); return response; }).catch(() => cached);
    return cached || network;
  }));
});

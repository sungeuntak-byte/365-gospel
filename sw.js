/* 오프라인용 캐시: 처음 연 뒤에는 인터넷 없이도 열립니다 */
const CACHE = 'm365-app-1169655ee0';
const FILES = ["./", "./app.css", "./app.js", "./data/extra.json", "./data/guides.json", "./data/krv-v1.json", "./data/krv-v2.json", "./data/krv-v3.json", "./data/structure.json", "./data/text-v1.json", "./data/text-v2.json", "./data/text-v3.json", "./fonts/sans-kr.woff", "./fonts/sans-light.woff", "./fonts/serif-kr.woff", "./fonts/serif-light.woff", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png", "./manifest.json"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});

// 🔖 캐시 버전 (수정 시 숫자 증가)
const CACHE_NAME = "idea-note-cache-v4";

// 📦 캐시 대상 (절대경로 필수)
const urlsToCache = [
  "/idea_note/",
  "/idea_note/index.html",
  "/idea_note/manifest.json",
  "/idea_note/icon-512.png"
];

// 설치
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// 활성화: 이전 캐시 제거
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// fetch: 네트워크 우선 → 캐시 폴백
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});

// 🔖 캐시 버전 (기능 수정할 때마다 숫자 올리기)
const CACHE_NAME = "idea-note-v3";

// 📦 캐시할 파일 목록
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json"
];

// 1️⃣ 설치 단계: 새 캐시 생성
self.addEventListener("install", event => {
  console.log("[SW] Install");
  self.skipWaiting(); // 👉 이전 SW 기다리지 않고 바로 교체 준비

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2️⃣ 활성화 단계: 이전 캐시 전부 삭제
self.addEventListener("activate", event => {
  console.log("[SW] Activate");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("[SW] Delete old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim(); // 👉 열린 페이지를 새 SW가 즉시 제어
});

// 3️⃣ fetch: 캐시 우선, 없으면 네트워크
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

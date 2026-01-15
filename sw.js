// sw.js
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  event.waitUntil(
    caches.open('family-chat-v3').then((cache) => {  // Updated cache name
      return cache.addAll([
        '/index.html',
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js',
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js',
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js',
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js',
        'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js',
        'https://cdn.jsdelivr.net/npm/chart.js',
        'https://unpkg.com/cybercore-css@latest/dist/cybercore.min.css'
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== 'family-chat-v3').map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open('family-chat-v3').then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    }).catch(() => {
      return new Response('Offline');
    })
  );
});

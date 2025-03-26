self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("image2webp-cache").then((cache) => {
            return cache.addAll([
                "/",
                "/index.html",
                "/manifest.json",
                "/service-worker.js",
                "/icons/icon-192x192.png",
                "/icons/icon-512x512.png"
            ]);
        })
    );
    self.skipWaiting(); // Forces installation immediately
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== "image2webp-cache") {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Take control of open clients
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

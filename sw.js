importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js'
);

// Cache fallback for HTML files
workbox.routing.registerRoute(/(?:^[^.]+|\.html)$/, args =>
  workbox.strategies
    .networkFirst()
    .handle(args)
    .then(
      // page is not in cache, respond with 404 page (even if the page exists)
      response => (response === undefined ? caches.match('/404/') : response)
    )
);

// Cache CSS and JS files
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

// Cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Cache Google Fonts
workbox.routing.registerRoute(
  new RegExp('https://fonts.(?:googleapis|gstatic).com/(.*)'),
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [200]
      })
    ]
  })
);

workbox.precaching.precache(['/', '/404/', '/error/']);

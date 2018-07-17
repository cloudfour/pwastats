importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js'
);

const CACHES = {
  cssJs: 'css-js',
  images: 'images',
  fonts: 'google-fonts'
};

// Cache CSS and JS files
workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: CACHES.cssJs
  })
);

// Cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: CACHES.images,
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
    cacheName: CACHES.fonts,
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

// filled in automatically
const precacheUrls = [];

workbox.precaching.precacheAndRoute(precacheUrls);

/**
 * Simplifies a url to one that might be in the precache
 * @example "https://pwastats.com/page2/" => "/page2/index.html"
 * @param {Location} location the url to simplify
 */
const getPrecachedUrl = location => {
  const parsed = new URL(location.href, location);
  // remove target and query params
  parsed.hash = '';
  parsed.search = '';
  return parsed
    .toString()
    .replace(location.protocol + '//' + location.host, '') // remove hostname (if it matches) so it is just the path
    .replace(/\/$/, '/index.html'); // if it ends with slash, add /index.html
};

workbox.routing.registerRoute(
  new workbox.routing.NavigationRoute(req =>
    workbox.strategies
      .networkFirst()
      .handle(req)
      .then(async response => {
        if (response === undefined) {
          const simplifiedUrl = getPrecachedUrl(req.url);
          console.log('falling back to precache, checking for', simplifiedUrl);
          const matching = await caches.match(simplifiedUrl);
          if (matching === undefined) {
            console.log('not in precache, responding with 404');
            const fallback = await caches.match('404.html');
            return fallback;
          }
          return matching;
        }
        return response;
      })
  )
);

/**
 * Returns true if the cache is one of the specified caches or starts with workbox-
 * @param {string} cacheName
 */
const isCacheValid = cacheName =>
  Object.values(CACHES).includes(cacheName) || cacheName.startsWith('workbox-');

/**
 * Delete out-of-date caches
 */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNameList =>
      Promise.all(
        cacheNameList.map(cacheName => {
          if (!isCacheValid(cacheName)) {
            console.info(`Deleting cache "${cacheName}"`);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Automatically start workbox
workbox.skipWaiting();
workbox.clientsClaim();

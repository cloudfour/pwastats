importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js'
);

workbox.setConfig({
  debug: true
});

workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);

const CACHES = {
  cssJs: 'css-js',
  images: 'images',
  fonts: 'google-fonts'
};

// // Cache fallback for HTML files
// workbox.routing.registerRoute(/(?:^[^.]+|\.html)$/, args =>
//   workbox.strategies
//     .networkFirst()
//     .handle(args)
//     .then(
//       // page is not in cache, respond with 404 page (even if the page exists)
//       response => (response === undefined ? caches.match('/404/') : response)
//     )
// );

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
const precacheUrls = [
  {
    "url": "404.html",
    "revision": "c655e20ab80ee387eac1bcf97b34028b"
  },
  {
    "url": "error.html",
    "revision": "94a7cc218631709c36263493b3200839"
  },
  {
    "url": "index.html",
    "revision": "02dcd892ddcff83482354b242a2d285f"
  },
  {
    "url": "page2/index.html",
    "revision": "ec61a1113aa31cfe480ee75a2d6d7d1b"
  },
  {
    "url": "page3/index.html",
    "revision": "0cb83fdee3057a1c3aa0e31103abb63b"
  },
  {
    "url": "page4/index.html",
    "revision": "e4815d2e0618aa86b51fbd13f18d42b6"
  },
  {
    "url": "page5/index.html",
    "revision": "ede7e811827f2ebde7281d42770e9a7d"
  }
];

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
        console.log('response', response);
        console.log('matching?', response === undefined);
        if (response === undefined) {
          console.log('request', req);
          const simplifiedUrl = getPrecachedUrl(req.url);
          console.log('checking for', simplifiedUrl);
          const matching = await caches.match(simplifiedUrl);
          console.log('matching request', matching);
          if (matching === undefined) {
            console.log('there is no cached version of this page');
            const fallback = await caches.match('404.html');
            console.log('fallback is', fallback);
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

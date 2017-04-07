importScripts(
  'js/vendor/sw-cacheable-response.min.js',
  'js/vendor/sw-routing.min.js',
  'js/vendor/sw-runtime-caching.min.js',
  'js/vendor/sw-precaching.min.js'
);

// Make this always match package.json version
const version = '0.1.3';
const cacheName = `defaultCache_${version}`;

const {
  cacheableResponse,
  precaching,
  routing,
  runtimeCaching
} = goog;

const router = new routing.Router();
const localhost = registration.scope;
const staticCache = new precaching.UnrevisionedCacheManager({ cacheName });
const requestWrapper = new runtimeCaching.RequestWrapper({ cacheName });
const cdnRequestWrapper = new runtimeCaching.RequestWrapper({
  plugins: [
    new cacheableResponse.CacheableResponsePlugin({ statuses: [0, 200] })
  ],
  cacheName
});

/**
 * Route for local CSS and JS assets
 *
 * Strategy:
 * https://developers.google.com/web/fundamentals/instant-and-offline/
 * offline-cookbook/#stale-while-revalidate
 */
const assetRoute = new routing.RegExpRoute({
  regExp: new RegExp(`^${localhost}.*\\.(css|js|png|svg)$`),
  handler: new runtimeCaching.StaleWhileRevalidate({ requestWrapper })
});

/**
 * Route for our pattern library
 *
 * Strategy:
 * https://developers.google.com/web/fundamentals/instant-and-offline/
 * offline-cookbook/#stale-while-revalidate
 */
const externalRoute = new routing.RegExpRoute({
  regExp: new RegExp('^https://cloudfour-patterns.netlify.com/.*'),
  handler: new runtimeCaching.StaleWhileRevalidate({ requestWrapper })
});

/**
 * Route for assets on cloudfront.net CDN
 *
 * Strategy:
 * https://developers.google.com/web/fundamentals/instant-and-offline/
 * offline-cookbook/#stale-while-revalidate
 */
const cdnAssetRoute = new routing.RegExpRoute({
  regExp: new RegExp('^https:\/\/.*\.cloudfront\.net\/.*\.(png|svg)$'),
  handler: new runtimeCaching.StaleWhileRevalidate({
    requestWrapper: cdnRequestWrapper
  })
});

/**
 * Route for pages
 *
 * Strategy:
 * https://developers.google.com/web/fundamentals/instant-and-offline/
 * offline-cookbook/#network-falling-back-to-cache
 */
const navRoute = new routing.NavigationRoute({
  whitelist: [/./],
  handler: new runtimeCaching.NetworkFirst({ requestWrapper })
});

/**
 * Precache resources
 */
staticCache.addToCacheList({
  unrevisionedFiles: [
    '/',
    '/404/',
    '/error/'
  ]
});

self.oninstall = event => {
  event.waitUntil(Promise.all([
    staticCache.install().then(skipWaiting)
  ]));
};

self.onactivate = event => {
  caches.keys().then(keys => {
    keys.forEach(cacheName => {
      if (!cacheName.endsWith(version)) {
        caches.delete(cacheName);
      }
    });
  });
  return event.waitUntil(clients.claim());
};

router.registerRoutes({
  routes: [
    assetRoute,
    externalRoute,
    cdnAssetRoute,
    navRoute
  ]
});

/**
 * Fallback route for stuff that doesn't match
 */
router.setDefaultHandler({
  handler: new runtimeCaching.NetworkOnly()
});

/**
 * Catch-all fetch error handler
 */
router.setCatchHandler({
  handler: {
    handle: () => caches.match('/error/')
  }
});

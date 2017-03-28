importScripts(
  'js/vendor/sw-routing.min.js',
  'js/vendor/sw-runtime-caching.min.js',
  'js/vendor/sw-precaching.min.js'
);

// Make this always match package.json version
const version = '0.1.0';

const {
  precaching,
  routing,
  runtimeCaching
} = goog;

const router = new routing.Router();
const localhost = registration.scope;
const assetCache = new precaching.UnrevisionedCacheManager();

/**
 * Route for local CSS and JS assets
 *
 * Strategy:
 * https://developers.google.com/web/fundamentals/instant-and-offline/
 * offline-cookbook/#stale-while-revalidate
 */
const assetRoute = new routing.RegExpRoute({
  regExp: new RegExp(`^${localhost}.*\\.(css|js)$`),
  handler: new runtimeCaching.StaleWhileRevalidate()
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
  handler: new runtimeCaching.StaleWhileRevalidate()
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
  handler: new runtimeCaching.NetworkFirst()
});

/**
 * Precache resources
 */
assetCache.addToCacheList({
  unrevisionedFiles: [
    '/',
    '/404/',
    '/error/'
  ]
});

self.oninstall = event => {
  event.waitUntil(Promise.all([
    assetCache.install().then(skipWaiting)
  ]));
};

self.onactivate = event => {
  event.waitUntil(Promise.all([
    assetCache.cleanup()
  ]));
};

router.registerRoutes({
  routes: [
    assetRoute,
    externalRoute,
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

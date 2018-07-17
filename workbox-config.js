module.exports = {
  swSrc: 'sw.js',
  swDest: 'revisioned-sw.js',
  globDirectory: '_site',
  globPatterns: ['*.html', 'page?/index.html'],
  injectionPointRegexp: /(const precacheUrls = )\[\](;)/
};

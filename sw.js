importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

const { cacheableResponse, core, expiration, googleAnalytics, routing, strategies } = workbox;
const { CacheableResponsePlugin } = cacheableResponse;
const { ExpirationPlugin } = expiration;
const { registerRoute } = routing;
const { CacheFirst, StaleWhileRevalidate } = strategies;

core.clientsClaim();
core.skipWaiting();

// Cache Google Fonts
registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  new CacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 Days
      }),
    ],
  }),
);

// Cache JavaScript and CSS
registerRoute(/\.(?:js|css)$/, new StaleWhileRevalidate());

// Cache Images
registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Days
      }),
    ],
  }),
);

// Offline Google Analytics
googleAnalytics.initialize();

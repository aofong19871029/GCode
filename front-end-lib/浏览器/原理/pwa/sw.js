const cacheName = 'news-v1';
const staticAssets = [
    './',
    './index.html',
    './styles.css',
    './index.js',
    './newsApi.js',
    './news-article.js'
];

// caches 是一个特殊的 CacheStorage 对象，它能在Service Worker指定的范围内提供数据存储的能力，
// 在service worker中使用web storage 将不会有效果，因为web storage的执行是同步的\，所以我们使用Cache API作为替代。

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    // 可以使用 self.skipWaiting() 方法，手动触发 Service Worker activate 事件，并告知 Service Worker 立即开始工作，而无需等待用户跳转或刷新页面。
    return self.skipWaiting();
});

self.addEventListener('activate', e => {
    // 如果需要在每次更改 Service Worker 文件后，马上更新所有资源，则可以在 install 事件中执行 self.skipWaiting() 方法跳过 waiting 状态，
    // 然后会直接进入 activate 阶段。接着在 activate 事件发生时，通过执行 self.clients.claim() 方法，更新所有客户端上的 Service Worker
    self.clients.claim();
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
    } else {
        e.respondWith(networkAndCache(req));
    }
});

async function cacheFirst(req) {
    // caches.open(cacheName) 方法用来创建一个名为 cacheName 的缓存，成功后返回 promise

    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached;
    }
}
let Cache_Name = 'currency-converter-v1';
let URLsToCache = [
    '/index.html',
    'scripts/free-converter.js',
    'https://free.currencyconverterapi.com/api/v5/currencies',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
];

self.addEventListener("install", (event) => {
    //Begin installing the service worker
    event.waitUntil(
        caches.open(Cache_Name).then(cache => {
            console.log("Cache opened");
            return cache.addAll(URLsToCache); 
        })
    );
}) 

self.addEventListener("fetch", (event) => {
    let requestURL = new URL(event.request.url);

    if(requestURL.pathname.startsWith('/api/v5/convert')){
        event.respondWith(conversionRates_cache(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
})


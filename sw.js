let Cache_Name = 'currency-converter-v1';
let URLsToCache = [
    '/index.html',
    'scripts/free-converter.js',
    'https://free.currencyconverterapi.com/api/v5/currencies'
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


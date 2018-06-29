const Cache_Name = 'currency-converter-v1';
const Cache_Conversion_Rate = 'conversion-rate';
const All_Caches = [
    Cache_Name,
    Cache_Conversion_Rate
];
let URLsToCache = [
    '/index.html',
    'scripts/free-converter.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css'
];

self.addEventListener("install", (event) => {
    //Begin installing the service worker
    event.waitUntil(
        caches.open(Cache_Name).then(cache => {
            console.log("Cache opened");
            self.skipWaiting();
            return cache.addAll(URLsToCache); 
        })
    );
}) 
 
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then( cacheNames => {
            return Promise.all(
                cacheNames.map( cacheName => {
                    if(All_Caches.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", (event) => {
    let requestURL = new URL(event.request.url);

    if(requestURL.pathname.startsWith('/api/v5/convert')) return;
    
    if(requestURL.pathname.startsWith('/api/v5/currencies')) return;
 
    event.respondWith(
        caches.match(event.request).then(response => {
            if(response) return response;

            // cloning the fetch request
            let fetchRequest = event.request.clone();
            return fetch(fetchRequest).then(response => {
                // check is the response received is valid
                if(!response || response.status !== 200){
                    return response;
                }

                // cloning the response before putting in cache
                let responseToCache = response.clone();
                // Opening the cache and putting the request and response to the cache array
                caches.open(Cache_Name).then(cache => {
                    cache.put(event.request, responseToCache);
                });
                console.log("Request/Response pair added");
                return response;
            });
        })
    );
}) 

function conversionRates_cache(request) {
    return caches.open(Cache_Conversion_Rate).then( cache => {
        cache.match(request).then( response => {
            let netResponse = fetch(request).then( networkResponse => {
                cache.put(request, networkResponse.clone());
                return networkResponse;
            });
            return response || netResponse;
        });
    });
}

// Handle the event where the service worker needs to skipWaiting 
self.addEventListener('load', function(event) {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });


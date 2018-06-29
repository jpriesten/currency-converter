self.addEventListener("load", () => {
    // if the browser doesn't surpport service workers then do not do anything 
    if(!navigator.serviceWorker) return;

    // registering the service worker
    navigator.serviceWorker.register('sw.js').then(reg => {
        console.log(`registration complete : ${reg.scope}`);
    }).catch(() => {
        console.log("registration broken");
    });

    // Ensure refresh is only called once.
    let refreshing;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        window.location.reload();
        refreshing = true;
    });
})
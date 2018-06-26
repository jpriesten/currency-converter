self.addEventListener("load", () => {
    // if the browser doesn't surpport service workers then do not do anything 
    if(!navigator.serviceWorker) return;

    // registering the service worker
    navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log("registration complete");
    }).catch(() => {
        console.log("registration broken");
    });
})
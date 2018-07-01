self.addEventListener("load", () => {
    // if the browser doesn't surpport service workers then do not do anything 
    if(!navigator.serviceWorker) return;

    // When the user asks to refresh the UI, we'll need to reload the window
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (!event.data) {
        return;
        }
        
        switch (event.data) {
        case 'reload-window':
            window.location.reload();
            break;
        default:
            // NOOP
            break;
        }
    });

    let updateReady = (worker) => {
        worker.postMessage({action: 'skipWaiting'});
    };
    let trackInstalling = (worker) => {
        worker.addEventListener('statechange', () => {
            if(worker.state == 'installed'){
                updateReady(worker);
            }
        });
    };

    // registering the service worker
    navigator.serviceWorker.register('/sw.js').then(reg => {

        if (!navigator.serviceWorker.controller) {
            return;
        }

        console.log(`registration complete : ${reg}`);

        if (reg.waiting) {
            console.log("waiting...");
            updateReady(reg.waiting);
            console.log("wait ended!");
            return;
        }
      
        if (reg.installing) {
            console.log("installing...");
            trackInstalling(reg.installing);
            console.log("installation complete!");
            return;
        }
    
        reg.addEventListener('updatefound', () => {
            trackInstalling(reg.installing);
        });

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
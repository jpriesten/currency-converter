
let toConvert = document.getElementById("toConvert");
let converted = document.getElementById("converted");
let convert = document.getElementById("convert");
let toSelect = document.getElementById("inputGroupSelect02");
let fromSelect = document.getElementById("inputGroupSelect01");

//Two things should happen when a user clicks on the convert button
// 1) The conversion calculation should take place and should populate the result field.
// 2) The JSON response after the query is made should be put in the database. The response holds the 
//      query_id and the conversion_rate
convert.addEventListener("click", ()=> {
    let queryCodes = `${fromSelect.value}_${toSelect.value}`;
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${queryCodes}&compact=ultra`).then(responds => {
        return responds.json();
    }).then(query => {
        let total = toConvert.value * query[queryCodes];
        converted.setAttribute("value", `${Math.round(total * 100) / 100}`);
        console.log(query);
        return query;
    }).then( query => {
        openDatabase().then( db => {
            if (!db) return;

            let tx = db.transaction('currency_rates', 'readwrite');
            let store = tx.objectStore('currency_rates');
            store.put({id: queryCodes, value: query[queryCodes]});
            return store.complete;
        });
    });
});

self.addEventListener('load', () => {
    const url = fetch(`https://free.currencyconverterapi.com/api/v5/currencies`);
    url.then(responds => {
        return responds.json();
    }).then(data => {
        let results = data.results
        fromSelect.innerHTML = "" , toSelect.innerHTML = "";

        for( const currency in results ){
            fromSelect.innerHTML += `<option value="${results[currency].id}">${results[currency].id}(${results[currency].currencyName})</option>`;
            toSelect.innerHTML += `<option value="${results[currency].id}">${results[currency].id}(${results[currency].currencyName})</option>`;
        }
        return results;
    }).then( results => {
        openDatabase().then( db => {
            if (!db) return;

            let tx = db.transaction('country_currency', 'readwrite');
            let store = tx.objectStore('country_currency');
            
            for( const currency in results){
                let result = results[currency];
                store.put(result);
            }
            return store.complete;
        });
    });
});

// Opening indexedDB and creating two objectStores
self.addEventListener('load', openDatabase = () => {
    // If browser does not support service workers, no need for indexedDB
    if(!navigator.serviceWorker){
        return Promise.resolve();
    }

    return idb.open('convert', 1, (upgradeDb) => {
        const rates_Store = upgradeDb.createObjectStore('currency_rates', {keyPath: 'id', autoIncrement: true});
        rates_Store.createIndex('by-date', 'time');
        return upgradeDb.createObjectStore('country_currency', {keyPath: 'id', autoIncrement: true});
    });
});
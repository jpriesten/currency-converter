let toConvert = document.getElementById("toConvert");
let converted = document.getElementById("converted");
let convert = document.getElementById("convert");
let toSelect = document.getElementById("inputGroupSelect02");
let fromSelect = document.getElementById("inputGroupSelect01");

convert.addEventListener("click", ()=> {
    let queryCodes = `${fromSelect.value}_${toSelect.value}`;
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${queryCodes}&compact=ultra`).then(responds => {
        return responds.json();
    }).then(query => {
        let total = toConvert.value * query[queryCodes];
        converted.setAttribute("value", `${Math.round(total * 100) / 100}`);
        console.log(query);
    })
})

const url = fetch(`https://free.currencyconverterapi.com/api/v5/currencies`);
url.then(responds => {
    return responds.json();
}).then(data => {
    let results = data.results
    fromSelect.innerHTML = "" , toSelect.innerHTML = "";
    for( const currency in results ){
        fromSelect.innerHTML += `<option value="${results[currency].id}">${results[currency].id}</option>`;
        toSelect.innerHTML += `<option value="${results[currency].id}">${results[currency].id}</option>`;
    }
});
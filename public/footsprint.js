"use strict";

//COOKIES
//Cookies erzeugen
function createCookie(name, value, days) {
    let expires = '';
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + value + expires + '; path=/';
}
//Cookies lesen
function readCookie(name) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
//Cookies löschen
function deleteCookie(name) {
    createCookie(name, '', -1);
}

// Prüfung, ob Cookie setzen möglich und erlaubt
function cookieTester() {
    let canIUseCookies = false;
    if (navigator.cookieEnabled) {
        canIUseCookies = true;
    }
    //alte Browser 
    if (typeof navigator.cookieEnabled == "undefined") {
        document.cookie = "testcookie";
        if (document.cookie.indexOf("testcookie") != -1) {
            canIUseCookies = true;
        }
    }
    return canIUseCookies;
}
//Info cookies sind erlaubt 
if (cookieTester()) {
    console.log("we can use cookies");
    console.log(navigator.cookieEnabled);
}

//Cookies Popup nachricht erzeugen
const cookieContainer = document.querySelector(".cookie-container");
let cookieButton = document.querySelector(".cookie-btn");
let antwort;

cookieButton.addEventListener("click", () => {
    cookieContainer.classList.remove("active");
});
//Cookies akzeptieren
cookieButton.addEventListener("click", function () {
    createCookie("username0", "IchBinEinCookie", 30);
    createCookie("username1", "IchBinEinAnderes", 30);
    createCookie("username2", "IchBleibeLänger", 60);
})

//Prüfen ob cookies bereits vorhanden
function checkCookie() {
    let user = readCookie("username0");
    if (user == null) {
        setTimeout(() => {
            cookieContainer.classList.add("active");
        }, 2000);
    }
}
checkCookie();

//AJAX 

let jsonData;
let indexAuswahl;

// 1. XHR-Object erzeugen
let xhr = new XMLHttpRequest();

// 2. EventHandler für Server-Antwort
xhr.onload = function () {
    if (xhr.status != 200) {
        container.textContent = "Allgemeiner Verarbeitungsfehler!";
        return;
    }
    if (xhr.responseType == "json") {
        jsonData = xhr.response;
    } else {
        jsonData = JSON.parse(xhr.responseText);
    }
    console.log(jsonData);

    //Tabelle Default Konfiguration
    let tableTitle = "LÄNDER, GEORDNET NACH GESAMTER BIOKAPAZITÄT (in globalen Hektar)"
    tables(tableTitle, "#558000", false);
    //Tabelle Länder Auswahl
    laenderAuswahl();
}

// 3. 
xhr.open("GET", "datei.json");

// 4.
xhr.responseType = "json";
xhr.setRequestHeader("Accept", "application/json");

// 5.
xhr.send();

//Tabelle erzeugen
//Funktion zum erzeugen neuer Tabellenzeilen
function addItemTabelle(nummer, land, wert) {

    //Tabellenzelle erzeugen
    let nummerTd = document.createElement("td");
    nummerTd.textContent = nummer;
    //Tabellenzelle erzeugen
    let landTd = document.createElement("td");
    landTd.textContent = land;
    //Tabellenzelle erzeugen
    let wertTd = document.createElement("td");
    //Position Texte auf der rechten Seite
    wertTd.style.textAlign = "right";
    //Wert in Int umwandeln und punkte nach drei Ziffern
    wertTd.textContent = parseInt(wert).toLocaleString();

    //tr-tag erzeugen
    let itemRow = document.createElement("tr");

    //DOM-Teilbaum erzeugen der neuen Zeile wird ausgelagert
    itemRow.appendChild(nummerTd);
    itemRow.appendChild(landTd);
    itemRow.appendChild(wertTd);

    //Zeile in DOM (in tbody) integrieren
    //tableBody = document.querySelector();
    //tableBody.appendChild();     
    document.querySelector("div.Table table tbody").appendChild(itemRow);
}

//Funktion zum erzeugen Tabellen BIOKAPAZITAET und OEKOLOGISHER FUSSABDRUCK
function tables(tableName, color, footprint) {

    //Erstmal die vorhandene Tabelle löschen
    let allTableRows = document.querySelectorAll("tbody tr");
    for (let i = 0; i < allTableRows.length; i++) {
        allTableRows[i].remove();
    }
    //DOM-Elemente selektieren 
    let laender = jsonData.laender;
    let tableTitle = document.querySelector("p.tableTitle");
    let tableTitleDiv = document.querySelector("div.tableTitle");
    let table = document.querySelector("div.Table");
    let platz = document.querySelector("div.platz");
    let parameterKey;

    //Werte sortieren
    if (footprint) {
        laender.sort(function (a, b) {
            return parseInt(b.totalOekologischerFussabdruck) - parseInt(a.totalOekologischerFussabdruck);
        });
    } else {
        laender.sort(function (a, b) {
            return parseInt(b.totalBiokapazitaet) - parseInt(a.totalBiokapazitaet);
        });
    }

    //Neue Tabelle erzeugen
    for (let i = 0; i < laender.length; i++) {
        let einLand = laender[i];
        if (footprint) {
            parameterKey = einLand.totalOekologischerFussabdruck;
        } else {
            parameterKey = einLand.totalBiokapazitaet;
        }
        let row = addItemTabelle(
            i + 1,
            einLand.name,
            parameterKey);
    }
    //Neue Tabelle Titel erzeugen    
    tableTitle.textContent = tableName;
    //Neue Style Eigenschaften erzeugen
    tableTitle.style.backgroundColor = color;
    tableTitle.style.color = "white";
    tableTitleDiv.style.backgroundColor = color;
    tableTitleDiv.style.opacity = 0.75;
    table.style.backgroundColor = color;
    table.style.opacity = 0.75;
    table.style.color = "white";
    platz.style.backgroundColor = color;
    platz.style.opacity = 0.75;
}

//Funktion Tabelle erzeugen Laender Auswahl
function laenderAuswahl() {
    let laender = jsonData.laender;
    let table = document.querySelector("table.laenderAuswahl");

    //Länder sind in alphabetischer Reihenfolge geordnet
    laender.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    for (let i = 0; i < laender.length; i++) {
        //tr-tag erzeugen
        let zeileLand = document.createElement("tr");
        zeileLand.setAttribute("class", "zeileLand");
        zeileLand.textContent = laender[i].name;
        document.querySelector("table.laenderAuswahl thead").appendChild(zeileLand);

        //Tabelle Länder Auswahl
        zeileLand.addEventListener("click", function (event) {
            let landName = zeileLand.textContent;
            let alleZeilen = event.currentTarget.parentNode.children;
            indexAuswahl = i;
            for (let item of alleZeilen) {
                item.style.backgroundColor = ""
                item.style.color = "#777"
            }
            event.currentTarget.style.backgroundColor = "dimgray"
            zeileLand.style.color = "white"
            //Berechnungen
            berechnungen(landName);
        });
    }
}

//Funktion Berechnungen
function berechnungen(landName) {
    let laender = jsonData.laender;
    const OekologischerFussabdruckErde = 1.6;
    let infoResDef;
    let colorInfo

    let bioPerson = laender[indexAuswahl].biokapazitaetPerPerson;
    let oekoPerson = laender[indexAuswahl].OekologischerFussabdruckPerPerson

    //Länder sind in alphabetischer Reihenfolge geordnet
    laender.sort(function (a, b) {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });

    //ECOLOGICAL DEFICIT/RESERVE
    let bioResDef = (bioPerson - oekoPerson).toFixed(2);
    if (bioResDef < 0) {
        infoResDef = laender[indexAuswahl].name + " hat deficit(-)";
        colorInfo = "red";
    } else {
        infoResDef = laender[indexAuswahl].name + " hat reserve(+)/superavit";
        colorInfo = "green";
    }

    //Wie viele Planeten?
    let planetZahl = (oekoPerson / OekologischerFussabdruckErde).toFixed(2);

    //Tag der Erdüberschreitung
    let monat;
    let tag;
    let nummer = OekologischerFussabdruckErde / oekoPerson;

    if (nummer > 1) {
        console.log("Dieses Land verbraucht weniger Ressourcen als die Erdgrenze.");
    } else {
        // Sie wird mit den 365 Tagen des Jahres multipliziert
        let datum = Math.round(nummer * 365);
        // Sucht der Monat
        if (datum <= 31) {
            monat = "Januar";
            tag = datum;
        } else if (datum > 31 && datum <= 59) {
            monat = "Februar";
            tag = datum - 31;
        } else if (datum > 59 && datum <= 90) {
            monat = "März";
            tag = datum - 59;
        } else if (datum > 90 && datum <= 120) {
            monat = "April";
            tag = datum - 90;
        } else if (datum > 120 && datum <= 151) {
            monat = "Mai";
            tag = datum - 120;
        } else if (datum > 151 && datum <= 181) {
            monat = "Juni";
            tag = datum - 151;
        } else if (datum > 181 && datum <= 212) {
            monat = "Juli";
            tag = datum - 181;
        } else if (datum > 212 && datum <= 243) {
            monat = "August";
            tag = datum - 212;
        } else if (datum > 243 && datum <= 273) {
            monat = "September";
            tag = datum - 243;
        } else if (datum > 273 && datum <= 304) {
            monat = "Oktober";
            tag = datum - 273;
        } else if (datum > 304 && datum <= 334) {
            monat = "November";
            tag = datum - 304;
        } else if (datum > 334 && datum <= 365) {
            monat = "Dezember";
            tag = datum - 334;
        }
    }
    //INFO ANZEIGEN

    //Erstmal die vorhandene Daten löschen
    let allTableRowsP = document.querySelectorAll("p.berechnungen");
    for (let i = 0; i < allTableRowsP.length; i++) {
        allTableRowsP[i].remove();
    }
    let allTableRowsBr = document.querySelectorAll("br.berechnungen");
    for (let i = 0; i < allTableRowsBr.length; i++) {
        allTableRowsBr[i].remove();
    }
    let alleWeltBild = document.querySelectorAll("img.weltBild");
    for (let i = 0; i < alleWeltBild.length; i++) {
        alleWeltBild[i].remove();
    }
    let alleWeltText = document.querySelectorAll("p.weltText");
    for (let i = 0; i < alleWeltText.length; i++) {
        alleWeltText[i].remove();
    }
    if (document.querySelector("div.infoWieViele") != null) {
        document.querySelector("div.infoWieViele").remove();
    }

    //Land Name
    let brTag = document.createElement("br");
    brTag.setAttribute("class", "berechnungen");
    let land = document.createElement("p");
    land.style.fontSize = "32px";
    land.style.fontWeight = "bold";
    land.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(land);
    document.querySelector("div.laenderDaten").appendChild(brTag);
    land.textContent = landName;

    //Ökologisch Defizit/Reserve von einem bestimmten Land
    let oekoResDef = document.createElement("p");
    oekoResDef.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(oekoResDef);
    oekoResDef.textContent = "Die Ökologisch Defizit/Reserve von " + laender[indexAuswahl].name + " ist: " + bioResDef + " gha.";

    //Ökologisch Defizit/Reserve zusätzliche Info
    let ResDef = document.createElement("p");
    ResDef.style.color = colorInfo;
    ResDef.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(ResDef);
    ResDef.textContent = infoResDef;

    //Wie viele Planeten werden gebraucht (Land)
    let wieViele = document.createElement("p");
    wieViele.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(wieViele);
    wieViele.textContent = "Der Lebensstandard in " + laender[indexAuswahl].name + " erfordert " + planetZahl + " Planeten.";

    //Tag der Bioressourcen-überschreitung (Land)
    let overshootDay = document.createElement("p");
    overshootDay.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(overshootDay);
    overshootDay.textContent = "Der Tag der Bioressourcen-überschreitung in diesem Land ist ungefähr am: " + tag + ". " + monat + ".";

    //Wie viele Planeten werden gebraucht (Welt)
    let wieVieleWelt = document.createElement("p");
    wieVieleWelt.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(wieVieleWelt);
    wieVieleWelt.textContent = "Der Lebensstandard im ganzen Welt erfordert 1.6 Planeten.";

    //Tag der Bioressourcen-überschreitung (Welt)
    let overshootDayWorld = document.createElement("p");
    overshootDayWorld.setAttribute("class", "berechnungen");
    document.querySelector("div.laenderDaten").appendChild(overshootDayWorld);
    overshootDayWorld.textContent = "Der Tag der Bioressourcen-überschreitung (2017) im ganzen Welt ist ungefähr am 2. August.";

    //Welt bild hinzufügen
    let weltBild = document.createElement("img");
    weltBild.setAttribute("src", "worldwide.png");
    weltBild.setAttribute("class", "weltBild");
    document.querySelector("div.welt").appendChild(weltBild);
    //text hinzufügen
    let weltText = document.createElement("p");
    weltText.setAttribute("class", "weltText");
    document.querySelector("div.welt").appendChild(weltText);
    weltText.textContent = " x " + planetZahl;
}

//EVENTS

//Tabellen BIOKAPAZITÄT und OEKOLOGISCHER FUSSABDRUCK
let footprintImg = document.querySelector("#footprint");
let treeImg = document.querySelector("#tree");

//Tabelle anzeigen beim clicken Footprint
footprintImg.addEventListener("click", function () {
    let tableTitle = "LÄNDER, GEORDNET NACH GESAMTER OEKOLOGISCHER FUSSABDRUCK (in globalen Hektar)"
    tables(tableTitle, "#990000", true);
});
//Tabelle anzeigen beim clicken Tree
treeImg.addEventListener("click", function () {
    let tableTitle = "LÄNDER, GEORDNET NACH GESAMTER BIOKAPAZITÄT (in globalen Hektar)"
    tables(tableTitle, "#558000", false);
});












const button = document.getElementById("berechnen");

button.addEventListener("click", berechnen);

// Größter gemeinsamer Teiler (Euklidischer Algorithmus)
function ggT(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
        let rest = a % b;
        a = b;
        b = rest;
    }

    return a;
}


function primfaktoren(zahl) {
    let faktoren = [];
    zahl = Math.abs(zahl);

    let teiler = 2;

    while (zahl > 1) {
        if (zahl % teiler === 0) {
            faktoren.push(teiler);
            zahl = zahl / teiler;
        } else {
            teiler++;
        }
    }

    // Die 1 am Ende behalten
    faktoren.push(1);

    return faktoren;
}

// Gemeinsame Faktoren finden und streichen
function faktorenKuerzen(zaehler, nenner) {
    let oben = primfaktoren(zaehler);
    let unten = primfaktoren(nenner);

    let obenGestrichen = [];
    let untenGestrichen = [];

    for (let i = 0; i < oben.length; i++) {
        let index = unten.findIndex(
            (faktor, j) =>
                faktor === oben[i] &&
                !untenGestrichen.includes(j)
        );

        if (index !== -1) {
            obenGestrichen.push(i);
            untenGestrichen.push(index);
        }
    }

    return {
        oben,
        unten,
        obenGestrichen,
        untenGestrichen
    };
}

function faktorenHTML(faktoren, gestrichen) {
    if (faktoren.length === 0) {
        return "1";
    }

    return faktoren.map((faktor, index) => {
        if (gestrichen.includes(index)) {
            return `<s>${faktor}</s>`;
        }
        return faktor;
    }).join(" × ");
}

// Bruch als HTML darstellen
function bruch(z, n, faktor = 1) {
    if(faktor!==1){
    return `
        <span class="bruch-anzeige">
            <span class="zaehler">${z} x ${faktor} </span>
            <span class="nenner">${n} x ${faktor}</span>
        </span>
    `;
    }
    return `
        <span class="bruch-anzeige">
            <span class="zaehler">${z} </span>
            <span class="nenner">${n}</span>
        </span>
    `;
}
function berechnen() {

    // 1. Eingaben lesen
    const z1 = Number(document.getElementById("zaehler1").value);
    const n1 = Number(document.getElementById("nenner1").value);
    const z2 = Number(document.getElementById("zaehler2").value);
    const n2 = Number(document.getElementById("nenner2").value);
    const operator = document.getElementById("operator").value;

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const step4 = document.getElementById("step4");
    const result = document.getElementById("result");

    // Eingaben prüfen
    if (
        ![z1, n1, z2, n2].every(Number.isSafeInteger) ||
        n1 === 0 || n2 === 0
    ) {
        step1.innerHTML = "Bitte gültige ganze Zahlen eingeben. Nenner dürfen nicht 0 sein.";
        step2.innerHTML = "";
        step3.innerHTML = "";
        step4.innerHTML = "";
        result.innerHTML = "";
        return;
    }

    // Nenner positiv halten
    const a = n1 < 0 ? -z1 : z1;
    const b = Math.abs(n1);
    const c = n2 < 0 ? -z2 : z2;
    const d = Math.abs(n2);

    let neuerZ1 = a;
    let neuerZ2 = c;
    let gemeinsamerNenner;
    let faktor1 = 1;
    let faktor2 = 1;

    // 2. Nenner vergleichen
    if (b === d) {

        // Fall 1: gleiche Nenner
        gemeinsamerNenner = b;

        step1.innerHTML = `
            <strong>Schritt 1: Nenner vergleichen</strong>
            <p>Beide Nenner sind ${b}. Sie sind gleich!</p>
        `;

        step2.innerHTML = `
            <strong>Schritt 2: Erweitern</strong>
            <p>Wir müssen nichts erweitern.</p>
        `;

    } else if (b > d && b % d === 0) {

        // Fall 2a: erster Nenner ist größer
        gemeinsamerNenner = b;
        faktor2 = b / d;
        neuerZ2 = c * faktor2;

        step1.innerHTML = `
            <strong>Schritt 1: Nenner vergleichen</strong>
            <p>${b} ist durch ${d} teilbar.</p>
             <p>Erweiterungszahl: ${b} ÷ ${d} = ${faktor2}</p>
        `;

        step2.innerHTML = `
            <strong>Schritt 2: Erweitern</strong>
           
            <p>${bruch(c, d)} =${bruch(c, d, faktor2)} = ${bruch(neuerZ2, gemeinsamerNenner)}</p>
        `;

    } else if (d > b && d % b === 0) {

        // Fall 2b: zweiter Nenner ist größer
        gemeinsamerNenner = d;
        faktor1 = d / b;
        neuerZ1 = a * faktor1;

        step1.innerHTML = `
            <strong>Schritt 1: Nenner vergleichen</strong>
            <p>${d} ist durch ${b} teilbar.</p>
             <p>Erweiterungszahl: ${d} ÷ ${b} = ${faktor1}</p>
        `;

        step2.innerHTML = `
            <strong>Schritt 2: Erweitern</strong>
           
            <p>${bruch(a, b)} =${bruch(a, b,faktor1)} = ${bruch(neuerZ1, gemeinsamerNenner)}</p>
        `;

    } else {

        // Fall 3: beide Brüche erweitern
        faktor1 = d;
        faktor2 = b;

        neuerZ1 = a * faktor1;
        neuerZ2 = c * faktor2;
        gemeinsamerNenner = b * d;

        step1.innerHTML = `
            <strong>Schritt 1: Nenner vergleichen</strong>
            <p>Die Nenner ${b} und ${d} sind verschieden.
            Keiner ist durch den anderen teilbar.</p>
        `;

        step2.innerHTML = `
            <strong>Schritt 2: Beide Brüche erweitern</strong>
            <p>Ersten Bruch mit ${faktor1} erweitern:</p>
            <p>${bruch(a, b)} =${bruch(a, b, faktor1)} = ${bruch(neuerZ1, gemeinsamerNenner)}</p>

            <p>Zweiten Bruch mit ${faktor2} erweitern:</p>
            <p>${bruch(c, d)} = ${bruch(c, d, faktor2)} = ${bruch(neuerZ2, gemeinsamerNenner)}</p>
        `;
    }

    // 3. Zähler addieren oder subtrahieren
    let neuerZaehler;

    if (operator === "+") {
        neuerZaehler = neuerZ1 + neuerZ2;
    } else {
        neuerZaehler = neuerZ1 - neuerZ2;
    }

    step3.innerHTML = `
        <strong>Schritt 3: Zähler berechnen</strong>
        <p>Die Nenner sind jetzt gleich.</p>
        <p>
            ${bruch(neuerZ1, gemeinsamerNenner)}
            ${operator}
            ${bruch(neuerZ2, gemeinsamerNenner)}
            =
            ${bruch(neuerZaehler, gemeinsamerNenner)}
        </p>
       
    `;

    // 4. Kürzen
    // const teiler = ggT(neuerZaehler, gemeinsamerNenner);

    // const endZaehler = neuerZaehler / teiler;
    // const endNenner = gemeinsamerNenner / teiler;

    // if (teiler === 1) {
    //     step4.innerHTML = `
    //         <strong>Schritt 4: Kürzen</strong>
    //         <p>Der Bruch ist bereits vollständig gekürzt.</p>
    //     `;
    // } else {
    //     step4.innerHTML = `
    //         <strong>Schritt 4: Kürzen</strong>
    //         <p>Der größte gemeinsame Teiler ist ${teiler}.</p>
    //         <p>Wir teilen Zähler und Nenner durch ${teiler}.</p>
    //         <p>${bruch(neuerZaehler, gemeinsamerNenner)}
    //            = ${bruch(endZaehler, endNenner)}</p>
    //     `;
    // }

// 4. Kürzen durch Primfaktorzerlegung

const faktoren = faktorenKuerzen(
    neuerZaehler,
    gemeinsamerNenner
);

const obenHTML = faktorenHTML(
    faktoren.oben,
    faktoren.obenGestrichen
);

const untenHTML = faktorenHTML(
    faktoren.unten,
    faktoren.untenGestrichen
);

const teiler = ggT(neuerZaehler, gemeinsamerNenner);

const endZaehler = neuerZaehler / teiler;
const endNenner = gemeinsamerNenner / teiler;

const vorzeichen = neuerZaehler < 0 ? "−" : "";

step4.innerHTML = `
    <strong>Schritt 4: Kürzen</strong>

    <p>Wir zerlegen Zähler und Nenner
    in Primfaktoren.</p>

    <p>Zähler:
    ${Math.abs(neuerZaehler)} =
    ${faktoren.oben.join(" × ") || "1"}</p>

    <p>Nenner:
    ${gemeinsamerNenner} =
    ${faktoren.unten.join(" × ") || "1"}</p>

    <p>Gemeinsame Faktoren streichen:</p>

    <p>
        ${vorzeichen}
        ${bruch(obenHTML, untenHTML)}
        =
        ${bruch(endZaehler, endNenner)}
    </p>
`;

    // 5. Ergebnis anzeigen
    result.innerHTML = bruch(endZaehler, endNenner);
}

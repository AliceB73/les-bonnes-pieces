import { ajoutListenersAvis } from "./avis.js";
import { ajoutListenerEnvoyerAvis } from "./avis.js";

// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem("pieces");
if (pieces === null) {
    // Récupération des pièces depuis l'API
    const reponse = await fetch('http://localhost:8081/pieces/');
    pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
} else {
    pieces = JSON.parse(pieces);
}

ajoutListenerEnvoyerAvis();

// Génération de la page web
function genererPieces(pieces) {
    for (let i = 0; i < pieces.length; i++) {

        const article = pieces[i];

        const pieceElement = document.createElement("article");
        const imageElement = document.createElement("img");
        const nomElement = document.createElement("h2");
        const prixElement = document.createElement("p");
        const categorieElement = document.createElement("p");
        const descriptionElement = document.createElement("p");
        const stockElement = document.createElement("p");

        imageElement.src = article.image;
        nomElement.innerText = article.nom;
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        categorieElement.innerText = article.categorie;
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment";
        stockElement.innerText = article.disponibilite ? "En stock" : "Rupture de stock";

        const avisBouton = document.createElement("button");
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis";


        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);

        const sectionFiches = document.querySelector(".fiches");
        sectionFiches.appendChild(pieceElement);

        pieceElement.appendChild(avisBouton);
    }
    ajoutListenersAvis();
}

genererPieces(pieces);

// Fonctionnalité de tri par prix croissants
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener("click", function () {
    const piecesOrdonnes = Array.from(pieces);
    piecesOrdonnes.sort(function (a, b) {
        return a.prix - b.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnes);
});

// Fonctionnalité de filtre pour les pièces abordables
const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//Fonctionnalité de filtre pour les pièces sans description
const boutonNoDesc = document.querySelector(".btn-nodesc");

boutonNoDesc.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//Fonctionnalité de tri par prix décroissant
const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnes = Array.from(pieces);
    piecesOrdonnes.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnes);
});

//Fonctionnalité de prix maximum
const inputPrixMax = document.getElementById("prix-max");
inputPrixMax.addEventListener("input", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
});

//Ajout d'une liste de pièces à prix abordable
const noms = pieces.map(piece => piece.nom);

for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].prix > 35) {
        noms.splice(i, 1);
    }
}

const abordablesElement = document.createElement("ul");

for (let i = 0; i < noms.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = noms[i];
    abordablesElement.appendChild(nomElement)
}

document.querySelector(".abordables").appendChild(abordablesElement);

//Ajout d'une liste de pièces disponibles
const nomsDisponibles = pieces.map(piece => piece.nom);
const prixDisponibles = pieces.map(piece => piece.prix);

for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].disponibilite === false) {
        nomsDisponibles.splice(i, 1);
        prixDisponibles.splice(i, 1);
    }
}

const disponiblesElement = document.createElement("ul");

for (let i = 0; i < nomsDisponibles.length; i++) {
    const nomElement = document.createElement("li");
    nomElement.innerText = `${nomsDisponibles[i]} - ${prixDisponibles[i]} €`;
    disponiblesElement.appendChild(nomElement);
}

document.querySelector(".disponibles").appendChild(disponiblesElement);

//

const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener("click", function () {
    window.localStorage.removeItem("pieces");
});

let currentPokemon;
let allPokemons = [];
let limitedPokemon = 21;
let currentIndex = 0;

let backgroundColors = {

}

function init() {
    includeHTML();
    loadPokemon();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]')//Abfrage aller HTML-Elemente, Attribut: w3...//
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];//einzelnes Element des Array's//
        file = element.getAttribute("w3-include-html");//Zeile liefert wert aus, also =header.html//
        let resp = await fetch(file);//Laden von file, also vom header-Element//
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }

}

async function loadPokemon() {
    for (let i = 1; i < limitedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('loaded Pokemon', currentPokemon);

        allPokemons.push(currentPokemon);
        renderPokemonInfo(currentPokemon, i);

    }
}

function renderPokemonInfo(currentPokemon, i) {

    let PokeId = '#' + currentPokemon['id'];
    let name = currentPokemon['name'];
    let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let category = currentPokemon['types'][0]['type']['name'];

    generatePokeCard(PokeId, name, image, category);
}

function generatePokeCard(PokeId, name, image, category) {

    document.getElementById('pokecard-main').innerHTML +=
     /*html*/`
     <div class="single-pokeCard">

            <div class="name-category-img-container">
                <div class="name-and-category-container">
                    <h1 id="pokemonName">${name}</h1>
                    <div id="category">${category}</div>
                </div>
                <img id="pokemonImage" src="${image}">
                <h5>${PokeId}</h5>
            </div>
</div>
    
`;


}




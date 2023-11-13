
let currentPokemon;
let allPokemons = [];
let limitedPokemon = 31;
let currentIndex;




async function init() {
    includeHTML();
    await loadPokemon();

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
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let category = currentPokemon['types'][0]['type']['name'];

    checkSpecialCategory(PokeId, name, image, category)
}

function checkSpecialCategory(PokeId, name, image, category, i) {
    let x = currentPokemon['types'].length;
    if (x > 1) {
        let specialCategory = currentPokemon['types']['1']['type']['name'];
        generatePokeCard(PokeId, name, image, category, specialCategory);

    } else {
        generatePokeCard(PokeId, name, image, category);
    }

}

function generatePokeCard(PokeId, name, image, category, specialCategory) {
    let backgroundColor = setBackgroundcolor(category);
    let i = PokeId;

    let specialCategoryContainer = generateSpecialCategoryContainer(specialCategory);


    document.getElementById('pokecard-main').innerHTML +=
     /*html*/`
     <div onclick="showCardDetails('${PokeId}')" id='single-pokeCard${i}' class="single-pokeCard" style="background-color:${backgroundColor};">
            <div class=singlePokecard-id><h5>${PokeId}</h5></div>
            <div class="spc-name-category-img-container">
                <div class="spc-name-and-category-container">
                    <h1 id="pokemonName">${name}</h1>
                    <div id="category" class="category-container ${setCharactertraits(category)}">${category}</div>
                    ${specialCategoryContainer}
                </div>
                <img id="pokemonImage" src="${image}">
            </div>
`;
}

function generateSpecialCategoryContainer(specialCategory) {
    if (specialCategory) {
        return `<div id="special-category" class="category-container ${setCharactertraits(specialCategory)}">${specialCategory}</div>`;
    } else {
        return '';
    }
}


function setBackgroundcolor(category) {
    switch (category) {
        case 'normal':
            return '#9fa0a8';
        case 'fire':
            return '#fe8128';
        case 'water':
            return '#448dd7';
        case 'electric':
            return '#eed432';
        case 'grass':
            return '#5fb854';
        case 'ice':
            return '#5fcdc0';
        case 'fighting':
            return '#d04164';
        case 'poison':
            return '#a653cc';
        case 'ground':
            return '#dc7843';
        case 'flying':
            return '#7590c8';
        case 'psychic':
            return '#e95b5d';
        case 'bug':
            return '#8eb335';
        case 'rock':
            return '#baa781';
        case 'ghost':
            return '#5066ab';
        case 'dragon':
            return '#0c68bf';
        case 'dark':
            return '#57565a';
        case 'steel':
            return '#448097';
        case 'fairy':
            return '#ee6ec8';
        default:
            return '#767676';
    }
}

function setCharactertraits(type) {
    switch (type) {
        case 'normal':
            return 'normal-background-color';
        case 'fire':
            return 'fire-background-color';
        case 'water':
            return 'water-background-color';
        case 'electric':
            return 'electric-background-color';
        case 'grass':
            return 'grass-background-color';
        case 'ice':
            return 'ice-background-color';
        case 'fighting':
            return 'fighting-background-color';
        case 'poison':
            return 'poison-background-color';
        case 'ground':
            return 'ground-background-color';
        case 'flying':
            return 'flying-background-color';
        case 'psychic':
            return 'psychic-background-color';
        case 'bug':
            return 'bug-background-color';
        case 'rock':
            return 'rock-background-color';
        case 'ghost':
            return 'ghost-background-color';
        case 'dragon':
            return 'dragon-background-color';
        case 'dark':
            return 'dark-background-color';
        case 'steel':
            return 'steel-background-color';
        case 'fairy':
            return 'fairy-background-color';
    }
}


function showCardDetails(PokeId) {
    document.getElementById('popup-card').innerHTML += generateDetailCard(PokeId);
}


function generateDetailCard(PokeId) {
    return /*html*/`
    <div>TEST</div>
    <img alt="pokemon-pic">
    
    
    
    `;
}


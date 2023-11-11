
let currentPokemon;
let allPokemons = [];
let limitedPokemon = 31;
let currentIndex = 0;



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

    checkSpecialCategory(PokeId, name, image, category);
}

function checkSpecialCategory(PokeId, name, image, category) {
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
    let firstCharactertrait = setCharactertraits(category);
    let secondCharactertrait = setCharactertraits(specialCategory);

    let styleString = `
    background-color: ${backgroundColor};
    ${firstCharactertrait}
`;


    if (specialCategory) {
        styleString += `${secondCharactertrait}`;
    }


    document.getElementById('pokecard-main').innerHTML +=
     /*html*/`
     <div id='single-pokeCard' class="single-pokeCard" style="background-color:${backgroundColor};">

            <div class="name-category-img-container">
                <div class="name-and-category-container">
                    <h1 id="pokemonName">${name}</h1>
                    <div id="category" class="category-container" style="${firstCharactertrait};">${category}</div>
                    <div id="special-category" class="special-category-container" style="${secondCharactertrait};">${specialCategory ? specialCategory : ''}</div>
                </div>
                <img id="pokemonImage" src="${image}">
                <h5>${PokeId}</h5>
            </div>

`;
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
            return 'color: #8d8e96;';
        case 'fire':
            return 'color: #fd6f0a;';
        case 'water':
            return 'color: #3d7ebf;';
        case 'electric':
            return 'color: #ebce17;';
        case 'grass':
            return 'color: #006400;';
        case 'ice':
            return 'color: #55b0a9;';
        case 'fighting':
            return 'color: #bd3b57;';
        case 'poison':
            return 'color: #9750bf;';
        case 'ground':
            return 'color: #c56e3f;';
        case 'flying':
            return 'color: #6987b2;';
        case 'psychic':
            return 'color: #d85456;';
        case 'bug':
            return 'color: #7fa12f;';
        case 'rock':
            return 'color: #a49276;';
        case 'ghost':
            return 'color: #455196;';
        case 'dragon':
            return 'color: #0b60aa;';
        case 'dark':
            return 'color: #504f54;';
        case 'steel':
            return 'color: #3c738c;';
        case 'fairy':
            return 'color: #d85ebe;';
        default:
            return 'color: #6b6b6b;';
    }
}


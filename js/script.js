
let currentPokemon;
let allPokemons = [];
let limitedPokemon = 31;



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
        renderPokemonInfo();

    }
}

function renderPokemonInfo() {

    let PokeId = '#' + currentPokemon['id'];
    let name = currentPokemon['name'];
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let category = currentPokemon['types'][0]['type']['name'];

    checkSpecialCategory(PokeId, name, image, category)
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
    let j = currentPokemon['id'];
    let i = PokeId;

    let specialCategoryContainer = generateSpecialCategoryContainer(specialCategory);

    document.getElementById('pokecard-main').innerHTML +=
     /*html*/`
     <div onclick="openCardDetails(${j})" id='single-pokeCard${j}' class="single-pokeCard" style="background-color:${backgroundColor};">
            <div class=singlePokecard-id><h5>${i}</h5></div>
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


function openCardDetails(j) {
    document.getElementById('popup-card').classList.remove("d-none");
    document.getElementById('popup-card').innerHTML += generateDetailCard(j);

}


function generateDetailCard(j) {
    let pokemon = allPokemons[j - 1];
    let i = '#' + pokemon['id'];

    let DetailName = capitalizeFirstLetter(pokemon['name']);
    let DetailfirstCategory = pokemon['types'][0]['type']['name'];
    let DetailImage = pokemon['sprites']['other']['official-artwork']['front_default'];
    let DetailsecondCategory = checkDetailSecondCategory(pokemon);



    return /*html*/`
<div id="Detail-Main-Container${j}" class="Detail-Main-Container">
        <!--  Top of Pokemon Card  -->
  <div class="card-top">
     <div onclick="closeDetailCard()" class="close-container">
       <img class="icon-class" src=./img/remove-icon.svg>
     </div>
       <div id="Detail-Pokecard-ID" class="Detail-Pokecard-ID">${i}</div>
        <div class="Detail-Poke-Categories">
            <h2 id='Detail-Pokemon-Name'>${DetailName}</h2>
            <img src="${DetailImage}">
            <h2>${DetailfirstCategory}</h2>
            ${DetailsecondCategory ? `<h2>${DetailsecondCategory}</h2>` : ''}
        </div>
  </div>
        <!--  Bottom of Pokemon Card  -->
        <div class="card-bottom">
            <div class="back-forward-container">
                <img class="icon-class" src=./img/arrow-long-left-icon.svg>
                <img class="icon-class" src=./img/arrow-long-right-icon.svg>
            </div>



        </div>


</div>  
    
    `;
}

function checkDetailSecondCategory(pokemon) {
    if (pokemon['types'].length > 1) {
        return pokemon['types'][1]['type']['name'];
    } else {
        return null;
    }
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


function closeDetailCard() {
    document.getElementById('popup-card').classList.add("d-none");
}
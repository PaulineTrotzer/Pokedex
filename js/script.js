
let currentPokemon;
let allPokemons = [];
let limitedPokemon = 21;
let desc_array = []; /*leeres Array für Pokemon-Description*/
let currentPokemonIndex = 0;


function checkShowBackArrow(index) {/*gibt true zurück, wenn der Index ungleich 1 ist*/
    return index !== 1;
}

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

        await fetchFlavorText(i);/* ruft die Beschreibung für das aktuelle Pokemon ab - anderes 'Server-Array, i gibt jeweiliges Pokemon weiter */

        allPokemons.push(currentPokemon);
        renderPokemonInfo();

    }
}

/* Funktion zum Abrufen der Beschreibung */
async function fetchFlavorText(pokemonId) {
    let descUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let descResponse = await fetch(descUrl);
    let json_desc = await descResponse.json();
    desc_array.push(json_desc);
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
            <div class="singlePokecard-id"><h5>${i}</h5></div>
            <div class="spc-name-category-images-container">
                <div class="spc-name-and-category-container">
                    <h1 id='pokemonName'>${name}</h1>
                    <div id='category' class="category-container ${setCharactertraits(category)}">${category}</div>
                    ${specialCategoryContainer}
                </div>
                <div id="pokemon-image-container" class="usez-index">
                <img id='pokemonImage' src="${image}">
                </div>
                <img class="black-pokeball" src=./img/pokeball.png>
            </div>
           
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
    currentPokemonIndex = j;/* nimmt Index des aktuellen Pokemons an*/
    document.getElementById('popup-card').classList.remove("d-none");
    document.getElementById('popup-card').innerHTML += generateDetailCard(j);

    const arrowcontainer = document.getElementById('arrow-container');
    arrowcontainer.style.justifyContent = checkShowBackArrow(j) ? "space-between" : "flex-end";/*if true= space-between, sonst false = flex-end;*/
}



function generateDetailCard(j) {
    let pokemon = allPokemons[j - 1]; /*die ID des Pokemons ist 1 Wert grö0er als die Stelle des Pokemons im Array*/
    let i = '#' + pokemon['id'];
    let DetailfirstCategory = pokemon['types'][0]['type']['name'];
    let backgroundColor = setBackgroundcolor(DetailfirstCategory);

    let DetailDescription = getFlavorText(pokemon["id"]);/*ruft Beschreibung ab*/


    let DetailfirstAbility = pokemon['abilities'][0]['ability']['name'];
    let DetailsecondAbility = checkDetailSecondAbility(pokemon)

    let DetailName = capitalizeFirstLetter(pokemon['name']);
    let DetailImage = pokemon['sprites']['other']['official-artwork']['front_default'];

    let showBackArrow = checkShowBackArrow(j);



    return /*html*/`
<div id='Detail-Main-Container${j}' class="Detail-Main-Container" style="background-color: ${backgroundColor};">
        <!--  Top of Pokemon Card  -->
  <div class="card-top">
     <div onclick="closeDetailCard()" class="close-container">
       <img class="icon-class" src=./img/remove-icon.svg>
     </div>
       <div id='Detail-Pokecard-ID' class="Detail-Pokecard-ID">${i}</div>
        <div class="Detail-PokeName-Categories">
        <h2 class="abilities ${setCharactertraits(DetailfirstCategory)}">${DetailfirstAbility}</h2>
            ${DetailsecondAbility ? `<h2 class="abilities ${setCharactertraits(DetailfirstCategory)}">${DetailsecondAbility}</h2>` : ''}
            <h2 id='Detail-Pokemon-Name'>${DetailName}</h2>
        </div>
        <div class="Detail-Image-Container">
                 <img class="Detail-Pokemon-Image" src="${DetailImage}">
              </div>
              <img class="Detail-Black-Pokeball" src=./img/pokeball.png>
  </div>
        <!--  Bottom of Pokemon Card  -->
    <div class="card-bottom">
            <div id='arrow-container' class="back-forward-container">
            ${showBackArrow ? `<img onclick='clickBackward()'class="icon-class" src=./img/arrow-long-left-icon.svg>` : ''}
                <img onclick='clickForward()' class="icon-class" src=./img/arrow-long-right-icon.svg>
            </div>
            <!--  Information about Pokemon -->
        <div class="information-container">
              <div class="navigation-container">
                <a>About</a>
                <a>Stats</a>
                <a>Evolution</a>
              </div>
            <!--  Information-Text  -->
             <div id='information-text-container'>
                        <div class="about">
                         <div class="description">
                        ${DetailDescription}
                         </div>
                         <div class="height-section"></div>
                         <div class="weight-section"></div>
                         <div class="abilities-section"></div>

                        </div>
             </div>
        </div>
    </div>
</div>  
    
    `;
}

function checkDetailSecondAbility(pokemon) {
    if (pokemon['abilities'].length > 1) {
        return pokemon['abilities'][1]['ability']['name'];
    } else {
        return null;
    }
}

function checkShowBackArrow(index){
    return index >1;
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function encodeFlavorText(flavorText) {
    flavorText = flavorText.replace('POKéMON', 'Pokémon');
    return flavorText;
}


function getFlavorText(pokemonId) {/* die Funktion nimmt den Paramter -pokemonId- entgegen, um auf das entsprechende Pokemon-Objekt zuzugreifen*/
    const pokemonDesc = desc_array[pokemonId - 1];/*die Variable greift auf das Pokemon-Objekt im desc_array zu*/
    if (pokemonDesc && pokemonDesc["flavor_text_entries"]) {
        const filteredEntries = pokemonDesc["flavor_text_entries"].filter(entry => entry.language.name === "en");
        const flavorText = filteredEntries.length > 0 ? filteredEntries[0].flavor_text : "";
        const encodedFlavorText = encodeFlavorText(flavorText);
        return encodedFlavorText;
    }
    return "";
}


function closeDetailCard() {
    document.getElementById('popup-card').classList.add("d-none");
}

function clickForward() {
    currentPokemonIndex++;
    if (currentPokemonIndex >= allPokemons.length) {
        currentPokemonIndex = 0;
    }
    updateDetailCard()
}

function updateDetailCard() {
    if (!document.getElementById('popup-card').classList.contains("d-none")) {
        document.getElementById('popup-card').innerHTML = '';
        document.getElementById('popup-card').innerHTML = generateDetailCard(currentPokemonIndex);
    }
}

function clickBackward() {
    currentPokemonIndex--;
    if (currentPokemonIndex < 0) {
        currentPokemonIndex = allPokemons.length - 1;
    }
    updateDetailCard();
}
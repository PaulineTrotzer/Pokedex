let currentPokemon;
let allPokemons = [];
let limitedPokemon = 51;
let offsetNumber = 0;
let desc_array = []; /*leeres Array für Pokemon-Description*/
let currentPokemonIndex = 0;
let filteredPokemons = [];
let loading = false;
let loadedPokemonsCount = 0;


function checkShowBackArrow(index) {/*gibt true zurück, wenn der Index ungleich 1 ist*/
    return index !== 1;
}

async function init() {
    includeHTML();
    await loadPokemon();

    document.getElementById('formControlDefault').addEventListener('input', filterPokemons);
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


async function loadPokemon(offset) {
    if (loading) {
        return;
    }

    loading = true;

    const limit = 20;
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        for (const pokemon of data.results) {
            const pokemonUrl = pokemon.url;
            const pokemonResponse = await fetch(pokemonUrl);
            const currentPokemon = await pokemonResponse.json();

            allPokemons.push(currentPokemon);
            renderPokemonInfo(currentPokemon);
            loadedPokemonsCount++;

            if (loadedPokemonsCount == 20) {
                loading = false;
                loadedPokemonsCount = 0;
            }
        }
    } finally {
        loading = false;
    }
}

window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        offsetNumber += 20;
        loadMorePokemons(offsetNumber);
    }
});

async function loadMorePokemons(offset) {
    await loadPokemon(offset);
}

/* Funktion zum Abrufen der Beschreibung */
async function fetchFlavorText(pokemonId) {
    let descUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let descResponse = await fetch(descUrl);
    let json_desc = await descResponse.json();
    desc_array.push(json_desc);
}


function renderPokemonInfo(filteredpokemon) {
    if (filteredpokemon) {
        currentPokemon = filteredpokemon;
    }

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
                <img class="black-pokeball" src=./img/pokeball.png> <!--https://www.flaticon.com/de/kostenloses-icon/pokeball_692557-->
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

    let height = pokemon['height'];
    let weight = pokemon['weight'];

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
              <img class="Detail-Black-Pokeball" src=./img/detail-pokeball.png>
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
                <a onclick='renderAbout(${j})'class="link">About</a>
                <a onclick='renderStats(${j})' class="link">Stats</a>
                <a onclick='showEvolutions(${j})' class="link">Evolution</a>
              </div>
            <!--  Information-Text  -->
             <div id='information-text-container'>
                    <div class="about">
                          <div class="description">
                          ${DetailDescription}
                           </div>
                        <div class="without-description-container">
                             <div class="height-section d-flex jc-sb"><b>Height</b>
                             <h5>${(height / 10).toFixed(1)} m</h5><!-- Darstellung in Metern, auf eine Dezimalstelle gerundet -->
                             </div>
                             <div class="weight-section d-flex jc-sb" ><b>Weight</b>
                             <h5>${(weight / 10).toFixed(1)} kg</h5><!-- Darstellung in kg, auf eine Dezimalstelle gerundet -->
                             </div>
                             <div class="abilities-section d-flex jc-sb"><b>Abilities</b>
                             <h5>${DetailfirstAbility}, ${DetailsecondAbility}</h5>
                             </div>
                        </div>
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

function checkShowBackArrow(index) {
    return index > 1;
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

function renderStats(j) {
    let textContainer = document.getElementById('information-text-container');
    textContainer.innerHTML = '';
    let pokemon = allPokemons[j - 1];

    textContainer.innerHTML += generateStats(pokemon);
}

function generateStats(pokemon) {
    let category = pokemon['types'][0]['type']['name'];
    return /*html*/`
        <div class="stats">
            <span class="stat-name">Hp</span>
            <span class="stat-value">${pokemon.stats[0].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${pokemon.stats[0].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Attack</span>
            <span class="stat-value">${pokemon.stats[1].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${pokemon.stats[1].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
                </div>
            </div>
        </div>
        <div class="stats">    
        <span class="stat-name">Defense</span>
            <span class="stat-value">${pokemon.stats[2].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${pokemon.stats[2].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
                </div>
            </div>
        </div>
        <div class="stats"> 
        <span class="stat-name">Special-Attack</span>
            <span class="stat-value">${pokemon.stats[3].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${pokemon.stats[3].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Special-Defense</span>
            <span class="stat-value">${pokemon.stats[4].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${pokemon.stats[4].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Speed</span>
            <span class="stat-value">${pokemon.stats[5].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${pokemon.stats[5].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
    `;
}

function calculatePercentage(value) {
    const maxValue = 100;
    return Math.floor((value / maxValue) * 100);
}

function renderAbout() {
    let textContainer = document.getElementById('information-text-container');
    textContainer.innerHTML = '';
    updateDetailCard();
}


function filterPokemons() {
    let search = document.getElementById('formControlDefault').value.toLowerCase();
    filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().startsWith(search));

    renderFilteredPokemons(filteredPokemons);
}

function renderFilteredPokemons(filteredPokemons) {
    let mainView = document.getElementById('pokecard-main');
    mainView.innerHTML = '';

    for (let i = 0; i < filteredPokemons.length; i++) {
        let filteredpokemon = filteredPokemons[i];
        renderPokemonInfo(filteredpokemon);
    }
}

function closeDetailCard() {
    document.getElementById('popup-card').classList.add("d-none");
}
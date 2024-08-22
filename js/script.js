let currentPokemon;
let allPokemons = [];
let limitedPokemon = 51;
let desc_array = []; /*leeres Array für Pokemon-Description*/
let currentPokemonIndex = 0;
let filteredPokemons = [];
let offsetNumber = 0;
let loadingMorePokemons = false;
let loadedPokemonsCount = 0;
const batchSize = 20;
let allListedPokemons = [];
let json_desc = [];


async function init() {
    includeHTML();
    await loadPokemon();
    await fetchAllPokemonList();

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
    const limit = 20;//constant limit of 20
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;//vgl fetchAllPokemonList

    const response = await fetch(url);
    const data = await response.json();//name und url für 20 Pokemons

    for (const pokemon of data.results) {//object with property .results// //const pokemon ist Schleifen-Variable und erhaält die properties von data.results//
        const pokemonUrl = pokemon.url;//sheet für das einzelne Pokemon
        const pokemonResponse = await fetch(pokemonUrl);
        const currentPokemon = await pokemonResponse.json();// Festsetzung von currentPokemon
        console.log('hier 1 P', currentPokemon);

        await fetchFlavorText(currentPokemon.id);
        await fetchEvolutionChain(currentPokemon.id);

        allPokemons.push(currentPokemon);
        renderPokemonInfo(currentPokemon.id);
        loadedPokemonsCount++;
    }
}

async function fetchAllPokemonList() {
    let listURL = 'https://pokeapi.co/api/v2/pokemon/?limit=811';
    let listResp = await fetch(listURL);
    let list_json = await listResp.json();

    // Extract results from each page and concatenate into a single array
    allListedPokemons = list_json.results;

    console.log('hier die Liste aller Pokemons', allListedPokemons);
}


//durchgehen//
window.addEventListener('scroll', async function () {
    if (loadingMorePokemons) {
        return;
    }

    const lastPokemonCard = document.querySelector('.single-pokeCard:last-child');
    const lastPokemonCardOffset = lastPokemonCard.offsetTop + lastPokemonCard.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;

    if (pageOffset > lastPokemonCardOffset - 200) { // Trigger loading when 200 pixels from the bottom of the last card
        loadingMorePokemons = true;
        offsetNumber += batchSize;

        try {
            await loadMorePokemons(offsetNumber, batchSize);
        } finally {
            loadingMorePokemons = false;
        }
    }
});


async function loadMorePokemons(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();

    for (const pokemon of data.results) {
        const pokemonUrl = pokemon.url;
        const pokemonResponse = await fetch(pokemonUrl);
        const currentPokemon = await pokemonResponse.json();

        await fetchFlavorText(currentPokemon.id);
        await fetchEvolutionChain(currentPokemon.id);

        allPokemons.push(currentPokemon);
        renderPokemonInfo(currentPokemon.id);
    }
}


/* Funktion zum Abrufen der Beschreibung */
async function fetchFlavorText(pokemonId) {
    let descUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let descResponse = await fetch(descUrl);
    let json_desc = await descResponse.json();
    desc_array[pokemonId - 1] = json_desc;  // Speichere die Beschreibung im Array
}


async function renderPokemonInfo(pokemonId) {
    let individualLink = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;
    let ind_resp = await fetch(individualLink);
    let currentPokemon = await ind_resp.json();

    let name = currentPokemon['name']; // Beachten Sie den Index 0 für den Namen
    let id = currentPokemon['id'];
    let profile_image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`
    let category = currentPokemon['types'][0]['type']['name']
    checkSpecialCategory(currentPokemon, id, name, profile_image, category)
}


function checkSpecialCategory(currentPokemon, id, name, profile_image, category) {
    let x = currentPokemon['types'].length;
    if (x > 1) {
        let specialCategory = currentPokemon['types'][1]['type']['name'];
        generatePokeCard(id, name, profile_image, category, specialCategory);
    } else {
        generatePokeCard(id, name, profile_image, category);
    }
}


function generatePokeCard(id, name, profile_image, category, specialCategory) {
    let backgroundColor = setBackgroundcolor(category);
    let j = id
    let i = '#' + id;
    let specialCategoryContainer = generateSpecialCategoryContainer(specialCategory);

    let existingCard = document.getElementById(`single-pokeCard${j}`);

    if (!existingCard) {
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
                        <img id='pokemonImage' src="${profile_image}">
                    </div>
                    <img class="black-pokeball" src=./img/pokeball.png>
                </div>
            </div>
        `;
    }
}

function generateSpecialCategoryContainer(specialCategory) {
    if (specialCategory) {
        return `<div id="special-category" class="category-container ${setCharactertraits(specialCategory)}">${specialCategory}</div>`;
    } else {
        return '';
    }
}


async function openCardDetails(j) {
    if (j > loadedPokemonsCount) {
        await loadSinglePokemon(j)
        document.getElementById('popup-card').classList.remove("d-none");
        updateDetailCard(j);

    } else {
        document.getElementById('popup-card').classList.remove("d-none");
        await generateDetailCard(j);
        await checkIfBackArrow(j);
    }
}

async function checkIfBackArrow(pokemonId) {
    let individualArrowContainer = document.getElementById(`backward-arrow${pokemonId}`);

    if (pokemonId > 1) {
        individualArrowContainer.src = './img/arrow-long-left-icon.svg';
        individualArrowContainer.classList.add('icon-class');
        individualArrowContainer.addEventListener('click', () => clickBackward(pokemonId));
        // RightArrowContainer.style = "icon-class"    onclick='clickBackward(${pokemonId})'//
    }
        if (pokemonId < 1) {
            individualArrowContainer.src = '';
        }
    }
   

    async function generateDetailCard(pokemonId) {
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        const response = await fetch(pokemonUrl);
        const currentPokemon = await response.json();

        let i = '#' + currentPokemon['id'];
        let DetailfirstCategory = currentPokemon['types'][0]['type']['name'];
        let backgroundColor = setBackgroundcolor(DetailfirstCategory);

        let DetailDescription = await getFlavorText(pokemonId);/*ruft Beschreibung ab*/

        let DetailfirstAbility = currentPokemon['abilities'][0]['ability']['name'];
        let DetailsecondAbility = checkDetailSecondAbility(currentPokemon)
        let DetailName = capitalizeFirstLetter(currentPokemon['name']);
        let DetailImage = currentPokemon['sprites']['other']['official-artwork']['front_default'];

        let height = currentPokemon['height'];
        let weight = currentPokemon['weight'];

        document.getElementById('popup-card').innerHTML +=  /*html*/`
<div id='Detail-Main-Container${pokemonId}' class="Detail-Main-Container" style="background-color: ${backgroundColor};">
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
         
  </div>
        <!--  Bottom of Pokemon Card  -->
    <div class="card-bottom">
            <div id='arrow-container' class="back-forward-container">
            <img src='' id="backward-arrow${pokemonId}">
            <img onclick='clickForward(${pokemonId})' class="icon-class" src=./img/arrow-long-right-icon.svg>
            </div>
            <!--  Information about Pokemon -->
        <div class="information-container">
              <div class="navigation-container">
                <a onclick='renderAbout(${pokemonId})'class="link">About</a>
                <a onclick='renderStats(${pokemonId})' class="link">Stats</a>
                <a onclick='showEvolutions(${pokemonId})' class="link">Evolution</a>
              </div>
            <!--  Information-Text  -->
             <div id='information-text-container'>
                    <div class="about">
                          <div class="description">
                          ${DetailDescription}
                           </div>
                        <div class="without-description-container">
                             <div class="height-section d-flex horizontal-position"><b>Height</b>
                             <h5>${(height / 10).toFixed(1)} m</h5><!-- Darstellung in Metern, auf eine Dezimalstelle gerundet -->
                             </div>
                             <div class="weight-section d-flex horizontal-position" ><b>Weight</b>
                             <h5>${(weight / 10).toFixed(1)} kg</h5><!-- Darstellung in kg, auf eine Dezimalstelle gerundet -->
                             </div>
                             <div class="abilities-section d-flex horizontal-position"><b>Abilities</b>
                             <h5>${DetailfirstAbility}, ${DetailsecondAbility}</h5>
                             </div>
                        </div>
                    </div>
             </div>
        </div>
    </div>
</div>  
    `;
         await checkIfBackArrow(pokemonId);

    }


    function showEvolutions(j) {
        filterEvolutions(j);
    }

    function checkDetailSecondAbility(pokemon) {
        if (pokemon['abilities'].length > 1) {
            return pokemon['abilities'][1]['ability']['name'];
        } else {
            return null;
        }
    }


    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function encodeFlavorText(flavorText) {
        flavorText = flavorText.replace('POKéMON', 'Pokémon');
        return flavorText;
    }

    async function getFlavorText(pokemonId) {
        if (pokemonId > loadedPokemonsCount) {
            await fetchFlavorText(pokemonId);
        }
        const pokemonDesc = desc_array[pokemonId - 1];
        if (pokemonDesc && pokemonDesc["flavor_text_entries"]) {
            const filteredEntries = pokemonDesc["flavor_text_entries"].filter(entry => entry.language.name === "en");
            const flavorText = filteredEntries.length > 0 ? filteredEntries[0].flavor_text : "";
            const encodedFlavorText = encodeFlavorText(flavorText);
            return encodedFlavorText;
        }
        return "";
    }

    async function clickForward(pokemonId) {
        currentPokemonIndex = pokemonId;
        currentPokemonIndex++;
        await updateDetailCard(currentPokemonIndex);
    }

    async function updateDetailCard(index) {
        if (!document.getElementById('popup-card').classList.contains("d-none")) {
            document.getElementById('popup-card').innerHTML = '';
            document.getElementById('popup-card').innerHTML =  generateDetailCard(index);
        }
    }

    async function clickBackward(pokemonId) {
        currentPokemonIndex = pokemonId;
        currentPokemonIndex--;
        if (currentPokemonIndex < 0) {
            currentPokemonIndex = allPokemons.length - 1;
        }
        await updateDetailCard(currentPokemonIndex);
        await checkIfBackArrow(currentPokemonIndex);
    }


    async function renderStats(pokemonId) {
        clearContainer();
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        const response = await fetch(pokemonUrl);
        const currentPokemon = await response.json();

        if (pokemonId < loadedPokemonsCount) {
            allPokemons[pokemonId - 1] = currentPokemon;
        }
        await generateStats(currentPokemon)
    }

    function clearContainer() {
        let textContainer = document.getElementById('information-text-container');
        textContainer.innerHTML = '';
    }

    async function generateStats(currentPokemon) {
        let category = currentPokemon['types'][0]['type']['name'];

        document.getElementById('information-text-container').innerHTML +=
     /*html*/`
        <div class="stats">
            <span class="stat-name">Hp</span>
            <span class="stat-value">${currentPokemon['stats'][0].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${currentPokemon.stats[0].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Attack</span>
            <span class="stat-value">${currentPokemon.stats[1].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${currentPokemon.stats[1].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
                </div>
            </div>
        </div>
        <div class="stats">    
        <span class="stat-name">Defense</span>
            <span class="stat-value">${currentPokemon.stats[2].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar" style="width: ${currentPokemon.stats[2].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
                </div>
            </div>
        </div>
        <div class="stats"> 
        <span class="stat-name">Special-Attack</span>
            <span class="stat-value">${currentPokemon.stats[3].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${currentPokemon.stats[3].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Special-Defense</span>
            <span class="stat-value">${currentPokemon.stats[4].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${currentPokemon.stats[4].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
        <div class="stats">
        <span class="stat-name">Speed</span>
            <span class="stat-value">${currentPokemon.stats[5].base_stat}</span>
            <div class="progress-hide progress bar-height-width" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
               <div class="progress-bar" style="width: ${currentPokemon.stats[5].base_stat}%; height: 20px; background-color:${setBackgroundcolor(category)};"></div>
               </div>
            </div>
        </div>
    `;
    }

    function calculatePercentage(value) {
        const maxValue = 100;
        return Math.floor((value / maxValue) * 100);
    }

    function renderAbout(pokemonId) {
        clearContainer();
        updateDetailCard(pokemonId);
    }


    function filterPokemons() {
        let search = document.getElementById('formControlDefault').value.toLowerCase();

        // Filter allListedPokemons basierend auf dem Suchwert
        filteredPokemons = allListedPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().startsWith(search)
        );
        renderFilteredPokemons(filteredPokemons);
    }


    function renderFilteredPokemons(filteredPokemons) {
        let mainView = document.getElementById('pokecard-main');
        mainView.innerHTML = '';

        for (let i = 0; i < filteredPokemons.length; i++) {
            let filteredpokemon = filteredPokemons[i];
            getFilteredData(filteredpokemon);
        }
    }

    function getFilteredData(filteredPokemon) {
        let url = filteredPokemon['url'];
        let id = extractPokemonId(url);
        renderPokemonInfo(id);
    }

    function extractPokemonId(url) {
        const match = url.match(/\/(\d+)\/$/);
        // Falls eine Übereinstimmung gefunden wurde, gibt die extrahierte ID zurück, ansonsten null
        return match ? parseInt(match[1]) : null;
    }


    function closeDetailCard() {
        clearPokemonCard();
        document.getElementById('popup-card').classList.add("d-none");
    }

    function clearPokemonCard() {
        const detailMainContainerId = `Detail-Main-Container${currentPokemonIndex}`;
        const detailMainContainer = document.getElementById(detailMainContainerId);

        if (detailMainContainer) {
            detailMainContainer.innerHTML = '';
        }
    }

    function resetPokemon(){
        document.getElementById('formControlDefault').value='';
        document.getElementById('pokecard-main').innerHTML ='';
   
        offsetNumber = 0;
        loadPokemon(offsetNumber);
    }
let evolutionChains = [];


async function fetchEvolutionChain(i) {
    let speciesURL = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
    let specResponse = await fetch(speciesURL);
    let json_spec = await specResponse.json();
    console.log('id suchen', json_spec)

    let evolutionchainURL = json_spec['evolution_chain']['url'];

    let evResponse = await fetch(evolutionchainURL);
    let json_ev = await evResponse.json();

    evolutionChains[i - 1] = json_ev;
    console.log('loaded evolution-chain', json_ev);
}

async function filterEvolutions(j) {
    let evolutionChain = evolutionChains[j - 1];

    let pokemon1 = evolutionChain['chain']['species']['name'];
    let speciesURL_pokemon1 = evolutionChain['chain']['species']['url'];//gesamteURL
    let pokemon1ID = extractPokemonID(speciesURL_pokemon1);
    let image_pokemon1 = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon1ID}.png`

    await proofFirstEvolutionexist(pokemon1, image_pokemon1, pokemon1ID, evolutionChain,)// pokemon2, image_pokemon2, pokemon3, image_pokemon3);//
}

function extractPokemonID(speciesURL) {// URL wird angenommen
    const idMatch = speciesURL.match(/\/(\d+)\/$/);//match-methode, um nach einem muster zu suchen - wert muss am ende stehen//d+ steht für Dezimalziffer!
    return idMatch ? idMatch[1] : null;//wenn ein muster gefunden wird - ein Array zurückgeben  - andernfalls = null//
}


async function proofFirstEvolutionexist(pokemon1, image_pokemon1, pokemon1ID, evolutionChain) {
    let firstEvolution = null;
    let firstEvolutionImage = null;
    if (evolutionChain['chain']['evolves_to'].length > 0) {
        firstEvolution = evolutionChain['chain']['evolves_to'][0]['species']['name'];
        let speciesURL_firstEvolution = evolutionChain['chain']['evolves_to'][0]['species']['url'];
        let firstEvolutionID = extractPokemonID(speciesURL_firstEvolution);
        firstEvolutionImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstEvolutionID}.png`;
        await proofSecondEvolutionExist(evolutionChain, pokemon1, image_pokemon1, pokemon1ID, firstEvolution, firstEvolutionImage, firstEvolutionID);
    } else {
        generateEvolutions(pokemon1, image_pokemon1, pokemon1ID);
    }
}

async function proofSecondEvolutionExist(evolutionChain, pokemon1, image_pokemon1, pokemon1ID, firstEvolution, firstEvolutionImage, firstEvolutionID) {
    let secondEvolution = null;
    let secondEvolutionImage = null;
    if (evolutionChain['chain']['evolves_to'][0]['evolves_to'].length > 0) {
        secondEvolution = evolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
        let speciesURL_secondEvolution = evolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['url'];
        let secondEvolutionID = extractPokemonID(speciesURL_secondEvolution);
        secondEvolutionImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondEvolutionID}.png`;
        generateEvolutions(pokemon1, image_pokemon1, pokemon1ID, firstEvolution, firstEvolutionImage, firstEvolutionID, secondEvolution, secondEvolutionImage, secondEvolutionID);
    } else {
        generateEvolutions(pokemon1, image_pokemon1, pokemon1ID, firstEvolution, firstEvolutionImage, firstEvolutionID);
    }
}

function generateEvolutions(pokemon1, image_pokemon1, pokemon1ID, firstEvolution, firstEvolutionImage, firstEvolutionID, secondEvolution, secondEvolutionImage, secondEvolutionID) {
    let evolutionContainer = document.getElementById('information-text-container');
    evolutionContainer.innerHTML = /*html*/`
        <div class="listed-evolutions-container">
            <div class="evolution-container">
                <div class="evolution-name">${pokemon1}</div>
                <div class="evolution-image"><img onclick="showPokemonDetails(${pokemon1ID})" src="${image_pokemon1}" alt="${pokemon1}" ></div>
            </div>
            ${firstEvolution ? `<div class="evolution-container">
                <div class="evolution-name">${firstEvolution}</div>
                <div class="evolution-image"><img onclick="showPokemonDetails(${firstEvolutionID})" src="${firstEvolutionImage}" alt="${firstEvolution}"></div>
            </div>` : ''}
            ${secondEvolution ? `<div class="evolution-container">
                <div class="evolution-name">${secondEvolution}</div>
                <div class="evolution-image"><img onclick="showPokemonDetails(${secondEvolutionID})" src="${secondEvolutionImage}" alt="${secondEvolution}"></div>
            </div>` : ''}
        </div>
    `;
    console.log("Click event registered for secondEvolution:", secondEvolution);
}



async function showPokemonDetails(currentPokemonIndex) {
    if (currentPokemonIndex <= allPokemons.length) {
        openCardDetails(currentPokemonIndex);
        await updateDetailCard(currentPokemonIndex);
    } else {
        // Das Pokemon ist nicht geladen, lade es nach und zeige dann die Details an // Da der Index bei 0 beginnt
        await loadSinglePokemon(currentPokemonIndex);
        openCardDetails(currentPokemonIndex)
        await updateDetailCard(currentPokemonIndex);
    };
}


async function loadSinglePokemon(pokemonId) {
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    const response = await fetch(pokemonUrl);
    const currentPokemon = await response.json();

    await fetchFlavorText(pokemonId);
    await fetchEvolutionChain(pokemonId);

    allPokemons[pokemonId - 1] = currentPokemon;

    if (document.getElementById('formControlDefault').value.toLowerCase().length === 0 ||
        currentPokemon.name.toLowerCase().startsWith(document.getElementById('formControlDefault').value.toLowerCase())) {
        renderPokemonInfo(currentPokemon);
    }
}




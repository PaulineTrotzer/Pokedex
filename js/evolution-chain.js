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

    await proofFirstEvolutionexist(pokemon1, image_pokemon1, evolutionChain,)// pokemon2, image_pokemon2, pokemon3, image_pokemon3);//
}

function extractPokemonID(speciesURL) {// URL wird angenommen
    const idMatch = speciesURL.match(/\/(\d+)\/$/);//match-methode, um nach einem muster zu suchen - wert muss am ende stehen//d+ steht für Dezimalziffer!
    return idMatch ? idMatch[1] : null;//wenn ein muster gefunden wird - ein Array zurückgeben  - andernfalls = null//
}


async function proofFirstEvolutionexist(pokemon1, image_pokemon1, evolutionChain) {
    let firstEvolution = null;
    let firstEvolutionImage = null;
    if (evolutionChain['chain']['evolves_to'].length > 0) {
        firstEvolution = evolutionChain['chain']['evolves_to'][0]['species']['name'];
        let speciesURL_firstEvolution = evolutionChain['chain']['evolves_to'][0]['species']['url'];
        let firstEvolutionID = extractPokemonID(speciesURL_firstEvolution);
        firstEvolutionImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${firstEvolutionID}.png`;
        await proofSecondEvolutionExist(evolutionChain, pokemon1, image_pokemon1, firstEvolution, firstEvolutionImage);
    } else {
        generateEvolutions(pokemon1, image_pokemon1);
    }

}

async function proofSecondEvolutionExist(evolutionChain, pokemon1, image_pokemon1, firstEvolution, firstEvolutionImage) {
    let secondEvolution = null;
    let secondEvolutionImage = null;
    if (evolutionChain['chain']['evolves_to'][0]['evolves_to'].length > 0) {
        secondEvolution = evolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];
        let speciesURL_secondEvolution = evolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['url'];
        let secondEvolutionID = extractPokemonID(speciesURL_secondEvolution);
        secondEvolutionImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${secondEvolutionID}.png`;
        generateEvolutions(pokemon1, image_pokemon1, firstEvolution, firstEvolutionImage, secondEvolution, secondEvolutionImage);
    } else {
        generateEvolutions(pokemon1, image_pokemon1, firstEvolution, firstEvolutionImage,);
    }


}

function generateEvolutions(pokemon1, image_pokemon1, firstEvolution, firstEvolutionImage, secondEvolution, secondEvolutionImage) {
    let evolutionContainer = document.getElementById('information-text-container');

    evolutionContainer.innerHTML = /*html*/`
        <div class="listed-evolutions-container">
            <div class="evolution-container">
                <div class="evolution-name" onclick="showPokemonDetails('${pokemon1}')">${pokemon1}</div>
                <div class="evolution-image"><img src="${image_pokemon1}" alt="${pokemon1}"></div>
            </div>
            ${firstEvolution ? `<div class="evolution-container">
                <div class="evolution-name"  onclick="showPokemonDetails('${firstEvolution}')">${firstEvolution}</div>
                <div class="evolution-image"><img src="${firstEvolutionImage}" alt="${firstEvolution}"></div>
            </div>` : ''}
            ${secondEvolution ? `<div class="evolution-container">
                <div class="evolution-name" onclick="showPokemonDetails('${secondEvolution}')">${secondEvolution}</div>
                <div class="evolution-image"><img src="${secondEvolutionImage}" alt="${secondEvolution}"></div>
            </div>` : ''}
        </div>
    `;
}












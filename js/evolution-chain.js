let pokemon1 = '';
let pokemon2 = '';
let pokemon3 = '';


async function renderEvolutionChain (){
    let species = await fetchApiReturnAsJson(`https://pokeapi.co/api/v2/pokemon-species/${i}`);
    let evolutionchainURL = species['evolution_chain']['url'];
    let evolutionchain = await fetchApiReturnAsJson(evolutionchainURL);
    findChain(evolutionchain);
}

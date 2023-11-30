async function fetchEvolutionChain(pokemonId) {
    let evURL = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`;
    let evResponse = await fetch(evURL);
    let json_ev = await evResponse.json();
    ev_array.push(json_ev);

    console.log('loaded evolution-chain', json_ev);

}
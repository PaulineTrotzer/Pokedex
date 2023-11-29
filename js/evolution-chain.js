let pokemon1 = '';
let pokemon2 = '';
let pokemon3 = '';
let ev_array = [];


async function renderEvolutionChain(pokemonId) {
    let evURL = `https://pokeapi.co/api/v2/evolution-chain/${pokemonId}/`;
    let evResponse = await fetch(evURL);
    let json_ev = await evResponse.json();
    ev_array.push(json_ev);

    console.log('loaded evolution-chain', json_ev);
    filterEv();

}
function filterEv(){

    for (let i = 0; i < ev_array.length; i++) {
        oneChain = ev_array[i];
    }
    console.log('firstPokemon', oneChain['chain']['species']);
    console.log('secondPokemon', oneChain['chain']['evolves_to'][0]['species']);
    console.log('thirdPokemon', oneChain['chain']['evolves_to'][0]['evolves_to'][0]['species']);
   
}















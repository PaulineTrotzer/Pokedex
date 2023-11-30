let pokemon1 = '';
let pokemon2 = '';
let pokemon3 = '';
let ev_array = [];


async function fetchEvolutionChain(i) {
    let evURL = `https://pokeapi.co/api/v2/evolution-chain/${i}/`;
    let evResponse = await fetch(evURL);
    let json_ev = await evResponse.json();
    ev_array.push(json_ev);

    console.log('loaded evolution-chain', json_ev);
    filterEvolutions(i);
 
}

function filterEvolutions(i) {
    let evolutionChain = ev_array[i-1];

    let pokemon1 = evolutionChain['chain']['species']['name'];
    let pokemon2 = evolutionChain['chain']['evolves_to'][0]['species']['name'];
    let pokemon3 = evolutionChain['chain']['evolves_to'][0]['evolves_to'][0]['species']['name'];

    proofFirstEvolutionexist(evolutionChain, pokemon1, pokemon2, pokemon3);
}

function proofFirstEvolutionexist(evolutionChain, pokemon1, pokemon2, pokemon3){
    if (evolutionChain['chain']['evolves_to'].length > 0){
        let firstEvolution = pokemon2;
        proofSecondEvolutionExist(evolutionChain, pokemon1, firstEvolution, pokemon3);
        console.log('firstEvolution:', firstEvolution)
    } else {
        console.log('No second Pokemon')
        /*generateEvolutions(pokemon1);*/
    }
}

function proofSecondEvolutionExist(evolutionChain,pokemon1, firstEvolution, pokemon3){
    if(evolutionChain['chain']['evolves_to'][0]['evolves_to'].length > 0){
        let secondEvolution = pokemon3;
        /*generateEvolutions(pokemon1, firstEvolution, secondEvolution);*/
        console.log('secondEvolution', secondEvolution);
    } else {
        /*generateEvolutions(pokemon1, firstEvolution);*/
    }
}

function generateEvolutions(pokemon1, firstEvolution, secondEvolution){
    let evolutionContainer = document.getElementById('information-text-container');

    evolutionContainer.innerHTML = /*html*/`
    <div class="evolution-container">${pokemon1}</div>
    <div class="evolution-container">${firstEvolution}</div>
    <div class="evolution-container">${secondEvolution}</div>
`;



}












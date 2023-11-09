
let currentPokemon;
let allPokemons = [];
let limitedPokemon = 21;
let currentIndex = 0;

let backgroundColors = {

}


async function loadPokemon() {
    for (let i = 1; i < limitedPokemon; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log('loaded Pokemon', currentPokemon);

        allPokemons.push(currentPokemon);
        renderPokemonInfo(currentPokemon, i);
    
    }
}

function renderPokemonInfo(currentPokemon, i) {

    let PokeId = '#' + currentPokemon['id'];
    let name = currentPokemon['name'];
    let image = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let category = currentPokemon['types'][0]['type']['name'];

    generatePokeCard(PokeId, name, image, category);

}

function generatePokeCard(PokeId, name, image, category) {

document.getElementById('pokecard-main').innerHTML +=
     /*html*/`
     <div class="single-pokeCard">
      <h5>${PokeId}</h5>
            <div class="name-category-img-container">
                <div class="name-and-category-container">
                    <h1 id="pokemonName">${name}</h1>
                    <div id="category">${category}</div>
                </div>
                <img id="pokemonImage" src="${image}">
            </div>
</div>
    
`;


}




function checkPokemontype(){
    let x = currentPokemon['types'][0]['type']['name'];
    return x;
    
}



function findColor(type) {
    switch (type) {
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


function findColorTag(type) {
    switch (type) {
        case 'normal':
            return '#8d8e96';
        case 'fire':
            return '#fd6f0a';
        case 'water':
            return '#3d7ebf';
        case 'electric':
            return '#ebce17';
        case 'grass':
            return '#55984f';
        case 'ice':
            return '#55b0a9';
        case 'fighting':
            return '#bd3b57';
        case 'poison':
            return '#9750bf';
        case 'ground':
            return '#c56e3f';
        case 'flying':
            return '#6987b2';
        case 'psychic':
            return '#d85456';
        case 'bug':
            return '#7fa12f';
        case 'rock':
            return '#a49276';
        case 'ghost':
            return '#455196';
        case 'dragon':
            return '#0b60aa';
        case 'dark':
            return '#504f54';
        case 'steel':
            return '#3c738c';
        case 'fairy':
            return '#d85ebe';
        default:
            return '#6b6b6b';
    }
}
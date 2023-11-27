function setBackgroundcolor(category) {
    switch (category) {
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


function setCharactertraits(type) {
    switch (type) {
        case 'normal':
            return 'normal-background-color';
        case 'fire':
            return 'fire-background-color';
        case 'water':
            return 'water-background-color';
        case 'electric':
            return 'electric-background-color';
        case 'grass':
            return 'grass-background-color';
        case 'ice':
            return 'ice-background-color';
        case 'fighting':
            return 'fighting-background-color';
        case 'poison':
            return 'poison-background-color';
        case 'ground':
            return 'ground-background-color';
        case 'flying':
            return 'flying-background-color';
        case 'psychic':
            return 'psychic-background-color';
        case 'bug':
            return 'bug-background-color';
        case 'rock':
            return 'rock-background-color';
        case 'ghost':
            return 'ghost-background-color';
        case 'dragon':
            return 'dragon-background-color';
        case 'dark':
            return 'dark-background-color';
        case 'steel':
            return 'steel-background-color';
        case 'fairy':
            return 'fairy-background-color';
    }
}
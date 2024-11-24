export const representations = {
    light: 0,
    darkHorse: 'D',
    whiteHorse: 'W',
    extraPoints: 'E',
}

const colors = {
    [representations.light]: '#ffffff', // Blanco
    [representations.darkHorse]: '#ffffff', // Blanco
    [representations.whiteHorse]: '#ffffff', // Blanco
    [representations.extraPoints]: '#ffffff', // Blanco
};

export const getColorByRepresentation = (representation) => {
    return colors[representation] || '#8b8b8b';
};
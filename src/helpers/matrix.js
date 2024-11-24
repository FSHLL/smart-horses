export const createEmptyMatrix = (size) => {
    return Array.from({ length: size }, () => Array(size).fill(0))
}

export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateMatrix = () => {
    const newMatrix = createEmptyMatrix(8);
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let eCount = 0;
    let dPlaced = 0;
    let wPlaced = 0;

    for (let i = numbers.length - 1; i > 0; i--) {
        const j = getRandomInt(0, i);
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    let valuesPlaced = 0;
    while (valuesPlaced < 10) {
        let row = getRandomInt(0, 7);
        let col = getRandomInt(0, 7);

        if (newMatrix[row][col] === 0) {
            newMatrix[row][col] = numbers[valuesPlaced];
            valuesPlaced++;
        }
    }

    while (eCount < 4) {
        let row = getRandomInt(0, 7);
        let col = getRandomInt(0, 7);

        if (newMatrix[row][col] === 0) {
            newMatrix[row][col] = 'E';
            eCount++;
        }
    }

    while (!dPlaced) {
        let row = getRandomInt(0, 7);
        let col = getRandomInt(0, 7);

        if (newMatrix[row][col] === 0) {
            newMatrix[row][col] = 'D';
            dPlaced = true;
        }
    }

    while (!wPlaced) {
        let row = getRandomInt(0, 7);
        let col = getRandomInt(0, 7);

        if (newMatrix[row][col] === 0) {
            newMatrix[row][col] = 'W';
            wPlaced = true;
        }
    }

    return newMatrix;
}
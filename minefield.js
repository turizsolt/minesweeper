const withAll = (field, fn) => {
    const size = field.length;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            fn(field[i][j], i, j);
        }
    }
};

const withAdjacent = (field, x, y, fn) => {
    for(let i=x-1;i<(x-(-2));i++) {
        for(let j=y-1;j<(y-(-2));j++) {
            if(isInField(field, i, j)) {
                fn(field[i][j], i, j);
            }
        }
    }
};

const initGame = (size, bombCount) => {
    const field = createField(size);
    addBombs(field, bombCount);
    countAdjacentBombs(field);

    return field;
};

const createField = (size) => {
    const field = [];
    for(let i=0;i<size;i++){
        field.push([]);
        for(let j=0;j<size;j++){
            field[i].push({
                isBomb: false,
                adjacentBombCount: 0,
                isRevealed: false,
                isFlagged: false,
            });
        }
    }
    return field;
};

const addBombs = (field, bombCount) => {
    const size = field.length;
    for(let i=0;i<bombCount;i++) {
        let x,y;
        do {
            x = Math.random()*size|0;
            y = Math.random()*size|0;
        } while(field[x][y].isBomb);

        field[x][y].isBomb = true;
    }
};

const countAdjacentBombs = (field) => {
    withAll(field, (cell, i, j) => cell.adjacentBombCount = countAdjacent(field, i, j));
};

const isInField = (field, x, y) => {
    const size = field.length;
    return (0 <= x && x < size && 0 <= y && y < size);
};

const countAdjacent = (field, x, y) => {
    let count = 0;
    withAdjacent(field, x, y, (cell, i, j) => {
        if(cell.isBomb) {
            count++;
        }
    });
    return count;
};

const reveal = (field, x, y, render, endGame) => {
    const cell = field[x][y];

    if(cell.isRevealed) return;
    if(cell.isFlagged) return;

    cell.isRevealed = true;
    render(x, y, {...cell});

    if(cell.isBomb) {
        endGame(0);
        revealAll(field, render);
    } else {
        if(cell.adjacentBombCount === 0) {
            revealAdjacent(field, x, y, render, endGame);
        }
        if(winCondition(field)) {
            endGame(1);
            flagAll(field, render);
        }
    }
};

const revealAll = (field, render) => {
    withAll(field, (cell, i, j) => {
        if(!cell.isRevealed && !(cell.isFlagged && cell.isBomb)) {
            cell.isRevealed = true;
            cell.isFlagged = false;
            render(i, j, cell);
        }
    });
};

const flagAll = (field, render) => {
    withAll(field, (cell, i, j) => {
        if(cell.isBomb && !cell.isFlagged) {
            cell.isFlagged = true;
            render(i, j, cell);
        }
    });
};

const winCondition = (field) => {
    let isWon = true;
    withAll(field, (cell) => {
        if(cell.isRevealed && cell.isBomb) isWon = false;
        if(!cell.isRevealed && !cell.isBomb) isWon = false;
    });
    return isWon;
};

const revealAdjacent = (field, x, y, render, endGame) => {
    withAdjacent(field, x, y, (cell, i, j) => {
        if(!cell.isRevealed) {
            reveal(field, i, j, render, endGame);
        }
    });
};

const toggleFlag = (field, x, y, render) => {
    const cell = field[x][y];

    if(cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    render(x, y, {...cell});
};

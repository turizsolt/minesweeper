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
    const size = field.length;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            field[i][j].adjacentBombCount = countAdjacent(field, i, j);
        }
    }
};

const isInField = (field, x, y) => {
    const size = field.length;
    return (0 <= x && x < size && 0 <= y && y < size);
};

const countAdjacent = (field, x, y) => {
    let count = 0;
    for(let i=x-1;i<x+2;i++) {
        for(let j=y-1;j<y+2;j++) {
            if(isInField(field, i, j) && field[i][j].isBomb) {
                count++;
            }
        }
    }
    return count;
};

const reveal = (field, x, y, render, endGame) => {
    if(field[x][y].isRevealed) return;
    if(field[x][y].isFlagged) return;

    field[x][y].isRevealed = true;
    render(x, y, {...field[x][y]});

    if(field[x][y].isBomb) {
        endGame(0);
        revealAll(field, render);
    } else {
        if(field[x][y].adjacentBombCount === 0) {
            revealAdjacent(field, x, y, render, endGame);
        }
        if(winCondition(field)) {
            endGame(1);
            flagAll(field, render);
        }
    }
};

const revealAll = (field, render) => {
    const size = field.length;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(!field[i][j].isRevealed && !(field[i][j].isFlagged && field[i][j].isBomb)) {
                field[i][j].isRevealed = true;
                render(i, j, field[i][j]);
            }
        }
    }
};

const flagAll = (field, render) => {
    const size = field.length;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(field[i][j].isBomb && !field[i][j].isFlagged) {
                field[i][j].isFlagged = true;
                render(i, j, field[i][j]);
            }
        }
    }
};

const winCondition = (field) => {
    const size = field.length;
    for(let i=0;i<size;i++){
        for(let j=0;j<size;j++){
            if(field[i][j].isRevealed && field[i][j].isBomb) return false;
            if(!field[i][j].isRevealed && !field[i][j].isBomb) return false;
        }
    }
    return true;
};

const revealAdjacent = (field, x, y, render, endGame) => {
    for(let i=x-1;i<(x-(-2));i++) {
        for(let j=y-1;j<(y-(-2));j++) {
            if(isInField(field, i, j) && !field[i][j].isRevealed) {
                reveal(field, i, j, render, endGame);
            }
        }
    }
};

const toggleFlag = (field, x, y, render) => {
    if(field[x][y].isRevealed) return;

    field[x][y].isFlagged = !field[x][y].isFlagged;
    render(x, y, {...field[x][y]});
};

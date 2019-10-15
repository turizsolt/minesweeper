var field = [];
var clickable = false;
var visualTable = null;
var visualField = [];

const render = (a, b, cell) => {
    const visualCell = visualField[a][b];
    visualField[a][b].className = 'cell';
    visualCell.innerText = "";

    if(cell.isRevealed && !cell.isBomb) {
        visualCell.classList.add('revealed');
        if(cell.adjacentBombCount > 0){
            visualCell.classList.add('number-'+cell.adjacentBombCount);
            visualCell.innerText = cell.adjacentBombCount;
        } else {
            visualCell.innerText = "";
        }
    }

    if(cell.isRevealed && cell.isBomb) {
        visualCell.classList.add('bomb');
        visualCell.innerText = 'Q';
    }

    if(cell.isFlagged) {
        visualCell.classList.add('flagged');
        visualCell.innerText = 'F';
    }
};

const endGame = (isWon) => {
    document.getElementById('result').innerText = isWon ? 'Congratulations!' : 'BUUUUUUUMMMM!';
    clickable = false;
};

const getEventTargetCoords = (event) => {
    const me = event.target;
    const x = me.dataset.x;
    const y = me.dataset.y;
    return {x, y};
};

const start = () => {
    const size = 9;
    const bombCount = 10;

    field = initGame(size, bombCount);
    clickable = true;

    document.getElementById('result').innerText = '';

    visualTable = document.getElementById('minefield');
    while (visualTable.firstChild) {
        visualTable.removeChild(visualTable.firstChild);
    }

    visualField = [];
    for(let i=0;i<size;i++) {
        visualField.push([]);
        for(let j=0;j<size;j++) {
            const elem = document.createElement('div');
            visualField[i][j] = elem;
            visualTable.append(elem);

            elem.classList.add('cell');
            elem.dataset.x = i;
            elem.dataset.y = j;

            elem.addEventListener('click', (event) => {
                if(!clickable) return;
                const { x, y } = getEventTargetCoords(event);

                reveal(field, x, y, render, endGame);
            });

            elem.addEventListener('contextmenu', (event) => {
                if(!clickable) return;
                event.preventDefault();
                const { x, y } = getEventTargetCoords(event);

                if(event.shiftKey) {
                    revealNearIfFlagged(field, x, y, render, endGame);
                } else {
                    toggleFlag(field, x, y, render);
                }
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", start);

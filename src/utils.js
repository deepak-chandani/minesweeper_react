export function getMinePositions(boardSize, numberOfMines){
    const positions = [];

    while(positions.length < numberOfMines){
        const pos = {
            x: getRandomNumber(boardSize),
            y: getRandomNumber(boardSize),
        };

        const isDuplicate = positions.some((e) => e.x===pos.x && e.y===pos.y);
        if(!isDuplicate){
            positions.push(pos);
        }
    }

    return positions;
}

function getRandomNumber(size){
    return Math.floor(Math.random() * size);
}

export function countMinesAroundTile({x, y}, boardTiles){
    let count = 0;

    for(let xOffset=-1; xOffset<=1; xOffset++){
        for(let yOffset=-1; yOffset<=1; yOffset++){
            let tile = boardTiles[x + xOffset]?.[y + yOffset];
            if(tile){
                if(tile.isMine) count++;
            }
        }
    }

    return count;
}

export function findAdjacentTiles({x, y}, boardTiles){
    const adjacentTiles = [];

    for(let xOffset=-1; xOffset<=1; xOffset++){
        for(let yOffset=-1; yOffset<=1; yOffset++){
            let tile = boardTiles[x + xOffset]?.[y + yOffset];
            if(tile){
                const {x:tx,y:ty} = tile.coordinates;
                if(tx==x && ty==y){
                    continue;
                }
                adjacentTiles.push(tile);
            }
        }
    }

    return adjacentTiles;
}
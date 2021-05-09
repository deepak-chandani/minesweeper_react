import React from "react";
import { TILE_STATUSES, GAME_STATUS } from "../constants";
import { countMinesAroundTile, findAdjacentTiles, getMinePositions } from "../utils";
import Tile from "./Tile";

function useForceUpdate(){
  const [value, setValue] = React.useState(0);

  const forceUpdate = () => setValue(v => v+1)

  return forceUpdate
}


function Board(props) {
  const { size, numberOfMines } = props;
  const forceUpdate = useForceUpdate();
  const [gameStatus, setGameStatus] = React.useState(GAME_STATUS.RUNNING);
  const [minePositions] = React.useState(getMinePositions(size, numberOfMines)); // we want to persist this across re-renders
  console.log(minePositions);
  const [minesLeft, setMinesLeft] = React.useState(numberOfMines);
  const [tiles, setTiles] = React.useState(() => {
    const values = [];
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const isMine = isMinePosition({ x: i, y: j });
        row.push({
          status: TILE_STATUSES.HIDDEN,
          isMine,
          text: '',
          coordinates: {x:i, y:j}
        });
      }
      values.push(row);
    }

    return values;
  });

  const boardRef = React.useRef();

  function isMinePosition(pos) {
    return minePositions.some((m) => m.x === pos.x && m.y === pos.y);
  }

  const updateTile = ({x,y}, properties) => {
    setTiles((t) => {
        const newVal = [...t];
        // t.forEach((row) => {
        //   newVal.push([...row]);
        // });

        newVal[x][y] = {
            ...newVal[x][y],
            ...properties
        };
        console.log("updated Tiles", newVal);

        return newVal;
      });
    // forceUpdate();
  }

  const updateTile_orig = ({x,y}, properties) => {
    setTiles((t) => {
        const newVal = [];
        t.forEach((row) => {
          newVal.push([...row]);
        });

        newVal[x][y] = {
            ...newVal[x][y],
            ...properties
        };
        console.log("updated Tiles", newVal);

        return newVal;
      });
    // forceUpdate();
  }

  const toggleMarkedTile = ({ x, y }) => {
    setTiles((v) => {
      const newVal = [];
      v.forEach((row) => {
        newVal.push([...row]);
      });
      newVal[x][y].status =
        newVal[x][y].status == TILE_STATUSES.MARKED
          ? TILE_STATUSES.HIDDEN
          : TILE_STATUSES.MARKED;
      if (newVal[x][y].status === TILE_STATUSES.MARKED) {
        setTimeout(() => setMinesLeft((i) => i - 1), 50);
      }
      return newVal;
    });
  };

  React.useEffect(() => {
    boardRef.current.style.setProperty("--size", size);
  }, []);

  const revealTile = (coordinates) => {
    const {x, y} = coordinates;
    if(tiles[x][y].status === TILE_STATUSES.MINE){
        return;
    }
    if(tiles[x][y].status !== TILE_STATUSES.HIDDEN){
        return;
    }

    const adjacentTiles = findAdjacentTiles(coordinates, tiles);
    const countNearbyMines = adjacentTiles.reduce((sum, t) => t.isMine ? sum+1 : sum, 0);
    console.log({countNearbyMines});
    if(countNearbyMines === 0){
        updateTile(coordinates, {status: TILE_STATUSES.NUMBER});
        /**
         * TODO:
         * iterate over every adjacent tile & recursively call revealTile for that tile's coordinates
         */
        adjacentTiles.forEach(tile => {
            // revealTile(tile.coordinates)
            // setTimeout(() => revealTile(tile.coordinates), 100)
            //updateTile(tile.coordinates, {status: TILE_STATUSES.NUMBER});
        })
    }else{
        updateTile(coordinates, {status: TILE_STATUSES.NUMBER, text: countNearbyMines});
    }
  }

  const onTileClick = React.useCallback((e) => {
    e.preventDefault();
    if(gameStatus !== GAME_STATUS.RUNNING){
        return;
    }
    // update status of that tile
    const { target } = e;
    console.log("inside onTileClick", e.type);

    const x = Number(target.getAttribute("data-x"));
    const y = Number(target.getAttribute("data-y"));
    const coordinates = {x,y};

    if(e.type==="contextmenu"){
        toggleMarkedTile(coordinates);
    }else {
        if (isMinePosition(coordinates)) {
            setGameStatus(GAME_STATUS.END);
            // alert("💣 BOOM !!");
            return;
        }
        revealTile(coordinates);
    }
  }, [gameStatus]);

  // draw tiles for size * size board
  const drawTiles = () => {
    let tilesJSX = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = tiles[i][j];
        const props = {};
        if(gameStatus==="end"){
            props.displayMine=true;
        }

        tilesJSX.push(
          <Tile
            key={i + "-" + j}
            x={i}
            y={j}
            status={tile.status}
            isMine={tile.isMine}
            onClick={onTileClick}
            text={tile.text}
            {...props}
          />
        );
      }
    }

    return tilesJSX;
  }

  return (
    <>
      {gameStatus===GAME_STATUS.RUNNING && <div className="subtext">Mines Left: {minesLeft}</div>}
      {gameStatus===GAME_STATUS.END && <div className="subtext">You lose <button onClick={() => window.location.reload()}>Restart</button> </div>}
      <div className="board" ref={boardRef}>
        {drawTiles()}
      </div>
    </>
  );
}

export default Board;

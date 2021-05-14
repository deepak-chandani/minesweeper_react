import React from "react";
import { TILE_STATUSES } from "../constants";

function Tile(props) {
  const {
    x,
    y,
    status = "hidden",
    onClick,
    text = "",
    isMine,
    displayMine = false,
  } = props;
  console.log("Tile rendered");
  const displayStatus = isMine && displayMine ? TILE_STATUSES.MINE : status;
  let displayText = isMine && displayMine ? "💣" : text;

  if(status===TILE_STATUSES.MARKED){
    displayText = '🚩';
  }

  return (
    <div data-status={displayStatus} data-x={x} data-y={y} onClick={onClick} onContextMenu={onClick}>
      {displayText}
    </div>
  );
}

export default React.memo(Tile);

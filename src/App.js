import React from 'react';
import Board from './components/Board';
// import './App.css';

const NUMBER_OF_MINES = 3;

function App() {
  const [numberOfMines, setNumberOfMines] = React.useState(3);

  console.log({numberOfMines});


  return (
    <>
      <h3 className="title">Minesweeper</h3>
      <div>
        {/* <select name="level" value={numberOfMines} onChange={e => setNumberOfMines(Number(e.target.value))}>
          <option value="3">easy</option>
          <option value="6">medium</option>
          <option value="10">difficult</option>
        </select> */}
      </div>
      <Board size="7" numberOfMines={NUMBER_OF_MINES} />
    </>
  );
}

export default App;

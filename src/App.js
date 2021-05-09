import Board from './components/Board';
// import './App.css';

const NUMBER_OF_MINES = 10;

function App() {
  return (
    <>
      <h3 className="title">Minesweeper</h3>      
      <Board size="7" numberOfMines={NUMBER_OF_MINES} />
    </>
  );
}

export default App;

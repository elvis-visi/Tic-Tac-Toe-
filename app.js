//module
const Gameboard = (() => {
    let gameboard = ["", "", "", "", "", "", "", "", ""];
  
    const reset = () => {
      gameboard = ["", "", "", "", "", "", "", "", ""];
    };
  
    const update = (index, symbol) => {
      gameboard[index] = symbol;
    };
  
    const checkWinner = () => {
      const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for (let combination of winningCombinations) {
        if (
          gameboard[combination[0]] &&
          gameboard[combination[0]] === gameboard[combination[1]] &&
          gameboard[combination[0]] === gameboard[combination[2]]
        ) {
          return true;
        }
      }
      return false;
    };
  
    const getBoard = () => {
      return gameboard;
    };
  
    const render = () => {
      const cells = document.querySelectorAll(".cell");
      for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = gameboard[i];
      }
    };
  
    return { reset, update, checkWinner, getBoard, render };
  })();
  

//factory
const Player = () => {

    

}

const displayController = () => {


    
}
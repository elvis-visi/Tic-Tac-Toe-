//module
const Gameboard = (() => {
    let gameboard =  ["", "", "", "", "", "", "", "",""];
  
    const reset = () => {
      gameboard = ["", "", "", "", "", "", "", "", ""];
      render();
    };
  
    const update = (index, symbol) => {
      gameboard[index] = symbol;
      render();

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
const Player = (name, symbol) => {
return {name, symbol};
}

//create two players, 1 chooses X, the other O
const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");


const displayController = (() => {
   
    //current active player, player 1
    let currentPlayer  = player1;
  
    const cells = document.querySelectorAll(".cell");

    //callback called after clicking on a cell
    const handleClick = (e) => {
      
        const index = Array.from(cells).indexOf(e.target);
        console.log("event and index: ",e, index)

        //update the click cell only if it isn't occupied
        if (Gameboard.getBoard()[index] === "") 
        {
            Gameboard.update(index, currentPlayer.symbol);

            console.log("winner?",Gameboard.checkWinner())
            currentPlayer = currentPlayer === player1 ? player2 : player1;
        }
    }

    //add event listener to all cells
    cells.forEach((cell) => {
        cell.addEventListener("click",handleClick);
    })

  })();
  



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

    const checkTie = () => {
      let isBoardFilled = true;
    
      for (let i = 0; i < gameboard.length; i++) {
        if (gameboard[i] == "") {
          isBoardFilled = false;
          break;
        }
      }
    
      return isBoardFilled;
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

    function makeMove(index) {
      // Update the game board with the move

      console.log("curentplayer and symbol",currentPlayer.name,currentPlayer.symbol)
      Gameboard.update(index, currentPlayer.symbol);
    
      // Check if the game has ended
      checkGameEnd();

      

    }

    function checkGameEnd() {
      if (Gameboard.checkWinner()) {
        console.log("Winner found: ", currentPlayer.name, gameboard);
        setTimeout(() => {
        Swal.fire({
          title: `${currentPlayer.name} won!`,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        Gameboard.reset(); //board is empty
        //after resetting the game, new game starts
        if (player1.symbol === 'O') {
          currentPlayer = player2;
          displayController.makeComputerMove(difficulty);
        } else {
          currentPlayer = player1;
        }
        }, 400);
      } else if (Gameboard.checkTie()) {
        console.log("Draw detected: ", gameboard); 
        setTimeout(() => {
          Swal.fire({
            title: 'It\'s a draw!',
            icon: 'info',
            confirmButtonText: 'OK'
          });
        Gameboard.reset();
        if (player1.symbol === 'O') {
          currentPlayer = player2;
          displayController.makeComputerMove(difficulty);
        } else {
          currentPlayer = player1;
        }
      },400)
      } else {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
      }
    }
  
    return { reset, update, checkWinner, getBoard, render,checkTie, makeMove, checkGameEnd };
  })();


//factory
const Player = (name, symbol) => {
return {name, symbol};
}

//create two players, 1 chooses X, the other O
const player1 = Player("You", "");
const player2 = Player("Computer", "");

function switchActive(off,on) {
  off.classList.remove("active")
  on.classList.add("active")
}

//select game difficulty

let currentPlayer = player1.symbol === "X" ? player1 : player2;

const difficultySelect = document.querySelector("#difficulty");
let difficulty = difficultySelect.value;

difficultySelect.addEventListener("change", () => {
  difficulty = difficultySelect.value;
  Gameboard.reset();

    // If player1 is 'O', make the computer move first when changing difficulty
  if (player1.symbol === 'O') {
    player2.symbol = 'X'
    currentPlayer = player2;
    displayController.makeComputerMove(difficulty);
  }
 else {
    // If player1 is 'X', set currentPlayer to player1 when changing difficulty
    currentPlayer = player1;
  }

  console.log("difficulty: ",difficulty)
});



const xBtn = document.querySelector(".X");
const oBtn = document.querySelector(".O");



xBtn.addEventListener("click", () => {
  [player1.symbol, player2.symbol] = ["X", "O"];
  switchActive(oBtn,xBtn);
 Gameboard.reset();
 // Set currentPlayer to player1
 currentPlayer = player1;
})

oBtn.addEventListener("click", () => {
  [player1.symbol, player2.symbol] = ["O", "X"];
  switchActive(xBtn,oBtn);
  // If it's now the computer's turn, make a move
   // Set currentPlayer to player1
   currentPlayer = player2;
  
   Gameboard.reset();
  displayController.makeComputerMove(difficulty);
   
 
})






const displayController = (() => {
   
 
  1

   
function makeComputerMove(difficulty) {
  console.log("AI and symbol",currentPlayer.name,currentPlayer.symbol);
  
  let board = Gameboard.getBoard();
  let bestMove;
  let blockingMove;

  
  // Look for winning moves on medium and hard modes
  if (difficulty === "medium" || difficulty === "hard") {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = player2.symbol;
        if (Gameboard.checkWinner()) {
          bestMove = i;
          break;
        }
        board[i] = "";
      }
    }
  }

  // Look for blocking moves on hard mode, only if no winning move is found
  //thus prioritizing winning over blocking moves, getting rid of double moves.
  if (difficulty === "hard" && !bestMove) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = player1.symbol;
        if (Gameboard.checkWinner()) {
          blockingMove = i;
        }
        board[i] = "";
      }
    }
  }


  // Choose a winning move if available
  if (bestMove !== undefined) {
    console.log("Choosing winning move");
  } else if (blockingMove !== undefined) {
    bestMove = blockingMove;
    console.log("Choosing blocking move");
  }
  // Choose a random move if no winning or blocking moves found
  else {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        emptyCells.push(i);
      }
    }

    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    bestMove = emptyCells[randomIndex];
    console.log("Choosing random move");
  }

  // Disable the game board while the computer is making a move
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.removeEventListener("click", displayController.handleClick);
  });

  // Update the game board with the move
  setTimeout(() => {
    Gameboard.update(bestMove, currentPlayer.symbol);

    // Check if the game has ended
    Gameboard.checkGameEnd();

    // Re-enable the game board after a delay
    setTimeout(() => {
      cells.forEach((cell) => {
        cell.addEventListener("click", displayController.handleClick);
      });
    }, 200);
  }, 200);
}

    //curentPlayer depends on which symbol has player 1 selected

   
    console.log("currentPlayer: " , currentPlayer)
  
    const cells = document.querySelectorAll(".cell");
    const startButton = document.querySelector("#start");
    const restartButton = document.querySelector("#restart");

    //callback called after clicking on a cell
    const handleClick = e => {
      const index = Array.from(cells).indexOf(e.target);
  
      if (Gameboard.getBoard()[index] === "") {
        Gameboard.makeMove(index);
  
          if (currentPlayer === player2) {
            setTimeout(() => {
              makeComputerMove(difficulty);
            }, 150);
          }
      }
  }

    //add event listener to all cells
    cells.forEach((cell) => {
        cell.addEventListener("click",handleClick);
    })

    //add event listener to restart button
    restartButton.addEventListener("click", () => {
        Gameboard.reset();
        currentPlayer = player1;
        Swal.fire({
          title: `New game!`,
          icon: 'info',
          confirmButtonText: 'OK'
        });
    });

    return { handleClick, makeComputerMove };

  })();
  



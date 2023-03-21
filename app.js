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
  
    return { reset, update, checkWinner, getBoard, render,checkTie };
  })();


//factory
const Player = (name, symbol) => {
return {name, symbol};
}

//create two players, 1 chooses X, the other O
const player1 = Player("Player 1", "");
const player2 = Player("Computer", "");

function switchActive(off,on) {
  off.classList.remove("active")
  on.classList.add("active")
}


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
    makeComputerMove(difficulty);
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
  makeComputerMove(difficulty);
   

})


function makeComputerMove(difficulty) {
  
  console.log("passed difficulty :" + difficulty)
  
  let board = Gameboard.getBoard();
  let bestMove;

  if (difficulty === "hard" || difficulty === "medium") {
    // Check for winning moves
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

    // Check for blocking moves
    if (!bestMove && difficulty === "hard") {
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          board[i] = player1.symbol;
          if (Gameboard.checkWinner()) {
            bestMove = i;
            break;
          }
          board[i] = "";
        }
      }
    }
  }

  // Choose random move if no other options
  if (!bestMove) {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        emptyCells.push(i);
      }
    }

    let randomIndex = Math.floor(Math.random() * emptyCells.length);
    bestMove = emptyCells[randomIndex];
}

// Update the game board with the move
Gameboard.update(bestMove, currentPlayer.symbol);

// Check if the game has ended
checkGameEnd();
}

function checkGameEnd() {
  if (Gameboard.checkTie()) {
    alert("Draw");
    // Reset the game and make the computer move first if player1 is 'O'
    Gameboard.reset();
    if (player1.symbol === 'O') {
      currentPlayer = player2; // no more double move
      makeComputerMove(difficulty);
    }else {
      currentPlayer = player1;
    }
  } else if (Gameboard.checkWinner()) {
    alert(currentPlayer.name + " won");
    // Reset the game and make the computer move first if player1 is 'O'
    Gameboard.reset();
    if (player1.symbol === 'O') {
      currentPlayer = player2;
      makeComputerMove(difficulty);
    }
    else {
      currentPlayer = player1;
    }
  } else {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  }
}


function makeMove(index) {
  // Update the game board with the move
  Gameboard.update(index, currentPlayer.symbol);

  // Check if the game has ended
  checkGameEnd();
}


const displayController = (() => {
   
    //current active player, player 1
    
   

    //curentPlayer depends on which symbol has player 1 selected

   
    console.log("currentPlayer: " , currentPlayer)
  
    const cells = document.querySelectorAll(".cell");
    const startButton = document.querySelector("#start");
    const restartButton = document.querySelector("#restart");

    //callback called after clicking on a cell
    const handleClick = e => {
      const index = Array.from(cells).indexOf(e.target);
  
      if (Gameboard.getBoard()[index] === "") {
          makeMove(index);
  
          if (currentPlayer === player2) {
              makeComputerMove(difficulty);
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
        alert("Game restarted!");
    });

  })();
  



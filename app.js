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
const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

function switchActive(off,on) {
  off.classList.remove("active")
  on.classList.add("active")
}


const xBtn = document.querySelector(".X");
const oBtn = document.querySelector(".O");

xBtn.addEventListener("click", () => {
  player1.symbol = "X";
  player2.symbol = "O";
  switchActive(oBtn,xBtn);
})

oBtn.addEventListener("click", () => {
  player1.symbol = "O";
  player2.symbol = "X";
  switchActive(xBtn,oBtn);
})






const displayController = (() => {
   
    //current active player, player 1

    let currentPlayer  = player1.symbol === "X" ? player1 : player2;

    //curentPlayer depends on which symbol has player 1 selected

   
    console.log("currentPlayer: " , currentPlayer)
  
    const cells = document.querySelectorAll(".cell");
    const startButton = document.querySelector("#start");
    const restartButton = document.querySelector("#restart");

    //callback called after clicking on a cell
    const handleClick = (e) => {
      
        const index = Array.from(cells).indexOf(e.target);
        console.log("event and index: ",e, index)

        //update the click cell only if it isn't occupied
        if (Gameboard.getBoard()[index] === "") 
        {
            Gameboard.update(index, currentPlayer.symbol);

            if(Gameboard.checkTie())
            {
              alert("Draw");
                Gameboard.reset();
                //currentPlayer = player1;
            }


            if(Gameboard.checkWinner() == true)
            {
                alert(currentPlayer.name + " won");
                Gameboard.reset();
                //currentPlayer = player1;
            }
            else{
                console.log("winner?",Gameboard.checkWinner())
                currentPlayer = currentPlayer === player1 ? player2 : player1;
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
  



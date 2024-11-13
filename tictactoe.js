let board = Array(9).fill(null);
let currentPlayer = "X";
let userSymbol = "X";
let computerSymbol = "O";
let gameActive = false;
let gameMode = "";

// Sounds
const moveSound = new Audio("move.mp3");
const winSound = new Audio("win.mp3");
const tieSound = new Audio("tie.mp3");
const errorSound = new Audio("error.mp3");
const gameStartSound = new Audio("game-start.mp3");
const backgroundMusic = new Audio("background-music.mp3");
const buttonClickSound = new Audio("buttonClickSound.mp3");
backgroundMusic.volume = 0.1;

function initializeGame() {
  buttonClickSound.play();
  board.fill(null);
  currentPlayer = "X";
  gameActive = false;
  document.getElementById("start-button").style.display = "none";
  document.getElementById("symbol-selection").style.display = "block";
  document.getElementById("board").style.display = "none";
  document.getElementById("status").innerText = "Choose your symbol to start";
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function chooseSymbol(symbol) {
  buttonClickSound.play();
  userSymbol = symbol;
  computerSymbol = symbol === "X" ? "O" : "X";
  document.getElementById("symbol-selection").style.display = "none";
  document.getElementById("mode-selection").style.display = "block";
}

function startGame(mode) {
  buttonClickSound.play();
  gameMode = mode;
  board.fill(null);
  currentPlayer = userSymbol;
  gameActive = true;
  document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("x", "o"));
  document.getElementById("board").style.display = "grid";
  document.getElementById("status").innerText = `${currentPlayer}'s turn`;
  document.getElementById("restart-button").classList.add("show");
  document.getElementById("mode-selection").style.display = "none";
  backgroundMusic.play();
}

function makeMove(index) {
  if (!gameActive || board[index] !== null) return;

  moveSound.play();  // Play the move sound

  setTimeout(() => {
    // Update the board with the current player's symbol
    board[index] = currentPlayer;
    document.querySelectorAll(".cell")[index].classList.add(currentPlayer.toLowerCase());

    // Check if there's a winner or if it's a tie
    if (checkWinner()) {
      displayPopup(`${currentPlayer} Wins!`);
      winSound.play();
      gameActive = false;
    } else if (board.every(cell => cell !== null)) {
      displayPopup("It's a Tie!");
      tieSound.play();
      gameActive = false;
    } else {
      // Switch player turns
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      document.getElementById("status").innerText = `${currentPlayer}'s turn`;

      // If it's the computer's turn in "computer" mode, trigger the computer's move
      if (gameMode === "computer" && currentPlayer === computerSymbol) {
        setTimeout(computerMove, 1000); // Add delay before computer makes a move (1000 ms = 1 second)
      }
    }
  }, moveSound.duration * 100);  // Wait for the sound to finish before proceeding
}

function computerMove() {
  const bestMove = getBestMove();
  makeMove(bestMove); // Play move sound and update board when computer moves
}

function getBestMove() {
  let bestScore = -Infinity;
  let bestMove;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      board[i] = computerSymbol;
      let score = minimax(board, 0, false);
      board[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  if (checkWinnerForSymbol(computerSymbol)) return 10 - depth;
  if (checkWinnerForSymbol(userSymbol)) return depth - 10;
  if (board.every(cell => cell !== null)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = computerSymbol;
        let score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = userSymbol;
        let score = minimax(board, depth + 1, true);
        board[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner() {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => 
    pattern.every(idx => board[idx] === currentPlayer)
  );
}

function checkWinnerForSymbol(symbol) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winPatterns.some(pattern => 
    pattern.every(idx => board[idx] === symbol)
  );
}

function displayPopup(message) {
  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").style.display = "block";
  backgroundMusic.pause();
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}

// Adding button click sound to relevant buttons
document.getElementById("start-button").addEventListener("click", () => buttonClickSound.play());
document.getElementById("restart-button").addEventListener("click", () => buttonClickSound.play());
document.getElementById("symbol-x").addEventListener("click", () => buttonClickSound.play());
document.getElementById("symbol-o").addEventListener("click", () => buttonClickSound.play());
document.getElementById("play-friend").addEventListener("click", () => buttonClickSound.play());
document.getElementById("play-computer").addEventListener("click", () => buttonClickSound.play());

// Adding Event Listeners for Player Moves
document.querySelectorAll(".cell").forEach((cell, index) => {
  cell.addEventListener("click", () => {
    if (gameMode === "friend" || (gameMode === "computer" && currentPlayer === userSymbol)) {
      makeMove(index);
    }
  });
});

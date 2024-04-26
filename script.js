// Game board
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

// Player symbols
const playerX = document.createElement('i');
playerX.className = 'fa fa-times';
playerX.value = '<i class="fa fa-times"></i>';

const playerO = document.createElement('i');
playerO.className = 'fa fa-circle-o';
playerO.value = '<i class="fa fa-circle-o"></i>';

// Current player
let currentPlayer;

// Start the game
function startGame() {
  const playerSymbol = document.getElementById('player').value;
   if (playerSymbol === '0') {
    currentPlayer = null;
   } else if (playerSymbol === '1') {
    currentPlayer = playerX;
  } else if (playerSymbol === '2') {
    currentPlayer = playerO;
  }
  resetBoard();
}

// Reset the board
function resetBoard() {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => cell.innerHTML = '');
}

// Handle player move
function playerMove(row, col) {
  if (board[row][col] === '') {
    board[row][col] = currentPlayer;
    updateCell(row, col, currentPlayer);

    displayMessage();
  }
}

// Update a cell with the player symbol
function updateCell(row, col, symbol) {
  const cell = document.getElementById(`${row}${col}`);
  cell.innerHTML = '';
  cell.appendChild(symbol.cloneNode(true));
}

// Check for a winner
function checkWinner(playerSymbol) {
  // Check rows
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === playerSymbol && board[i][1] === playerSymbol && board[i][2] === playerSymbol) {
      return true;
    }
  }

  // Check columns
  for (let i = 0; i < 3; i++) {
    if (board[0][i] === playerSymbol && board[1][i] === playerSymbol && board[2][i] === playerSymbol) {
      return true;
    }
  }

  // Check diagonals
  if (board[0][0] === playerSymbol && board[1][1] === playerSymbol && board[2][2] === playerSymbol) {
    return true;
  }
  if (board[0][2] === playerSymbol && board[1][1] === playerSymbol && board[2][0] === playerSymbol) {
    return true;
  }

  return false;
}

// Check for a draw
function checkDraw() {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        return false;
      }
    }
  }
  return true;
}

// Reset the game
function resetGame() {
  resetBoard();
  startGame();
}

// Add event listeners to cells
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  cell.addEventListener('click', () => {
    // Check if the game is over before making a move
    if (checkWinner(playerX) || checkWinner(playerO) || checkDraw()) {
      resetGame();
    } else {
      playerMove(row, col);
    }
  });
});

function playerSelection() {
  startGame();
  const playerSelectionModal = document.getElementById('playerSelectionModal');
  const playerSelectionSpan = document.getElementsByClassName('closePlayerSelection')[0];

  playerSelectionModal.style.display = "flex";
  playerSelectionSpan.onclick = () => {
    if (currentPlayer !== null) {
      playerSelectionModal.style.display = "none";
    } else if (currentPlayer == null) {
      document.getElementById('error').innerHTML = "Choose your symbol";
      playerSelectionModal.style.display = "flex";
    }
  }

  window.onclick = (event) => {
    if (event.target === playerSelectionModal) {
      if (currentPlayer !== null) {
        playerSelectionModal.style.display = "none";
      } else if (currentPlayer == null) {
        document.getElementById('error').innerHTML = "Choose your symbol";
        playerSelectionModal.style.display = "flex";
      }
    }
  }

  const escape = (event) => {
    if (event.key === 'Escape') {
      if (currentPlayer !== null) {
        playerSelectionModal.style.display = "none";
      } else if (currentPlayer == null) {
        document.getElementById('error').innerHTML = "Choose your symbol";
        playerSelectionModal.style.display = "flex";
      }
    }
  };
  document.addEventListener('keydown', escape);

  document.getElementById('startGame').onclick = () => {
    if (currentPlayer !== null) {
      playerSelectionModal.style.display = "none";
    } else if (currentPlayer == null) {
      document.getElementById('error').innerHTML = "Choose your symbol";
      playerSelectionModal.style.display = "flex";
    }
  }
}

function displayMessage () {
  const messageModal = document.getElementById('messageModal');

  // Check for a winner or a draw
  if (checkWinner(playerX) || checkWinner(playerO) || checkDraw()) {
    setTimeout(() => {
      messageModal.style.display = "flex";
    }, 300);
  } else {
    // Switch to the other player
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  }
  
  document.getElementById('restart').onclick = () => {
    messageModal.style.display = "none";
    playerSelection();
  }
  document.getElementById('tryAgain').onclick = () => {
    messageModal.style.display = "none";
    resetBoard();
  }

  // Check for a winner or a draw
  if (checkWinner(playerX) || checkWinner(playerO)) {
    document.getElementById('message').innerHTML = `${currentPlayer.value} wins!`;
  } else if (checkDraw()) {
    document.getElementById('message').textContent = 'It is a tie!';
  }
}

playerSelection();
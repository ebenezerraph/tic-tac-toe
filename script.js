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

    if (checkWinner(playerX) || checkWinner(playerO) || checkDraw()) {
      displayMessage();
    } else {
      currentPlayer = currentPlayer === playerX ? playerO : playerX;
    }
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

  const playerSymbol = document.getElementById('player').value;
  if (playerSymbol === '0') {
    currentPlayer = null;
  } else if (playerSymbol === '1') {
    currentPlayer = playerX;
  } else if (playerSymbol === '2') {
    currentPlayer = playerO;
  }
}

// Add event listeners to cells
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
  const row = Math.floor(index / 3);
  const col = index % 3;
  cell.addEventListener('click', () => {
    playerMove(row, col);
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

function displayMessage() {
  const messageModal = document.getElementById('messageModal');

  setTimeout(() => {
    messageModal.style.display = "flex";
  }, 300);

  document.getElementById('restart').onclick = () => {
    messageModal.style.display = "none";
    playerSelection();
  }
  document.getElementById('tryAgain').onclick = () => {
    messageModal.style.display = "none";
    resetGame(); // Call resetGame instead of resetBoard
  }

  // Check for a winner or a draw
  if (checkWinner(playerX) || checkWinner(playerO)) {
    document.getElementById('message').innerHTML = `${currentPlayer.value} wins!`;
  } else if (checkDraw()) {
    document.getElementById('message').textContent = 'It is a tie!';
  }
}

playerSelection();

// Utility function to add event listener
function addEventListenerWithOptions(target, type, handler, options = false) {
  if (target.addEventListener) {
    target.addEventListener(type, handler, options);
  } else if (target.attachEvent) {
    target.attachEvent(`on${type}`, handler);
  } else {
    target[`on${type}`] = handler;
  }
}

// Function to initialize custom select
function initCustomSelect(selectEl) {
  const customSelectContainer = selectEl.parentNode;
  const selectedOption = document.createElement("div");
  const optionsContainer = document.createElement("div");
  const arrow = document.createElement("i");

  selectedOption.classList.add("select-selected");
  selectedOption.textContent = selectEl.options[selectEl.selectedIndex].text;
  arrow.classList.add("arrow", "fas", "fa-caret-down");
  selectedOption.appendChild(arrow);

  optionsContainer.classList.add("select-items", "select-hide");

  [...selectEl.options].slice(1).forEach((option, index) => {
    const optionEl = document.createElement("div");
    optionEl.textContent = option.text;
    optionEl.addEventListener("click", () => {
      selectEl.selectedIndex = index + 1;
      selectedOption.textContent = option.text;
      optionsContainer.querySelectorAll(".same-as-selected").forEach(el => el.classList.remove("same-as-selected"));
      optionEl.classList.add("same-as-selected");
      optionsContainer.classList.add("select-hide");
      selectedOption.classList.remove("select-arrow-active");
      selectedOption.appendChild(arrow);

      // Update currentPlayer based on the selected option
      if (option.value === '1') {
        currentPlayer = playerX;
      } else if (option.value === '2') {
        currentPlayer = playerO;
      }

      // Remove the error message when a symbol is selected
      document.getElementById('error').innerHTML = "";

      // Start the game if not already started
      if (!gameStarted) {
        startGame();
        gameStarted = true;
      }
    });
    optionsContainer.appendChild(optionEl);
  });

  customSelectContainer.appendChild(selectedOption);
  customSelectContainer.appendChild(optionsContainer);

  addEventListenerWithOptions(selectedOption, "click", () => {
    optionsContainer.classList.toggle("select-hide");
    selectedOption.classList.toggle("select-arrow-active");
  });

  addEventListenerWithOptions(document, "click", (event) => {
    if (!customSelectContainer.contains(event.target)) {
      optionsContainer.classList.add("select-hide");
      selectedOption.classList.remove("select-arrow-active");
    }
  });
}

// Initialize custom select for all select elements
document.querySelectorAll(".custom-select select").forEach(initCustomSelect);
// Game board
const board = [
['', '', ''],
['', '', ''],
['', '', '']
];

// Player symbols
const playerX = createPlayerIcon('fa fa-times');
const playerO = createPlayerIcon('fa fa-circle-o');

// Current player
let currentPlayer;
let gameStarted = false;

// Start the game
function startGame() {
const playerSymbol = document.getElementById('player').value;
currentPlayer = getPlayerSymbol(playerSymbol);
resetBoard();
gameStarted = true;
}

// Reset the board
function resetBoard() {
board.forEach(row => row.fill(''));
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
  if (board[i].every(cell => cell === playerSymbol)) {
    return true;
  }
}

// Check columns
for (let i = 0; i < 3; i++) {
  if (board.every(row => row[i] === playerSymbol)) {
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
return board.every(row => row.every(cell => cell !== ''));
}

// Reset the game
function resetGame() {
resetBoard();
currentPlayer = getPlayerSymbol(document.getElementById('player').value);
}

// Add event listeners to cells
const cells = document.querySelectorAll('.cell');
cells.forEach((cell, index) => {
const row = Math.floor(index / 3);
const col = index % 3;
cell.addEventListener('click', () => playerMove(row, col));
});

// Player selection modal
function playerSelection() {
startGame();
const playerSelectionModal = document.getElementById('playerSelectionModal');
const playerSelectionSpan = document.getElementsByClassName('closePlayerSelection')[0];
const footerLink = document.querySelector('.footer-link'); // Footer link element

playerSelectionModal.style.display = "flex";
playerSelectionSpan.onclick = () => toggleModal(playerSelectionModal);
window.onclick = (event) => {
  // Ensure the click is not on the footer link or its children
  if (event.target === footerLink || footerLink.contains(event.target)) {
    return; // Do nothing if the footer link is clicked
  }
  if (event.target === playerSelectionModal) {
    toggleModal(playerSelectionModal);
  }
};
document.addEventListener('keydown', (event) => event.key === 'Escape' && toggleModal(playerSelectionModal));
document.getElementById('startGame').onclick = () => toggleModal(playerSelectionModal);

function toggleModal(modal) {
  if (currentPlayer !== null) {
    modal.style.display = "none";
  } else {
    document.getElementById('error').innerHTML = "Choose your symbol";
    modal.style.display = "flex";
  }
}
}

// Display message modal
function displayMessage() {
const messageModal = document.getElementById('messageModal');
const message = document.getElementById('message');

setTimeout(() => {
  messageModal.style.display = "flex";

  if (checkWinner(playerX) || checkWinner(playerO)) {
    message.innerHTML = `${currentPlayer.value} wins!`;
  } else if (checkDraw()) {
    message.textContent = 'It is a tie!';
  }
}, 300);

document.getElementById('restart').onclick = () => {
  messageModal.style.display = "none";
  playerSelection();
};
document.getElementById('tryAgain').onclick = () => {
  messageModal.style.display = "none";
  resetGame();
};
}

// Helper functions
function createPlayerIcon(className) {
const icon = document.createElement('i');
icon.className = className;
icon.value = `<i class="${className}"></i>`;
return icon;
}

function getPlayerSymbol(playerSymbol) {
if (playerSymbol === '1') {
  return playerX;
} else if (playerSymbol === '2') {
  return playerO;
} else {
  return null;
}
}

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
    currentPlayer = getPlayerSymbol(option.value);

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

// Start the game
playerSelection();
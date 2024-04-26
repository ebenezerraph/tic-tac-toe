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
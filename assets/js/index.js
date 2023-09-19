function generateNumbertoFifty(num, ticketName) {
  let li = "";

  for (let i = 1; i <= num; i++) {
    li += `<li data-ticket="${ticketName}" data-number="${i}">${i}</li>`;
  }

  return li;
}

const cardBody = document.querySelector(".single-body-inner");
const addItemBtn = document.getElementById("add-item");

// Object to store tickets and their selected numbers
const tickets = {};

// Function to add a play card
function addPlayCard(ticketName) {
  const ticketData = {
    multiple: [],
    single: [],
  };

  const playCard = `<div class="play-card" data-ticket="${ticketName}">
      <button type="button" class="close-play-card">
        <i class="fa fa-times"></i>
      </button>
      <div class="play-card-inner text-center">
        <div class="play-card-header">
          <span class="number-amount">Pick 5 Numbers</span>
          <div class="header-btn-area">
          <button type="button" id="quick-pick5" onclick="quickPick('${ticketName}')">
          quick pick
        </button>        
            <button type="button" data-ticket="${ticketName}" id="clear-pick5" class="clear-tickcet">clear</button>
          </div>
        </div>
        <div class="play-card-body">
          <ul class="number-list" id="select_multiple">
           ${generateNumbertoFifty(50, ticketName)}
          </ul>
          <span class="add-more-text">All Selected</span>
          <ul class="number-list" id="select_single">
          ${generateNumbertoFifty(10, ticketName)}
          </ul>
        </div>
        <div class="play-card-footer">
          <p class="play-card-footer-text">Selected Numbers:</p>
          <div class="selected-numbers" id="${ticketName}-selected-numbers">
            <!-- Display selected numbers here -->
          </div>
        </div>
      </div>
      </div>`;

  cardBody.insertAdjacentHTML("beforeend", playCard);

  // Initialize the ticket with an empty array for selected numbers
  tickets[ticketName] = ticketData;
}

// Function to update the selected numbers display for a specific ticket
function updateSelectedNumbersDisplay(ticketName) {
  const selectedNumbersDiv = document.getElementById(
    `${ticketName}-selected-numbers`
  );
  const selectedNumbers = tickets[ticketName];

  const multipleNumbersHTML = selectedNumbers.multiple
    .map((number) => `<span class="multiple">${number}</span>`)
    .join(", ");

  const singleNumbersHTML = selectedNumbers.single
    .map((number) => `<span class="single">${number}</span>`)
    .join(", ");

  selectedNumbersDiv.innerHTML = `
   ${multipleNumbersHTML}
     ${singleNumbersHTML}
  `;
}

// Add five play cards on page load
for (let i = 1; i <= 5; i++) {
  const ticketName = `ticket${i}`;
  addPlayCard(ticketName);
}

// Add a play card when the "Add Item" button is clicked
addItemBtn.addEventListener("click", function () {
  const ticketCount = Object.keys(tickets).length + 1;
  const ticketName = `ticket${ticketCount}`;
  addPlayCard(ticketName);
});

// Function to remove a ticket
function removeTicket(ticketName) {
  // Remove the ticket's DOM element
  const ticketElement = document.querySelector(`[data-ticket="${ticketName}"]`);
  if (ticketElement) {
    ticketElement.remove();
  }

  // Remove the ticket from the tickets object
  delete tickets[ticketName];
}

// Add event listener for clicks on the cardBody
cardBody.addEventListener("click", function (event) {
  if (event.target.classList.contains("fa-times")) {
    // Find the closest .play-card element
    const ticketCard = event.target.closest(".play-card");

    if (ticketCard) {
      const ticketName = ticketCard.getAttribute("data-ticket");
      removeTicket(ticketName);
    }
  }

  if (event.target.classList.contains("clear-tickcet")) {
    const ticketName = event.target.getAttribute("data-ticket");
    clearSelections(ticketName);
  }
});

// Function to clear both "single" and "multiple" selections
function clearSelections(ticketName) {
  // Clear the arrays
  tickets[ticketName].multiple = [];
  tickets[ticketName].single = [];

  // Remove the "active" class from all list items
  const multipleNumbers = document.querySelectorAll(
    `#select_multiple li[data-ticket="${ticketName}"]`
  );
  multipleNumbers.forEach((li) => {
    li.classList.remove("active");
  });

  const singleNumbers = document.querySelectorAll(
    `#select_single li[data-ticket="${ticketName}"]`
  );
  singleNumbers.forEach((li) => {
    li.classList.remove("active");
  });

  // Update the display
  updateSelectedNumbersDisplay(ticketName);
}

// select multiple numbers
let multipleNumbers = document.querySelectorAll("#select_multiple li");

multipleNumbers.forEach((li) => {
  li.addEventListener("click", function () {
    let ticketName = li.getAttribute("data-ticket");
    let number = li.getAttribute("data-number");
    let ticketsArr = tickets[ticketName];

    if (!ticketsArr.multiple.includes(number)) {
      if (ticketsArr.multiple.length >= 4) {
        const secondLast = ticketsArr.multiple[ticketsArr.multiple.length - 1];
        const removedLi = document.querySelector(
          `#select_multiple li[data-ticket="${ticketName}"][data-number="${secondLast}"]`
        );
        removedLi.classList.remove("active");
        const indexToRemove = ticketsArr.multiple.indexOf(secondLast);
        if (indexToRemove !== -1) {
          ticketsArr.multiple.splice(indexToRemove, 1);
        }
      }

      ticketsArr.multiple.push(number);
      li.classList.add("active");
      updateSelectedNumbersDisplay(ticketName);
    } else {
      // If the number is already selected, remove it
      const indexToRemove = ticketsArr.multiple.indexOf(number);
      if (indexToRemove !== -1) {
        ticketsArr.multiple.splice(indexToRemove, 1);
        li.classList.remove("active");
        updateSelectedNumbersDisplay(ticketName);
      }
    }
  });
});

// select single number
// Select all single numbers
let singleNumbers = document.querySelectorAll("#select_single li");

singleNumbers.forEach((li) => {
  li.addEventListener("click", function () {
    let ticketName = li.getAttribute("data-ticket");
    let number = li.getAttribute("data-number");
    let ticketsArr = tickets[ticketName];

    // Clear previous selections for this ticket
    ticketsArr.single = [];

    const singleNumbersForTicket = document.querySelectorAll(
      `#select_single li[data-ticket="${ticketName}"]`
    );
    singleNumbersForTicket.forEach((item) => {
      item.classList.remove("active");
    });

    ticketsArr.single.push(number);

    li.classList.add("active");

    updateSelectedNumbersDisplay(ticketName);
  });
});

//Quick pick
function quickPick(ticketName) {
  const ticketsArr = tickets[ticketName];
  const multipleNumbers = document.querySelectorAll(
    `#select_multiple li[data-ticket="${ticketName}"]`
  );

  const singleNumbers = document.querySelectorAll(
    `#select_single li[data-ticket="${ticketName}"]`
  );

  // Clear previous selections for this ticket
  ticketsArr.multiple = [];
  ticketsArr.single = [];

  multipleNumbers.forEach((li) => {
    li.classList.remove("active");
  });

  singleNumbers.forEach((li) => {
    li.classList.remove("active");
  });

  // Generate and select a maximum of four random numbers for multiple
  const maxMultipleNumbersToSelect = 4;
  const selectedMultipleNumbers = new Set(); // Use a Set to ensure unique selections
  while (selectedMultipleNumbers.size < maxMultipleNumbersToSelect) {
    const randomIndex = Math.floor(Math.random() * multipleNumbers.length);
    const randomLi = multipleNumbers[randomIndex];
    const number = randomLi.getAttribute("data-number");

    // Ensure the selected number is not already selected
    if (!selectedMultipleNumbers.has(number)) {
      selectedMultipleNumbers.add(number);
      ticketsArr.multiple.push(number);
      randomLi.classList.add("active");
    }
  }

  // Generate and select a single random number for single
  const maxSingleNumbersToSelect = 1;
  const selectedSingleNumbers = new Set(); // Use a Set to ensure unique selections
  while (selectedSingleNumbers.size < maxSingleNumbersToSelect) {
    const randomIndex = Math.floor(Math.random() * singleNumbers.length);
    const randomLi = singleNumbers[randomIndex];
    const number = randomLi.getAttribute("data-number");

    // Ensure the selected number is not already selected
    if (!selectedSingleNumbers.has(number)) {
      selectedSingleNumbers.add(number);
      ticketsArr.single.push(number);
      randomLi.classList.add("active");
    }
  }

  // Update the display
  updateSelectedNumbersDisplay(ticketName);
}

// ,let show Tickets
let addToCart = document.querySelector(".single-cart-btn");
addToCart.addEventListener("click", function () {
  console.log(tickets);
});

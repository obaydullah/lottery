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
  if (event.target.classList.contains("clear-tickcet")) {
    const ticketName = event.target.getAttribute("data-ticket");
    clearSelections(ticketName);
  } else if (event.target.matches("#select_multiple li")) {
    handleMultipleSelection(event.target);
  } else if (event.target.matches("#select_single li")) {
    handleSingleSelection(event.target);
  }
});

// select multiple number
function handleMultipleSelection(li) {
  let ticketName = li.getAttribute("data-ticket");
  let number = li.getAttribute("data-number");
  let ticketsArr = tickets[ticketName];

  if (!ticketsArr.multiple.includes(number)) {
    if (ticketsArr.multiple.length <= 6) {
      ticketsArr.multiple.push(number);
      li.classList.add("active");
      updateSelectedNumbersDisplay(ticketName);
    }
  } else {
    // If the number is already selected, remove it
    const indexToRemove = ticketsArr.multiple.indexOf(number);
    if (indexToRemove !== -1) {
      ticketsArr.multiple.splice(indexToRemove, 1);
      li.classList.remove("active");
      updateSelectedNumbersDisplay(ticketName);
    }
  }
}

// select single number
function handleSingleSelection(li) {
  let ticketName = li.getAttribute("data-ticket");
  let number = li.getAttribute("data-number");
  let ticketsArr = tickets[ticketName];

  if (!ticketsArr.single.includes(number) && ticketsArr.single.length < 2) {
    ticketsArr.single.push(number);
    li.classList.add("active");
    updateSelectedNumbersDisplay(ticketName);
  } else {
    // If the number is already selected, remove it
    const indexToRemove = ticketsArr.single.indexOf(number);
    if (indexToRemove !== -1) {
      ticketsArr.single.splice(indexToRemove, 1);
      li.classList.remove("active");
      updateSelectedNumbersDisplay(ticketName);
    }
  }
}

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

//Quick pick
function quickPick(ticketName) {
  const ticketsArr = tickets[ticketName];
  const multipleNumbers = document.querySelectorAll(
    `#select_multiple li[data-ticket="${ticketName}"]`
  );

  const singleNumbers = document.querySelectorAll(
    `#select_single li[data-ticket="${ticketName}"]`
  );

  function blinkingEffect() {
    const maxMultipleNumbersToSelect = 7;
    const selectedMultipleNumbers = new Set(); // Use a Set to ensure unique selections

    // Clear previous selections for this ticket
    ticketsArr.multiple = [];
    ticketsArr.single = [];

    multipleNumbers.forEach((li) => {
      li.classList.remove("active");
    });

    singleNumbers.forEach((li) => {
      li.classList.remove("active");
    });

    // Generate and select a maximum of five random numbers for multiple
    while (selectedMultipleNumbers.size < maxMultipleNumbersToSelect) {
      const randomIndex = Math.floor(Math.random() * multipleNumbers.length);
      const randomLi = multipleNumbers[randomIndex];
      const number = randomLi.getAttribute("data-number");

      if (!selectedMultipleNumbers.has(number)) {
        selectedMultipleNumbers.add(number);
        ticketsArr.multiple.push(number);
        randomLi.classList.add("active");
      }
    }

    // Generate and select a single random number for single
    const maxSingleNumbersToSelect = 2;
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

  // Create a blinking effect with a total of 5 iterations, each after 1 second
  let iterationCount = 0;
  const maxIterations = 5;

  function runBlinkEffect() {
    iterationCount++;

    blinkingEffect();

    if (iterationCount === maxIterations) {
      clearInterval(interval); // Stop the interval after 5 iterations
    }
  }

  // Initial call and setup of setInterval
  runBlinkEffect();
  const interval = setInterval(runBlinkEffect, 150); // Run every 1 second
}

const addedTicketNames = [];
// add five ticket
addItemBtn.addEventListener("click", function () {
  const ticketCount = Object.keys(tickets).length;
  const newTicketCount = ticketCount + 1;

  // Create and store new ticket names
  for (let i = 0; i < 5; i++) {
    const ticketName = `ticket${newTicketCount + i}`;
    addPlayCard(ticketName);
    addedTicketNames.push(ticketName); // Store the added ticket names
  }
});

// delete row;
const deleteRow = document.getElementById("delete-item");
deleteRow.addEventListener("click", function () {
  const lastFiveTicketNames = addedTicketNames.slice(-5);

  lastFiveTicketNames.forEach((ticketName) => {
    removeTicket(ticketName);
  });

  addedTicketNames.splice(-5);
});

// quick pick all
const quickPickAll = document.getElementById("quick-pick-all");
quickPickAll.addEventListener("click", function () {
  for (const ticketName in tickets) {
    quickPick(ticketName);
  }
});

//show tickets
let addToCart = document.querySelector(".single-cart-btn");
addToCart.addEventListener("click", function () {
  let error = false;
  let hasSelectedTicket = false;

  for (let key in tickets) {
    if (tickets[key].multiple.length > 0 && tickets[key].multiple.length < 5) {
      error = true;
    }

    if (tickets[key].multiple.length == 5 && tickets[key].single.length === 0) {
      error = true;
    }

    if (tickets[key].single.length == 1 && tickets[key].multiple.length !== 5) {
      error = true;
    }
    if (tickets[key].single.length > 0 && tickets[key].multiple.length > 0) {
      hasSelectedTicket = true;
      break;
    }
  }

  if (!hasSelectedTicket) {
    alert(
      "You have to select at least one ticket with both single and multiple selections."
    );
    return;
  }

  if (error) {
    alert(
      "You have to select five number and one number from the powered number"
    );
    return;
  }

  let ticketTemp = {};
  for (let ticket in tickets) {
    if (
      tickets[ticket].single.length > 0 &&
      tickets[ticket].multiple.length > 0
    ) {
      ticketTemp[ticket] = tickets[ticket];
    }
  }

  console.log(ticketTemp);
});

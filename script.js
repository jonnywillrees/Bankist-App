"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2021-01-19T17:01:17.194Z",
    "2021-01-21T23:36:17.929Z",
    "2021-01-25T10:51:36.790Z"
  ],
  currency: "EUR",
  locale: "pt-PT" // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z"
  ],
  currency: "USD",
  locale: "en-US"
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z"
  ],
  currency: "Pound",
  locale: "en-GB"
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z"
  ],
  currency: "Rand",
  locale: "en-ZA"
};

const userAccounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

////////////////////////
// Format Date and Time
////////////////////////
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = date.getDate().toString().padStart(2, 0);
  // const month = (date.getMonth() + 1).toString().padStart(2, 0);
  // const year = date.getFullYear();
  // return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

////////////////////
// Format Currency
////////////////////
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(value);
};

//////////////////////
// Display Movements
//////////////////////
const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? [...account.movements].sort((a, b) => a - b)
    : account.movements;

  movs.forEach((movement, i) => {
    const typeOfTrans = movement > 0 ? "deposit" : "withdrawal";

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeOfTrans}">
          ${i + 1} ${typeOfTrans}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatCur(
          movement,
          account.locale,
          account.currency
        )}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

///////////////////////////////////////
// Calculate, Store and Display Balance
///////////////////////////////////////
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.textContent = formatCur(
    account.balance,
    account.locale,
    account.currency
  );
};

/////////////////////////////////
// Calculate and Display Summary
/////////////////////////////////
const calcDisplaySummary = function (account) {
  const income = account.movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = formatCur(income, account.locale, account.currency);

  const out = account.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = formatCur(
    Math.abs(out),
    account.locale,
    account.currency
  );

  const interest = account.movements
    .filter((mov) => {
      return mov > 0;
    })
    .map((deposit) => {
      return (deposit * account.interestRate) / 100;
    })
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int, i, arr) => {
      return acc + int;
    }, 0);
  labelSumInterest.textContent = formatCur(
    interest,
    account.locale,
    account.currency
  );
};

////////////////////////
// CREATE USERNAME PROP
////////////////////////
const createUserNames = function (accounts) {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(userAccounts);

////////////
// UPADTE UI
////////////
const updateUI = function (account) {
  // Display movements
  displayMovements(account);
  // Display balance
  calcDisplayBalance(account);
  // Display summary
  calcDisplaySummary(account);
};

const startLogOutTimer = function () {
  // Set time to 5 minutes
  let time = 120;

  function tick() {
    const min = Math.trunc(time / 60)
      .toString()
      .padStart(2, 0);
    const sec = (time % 60).toString().padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  }

  // Call timer immediately
  tick();
  // Call the timer every second
  const timer = setInterval(tick, 1000);
  return timer;
};

//////////////////
// Event Handlers
//////////////////
let currentAccount, timer;
let sorted = false;

// LOGIN EVENT HANDlER
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // prevent form from submitting
  currentAccount = userAccounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });
  // if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
  if (currentAccount?.pin === +inputLoginPin.value) {
    // OPTIONAL CHAINING
    // Display UI and a Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Create Date and Time
    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric"
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields and lose focus
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

// TRANSFER BUTTON HANDLER
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const transferTo = userAccounts.find((account) => {
    return account.username === inputTransferTo.value;
  });

  if (
    amount > 0 &&
    transferTo &&
    currentAccount.balance >= amount &&
    transferTo.username !== currentAccount.username
  ) {
    // Remove amount / add withdrawal from current account
    currentAccount.movements.push(-amount);
    // Add amount (deposit) to 'transferTo'
    transferTo.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    transferTo.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Clear input fields and lose focus
    inputTransferTo.value = inputTransferAmount.value = "";
    inputTransferAmount.blur();

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// REQUEST A LOAN HANDLER
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  let amount = Math.floor(inputLoanAmount.value);

  const loanApproved = currentAccount.movements.some((movement) => {
    return movement >= amount * 0.1;
  });

  if (amount > 0 && loanApproved) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);

    // Reset Timer
    clearInterval(timer);
    timer = startLogOutTimer();

    // Clear input fields and lose focus
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
  }
});

// CLOSE ACCOUNT HANDLER
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    +inputClosePin.value === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    console.log("PIN AND USERNAME CORRECT");
    const index = userAccounts.findIndex((account) => {
      return account.username === currentAccount.username;
    });
    // Delete account
    userAccounts.splice(index, 1);

    // Clear input fields and lose focus
    inputCloseUsername.value = inputClosePin.value = "";
    inputClosePin.blur();

    // Hide UI
    containerApp.style.opacity = 0;

    // Reset Timer
    clearInterval(timer);
  }
});

// SORT MOVEMENTS HANDLER
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

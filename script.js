"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const userAccounts = [account1, account2, account3, account4];

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

//////////////////////
// Display Movements
//////////////////////
const displayMovements = function (account) {
  containerMovements.innerHTML = "";

  account.movements.forEach((movement, i) => {
    const typeOfTrans = movement > 0 ? "deposit" : "withdrawal";

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeOfTrans}">
          ${i + 1} ${typeOfTrans}
        </div>
        <div class="movements__value">${movement}\u20AC</div>
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
  labelBalance.textContent = `${account.balance}\u20AC`;
};

/////////////////////////////////
// Calculate and Display Summary
/////////////////////////////////
const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter((mov) => {
      return mov > 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumIn.textContent = `${incomes}\u20AC`;

  const out = account.movements
    .filter((mov) => {
      return mov < 0;
    })
    .reduce((acc, mov) => {
      return acc + mov;
    }, 0);
  labelSumOut.textContent = `${Math.abs(out)}\u20AC`;

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
  labelSumInterest.textContent = `${interest}\u20AC`;
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

///////////////
// FIND METHOD
///////////////
// const account = userAccounts.find((acc) => {
//   return acc.owner === "Jessica Davis";
// });
// console.log(account);

// for (const acc of userAccounts) {
//   if (acc.owner === "Jessica Davis") {
//     console.log(acc);
//   }
// }

//////////////////
// Event Handlers
//////////////////
let currentAccount;

// LOGIN EVENT HANDlER
btnLogin.addEventListener("click", function (e) {
  e.preventDefault(); // prevent form from submitting
  currentAccount = userAccounts.find((acc) => {
    return acc.username === inputLoginUsername.value;
  });
  // if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // OPTIONAL CHAINING
    // Display UI and a Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields and lose focus
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

// TRANSFER BUTTON HANDLER
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = userAccounts.find((account) => {
    return account.username === inputTransferTo.value;
  });
  console.log(transferTo);

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
    // Display movements, calc and display balance, calc and display summary
    setInterval(function () {
      updateUI(currentAccount);
    }, 3000);
  }
  // Clear input fields and lose focus
  inputTransferTo.value = inputTransferAmount.value = "";
  inputTransferAmount.blur();
});

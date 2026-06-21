#!/usr/bin/env node
const readline = require('readline');

const initialBalance = 1000.0;
let storedBalance = initialBalance;

function formatCurrency(value) {
  return value.toFixed(2);
}

function readBalance() {
  return storedBalance;
}

function writeBalance(newBalance) {
  storedBalance = newBalance;
}

function resetBalance() {
  storedBalance = initialBalance;
}

function getMenuText() {
  return [
    '--------------------------------',
    'Account Management System',
    '1. View Balance',
    '2. Credit Account',
    '3. Debit Account',
    '4. Exit',
    '--------------------------------',
  ].join('\n');
}

function getChoiceAction(choice) {
  switch (choice) {
    case '1':
      return 'view';
    case '2':
      return 'credit';
    case '3':
      return 'debit';
    case '4':
      return 'exit';
    default:
      return 'invalid';
  }
}

function creditBalance(amount) {
  if (Number.isNaN(amount) || amount <= 0) {
    return {
      success: false,
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  const currentBalance = readBalance();
  const newBalance = currentBalance + amount;
  writeBalance(newBalance);
  return {
    success: true,
    newBalance,
    message: `Amount credited. New balance: ${formatCurrency(newBalance)}`,
  };
}

function debitBalance(amount) {
  if (Number.isNaN(amount) || amount <= 0) {
    return {
      success: false,
      message: 'Invalid amount. Please enter a positive number.',
    };
  }

  const currentBalance = readBalance();
  if (currentBalance >= amount) {
    const newBalance = currentBalance - amount;
    writeBalance(newBalance);
    return {
      success: true,
      newBalance,
      message: `Amount debited. New balance: ${formatCurrency(newBalance)}`,
    };
  }

  return {
    success: false,
    message: 'Insufficient funds for this debit.',
  };
}

function createPromptInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function prompt(rl, question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function viewBalance(output = console.log) {
  output(`Current balance: ${formatCurrency(readBalance())}`);
}

async function creditAccount(rl, output = console.log) {
  const answer = await prompt(rl, 'Enter credit amount: ');
  const amount = parseFloat(answer);
  const result = creditBalance(amount);
  output(result.message);
}

async function debitAccount(rl, output = console.log) {
  const answer = await prompt(rl, 'Enter debit amount: ');
  const amount = parseFloat(answer);
  const result = debitBalance(amount);
  output(result.message);
}

async function mainMenu() {
  const rl = createPromptInterface();
  let continueFlag = true;

  while (continueFlag) {
    console.log(getMenuText());

    const choice = await prompt(rl, 'Enter your choice (1-4): ');

    switch (getChoiceAction(choice)) {
      case 'view':
        await viewBalance();
        break;
      case 'credit':
        await creditAccount(rl);
        break;
      case 'debit':
        await debitAccount(rl);
        break;
      case 'exit':
        continueFlag = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }

    if (continueFlag) {
      console.log('');
    }
  }

  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  mainMenu().catch((error) => {
    console.error('Unexpected error:', error);
  });
}

module.exports = {
  initialBalance,
  formatCurrency,
  readBalance,
  writeBalance,
  resetBalance,
  getMenuText,
  getChoiceAction,
  creditBalance,
  debitBalance,
};

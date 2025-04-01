// Simple in-memory data model (replace with a database like MongoDB for persistence)
let transactions = [];

class Transaction {
  static getAll() {
    return transactions;
  }

  static add(transaction) {
    const newTransaction = { id: Date.now(), ...transaction };
    transactions.push(newTransaction);
    return newTransaction;
  }

  static clear() {
    transactions = [];
  }
}

module.exports = Transaction;
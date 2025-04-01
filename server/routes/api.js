const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/transactions', (req, res) => {
  res.json(Transaction.getAll());
});

router.post('/transactions', (req, res) => {
  const { type, amount, description } = req.body;
  const transaction = Transaction.add({ type, amount, description });
  res.json(transaction);
});

router.delete('/transactions', (req, res) => {
  Transaction.clear();
  res.sendStatus(204);
});

module.exports = router;
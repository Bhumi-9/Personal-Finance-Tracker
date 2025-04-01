import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './styles.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Load from localStorage or fetch from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/transactions');
        setTransactions(res.data);
      } catch (error) {
        console.error('API error, falling back to localStorage:', error);
        const localData = JSON.parse(localStorage.getItem('transactions')) || [];
        setTransactions(localData);
      }
    };
    fetchTransactions();
  }, []);

  // Save to localStorage as fallback
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = async (e) => {
    e.preventDefault();
    const newTransaction = { type, amount: parseFloat(amount), description };
    try {
      const res = await axios.post('http://localhost:5000/api/transactions', newTransaction);
      setTransactions([...transactions, res.data]);
    } catch (error) {
      console.error('API error, saving locally:', error);
      setTransactions([...transactions, { id: Date.now(), ...newTransaction }]);
    }
    setAmount('');
    setDescription('');
  };

  // Data for visualization
  const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const savings = income - expenses;

  const chartData = {
    labels: ['Income', 'Expenses', 'Savings'],
    datasets: [{
      label: 'Amount ($)',
      data: [income, expenses, savings],
      backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0'],
    }],
  };

  return (
    <div className="container">
      <h1>Personal Finance Tracker</h1>
      
      <form onSubmit={addTransaction} className="form">
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit">Add Transaction</button>
      </form>

      <div className="summary">
        <h2>Summary</h2>
        <p>Income: ${income.toFixed(2)}</p>
        <p>Expenses: ${expenses.toFixed(2)}</p>
        <p>Savings: ${savings.toFixed(2)}</p>
      </div>

      <div className="chart">
        <Bar data={chartData} />
      </div>

      <div className="transactions">
        <h2>Transactions</h2>
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              {t.description} - ${t.amount.toFixed(2)} ({t.type})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
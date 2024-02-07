"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './page.module.css';

export default function Page() {
  const [accounts, setAccounts] = useState({ checking: 0, savings: 0 });
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  // Define fetchAccounts outside of useEffect
  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/accounts');
      setAccounts(response.data);
    } catch (err) {
      setError('Failed to fetch account data.');
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleTransfer = async (from: string, to: string) => {
    // Reset error message
    setError('');
    if (!amount) {
      setError('Please enter an amount to transfer.');
      return;
    }

    try {
      await axios.post('http://localhost:3000/accounts/transfer', {
        from,
        to,
        amount: parseFloat(amount),
      });
      setAmount(''); // Clear the amount after successful transfer
      await fetchAccounts(); // Update account balances
    } catch (err) {
      setError('Transfer failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Account Balances</h1>
      <div className={styles.account}>
        <p>Checking: ${accounts.checking}</p>
        <p>Savings: ${accounts.savings}</p>
      </div>
      <div>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
      </div>
      <div className={styles.buttons}>
        <button onClick={() => handleTransfer('checking', 'savings')}>
          Transfer to Savings
        </button>
        <button onClick={() => handleTransfer('savings', 'checking')}>
          Transfer to Checking
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
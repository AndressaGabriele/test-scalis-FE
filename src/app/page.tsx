"use client" 

import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { CgProfile } from 'react-icons/cg';

interface User {
  _id: string;
  userName: string;
}

interface AccountData {
  checking: number;
  savings: number;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [accounts, setAccounts] = useState<AccountData | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await axios.get<User[]>('http://localhost:3002/accounts');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const fetchAccounts = async (userId: string) => {
    try {
      const response = await axios.get<AccountData>(`http://localhost:3002/accounts/${userId}`);
      setAccounts(response.data);
    } catch (err) {
      setError(`Failed to fetch account data.`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      fetchAccounts(userId);
    }
  };

  const handleTransfer = async (from: string, to: string) => {
    setError('');
    if (!amount) {
      setError('Please enter an amount to transfer.');
      return;
    }

    try {
      await axios.post('http://localhost:3002/accounts/transfer', {
        from,
        to,
        amount: parseFloat(amount),
        userId: selectedUserId,
      });
      setAmount('');
      if (selectedUserId) {
        fetchAccounts(selectedUserId);
      }
      setError('Transfer successful');
    } catch (err) {
      setError('Transfer failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.navBar}>
        <CgProfile size={25} />
        <h1>ScalisBank</h1>
      </div>

      <select onChange={handleUserChange} value={selectedUserId} className={styles.userSelect}>
        <option value="">Select User</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.userName}
          </option>
        ))}
      </select>

      {accounts && (
        <div className={styles.accountsTitle}>
          <h2>Account Balances</h2>
          <div className={styles.account}>
            <p>Checking: ${accounts.checking}</p>
            <p>Savings: ${accounts.savings}</p>
          </div>
        </div>
      )}

      <div>
        <input
          type="number"
          className={styles.amountInput}
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

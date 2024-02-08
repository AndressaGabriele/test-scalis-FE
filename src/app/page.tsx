"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CgProfile } from 'react-icons/cg';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  ListGroup,
} from 'react-bootstrap';
import { AiFillBank } from 'react-icons/ai';

interface User {
  id: string;
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
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [newUserName, setNewUserName] = useState<string>('');
  const [newChecking, setNewChecking] = useState<number>(0);
  const [newSavings, setNewSavings] = useState<number>(0);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get<User[]>('http://localhost:3002/accounts');
      setUsers(response.data);
    } catch (err) {
      handleError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const handleSuccess = (successMessage: string) => {
    setSuccess(successMessage);
    setTimeout(() => {
      setSuccess('');
    }, 3000);
  };

  const fetchAccounts = async (userId: string) => {
    setLoading(true);
    try {
      const response = await axios.get<AccountData>(`http://localhost:3002/accounts/${userId}`);
      setAccounts(response.data);
    } catch (err) {
      handleError('Failed to fetch account data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    fetchAccounts(userId);
  };

  const handleTransfer = async (from: string, to: string) => {
    setError('');
    if (!amount) {
      handleError('Please enter an amount to transfer.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:3002/accounts/transfer', {
        from,
        to,
        amount: parseFloat(amount),
        userId: selectedUserId,
      });
      setAmount('');
      fetchAccounts(selectedUserId);
      handleSuccess('Transfer successful');
    } catch (err) {
      handleError('Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:3002/accounts', {
        userName: newUserName,
        checking: newChecking,
        savings: newSavings,
      });
      handleSuccess('Account created successfully');
      setNewUserName('');
      setNewChecking(0);
      setNewSavings(0);
      fetchUsers();
    } catch (err) {
      handleError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className={styles.container}>
      <Row className={styles.navBar}>
        <Col xs={2} className="text-center">
          <AiFillBank size={35} />
        </Col>
        <Col xs={10}>
          <h1>ScalisBank</h1>
        </Col>
      </Row>
      <Row>
        <Form.Group className={`mb-3 ${styles.userSelect}`}>
          <CgProfile size={30} />
          <Form.Select
            onChange={handleUserChange}
            value={selectedUserId}
            className="form-select"
            style={{
              backgroundColor: '#7796f20f',
              color: 'rgb(10, 17, 145)',
              width: '50%'
            }}
          >
            <option value="" className={styles.selected}>
              Select User
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.userName}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
      <Row>
        {accounts && (
          <Col className={`mb-3 ${styles.title}`}>
            <h2 className="mb-3">Account Balances</h2>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row className={`mb-3 ${styles.title}`}>
                  <Col>Checking:</Col>
                  <Col>${accounts.checking}</Col>
                </Row >
              </ListGroup.Item>
              <ListGroup.Item>
                <Row className={`mb-3 ${styles.title}`}>
                  <Col>Savings:</Col>
                  <Col>${accounts.savings}</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        )}
      </Row>
      <Row style={{ flexDirection: 'column', }}>
        <Col xs={6}>
          <Form.Group className="mb-3">
            <Form.Label className={`mb-3 ${styles.title}`}>Amount:</Form.Label>
            <Form.Control
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={styles.amountInput}
            />
          </Form.Group>
        </Col>
        <Col xs={6}>
          <Row>
            <Col xs={6}>
              <Button
                onClick={() => handleTransfer("checking", "savings")}
                disabled={loading}
                className="mb-2 w-100"
                style={{
                  backgroundColor: 'rgba(14, 0, 174, 0.734)',
                }}
              >
                Transfer to Savings
              </Button>
            </Col>
            <Col xs={6}>
              <Button
                onClick={() => handleTransfer("savings", "checking")}
                disabled={loading}
                className="mb-2 w-100"
                style={{
                  backgroundColor: 'rgba(14, 0, 174, 0.734)',
                }}
              >
                Transfer to Checking
              </Button>
            </Col>
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
          </Row>
        </Col>
      </Row>
      {/* New Account Creation Form */}
      <Row>
        <Col>
          <h2 className={`mb-3 ${styles.title}`}>Create New Account</h2>
          <Form onSubmit={handleCreateAccount} className={`mb-3 ${styles.title}`}>
            <Form.Group className="mb-3">
              <Form.Label>User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="User Name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                required
                
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Checking Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Checking Balance"
                value={newChecking.toString()}
                onChange={(e) => setNewChecking(parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Savings Account Balance</Form.Label>
              <Form.Control
                type="number"
                placeholder="Savings Balance"
                value={newSavings.toString()}
                onChange={(e) => setNewSavings(parseFloat(e.target.value))}
                required
              />
            </Form.Group>
            <Button 
            variant="primary" 
            type="submit" 
            disabled={loading} 
            style={{
              backgroundColor: 'rgba(14, 0, 174, 0.734)',
              border: 'none',
            }}>
              Create Account
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

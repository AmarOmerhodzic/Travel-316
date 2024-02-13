import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      history('/home');
    }
  }, [history]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/users/login', { email, password });
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      history('/home'); // Redirect to home page
    } catch (error) {
      const errorMessage = error.response && error.response.data.message
        ? error.response.data.message
        : 'Failed to login. Please check your credentials.';
      setError(errorMessage);
    }
  };

  const handleGuest = () => {
    history('/home'); // Redirect to home page
  };

  const handleGoToRegister = () => {
    history('/register');
  };

  return (
    <Container className="login-container">
      <div className="login-box">
        <h2 className="text-center mb-4">Welcome to Tour the World</h2>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100 mb-2">Login</Button>
          <Button variant="outline-primary" onClick={handleGoToRegister} className="w-100 mb-2">Register</Button>
          <Button variant="link" onClick={handleGuest} className="w-100">Continue as Guest</Button>
        </Form>
        {error && <Alert variant="danger" className="mt-3 text-center">{error}</Alert>}
      </div>
    </Container>
  );
};

export default Login;

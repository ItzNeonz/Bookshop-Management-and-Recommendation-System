import React, { useState } from 'react';
import { login } from '../../services/api';
import './LoginModal.css';

const LoginModal = ({ onClose, onLoginSuccess, openRegistrationModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let token = await login(email, password);
      if(token == undefined || token.length == 0){
        alert('Error: Invalid Email or password');
      }
      else{
        localStorage.setItem('x-auth-token', token);
        onLoginSuccess();
        onClose();
      }

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='loginModal'>
      <form onSubmit={handleSubmit} className="loginForm">
        <h2>Login Form</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Submit</button>
        <a href="#register" onClick={openRegistrationModal}>Not Registered? Register Now!</a>
      </form>
      <button onClick={onClose} className='closeButton'>Close</button>
    </div>
  );
};

export default LoginModal;

import React, { useState } from 'react';
import { register } from '../../services/api';
import './RegistrationModal.css';


const RegistrationModal = ({ onClose, onRegistrationSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    try {
      var token = await register(firstName, lastName, email, password);
      if(token == undefined || token.length == 0){
        alert('Error: Registration failed!');
      }
      else{
        localStorage.setItem('x-auth-token', token);
        onRegistrationSuccess();
      }
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="registrationModal">
      <form onSubmit={handleSubmit} className='registrationForm'>
      <h2>Registration Form</h2>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          required
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          required
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button type="submit">Register</button>
      </form>
      <button onClick={onClose} className='regCloseButton'>Close</button>
    </div>
  );
};

export default RegistrationModal;

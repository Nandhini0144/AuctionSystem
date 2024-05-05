// Registration.js

import React, { useState,useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css'
import {DomainContext } from '../App';

const Registration = () => {
  const [name,setName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const url=useContext(DomainContext);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      alert("mail will be sended shortly for verification")
      const response = await axios.post(`${url}/api/user/`, {name,email, password });
      // Assuming your backend returns a token upon successful registration
      const { token } = response.data;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      // Handle token storage or redirection to dashboard here
      console.log('Registration successful, token:', token);
      alert("Registered successfully")
      navigate('/');
    } catch (error) {
      alert("User already exists")
      setError(error.response.data.message);
    }
  };

  return (
    <div className="register-container"> 
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      <form className="register-form" onSubmit={handleSubmit}> 
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Registration;

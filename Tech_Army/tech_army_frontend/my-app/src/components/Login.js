// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import loginImage from '../assets/images.png';


const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
  });

  const { userid, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', { userid, password });
      const { userid: userId, personstatus: personStatus, redirect_url } = response.data;

      // Store the userid and personstatus in local storage
      localStorage.setItem('userid', userId);
      localStorage.setItem('personstatus', personStatus);

      console.log('Stored userid:', userId);
      console.log('Stored personstatus:', personStatus);
      // Redirect to the appropriate dashboard
      if (redirect_url) {
        onLogin(); // Call the onLogin prop to set the logged-in state
        navigate(redirect_url);
      } else {
        console.error('No redirect URL found in the response');
      }
    } catch (error) {
      console.error(error.response?.data || 'Error logging in');
      alert('Error logging in');
    }
  };

  return (
    <div className="login-container">
     <div> <img src={loginImage} alt="Login" /></div>
     <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="userid"
          value={userid}
          onChange={onChange}
          placeholder="User ID"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      </div>
    </div>

  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';  // Import the CSS file

const Register = () => {
  const [formData, setFormData] = useState({
    userid: '',
    name: '',
    email: '',
    phone_number: '',
    personstatus: 'Employee',
    password: '',
  });

  const { userid, name, email, phone_number, personstatus, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register/', formData);
      console.log(response.data);
      alert('Registration successful!');
      setFormData({
        userid: '',
        name: '',
        email: '',
        phone_number: '',
        personstatus: 'Employee',
        password: '',
      }); // Clear the form fields after successful registration
    } catch (error) {
      console.error('There was an error registering the user:', error);
      alert('Registration failed. Please try again.');
    }
  };

  const onClear = () => {
    setFormData({
      userid: '',
      name: '',
      email: '',
      phone_number: '',
      personstatus: 'Employee',
      password: '',
    });
  };

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>User ID</label>
          <input type="text" name="userid" value={userid} onChange={onChange} required />
        </div>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={name} onChange={onChange} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" name="email" value={email} onChange={onChange} required />
        </div>
        <div>
          <label>Phone Number</label>
          <input type="text" name="phone_number" value={phone_number} onChange={onChange} required />
        </div>
        <div>
          <label>Person Status</label>
          <select name="personstatus" value={personstatus} onChange={onChange}>
            <option value="Employee">Employee</option>
            <option value="Lead">Lead</option>
            <option value="Manager">Manager</option>
            <option value="HR">HR</option>
            
          </select>
        </div>
        <div>
          <label>Password</label>
          <input type="password" name="password" value={password} onChange={onChange} required />
        </div>
        <button type="submit">Register</button>
        <button type="button" className="clear-button" onClick={onClear}>Clear</button>
      </form>
    </div>
  );
};

export default Register;

// src/UserForm.js
import React, { useState } from 'react';
import '../App.css';

const UserForm = ({ onSubmit }) => {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // Validation logic, you can customize this based on your requirements
    if (name && email && password) {
      const type = 2;
      const userData = { name, email, password, type };
      console.log("userData =", userData);

      // Make a fetch call to the backend endpoint
      fetch('http://localhost:9000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          alert("Your Account has been registered! Please proceed to login.");
          return response.json();
        })
        .then((data) => {
          // Handle the response data as needed
          console.log('Signup successful:', data);
          onSubmit(userData); // You can use this callback to handle successful signup
        })
        .catch((error) => {
          console.error('Error during signup:', error.message);
        });
    } else {
      alert('Please fill in all the fields.');
    }
  };

  return (
    <div className='landing'>
      <h2>Create Patient Account</h2>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setname(e.target.value)} />
      </label>
      <br /><label>
        Email ID:
        <input type="text" value={email} onChange={(e) => setemail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UserForm;

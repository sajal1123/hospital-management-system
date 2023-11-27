// src/UserForm.js
import React, { useState } from 'react';
import '../App.css';

const UserForm = ({ onSubmit }) => {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [SSN, setSSN] = useState('');
  const [race, setRace] = useState('');
  const [occupation, setOccupation] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const handleSubmit = () => {
    // Validation logic, you can customize this based on your requirements
    if (
      firstName &&
      lastName &&
      age &&
      email &&
      password &&
      SSN
    ) {
      const userData = {
        firstName,
        middleName,
        lastName,
        age,
        gender,
        email,
        password,
        phone,
        address,
        SSN,
        race,
        occupation,
        medicalHistory,
      };

      console.log("your entry = ", userData);


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
          alert('Your Account has been registered! Please proceed to login.');
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
      // console.log("your entry = ", userData);

      alert('Please fill in all the fields.');
    }
  };

  return (
    <div className='landing'>
      <h2>Create Patient Account</h2>
      <label>
        First Name:
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </label>
      <br />
      <label>
        Middle Name:
        <input required='false' type="text" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </label>
      <br />
      <label>
        Age:
        <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
      </label>
      <br />
      <label>
        Gender:
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option default value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>
      <br />
      <label>
        Email ID:
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <label>
        Phone:
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </label>
      <br />
      <label>
        Address:
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
      </label>
      <br />
      <label>
        SSN:
        <input type="text" value={SSN} onChange={(e) => setSSN(e.target.value)} />
      </label>
      <br />
      <label>
        Race:
        <select required='false' value={race} onChange={(e) => setRace(e.target.value)}>
          <option value="white">White</option>
          <option value="black">Black</option>
          <option value="asian">Asian</option>
          <option value="other">Other</option>
        </select>
      </label>
      <br />
      <label>
        Occupation:
        <input required='false' type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
      </label>
      <br />
      <label>
        Medical History:
        <textarea required='false' value={medicalHistory} onChange={(e) => setMedicalHistory(e.target.value)} />
      </label>
      <br />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default UserForm;

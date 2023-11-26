import React, { useState } from 'react';

const UpdateNurseInfo = () => {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = () => {
    // Create request body
    const requestBody = {
      newPhoneNumber,
      newAddress,
    };

    const nurseToken = localStorage.getItem("accessToken")
    const empID = localStorage.getItem("empID")

    // Create headers
    const headers = new Headers();
    headers.append('Authorization', nurseToken)
    headers.append('Content-Type', 'application/json');

    // Create requestOptions
    const requestOptions = {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    };

    // Set loading state to true
    setIsLoading(true);

    // Make API call
    fetch(`http://localhost:9000/api/update-nurse/${empID}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        // Handle success, update UI or show a success message
        console.log('Update Nurse Info Response:', data);
      })
      .catch(error => {
        // Handle error, update UI or show an error message
        console.error('Update Nurse Info Error:', error);
      })
      .finally(() => {
        // Set loading state to false after API call completes
        setIsLoading(false);
      });
  };

  return (
    <div>
      <h2>Update Nurse Information</h2>
      <label htmlFor="newPhoneNumber">New Phone Number:</label>
      <input
        type="text"
        id="newPhoneNumber"
        value={newPhoneNumber}
        onChange={(e) => setNewPhoneNumber(e.target.value)}
      />
      
      <br/>
      <br/>

      <label htmlFor="newAddress">New Address:</label>
      <input
        type="text"
        id="newAddress"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />

      <br/>
      <br/>

      <button onClick={handleUpdate}>Update Nurse Info</button>

      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default UpdateNurseInfo;

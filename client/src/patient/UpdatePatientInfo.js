import React, { useState, useEffect } from 'react';
import NavbarPatient from './navBar';

const UpdatePatientInfo = () => {
  const [patientData, setPatientData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      const patientToken = localStorage.getItem("accessToken");
      const patientEmail = localStorage.getItem("userEmail");

      const myHeaders = new Headers();
      myHeaders.append("Authorization", patientToken);
      myHeaders.append("Content-Type", "application/json");

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch(`http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`, requestOptions);
      const data = await response.json();

      setPatientData(data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = () => {
    // Create request body
    const requestBody = {
      name: patientData.name,
      age: patientData.age,
      phone: patientData.phone,
      address: patientData.address
    };

    const patientToken = localStorage.getItem("accessToken");
    const patientEmail = localStorage.getItem("userEmail");

    // Create headers
    const headers = new Headers();
    headers.append('Authorization', patientToken)
    headers.append('Content-Type', 'application/json');

    // Create requestOptions
    const requestOptions = {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody),
    };

    // Set loading state to true
    setIsLoading(true);

    // Make API call
    fetch(`http://localhost:9000/api/update-patient/${patientEmail}`, requestOptions)
      .then(response => response.json())
      .then(data => {
        // Handle success, update UI or show a success message
        console.log('Update Patient Info Response:', data);
        // Fetch updated data after the update
        fetchData();
        alert("Your Information has been updated!");
      })
      .catch(error => {
        // Handle error, update UI or show an error message
        console.error('Update Patient Info Error:', error);
        alert("Failed to update your information!");
      })
      .finally(() => {
        // Set loading state to false after API call completes
        setIsLoading(false);
      });
  };
  console.log("patientData =", patientData);

  return (
    <div>
      <NavbarPatient />
      <h2>Update Patient Information</h2>
      <label htmlFor="newName">Name:</label>
      <input
        type="text"
        id="newName"
        value={patientData.name || ''}
        onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
      />

      <br />
      <br />

    <label htmlFor="newAge">Age:</label>
    <input
    type="number"
    id="newAge"
    value={patientData.age || ''}
    onChange={(e) => setPatientData({ ...patientData, age: e.target.value })}
    />

    <br />
    <br />

    <label htmlFor="newAddress">Address:</label>
    <input
    type="text"
    id="newAddress"
    value={patientData.address || ''}
    onChange={(e) => setPatientData({ ...patientData, address: e.target.value })}
    />

    <br />
    <br />

    <label htmlFor="newPhone">Phone Number:</label>
    <input
    type="tel"
    id="newPhone"
    value={patientData.phone || ''}
    onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
    />
    <br />
    <br />

      <button onClick={handleUpdate}>Update Patient Info</button>

      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default UpdatePatientInfo;

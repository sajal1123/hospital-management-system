// src/NurseTable.js
import React from 'react';
import './tableStyle.css';

const NurseTable = ({ nurses }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Nurse Email</th>
          <th>Nurse Name</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {nurses.map((nurse) => (
          <tr key={nurse.id}>
            <td>{nurse.email}</td>
            <td>{nurse.name}</td>
            <td>
              <button onClick={() => handleUpdate(nurse.empID)}>Update</button>
              <button onClick={() => handleDelete(nurse.empID)}>Delete</button>
              <button onClick={() => handleView(nurse.empID)}>View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

var adminToken = localStorage.getItem("accessToken");

var myHeaders = new Headers();
myHeaders.append("Authorization", adminToken);
myHeaders.append("Content-Type", "application/json");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

const handleUpdate = (nurseId) => {
  // Add logic for updating nurse details
  console.log(`Update nurse with ID: ${nurseId}`);
};

const handleDelete = (nurseId) => {
  // Add logic for deleting nurse
  console.log(`Delete nurse with ID: ${nurseId}`);
};

const handleView = (nurseId) => {
  // Add logic for updating nurse details
  console.log("nurseID = ", nurseId);
  fetch(`http://localhost:9000/api/get-nurse/?empID=${nurseId}`, requestOptions)
  .then(response => response.json())
  .then(result => console.log(`INFO FOR NURSE ${nurseId} is `, result))
};


export default NurseTable;

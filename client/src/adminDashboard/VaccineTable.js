// src/VaccineTable.js
import React from 'react';
import './tableStyle.css';

const VaccineTable = ({ vaccines }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Vaccine Name</th>
          <th>Company</th>
          <th># of Doses Required</th>
          <th>In Stock</th>
          <th>On Hold</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {vaccines.map((vaccine) => (
          <tr key={vaccine.id}>
            <td>{vaccine.name}</td>
            <td>{vaccine.company}</td>
            <td>{vaccine.dosesRequired}</td>
            <td>{vaccine.inStock}</td>
            <td>{vaccine.onHold}</td>
            <td>
              <button onClick={() => handleUpdate(vaccine.id)}>Update</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const handleUpdate = (vaccineId) => {
  // Add logic for updating vaccine details
  console.log(`Update vaccine with ID: ${vaccineId}`);
};

export default VaccineTable;

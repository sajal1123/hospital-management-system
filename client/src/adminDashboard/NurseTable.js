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
              <button onClick={() => handleUpdate(nurse.id)}>Update</button>
              <button onClick={() => handleDelete(nurse.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const handleUpdate = (nurseId) => {
  // Add logic for updating nurse details
  console.log(`Update nurse with ID: ${nurseId}`);
};

const handleDelete = (nurseId) => {
  // Add logic for deleting nurse
  console.log(`Delete nurse with ID: ${nurseId}`);
};

export default NurseTable;

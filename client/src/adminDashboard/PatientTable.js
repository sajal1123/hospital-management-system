// src/PatientTable.js
import React from 'react';
import './tableStyle.css';

const PatientTable = ({ patients }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Patient Email</th>
          <th>Name</th>
          <th>Upcoming Vaccination Slot</th>
          <th>Vaccination History</th>
        </tr>
      </thead>
      <tbody>
        {patients.map((patient) => (
          <tr key={patient.id}>
            <td>{patient.email}</td>
            <td>{patient.name}</td>
            <td>{patient.upcomingVaccinationSlot}</td>
            <td>{patient.vaccinationHistory}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PatientTable;

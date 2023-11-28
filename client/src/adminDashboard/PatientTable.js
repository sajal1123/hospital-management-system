// src/PatientTable.js
import React from 'react';
import './tableStyle.css';

const PatientTable = ({ patients }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Appointments</th>
          <th>Records</th>
        </tr>
      </thead>
      <tbody>
          {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.phone}</td>
                <td>{patient.address}</td>
                <td>
                  {patient.appointments.map((appointment) => (
                    <div key={appointment.id}>
                      {appointment.timeSlotName} || {appointment.vaccineName}
                    </div>
                  ))}
                </td>
                <td>
                  {patient.records.map((record) => (
                    <div key={record.id}>
                      {record.vaccineName} || {record.nurseName} || {record.vaccinationTime}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default PatientTable;

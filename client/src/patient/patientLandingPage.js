// src/components/PatientLandingPage.js
import React from 'react';
import NavbarPatient from './navBar';
import './patientLandingPage.css';

const PatientLandingPage = () => {
  const patientInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    dosesTaken: 1, // Number of doses taken
    // Add more patient information as needed
  };

  const handleScheduleVaccination = () => {
    // Implement scheduling logic
    console.log('Scheduling vaccination...');
  };

  const handleModifyAppointments = () => {
    // Implement appointment modification logic
    console.log('Modifying appointments...');
  };

  return (
    <div>
      <NavbarPatient />
      <div className="landing-page-content">
        <h2>Welcome, {patientInfo.name}!</h2>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{patientInfo.name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{patientInfo.email}</td>
            </tr>
            <tr>
              <td>Doses Taken:</td>
              <td>{patientInfo.dosesTaken}</td>
            </tr>
            {/* Add more rows for additional patient information */}
          </tbody>
        </table>
        <div className="landing-page-buttons">
          <button onClick={handleScheduleVaccination}>Schedule Vaccination</button>
          <button onClick={handleModifyAppointments}>Modify Appointments</button>
        </div>
      </div>
    </div>
  );
};

export default PatientLandingPage;

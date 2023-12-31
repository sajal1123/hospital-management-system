// src/components/LandingPage.js
import React from 'react';
import NavbarNurse from './navBar.js';
import { useNavigate } from 'react-router-dom';




const NurseLandingPage = () => {
  const navigate = useNavigate();
  const goToSchedules = () => {
    navigate('/employee/schedules')
  }
  const goToRecordVaccine = () => {
    navigate('/employee/record-vaccination')
  }
  return (
    <div>
      <NavbarNurse />
      <div className="landing-page-content">
        <h2>Welcome Nurse!</h2>
        <div className="landing-page-buttons">
          <button onClick={goToSchedules}>My Schedule</button>
          <button onClick={goToRecordVaccine}>Record Vaccines</button>
        </div>
      </div>
    </div>
  );
};

export default NurseLandingPage;

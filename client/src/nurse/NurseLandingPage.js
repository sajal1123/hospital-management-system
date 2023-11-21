// src/components/LandingPage.js
import React from 'react';
import Navbar from './navBar.js';
import { useNavigate } from 'react-router-dom';




const NurseLandingPage = () => {
  const navigate = useNavigate();
  const goToSchedules = () => {
    navigate('/employee/schedules')
  }
  return (
    <div>
      <Navbar />
      <div className="landing-page-content">
        <h2>Welcome Nurse!</h2>
        <div className="landing-page-buttons">
          <button onClick={goToSchedules}>My Schedule</button>
          <button>Record Vaccines</button>
        </div>
      </div>
    </div>
  );
};

export default NurseLandingPage;

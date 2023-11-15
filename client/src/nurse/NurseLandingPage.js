// src/components/LandingPage.js
import React from 'react';
import Navbar from './navBar.js';

const NurseLandingPage = () => {
  return (
    <div>
      <Navbar />
      <div className="landing-page-content">
        <h2>Welcome Nurse!</h2>
        <div className="landing-page-buttons">
          <button>My Schedule</button>
          <button>Record Vaccines</button>
        </div>
      </div>
    </div>
  );
};

export default NurseLandingPage;

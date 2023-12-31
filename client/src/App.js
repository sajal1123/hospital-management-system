// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './landing/LandingPage';
import CreateAccount from './landing/CreateAccount';
import AdminDashboard from './adminDashboard/AdminDashboard';
import NurseLandingPage from './nurse/NurseLandingPage';
import PatientLandingPage from './patient/patientLandingPage';
import Schedules from './nurse/Schedules';
import UpdateNurseInfo from './nurse/UpdateNurseInfo';
import ScheduleVaccination from './patient/ScheduleVaccination';
import RecordVaccination from './nurse/RecordVaccination';
import ModifyAppointment from './patient/ModifyAppointment';
import UpdatePatientInfo from './patient/UpdatePatientInfo';

function App() {
  const handleLogin = (username) => {
    console.log(`Logged in as ${username}`);
    // You can add redirection logic here
  };

  const handleCreateAccount = (userData) => {
    // Make a backend call to '/newAccountCreate' with userData
    console.log('Backend call to /newAccountCreate:', userData);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" element={<LandingPage onLogin={handleLogin} />} />
            <Route path="/create-account" element={<CreateAccount onCreateAccount={handleCreateAccount} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/employee" element={<NurseLandingPage />} />
            <Route path="/patient" element={<PatientLandingPage />} />
            <Route path="employee/schedules" element={<Schedules />} />
            <Route path="/employee/profile" element={<UpdateNurseInfo />} />
            <Route path="/patient/profile" element={<UpdatePatientInfo />} />
            <Route path="/patient/schedule-vaccination" element={<ScheduleVaccination />} />
            <Route path="/employee/record-vaccination" element={<RecordVaccination />} />
            <Route path="/patient/modify-appointment" element={<ModifyAppointment />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;

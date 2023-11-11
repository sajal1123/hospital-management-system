// src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import NurseTable from './NurseTable';
import PatientTable from './PatientTable';
import VaccineTable from './VaccineTable';
import './tableStyle.css';

const AdminDashboard = () => {
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [vaccines, setVaccines] = useState([]);

  const [showNurseTable, setShowNurseTable] = useState(true);
  const [showPatientTable, setShowPatientTable] = useState(true);
  const [showVaccineTable, setShowVaccineTable] = useState(true);

  useEffect(() => {
    // Fetch data for nurses, patients, and vaccines when the component mounts
    // You should replace the fetch calls with your backend API endpoints
    fetch('/api/getNurses')
      .then((response) => response.json())
      .then((data) => setNurses(data));

    fetch('/api/getPatients')
      .then((response) => response.json())
      .then((data) => setPatients(data));

    fetch('/api/getVaccines')
      .then((response) => response.json())
      .then((data) => setVaccines(data));
  }, []);

  const toggleNurseTable = () => setShowNurseTable(!showNurseTable);
  const togglePatientTable = () => setShowPatientTable(!showPatientTable);
  const toggleVaccineTable = () => setShowVaccineTable(!showVaccineTable);

  return (
    <div>
      <h2>Welcome to the Admin Dashboard</h2>

      <div className="table-container">
        <h3>
          Nurse Information
          <button onClick={toggleNurseTable}>
            {showNurseTable ? 'Hide' : 'Show'}
          </button>
        </h3>
        {showNurseTable && <NurseTable nurses={nurses} />}
      </div>

      <div className="table-container">
        <h3>
          Patient Information
          <button onClick={togglePatientTable}>
            {showPatientTable ? 'Hide' : 'Show'}
          </button>
        </h3>
        {showPatientTable && <PatientTable patients={patients} />}
      </div>

      <div className="table-container">
        <h3>
          Vaccine Information
          <button onClick={toggleVaccineTable}>
            {showVaccineTable ? 'Hide' : 'Show'}
          </button>
        </h3>
        {showVaccineTable && <VaccineTable vaccines={vaccines} />}
      </div>
    </div>
  );
};

export default AdminDashboard;

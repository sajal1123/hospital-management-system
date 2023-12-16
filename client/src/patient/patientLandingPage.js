// src/components/PatientLandingPage.js
import React, { useEffect, useState } from 'react';
import NavbarPatient from './navBar';
import { useNavigate } from 'react-router-dom';
import './patientLandingPage.css';




const PatientLandingPage = () => {

  const [patientDetails, setPatientDetails] = useState([]);

  const patientToken = localStorage.getItem("accessToken");
  const patientEmail = localStorage.getItem("userEmail");

  var myHeaders = new Headers();
  myHeaders.append("Authorization", patientToken);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  useEffect(() => {

    const fetchPatientDetails = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`, requestOptions);
        const data = await response.json();
        setPatientDetails(data);
      } catch (error) {
        console.error('Error fetching vaccine options:', error);
      }
    }

    fetchPatientDetails();
  }, [])

  console.log("patientDetails= ", patientDetails);

  const navigate = useNavigate();
  const goToScheduleVaccination = () => {
    navigate('/patient/schedule-vaccination')
  }

  const handleModifyAppointments = () => {
    // Implement appointment modification logic
    navigate('/patient/modify-appointment')
  };

  return (
    <div>
      <NavbarPatient />
      <div className="landing-page-content">
        <h2>Welcome, {patientDetails.name}!</h2>
        <table>
          <tbody>
            <tr>
              <td>Name:</td>
              <td>{patientDetails.name}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{patientDetails.email}</td>
            </tr>
            <tr>
              <td>Age:</td>
              <td>{patientDetails.age}</td>
            </tr>
            <tr>
              <td>Phone Number:</td>
              <td>{patientDetails.phone}</td>
            </tr>
            <tr>
              <td>Address:</td>
              <td>{patientDetails.address}</td>
            </tr>
            {/* <tr>
              <td>Upcoming Appointments:</td>
              <td>
                  {patientDetails.appointments?.forEach((appointment) => (
                    <div key={appointment.id}>
                      {appointment.timeSlotName} || {appointment.vaccineName}
                    </div>
                  ))}
                </td>
                <td>
                  {patientDetails.records?.forEach((record) => (
                    <div key={record.id}>
                      {record.vaccineName} || {record.nurseName} || {record.vaccinationTime}
                    </div>
                  ))}
                </td>
            </tr> */}
            {/* Add more rows for additional patient information */}
          </tbody>
        </table>
        <div className="landing-page-buttons">
          <button onClick={goToScheduleVaccination}>Schedule Vaccination</button>
          <button onClick={handleModifyAppointments}>Modify Appointments</button>
        </div>
      </div>
    </div>
  );
};

export default PatientLandingPage;

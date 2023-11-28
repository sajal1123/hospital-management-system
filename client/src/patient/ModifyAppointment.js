import React, { useState, useEffect } from 'react';

const ModifyAppointment = () => {
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

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
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`, requestOptions);
        const data = await response.json();
        setVaccinationHistory(data.records);
        setUpcomingAppointments(data.appointments);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  const handleCancelAppointment = async (appointmentID) => {
    try {
      // Cancel appointment
      await fetch(`http://localhost:9000/api/cancel-appointment/${appointmentID}`, {
        method: 'DELETE',
        headers: {
            'Authorization': patientToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appointmentID }),
      });

      // Update state to reflect the canceled appointment
      setUpcomingAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== appointmentID)
      );

      console.log('Appointment canceled successfully!');
      // You might want to add some kind of success message or notification
    } catch (error) {
      console.error('Error canceling appointment:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <h2>Vaccination History</h2>
      <ul>
        {vaccinationHistory.map((historyItem) => (
          <li key={historyItem.id}>
            {historyItem.vaccineName} || {historyItem.nurseName} || {historyItem.vaccinationTime}
          </li>
        ))}
      </ul>

      <h2>Upcoming Appointments</h2>
      <ul>
        {upcomingAppointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.timeSlotName} || {appointment.vaccineName} || {appointment.appointmentTime}
            <button onClick={() => handleCancelAppointment(appointment.id)}>Cancel Appointment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModifyAppointment;

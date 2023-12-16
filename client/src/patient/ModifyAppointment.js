import React, { useState, useEffect } from "react";
import NavbarPatient from "./navBar";

const ModifyAppointment = () => {
  const [vaccinationHistory, setVaccinationHistory] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  const patientToken = localStorage.getItem("accessToken");
  const patientEmail = localStorage.getItem("userEmail");

  var myHeaders = new Headers();
  myHeaders.append("Authorization", patientToken);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`,
          requestOptions
        );
        const data = await response.json();
        const formattedHistory = data.records.map((record) => ({
          ...record,
          vaccinationTime: formatDate(record.vaccinationTime),
        }));
        setVaccinationHistory(formattedHistory);
        setUpcomingAppointments(data.appointments);
        console.log("patient = ", data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, []);

  const handleCancelAppointment = async (appointmentID) => {
    try {
      // Cancel appointment
      await fetch(
        `http://localhost:9000/api/cancel-appointment/${appointmentID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: patientToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentID }),
        }
      );

      // Update state to reflect the canceled appointment
      setUpcomingAppointments((prevAppointments) =>
        prevAppointments.filter(
          (appointment) => appointment.id !== appointmentID
        )
      );

      console.log("Appointment canceled successfully!");
      // You might want to add some kind of success message or notification
    } catch (error) {
      console.error("Error canceling appointment:", error);
      // Handle error, show error message, etc.
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
      <NavbarPatient />
      <h2>Vaccination History</h2>
      <table>
        <thead>
          <tr>
            <th>Vaccine</th>
            <th>Dose</th>
            <th>Nurse</th>
            <th>Time of Vaccination</th>
          </tr>
        </thead>
        <tbody>
          {vaccinationHistory.map((historyItem) => (
            <tr key={historyItem.id}>
              <td>{historyItem.vaccineName}</td>
              <td>{historyItem.doses}</td>
              <td>{historyItem.nurseName}</td>
              <td>{historyItem.vaccinationTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Upcoming Appointments</h2>
      <table>
        <thead>
          <tr>
            <th>Time Slot</th>
            <th>Vaccine</th>
            <th>Modify</th>
          </tr>
        </thead>
        <tbody>
          {upcomingAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.timeSlotName}</td>
              <td>{appointment.vaccineName}</td>
              <td>
                <button onClick={() => handleCancelAppointment(appointment.id)}>
                  Cancel Appointment
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ModifyAppointment;

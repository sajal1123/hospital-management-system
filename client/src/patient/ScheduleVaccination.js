import React, { useState, useEffect } from 'react';
import './ScheduleVaccination.css';
const ScheduleVaccinations = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');


  const adminToken = localStorage.getItem("accessToken");

  var myHeaders = new Headers();
  myHeaders.append("Authorization", adminToken);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  // Fetch available appointment times
  useEffect(() => {
    const fetchAvailableTimes = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/availability', requestOptions);
        const data = await response.json();
        setAvailableTimes(data['availableSlots']);
      } catch (error) {
        console.error('Error fetching available times:', error);
      }
    };

    fetchAvailableTimes();
  }, []);

  // Fetch vaccine options
  useEffect(() => {
    const fetchVaccineOptions = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/get-vaccines', requestOptions);
        const data = await response.json();
        setVaccineOptions(data);
        if (data.length > 0) {
            setSelectedVaccine(data[0].VaccineID);
          }
      } catch (error) {
        console.error('Error fetching vaccine options:', error);
      }
    };

    fetchVaccineOptions();
    
  }, []);
  console.log("vaccine options = ", vaccineOptions);

  const handleAppointmentBooking = async () => {
    // Get patientID from localStorage
    console.log("Book Appointment Clocked");
    const patientEmail = localStorage.getItem('userEmail');

    console.log("selectedTime - ", selectedTime);
    console.log("selectedVaxx - ", selectedVaccine);
    console.log("patient Email - ", patientEmail);

    // Validate input
    if (!selectedTime || !patientEmail || !selectedVaccine) {
      console.error('Please fill in all required fields.');
      return;
    }

    // Create appointment data
    const appointmentData = {
      timeSlotID: selectedTime,
      patientEmail,
      vaccineID: selectedVaccine,
    };

    console.log("appointment data = ", appointmentData);

    try {
      // Book appointment
      await fetch('http://localhost:9000/api/book-appointment', {
        method: 'POST',
        headers: {
            'Authorization': adminToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      console.log('Appointment booked successfully!');
      // You might want to add some kind of success message or redirect the user
    } catch (error) {
      console.error('Error booking appointment:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      {/* Left side: Display available appointment times */}
      <div>
        <h2>Available Times</h2>
        <ul>
            {availableTimes.map((time) => (
                <li
                key={time.id}
                onClick={() => setSelectedTime(time.id)}
                className={selectedTime === time.id ? 'selected' : 'unselected'}
                >
                {time.timeSlot}
                </li>
            ))}
        </ul>
      </div>

      {/* Right side: Form for vaccine information and appointment booking */}
      <div>
        <h2>Book Appointment</h2>
        <form>
          <div>
            <label>Vaccine Name:</label>
            <select
              value={selectedVaccine}
              onChange={(e) => setSelectedVaccine(e.target.value)}
            >
              {vaccineOptions.map((vaccine) => (
                <option key={vaccine.VaccineID} value={vaccine.VaccineID}>
                  {vaccine.name}
                </option>
              ))}
            </select>
          </div>
          <br />
          <br />
          <div>
            <button type="button" onClick={handleAppointmentBooking}>
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleVaccinations;

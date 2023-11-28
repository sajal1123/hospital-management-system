import React, { useState, useEffect } from 'react';
import './RecordVaccination.css';

const RecordVaccination = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [doseNumber, setDoseNumber] = useState('');

  const nurseID = localStorage.getItem("empID");
  const adminToken = localStorage.getItem("accessToken");

  var myHeaders = new Headers();
  myHeaders.append("Authorization", adminToken);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };


  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/get-slots', requestOptions);
        const data = await response.json();
        setTimeSlots(data);
        if (data.length > 0) {
            setSelectedTimeSlot(data[0].id);
          }
      } catch (error) {
        console.error('Error fetching time slots:', error);
      }
    };

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

    fetchTimeSlots();
    fetchVaccineOptions();
  }, []);

  const handleVaccinationRecord = async () => {
    // Validate input
    if (!selectedTimeSlot || !patientEmail || !selectedVaccine || !doseNumber) {
      console.error('Please fill in all required fields.');
      return;
    }

    // Create vaccination data
    const vaccinationData = {
      timeSlotID: parseInt(selectedTimeSlot, 10),
      patientEmail,
      vaccineID: parseInt(selectedVaccine, 10),
      doseNumber: parseInt(doseNumber, 10),
      nurseID: nurseID
    };
    console.log("RECORDING VACCINE:");
    console.log("vaxx data = ", vaccinationData);

    try {
      // Record vaccination
      await fetch('http://localhost:9000/api/record-vaccine', {
        method: 'POST',
        headers: {
            'Authorization': adminToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vaccinationData),
      });

      console.log('Vaccination recorded successfully!');
      // You might want to add some kind of success message or redirect the user
    } catch (error) {
      console.error('Error recording vaccination:', error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <div>
      <h2>Record Vaccination</h2>
      <form>
        <div>
          <label>Time Slot:</label>
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
          >
            {timeSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.timeSlot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Patient Email:</label>
          <input
            type="text"
            value={patientEmail}
            onChange={(e) => setPatientEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Vaccine:</label>
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
        <div>
          <label>Dose Number:</label>
          <input
            type="text"
            value={doseNumber}
            onChange={(e) => setDoseNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="button" onClick={handleVaccinationRecord}>
            Record Vaccination
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordVaccination;

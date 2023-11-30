import React, { useState, useEffect } from 'react';
import NavbarPatient from './navBar';
import './ScheduleVaccination.css';
const ScheduleVaccinations = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [patientData, setPatientData] = useState([]);
  const [filteredVaccineOptions, setFilteredVaccineOptions] = useState([]);



  const adminToken = localStorage.getItem("accessToken");
  const patientEmail = localStorage.getItem("userEmail");

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
    
    fetch(`http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`, requestOptions)
      .then(response => response.json())
      .then(patient => setPatientData(patient))
      .catch(error => console.error('Error fetching patient data:', error));

      fetch('http://localhost:9000/api/availability', requestOptions)
        .then(response => response.json())
        .then(data => setAvailableTimes(data['availableSlots']))
        .catch(error => console.error('Error fetching available times:', error));
  
    fetch('http://localhost:9000/api/get-vaccines', requestOptions)

        .then(response => response.json())
        .then(data => {
          setVaccineOptions(data);
          setFilteredVaccineOptions(data);
          if (data.length > 0) {
            setSelectedVaccine(data[0].VaccineID);
          }
        })
        .catch(error => console.error('Error fetching vaccine options:', error));
  
    // const filterVaccineOptions = () => {
    //   try {
    //     if (
    //       patientData &&
    //       patientData.records &&
    //       patientData.records.length > 0 &&
    //       vaccineOptions &&
    //       vaccineOptions.length > 0
    //     ) {
    //       const filteredOptions = vaccineOptions.filter(option =>
    //         patientData.records.some(record => record.vaccineName === option.name)
    //       );
    //       setFilteredVaccineOptions(filteredOptions);
    //     } else {
    //       setFilteredVaccineOptions(vaccineOptions);
    //     }
    //   } catch (error) {
    //     console.error('Error filtering vaccine options:', error);
    //   }
    // };
  
  }, []);
  
  console.log("vaccine options = ", vaccineOptions);
  console.log("patient Data = ", patientData);
  console.log("records = ", patientData.records);
  // console.log("lolz  =  ", patientData.records.some(record => record.vaccineName == "Vaccine 2"));
  // patientData.records.forEach((record) => {
  //   console.log("kdjsgbkjdsgbsdg =", record);
  // });

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
      vaccineID: parseInt(selectedVaccine, 10),
    };

    console.log("appointment data = ", appointmentData);

    try {
      // Book appointment
      let resp = await fetch('http://localhost:9000/api/book-appointment', {
        method: 'POST',
        headers: {
            'Authorization': adminToken,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
    });
    
    if(resp.status != 201){
        alert(await resp.json());
    }else{
        alert("Appointment booked successfully!")
    }

    // You might want to add some kind of success message or redirect the user
    } catch (error) {
        console.error('Error booking appointment:', error);
        // Handle error, show error message, etc.
    }

};

  return (
    <div>
        <NavbarPatient />
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
              {(patientData.records || []).length === 0
                ? vaccineOptions.map((vaccine) => (
                    <option key={vaccine.VaccineID} value={vaccine.VaccineID}>
                      {vaccine.name}
                    </option>
                  ))
                : (patientData.records || []).map((record) => (
                    <option key={record.vaccineName} value={record.vaccineName}>
                      {record.vaccineName}
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

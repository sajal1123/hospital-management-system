import React, { useState, useEffect, useMemo } from "react";
import NavbarPatient from "./navBar";
import "./ScheduleVaccination.css";

const ScheduleVaccinations = () => {
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [vaccineOptions, setVaccineOptions] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState("");
  const [patientData, setPatientData] = useState([]);
  const [filteredVaccineOptions, setFilteredVaccineOptions] = useState([]);

  const adminToken = localStorage.getItem("accessToken");
  const patientEmail = localStorage.getItem("userEmail");

  // Memoizing requestOptions to prevent useEffect from running infinitely
  const requestOptions = useMemo(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", adminToken);
    myHeaders.append("Content-Type", "application/json");

    return {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
  }, [adminToken]);

  useEffect(() => {
    Promise.all([
      fetch(
        `http://localhost:9000/api/get-patient/?patientEmail=${patientEmail}`,
        requestOptions
      ),
      fetch("http://localhost:9000/api/get-vaccines", requestOptions),
    ])
      .then(([patientResponse, vaccineResponse]) =>
        Promise.all([patientResponse.json(), vaccineResponse.json()])
      )
      .then(([patientData, vaccineData]) => {
        setPatientData(patientData);
        setVaccineOptions(vaccineData);

        const combinedVaccineOptions = combineAndFilterVaccineOptions(
          patientData,
          vaccineData
        );

        if (combinedVaccineOptions.length === 0) {
          setFilteredVaccineOptions(vaccineData);
        } else {
          setFilteredVaccineOptions(combinedVaccineOptions);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));

    fetch("http://localhost:9000/api/availability", requestOptions)
      .then((response) => response.json())
      .then((data) => setAvailableTimes(data["availableSlots"]))
      .catch((error) =>
        console.error("Error fetching available times:", error)
      );
  }, [patientEmail, requestOptions]); // Dependencies are patientEmail and requestOptions

  useEffect(() => {
    if (filteredVaccineOptions.length > 0) {
      setSelectedVaccine(filteredVaccineOptions[0].VaccineID);
    }
  }, [filteredVaccineOptions]);

  const combineAndFilterVaccineOptions = (patientData, vaccineData) => {
    const patientVaccines = new Set([
      ...(patientData.appointments || []).map((a) => a.vaccineName),
      ...(patientData.records || []).map((r) => r.vaccineName),
    ]);

    return vaccineData.filter((vaccine) => !patientVaccines.has(vaccine.name));
  };

  const handleAppointmentBooking = async () => {
    console.log("Book Appointment Clicked");
    const patientEmail = localStorage.getItem("userEmail");

    if (!selectedTime || !patientEmail || !selectedVaccine) {
      console.error("Please fill in all required fields.");
      return;
    }

    const appointmentData = {
      timeSlotID: selectedTime,
      patientEmail,
      vaccineID: parseInt(selectedVaccine, 10),
    };

    try {
      let resp = await fetch("http://localhost:9000/api/book-appointment", {
        method: "POST",
        headers: {
          Authorization: adminToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      if (resp.status !== 201) {
        alert(await resp.json());
      } else {
        alert("Appointment booked successfully!");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div>
      <NavbarPatient />
      <div>
        <h2>Available Times</h2>
        <ul>
          {availableTimes.map((time) => (
            <li
              key={time.id}
              onClick={() => setSelectedTime(time.id)}
              className={selectedTime === time.id ? "selected" : "unselected"}
            >
              {time.timeSlot}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Book Appointment</h2>
        <form>
          <div>
            <label>Vaccine Name:</label>
            <select
              value={selectedVaccine}
              onChange={(e) => setSelectedVaccine(e.target.value)}
            >
              {filteredVaccineOptions.map((vaccine) => (
                <option key={vaccine.VaccineID} value={vaccine.VaccineID}>
                  {vaccine.name}
                </option>
              ))}
            </select>
          </div>
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

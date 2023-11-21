import React, { useState, useEffect } from 'react';
import './Schedules.css'; // Import your CSS file for styling

const Schedules = () => {
  // State to manage available time slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // State to manage user-selected time slots
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  // Function to generate available time slots (Sunday from 10 AM to 5 PM, 1-hour slots)
  const generateAvailableTimeSlots = () => {
    const days = ['Sunday'];
    const startHour = 10;
    const endHour = 17;

    const slots = [];

    days.forEach(day => {
      for (let hour = startHour; hour <= endHour; hour++) {
        const time = `${day} ${hour}:00 - ${hour + 1}:00`;
        slots.push({ id: slots.length + 1, time, available: true });
      }
    });

    return slots;
  };

  // Fetch available time slots (replace with your actual API call)
  useEffect(() => {
    // Example API call (replace with your actual endpoint)
    // In this case, we're using the generated time slots
    setAvailableTimeSlots(generateAvailableTimeSlots());
  }, []);

  // Function to handle adding a time slot
  const handleAddTimeSlot = () => {
    // Get the selected time slot from the dropdown
    const selectedSlot = document.getElementById('timeSlotDropdown').value;

    // Update the selected time slots
    setSelectedTimeSlots(prevSlots => [...prevSlots, selectedSlot]);

    // Add your logic for the API call to save the selected time slot
    // Example: fetch('/api/addTimeSlot', { method: 'POST', body: JSON.stringify(selectedSlot) })
    //   .then(response => response.json())
    //   .then(data => console.log('Time slot added successfully:', data))
    //   .catch(error => console.error('Error adding time slot:', error));
  };

  console.log("slotv= ", availableTimeSlots);

  return (
    <div className="schedules-container">
      {/* Column 1: Add Shift */}
      <div className="add-shift-column">
        <h2>Add Shift</h2>
        {/* Calendar-like display of available time slots */}
        <div className="calendar">

          {availableTimeSlots.map(slot => (
            <div key={slot.id} className={`time-slot${slot.available ? 'available' : 'unavailable'}`}>
              {slot.time}
            </div>
          ))}
        </div>
        {/* Dropdown to select time slot */}
        <select id="timeSlotDropdown">
          {availableTimeSlots.map(slot => (
            <option key={slot.id} value={slot.time} disabled={!slot.available}>
              {slot.time}
            </option>
          ))}
        </select>

        {/* Add button */}
        <button onClick={() => handleAddTimeSlot()}>Add</button>
      </div>

      {/* Column 2: Your Schedule */}
      <div className="your-schedule-column">
        <h2>Your Schedule</h2>
        {/* Display user-selected time slots */}
        <ul>
          {selectedTimeSlots.map((slot, index) => (
            <li key={index}>{slot}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Schedules;

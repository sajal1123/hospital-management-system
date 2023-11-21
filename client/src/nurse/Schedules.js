import React, { useState } from 'react';
import './Schedules.css';

const Schedules = () => {
  // State to keep track of selected slots
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Function to handle slot click
  const handleSlotClick = (day, hour) => {
    const slot = `${day}-${hour}`;
    if (selectedSlots.includes(slot)) {
      // If slot is already selected, remove it
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      // If slot is not selected, add it
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  // Function to handle "Clear" button click
  const handleClearClick = () => {
    // Clear all selected slots
    setSelectedSlots([]);
  };

  // Function to add nurse shift (placeholder for future functionality)
  const addNurseShift = () => {
    // Placeholder for saving schedule logic
  };

  // Generate 1-hour slot timings from 9 AM to 5 PM for all 7 days
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 9 }, (_, index) => index + 9); // 9 AM to 5 PM

  return (
    <div className="schedules-container">
      {/* Slot table */}
      <div className="slot-table">
        <table>
          <thead>
            <tr>
              <th></th>
              {days.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hours.map((hour) => (
              <tr key={hour}>
                <td>{hour}:00 - {hour + 1}:00</td>
                {days.map((day) => (
                  <td
                    key={`${day}-${hour}`}
                    onClick={() => handleSlotClick(day, hour)}
                    className={`slot-cell ${selectedSlots.includes(`${day}-${hour}`) ? 'selected' : ''}`}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Your schedules section */}
      <div className="your-schedules">
        <button onClick={addNurseShift}>
          {"Save Schedule"}
        </button>
        <button onClick={handleClearClick} className="clear-button">
          {"Clear"}
        </button>
        <h2>Your Schedules</h2>
        <ul>
          {selectedSlots.map((slot) => {
            const [day, startHour] = slot.split('-');
            const endHour = parseInt(startHour) + 1;
            return (
              <li key={slot} className="selected-slot">
                {`${day}, ${startHour}:00 - ${endHour}:00`}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Schedules;

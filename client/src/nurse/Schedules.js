import React, { useEffect, useState } from 'react';
import './Schedules.css';

const Schedules = () => {
  // State to keep track of selected slots
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availability, setAvailability] = useState([]);

  // Function to handle slot click
  const handleSlotClick = (day, hour, id) => {
    const slot = `${day}-${hour}-${id}`;
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

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InBwcC5kb2VAZXhhbXBsZS5jb20iLCJ0eXBlIjoxLCJpYXQiOjE3MDAwMTM3NDN9.csWYN9BrPm66BVqxhtPPRJ8GLLhMYbLQZCufo8GRnPo");
    myHeaders.append("Cookie", "your-cookie");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:9000/api/get-slots", requestOptions)
      .then(response => response.json())
      .then(result => {
        const availabilityByDay = result.reduce((acc, slot) => {
          const day = slot.timeSlot.split('-')[0]; // Extract day from timeSlot
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(slot);
          return acc;
        }, {});

        // Convert the object to an array
        const availabilityArray = Object.entries(availabilityByDay).map(([day, slots]) => ({
          day,
          slots
        }));

        setAvailability(availabilityArray);
      })
      .catch(error => console.log('error', error));
  }, []);

  // Function to add nurse shift (placeholder for future functionality)
  const addNurseShift = () => {
    // Post request /book-slots, JSON body {"email": "xyz@abc.com", "slots": [slotID1, slotID2, slotID3, ...]}
    // Prepare the data for the POST request

    let slotIDs = [];
    let email = localStorage.getItem("userEmail");
    console.log("selectedSlots = ", selectedSlots);

    for (let i = 0; i < selectedSlots.length; i++) {
      console.log(selectedSlots[i])
      slotIDs.push(parseInt(selectedSlots[i].split('-')[2]));
    }

    console.log("slot IDS= ", slotIDs);
    const data = {
      email,
      slots: slotIDs,
    };

    // Send a POST request to the '/book-slots' endpoint
    fetch("http://localhost:9000/api/book-slots", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response as needed
        console.log("Booking response:", result);
      })
      .catch(error => console.error('Error booking slots:', error));

  };

  // Generate 1-hour slot timings from 9 AM to 5 PM for all 7 days
  const days = ['Monday', 'Tuesday', 'Wednesday'];
  const hours = Array.from({ length: 7 }, (_, index) => index + 10); // 10 AM to 5 PM

  return (
    <div className="schedules-container">
      {/* Slot table */}
      <div className="slot-table">
        <table>
          <thead>
            <tr>
              <th></th>
              {hours.map((hour) => (
                <th key={hour}>{hour}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availability.map((timeslot) => (
              <tr key={timeslot.day}>
                <td>{timeslot.day}</td>
                {hours.map((hour) => (
                  <td
                    key={hour}
                  // onClick={() => handleSlotClick(timeslot.day, hour, timeslot.id)}

                  >
                    {timeslot.slots
                      .filter((slot) => {
                        const slotHour = slot.timeSlot.split('-')[4].split(':')[0];
                        return timeslot.day === slot.timeSlot.split('-')[0] && parseInt(slotHour) === hour;
                      })
                      .map((slot) => (
                        <div key={slot.id} onClick={() => handleSlotClick(timeslot.day, hour, slot.id)}
                          className={selectedSlots.includes(`${timeslot.day}-${hour}-${slot.id}`) ? 'selected-slot' : ''}
                        >{12 - slot.numberOfNurses}</div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Your schedules section */}
      <div className="your-schedules">
        <h2>Your Schedules</h2>
        <button onClick={addNurseShift}>
          {"Save Schedule"}
        </button>
        <button onClick={handleClearClick} className="clear-button">
          {"Clear"}
        </button>
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

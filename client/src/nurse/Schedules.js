import React, { useEffect, useState } from 'react';
import NavbarNurse from './navBar';
import './Schedules.css';

const Schedules = () => {
  // State to keep track of selected slots
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [currentShifts, setCurrentShifts] = useState([]);
  const [timeSlotMap, setTimeslotMap] = useState([]);

  const accessToken = localStorage.getItem("accessToken");


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

  const handleClearSlot = (slot, index) => {
    const updatedCurrentShifts = [...currentShifts];
    updatedCurrentShifts.splice(index, 1);
    setCurrentShifts(updatedCurrentShifts);
    // deletionList.push(slot);
    deleteNurseShift(slot);
  };

  const isSlotBooked = (day, hour, id) => {
    const slot = `${day}-${hour}-${id}`;
    return timeSlotMap.hasOwnProperty(slot);
  };

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Cookie", "your-cookie");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };



    fetch("http://localhost:9000/api/get-slots", requestOptions)
      .then(response => response.json())
      .then(result => {
        // console.log("result of get-slots -> ", result);
        var timeslotHashmap = {};
        const availabilityByDay = result.reduce((acc, slot) => {
          const day = slot.timeSlot.split(' ')[0].split('-')[3]; // Extract day from timeSlot
          if (!acc[day]) {
            acc[day] = [];
          }
          acc[day].push(slot);

          if(!timeslotHashmap[slot.timeSlot]){
            timeslotHashmap[slot.timeslot] = -1;
          }
          timeslotHashmap[slot.timeSlot] = slot.id;
          return acc;
        }, {});

        setTimeslotMap(timeslotHashmap);

        // console.log("availab by day = ", availabilityByDay);

        // Convert the object to an array
        const availabilityArray = Object.entries(availabilityByDay).map(([day, slots]) => ({
          day,
          slots
        }));

        setAvailability(availabilityArray);

        let currentSlots = [];
        var nurseId = localStorage.getItem("empID");

        fetch(`http://localhost:9000/api/get-nurse/?empID=${nurseId}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          console.log("result  = ", result);
          for(let i=0; i<result.shifts.length; i++){
            currentSlots.push(result.shifts[i]);
          }

          setCurrentShifts(currentSlots);
        })


      })
      .catch(error => console.log('error', error));
  }, []);

  console.log("CURRENT SHIFTS = ", currentShifts);

  console.log("AVAL ARRAY = ", availability);

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
      timeSlotIDs: slotIDs,
    };

    // Send a POST request to the '/book-slots' endpoint
    fetch("http://localhost:9000/api/book-slots", {
      method: 'POST',
      headers: {
        'Authorization': accessToken,
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

      window.location.reload();
  
    };
  
  const deleteNurseShift = (toBeDeleted) => {
    // setToBeDeleted(deletionList);

    var deleteBody = {
      email: localStorage.getItem("userEmail"),
      timeSlotIDs: [timeSlotMap[toBeDeleted]],
    }

    var myHeaders = new Headers();
    myHeaders.append("Authorization", accessToken);
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'POST',
      headers: myHeaders, 
      body: JSON.stringify(deleteBody),
      redirect: 'follow'
    };

    
    fetch('http://localhost:9000/api/cancel-slots', requestOptions)
    .then(response => response.json())
    .then(result => {
      console.log(deleteBody, "has been deleted.");
    })
    .catch(error => console.error('Error deleting slots', error));

    window.location.reload();
  }

  // Generate 1-hour slot timings from 9 AM to 5 PM for all 7 days
  const days = ['Monday', 'Tuesday', 'Wednesday'];
  const hours = Array.from({ length: 7 }, (_, index) => index + 8); // 10 AM to 5 PM

  return (
    <div>
     <NavbarNurse /> 
    <div className="schedules-container">
      <div className="slot-table">
        <table>
          <thead>
            <tr>
              <th></th>
              {hours.map((hour) => (
                <th key={hour}>{hour + '-' + parseInt(hour + 1)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availability.map((timeslot) => (
              <tr key={timeslot.day}>
                <td>{timeslot.day}</td>
                {hours.map((hour) => (
                  <td key={hour}>
                    {timeslot.slots
                      .filter((slot) => {
                        const slotHour = slot.timeSlot.split(' ')[1].split('-')[0].split(':')[0];
                        return timeslot.day === slot.timeSlot.split(' ')[0].split('-')[3] && parseInt(slotHour) === hour;
                      })
                      .map((slot) => (
                        <div
                          key={slot.id}
                          onClick={() => handleSlotClick(timeslot.day, hour, slot.id)}
                          className={`${
                            selectedSlots.includes(`${timeslot.day}-${hour}-${slot.id}`)
                              ? 'selected-slot'
                              : isSlotBooked(timeslot.day, hour, slot.id)
                              ? 'booked-slot'
                              : ''
                          }`}
                        >
                          {12 - slot.numberOfNurses}
                        </div>
                      ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="your-schedules">
        <h2>Add Shifts</h2>
        <button onClick={addNurseShift}>{"Save Schedule"}</button>
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

      <div className="your-schedules">
        <h2>Your Current Schedule</h2>
        <ul>
          {currentShifts.map((slot, index) => (
            <li key={index} className="selected-slot">
              {`${slot}`}
              <button onClick={() => handleClearSlot(slot, index)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Schedules;
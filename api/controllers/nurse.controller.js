const db = require("../models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const registerNurse = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can register a nurse");
    }
    const {
      firstName,
      middleName,
      lastName,
      age,
      gender,
      email,
      password,
      phone,
      address,
    } = req.body;

    // Check if the empID or email already exists
    const nurseExists = await db.Nurse.findOne({
      where: { email },
    });

    if (nurseExists) {
      return res
        .status(400)
        .json("Nurse with the same empID or email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 15);
    const uniqueString = crypto.randomBytes(4).toString("hex");
    const empID = `${firstName}-${uniqueString}`;

    await db.User.create({
      name: firstName + middleName + lastName,
      email,
      password: hashedPassword,
      type: 1,
    });

    // Create the Nurse record
    await db.Nurse.create({
      empID,
      firstName,
      middleName,
      lastName,
      age,
      gender,
      email,
      phone,
      address,
    });

    return res.status(200).json("Nurse registration successful");
  } catch (err) {
    console.error(err);

    return res.status(500).json("Error in registering nurse");
  }
};

const updateNurse = async (req, res) => {
  try {
    if (req.authPayload.type != 0 && req.authPayload.type != 1) {
      return res.status(403).json("Only Admin can register a nurse");
    }

    const { empID } = req.params; // Assuming empID is passed as a URL parameter
    const { name, age, gender, email, phone, address, newPassword } = req.body;

    // Check if the nurse exists
    const nurse = await db.Nurse.findOne({ where: { empID } });
    if (!nurse) {
      return res.status(404).json("Nurse not found");
    }

    // Update information
    let updatedData = {};
    if (name) updatedData.name = name;
    if (age) updatedData.age = age;
    if (gender) updatedData.gender = gender;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (address) updatedData.address = address;

    // If there's a new password, hash it before updating
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 15);
      updatedData.password = hashedPassword;
    }

    // Perform the update
    await db.Nurse.update(updatedData, { where: { empID } });

    return res.status(200).json("Nurse information updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in updating nurse information");
  }
};

const deleteNurse = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can register a nurse");
    }
    const { empID } = req.params;

    const nurse = await db.Nurse.findOne({ where: { empID } });
    if (!nurse) {
      return res.status(404).json("Nurse not found");
    }

    await db.Nurse.destroy({ where: { empID } });

    return res.status(200).json("Nurse deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in deleting nurse");
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    if (req.authPayload.type !== 1) {
      // Use strict equality for type comparison
      return res.status(403).json("Only Nurse can schedule a slot");
    }

    const daysToAdd = 7; // Look for slots for 7 days starting today
    const slotsPerDay = 7; // 7 time slots each day
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = new Date();

    let schedulesToCreate = [];

    for (let i = 0; i < daysToAdd; i++) {
      const dateStr = new Date(currentDay);
      dateStr.setDate(dateStr.getDate() + i); // Increment the day for each loop iteration
      const dateString = dateStr.toISOString().slice(0, 10); // Format as YYYY-MM-DD
      const dayName = dayNames[dateStr.getDay()];

      for (let j = 0; j < slotsPerDay; j++) {
        const timeStart = `${j + 8}:00`; // Assuming the slots start at 8 AM
        const timeEnd = `${j + 9}:00`; // Assuming each slot is 1 hour long
        const timeSlot = `${dayName}-${dateString} ${timeStart}-${timeEnd}`;

        const existingSlot = await db.Schedule.findOne({
          where: { timeSlot: timeSlot },
        });

        if (!existingSlot) {
          schedulesToCreate.push({
            timeSlot: timeSlot,
            numberOfNurses: 0,
            capacity: 0, // Set capacity for each slot if needed
            bookings: 0,
          });
        }
      }
    }

    if (schedulesToCreate.length > 0) {
      // Bulk create the missing slots in the database
      await db.Schedule.bulkCreate(schedulesToCreate);
    }

    // Retrieve the list of schedules where the number of nurses is less than capacity
    const schedules = await db.Schedule.findAll({
      where: {
        numberOfNurses: { [db.Sequelize.Op.lt]: 13 },
        // Ensure only future slots are fetched
        timeSlot: {
          [db.Sequelize.Op.gte]: new Date()
            .toISOString()
            .slice(0, 16)
            .replace("T", " "),
        },
      },
      order: [["timeSlot", "ASC"]], // Order by time slot
    });

    return res.status(200).json(schedules);
  } catch (err) {
    console.error("Error in getting available slots:", err);
    return res.status(500).json("Error in scheduling slot");
  }
};

module.exports = { getAvailableSlots };

const bookSlots = async (req, res) => {
  try {
    const { email, timeSlotIDs } = req.body;

    // Query the Nurse table to get the empID associated with the email
    const nurse = await db.Nurse.findOne({
      where: { email },
    });

    // Check if the nurse exists
    if (!nurse) {
      return res.status(404).json("Nurse not found with the given email");
    }

    const empID = nurse.empID;

    for (const timeSlotID of timeSlotIDs) {
      // Create a record in the NurseShifts table
      await db.NurseShifts.create({
        NurseID: empID,
        TimeSlotID: timeSlotID,
      });

      // Fetch the Schedule record for the current timeSlotID
      const scheduleRecord = await db.Schedule.findOne({
        where: { id: timeSlotID },
      });

      if (scheduleRecord) {
        console.log("Here");
        // Increment the existing number of nurses
        const updatedNursesCount = scheduleRecord.numberOfNurses + 1;

        // Calculate the new capacity
        const updatedCapacity = Math.min(10 * updatedNursesCount, 100);

        // Update the Schedule record with the new values
        await db.Schedule.update(
          {
            numberOfNurses: updatedNursesCount,
            capacity: updatedCapacity,
          },
          {
            where: { id: timeSlotID },
          }
        );
      }
    }

    return res.status(200).json("Slot booking successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in booking slot");
  }
};

const cancelSlots = async (req, res) => {
  try {
    const { email, timeSlotIDs } = req.body;
    const nurse = await db.Nurse.findOne({
      where: { email },
    });

    if (!nurse) {
      return res.status(404).json("Nurse not found with the given email");
    }

    const empID = nurse.empID;

    for (const timeSlotID of timeSlotIDs) {
      // Delete the record in the NurseShifts table
      await db.NurseShifts.destroy({
        where: {
          NurseID: empID,
          TimeSlotID: timeSlotID,
        },
      });

      // Fetch the Schedule record for the current timeSlotID
      const scheduleRecord = await db.Schedule.findOne({
        where: { id: timeSlotID },
      });

      if (scheduleRecord && scheduleRecord.numberOfNurses > 0) {
        // Decrement the existing number of nurses
        const updatedNursesCount = scheduleRecord.numberOfNurses - 1;

        // Calculate the new capacity
        const updatedCapacity = Math.max(10 * updatedNursesCount, 0);

        // Update the Schedule record with the new values
        await db.Schedule.update(
          {
            numberOfNurses: updatedNursesCount,
            capacity: updatedCapacity,
          },
          {
            where: { id: timeSlotID },
          }
        );
      }
    }

    return res.status(200).json("Slot cancellation successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in cancelling slot");
  }
};

module.exports = {
  registerNurse,
  updateNurse,
  deleteNurse,
  getAvailableSlots,
  bookSlots,
  cancelSlots,
};

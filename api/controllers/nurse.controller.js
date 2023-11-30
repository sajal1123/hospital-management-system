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
    console.log(req.body);
    // Check if the nurse exists
    const nurse = await db.Nurse.findOne({ where: { empID } });
    if (!nurse) {
      return res.status(404).json("Nurse not found");
    }

    // Update information
    let updatedData = {};
    if (name) {
      const splitArr = name.split(" ");
      let middleName, firstName, lastName;
      if (splitArr.length == 3) {
        firstName = splitArr[0];
        middleName = splitArr[1];
        lastName = splitArr[2];
      } else {
        firstName = splitArr[0];
        lastName = splitArr[1];
      }
      console.log(firstName, middleName, lastName);
      if (firstName) updatedData.firstName = firstName;
      if (middleName) updatedData.middleName = middleName;
      if (lastName) updatedData.lastName = lastName;
    }
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
    console.log(updatedData, empID);
    await db.Nurse.update(updatedData, { where: { empID: empID } });

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
    console.log(currentDay);
    let schedulesToCreate = [];

    for (let i = 0; i < daysToAdd; i++) {
      const dateStr = new Date(currentDay);
      dateStr.setDate(dateStr.getDate() + i); // Increment the day for each loop iteration

      for (let j = 0; j < slotsPerDay; j++) {
        const timeStartHour = j + 8; // Assuming the slots start at 8 AM
        // Create a new Date object for the specific time slot
        const timeSlotDate = new Date(
          dateStr.getFullYear(),
          dateStr.getMonth(),
          dateStr.getDate(),
          timeStartHour - 6
        );

        // Format timeSlot string
        const timeSlotString = `${timeSlotDate.toISOString().slice(0, 10)}-${
          dayNames[timeSlotDate.getDay()]
        } ${timeStartHour}:00-${timeStartHour + 1}:00`;

        const existingSlot = await db.Schedule.findOne({
          where: { timeSlot: timeSlotString },
        });

        if (!existingSlot) {
          schedulesToCreate.push({
            timeSlot: timeSlotString,
            numberOfNurses: 0,
            capacity: 0,
            bookings: 0,
            time: timeSlotDate.toISOString(), // Set the time field in ISO 8601 format
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
      order: [["id", "ASC"]], // Order by time slot
    });

    return res.status(200).json(schedules);
  } catch (err) {
    console.error("Error in getting available slots:", err);
    return res.status(500).json("Error in scheduling slot");
  }
};

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
      // Check if the slot has already been booked by the same nurse
      const existingBooking = await db.NurseShifts.findOne({
        where: {
          NurseID: empID,
          TimeSlotID: timeSlotID,
        },
      });

      if (existingBooking) {
        // Skip this slot as it's already booked by the same nurse
        continue;
      }

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

const getNurseInfo = async (req, res) => {
  try {
    if (req.authPayload.type !== 0 && req.authPayload.type !== 1) {
      return res.status(403).json("Unauthorized access");
    }

    const empID = req.query.empID;
    if (!empID) {
      return res.status(400).json("Employee ID is required");
    }

    const nurse = await db.Nurse.findOne({
      where: { empID: empID },
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: db.NurseShifts,
          as: "shifts",
          include: [
            {
              model: db.Schedule,
              as: "timeSlot",
              attributes: ["timeSlot"], // Include only the timeSlot string
            },
          ],
        },
      ],
      attributes: [
        "empID",
        "email",
        "firstName",
        "middleName",
        "lastName",
        "phone",
        "gender",
        "address",
        "age",
      ],
    });

    if (!nurse) {
      return res.status(404).json("Nurse not found");
    }

    const nurseInfo = {
      empID: nurse.empID,
      name: nurse.user
        ? nurse.firstName + " " + nurse.middleName + " " + nurse.lastName
        : null,
      email: nurse.email,
      address: nurse.address,
      phone: nurse.phone,
      gender: nurse.gender,
      age: nurse.age,
      shifts: nurse.shifts.map((shift) =>
        shift.timeSlot ? shift.timeSlot.timeSlot : null
      ),
    };

    res.status(200).json(nurseInfo);
  } catch (error) {
    console.error("Error fetching nurse info:", error);
    res.status(500).send("Error fetching nurse information");
  }
};

const recordVaccine = async (req, res) => {
  try {
    if (req.authPayload.type !== 1) {
      return res
        .status(403)
        .json("Unauthorized access. Only Nurse can make a record entry!");
    }

    const { nurseID, patientEmail, vaccineID } = req.body;

    // Check if the patient exists
    const patientRecord = await db.Patient.findOne({
      where: { email: patientEmail },
    });

    if (!patientRecord) {
      return res.status(404).json("Patient not found");
    }

    const patientID = patientRecord.ID;

    // Fetch and update the specific appointment matching the patient and vaccine
    const appointment = await db.Appointment.findOne({
      where: { PatientID: patientID, VaccineID: vaccineID, Completed: 0 },
    });

    if (!appointment) {
      return res
        .status(404)
        .json(
          "No pending appointment found for the patient with the specified vaccine"
        );
    }

    await appointment.update({ Completed: 1 });
    const { TimeSlotID } = appointment;

    // Determine the dose number
    const existingRecordsCount = await db.Record.count({
      where: { PatientID: patientID, VaccineID: vaccineID },
    });
    const doseNumber = existingRecordsCount + 1;

    // Create a record in the Record table
    const newRecord = await db.Record.create({
      PatientID: patientID,
      NurseID: nurseID,
      VaccineID: vaccineID,
      TimeSlotID: TimeSlotID,
      DoseNumber: doseNumber,
    });

    const vaccine = await db.Vaccine.findOne({
      where: { VaccineID: vaccineID },
    });
    if (vaccine) {
      await vaccine.decrement(["onHold", "inStock"], { by: 1 });
    }

    return res
      .status(201)
      .json({ message: "Record created successfully", newRecord });
  } catch (error) {
    console.error("Error in recording vaccine:", error);
    return res.status(500).json("Error in recording vaccine");
  }
};

module.exports = {
  registerNurse,
  updateNurse,
  deleteNurse,
  getAvailableSlots,
  bookSlots,
  cancelSlots,
  getNurseInfo,
  recordVaccine,
};

const { response } = require("express");
const db = require("../models/index");
const bcrypt = require("bcrypt");

const updatePatient = async (req, res) => {
  try {
    if (req.authPayload.type !== 2) {
      // Use strict equality check
      return res
        .status(403)
        .json("Only Admin can update a patient's information");
    }

    const { email } = req.params; // Assuming email is passed as a URL parameter
    const {
      name,
      age,
      gender,
      password,
      phone,
      address,
      SSN,
      race,
      occupation,
      medicalHistory,
    } = req.body;

    // Start a transaction
    const transaction = await db.sequelize.transaction();

    try {
      // Update information in the User table first
      const userUpdateData = {};
      if (name) userUpdateData.name = name;
      if (email) userUpdateData.email = email;

      // If there's a new password, hash it before updating
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        userUpdateData.password = hashedPassword;
      }

      await db.User.update(userUpdateData, { where: { email }, transaction });

      // Update information in the Patient table
      const patientUpdateData = {};
      if (age) patientUpdateData.age = age;
      if (gender) patientUpdateData.gender = gender;
      if (address) patientUpdateData.address = address;
      if (SSN) patientUpdateData.SSN = SSN;
      if (race) patientUpdateData.race = race;
      if (occupation) patientUpdateData.occupation = occupation;
      if (medicalHistory) patientUpdateData.medicalHistory = medicalHistory;
      if (phone) patientUpdateData.phone = phone;

      // Split the name into first, middle, and last names
      if (name) {
        const names = name.split(" ");
        patientUpdateData.firstName = names[0];
        patientUpdateData.middleName = names.length === 3 ? names[1] : "";
        patientUpdateData.lastName =
          names.length > 1 ? names[names.length - 1] : "";
      }

      await db.Patient.update(patientUpdateData, {
        where: { email },
        transaction,
      });

      // Commit the transaction
      await transaction.commit();

      return res.status(200).json("Patient information updated successfully");
    } catch (error) {
      // If an error occurred, rollback the transaction
      await transaction.rollback();
      throw error;
    }
  } catch (err) {
    console.error("Error in updating patient information:", err);
    return res.status(500).json("Error in updating patient information");
  }
};

const getAppointment = async (req, res) => {
  try {
    // Current date at the beginning of the day for comparison
    const now = new Date();

    const availableSlots = await db.Schedule.findAll({
      where: {
        // Assuming you have a field for the date or datetime of the schedule
        time: { [db.Sequelize.Op.gte]: now }, // Only from today onwards
        numberOfNurses: { [db.Sequelize.Op.gt]: 0 }, // More than 0 nurses
        [db.Sequelize.Op.and]: db.Sequelize.literal("capacity - bookings > 0"), // Capacity not yet filled
      },
      attributes: ["id", "timeSlot", "numberOfNurses", "capacity", "bookings"],
      order: [["time", "ASC"]], // Order by date ascending
    });

    if (availableSlots.length === 0) {
      return res
        .status(404)
        .json({ message: "No available slots found for booking." });
    }

    // Respond with the available time slots
    res.status(200).json({
      message: "Available slots retrieved successfully.",
      availableSlots,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).send("Error booking appointment");
  }
};

const bookAppointment = async (req, res) => {
  try {
    const { timeSlotID, patientEmail, vaccineID } = req.body;

    // Validate the input
    if (!timeSlotID || !patientEmail || !vaccineID) {
      return res.status(400).json("Missing required fields");
    }

    // Fetch the patientID using the provided email
    const patient = await db.Patient.findOne({
      where: { email: patientEmail },
    });
    if (!patient) {
      return res.status(404).json("Patient not found");
    }
    const patientID = patient.ID;

    // Check if the vaccine exists and is available
    const vaccine = await db.Vaccine.findOne({
      where: { VaccineID: vaccineID },
    });
    if (!vaccine) {
      return res.status(404).json("Vaccine not found");
    }

    // Check if the patient already has an incomplete appointment for the same vaccine
    const existingAppointment = await db.Appointment.findOne({
      where: { PatientID: patientID, VaccineID: vaccineID, Completed: 0 },
    });
    if (existingAppointment) {
      return res
        .status(400)
        .json("Patient has an incomplete appointment for this vaccine");
    }

    // Check if the patient has already taken the required number of doses
    const recordsCount = await db.Record.count({
      where: { PatientID: patientID, VaccineID: vaccineID },
    });
    if (recordsCount >= vaccine.doses) {
      return res
        .status(400)
        .json("Patient has already taken the required number of doses");
    }

    // Check if the timeslot exists and is available
    const timeslot = await db.Schedule.findOne({ where: { id: timeSlotID } });
    if (!timeslot || timeslot.bookings >= timeslot.capacity) {
      return res.status(404).json("Timeslot not available");
    }

    // Check for available vaccine quantity
    if (vaccine.inStock < vaccine.onHold + 1) {
      return res.status(400).json("No available vaccines");
    }

    // Create the appointment
    const newAppointment = await db.Appointment.create({
      TimeSlotID: timeSlotID,
      PatientID: patientID,
      VaccineID: vaccineID,
      Completed: 0, // Assuming default value as 0
    });

    // Update the timeslot's bookings count
    await timeslot.increment("bookings");

    // Increment the onHold field in the Vaccine table
    await vaccine.increment("onHold");

    return res.status(201).json(newAppointment);
  } catch (err) {
    console.error("Error in booking appointment:", err);
    return res.status(500).json("Error in booking appointment");
  }
};

const getPatientInfo = async (req, res) => {
  try {
    console.log(req.query);
    const patientEmail = req.query.patientEmail;

    console.log(patientEmail);
    const patient = await db.Patient.findOne({
      where: { email: patientEmail },
      include: [
        {
          model: db.Appointment,
          as: "appointments",
          required: false,
          where: { Completed: 0 }, // Only include appointments where Completed is 0
          include: [
            {
              model: db.Vaccine,
              as: "vaccine",
              attributes: ["name"],
            },
            {
              model: db.Schedule,
              as: "timeSlot",
              attributes: ["timeSlot"],
            },
          ],
        },
        {
          model: db.Record,
          as: "records",
          required: false,
          include: [
            {
              model: db.Vaccine,
              as: "vaccine",
              attributes: ["name"],
            },
            {
              model: db.Schedule,
              as: "timeSlot",
              attributes: ["timeSlot"],
            },
            {
              model: db.Nurse,
              as: "nurse",
              attributes: ["firstName", "lastName"],
            },
          ],
        },
      ],
      attributes: [
        "ID",
        "firstName",
        "middleName",
        "lastName",
        "email",
        "age",
        "phone",
        "address",
      ],
      order: [
        [{ model: db.Appointment, as: "appointments" }, "updatedAt", "ASC"],
        [{ model: db.Record, as: "records" }, "createdAt", "DESC"],
      ],
    });

    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    const patientInfo = {
      id: patient.ID,
      name: `${patient.firstName} ${patient.middleName} ${patient.lastName}`,
      email: patient.email,
      age: patient.age,
      phone: patient.phone,
      address: patient.address,
      appointments: patient.appointments.map((a) => ({
        id: a.id,
        timeSlotName: a.timeSlot?.timeSlot,
        vaccineName: a.vaccine?.name,
      })),
      records: patient.records.map((r) => ({
        id: r.id,
        timeSlotName: r.timeSlot?.timeSlot,
        vaccinationTime: r.createdAt,
        vaccineName: r.vaccine?.name,
        nurseName: r.nurse?.firstName + ` ` + r.nurse?.lastName,
        doses: r.DoseNumber,
      })),
    };

    res.status(200).json(patientInfo);
  } catch (error) {
    console.error("Error fetching patient info:", error);
    res.status(500).send("Error fetching patient information");
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentID } = req.params;
    console.log("appo ID = ", appointmentID);
    const appointment = await db.Appointment.findOne({
      where: { id: appointmentID },
      include: ["vaccine", "timeSlot"],
    });

    if (!appointment) {
      return res.status(404).json("Appointment not found");
    }

    // Delete the appointment
    await db.Appointment.destroy({ where: { id: appointmentID } });

    // Decrement the onHold count for the associated vaccine
    if (appointment.vaccine) {
      await db.Vaccine.decrement("onHold", {
        where: { VaccineID: appointment.VaccineID },
      });
    }

    // Decrement the bookings count for the associated timeslot
    if (appointment.timeSlot) {
      await db.Schedule.decrement("bookings", {
        where: { id: appointment.TimeSlotID },
      });
    }

    res.status(200).json("Appointment canceled successfully");
  } catch (error) {
    console.error("Error in canceling appointment:", error);
    res.status(500).json("Error in canceling appointment");
  }
};

module.exports = {
  updatePatient,
  getAppointment,
  bookAppointment,
  getPatientInfo,
  cancelAppointment,
};

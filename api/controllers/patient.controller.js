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
    const { timeSlotID, patientID, vaccineID } = req.body;

    // Validate the input
    if (!timeSlotID || !patientID || !vaccineID) {
      return res.status(400).json("Missing required fields");
    }

    // Check if the timeslot exists and is available
    const timeslot = await db.Schedule.findOne({ where: { id: timeSlotID } });
    if (!timeslot || timeslot.bookings >= timeslot.capacity) {
      return res.status(404).json("Timeslot not available");
    }

    // Check if the patient exists
    const patient = await db.Patient.findOne({ where: { id: patientID } });
    if (!patient) {
      return res.status(404).json("Patient not found");
    }

    // Check if the vaccine exists and is available
    const vaccine = await db.Vaccine.findOne({
      where: { VaccineID: vaccineID },
    });
    if (!vaccine) {
      return res.status(404).json("Vaccine not found");
    }

    // Check for available vaccine quantity
    if (vaccine.inStock < vaccine.onHold + 1) {
      return res.status(400).json("No available vaccines");
    }

    const existingAppointment = await db.Appointment.findOne({
      where: {
        PatientID: patientID,
        VaccineID: vaccineID,
        TimeSlotID: timeSlotID,
      },
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json(
          "Appointment already booked for this patient with the selected timeslot and vaccine"
        );
    }

    // Create the appointment
    const newAppointment = await db.Appointment.create({
      TimeSlotID: timeSlotID,
      PatientID: patientID,
      VaccineID: vaccineID,
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

module.exports = {
  updatePatient,
  getAppointment,
  bookAppointment,
};

const db = require("../models/index");

const getNursesInfo = async (req, res) => {
  try {
    if (req.authPayload.type !== 0) {
      return res.status(403).json("Only Admin can view nurse information");
    }

    const nurses = await db.Nurse.findAll({
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
      attributes: ["empID", "email", "firstName", "lastName"],
    });

    const nurseInfo = nurses.map((nurse) => ({
      empID: nurse.empID,
      name: nurse.user.name,
      email: nurse.email,
      shifts: nurse.shifts.map((shift) =>
        shift.timeSlot ? shift.timeSlot.timeSlot : null
      ), // Get the timeSlot string
    }));

    res.status(200).json(nurseInfo);
  } catch (error) {
    console.error("Error fetching nurses info:", error);
    res.status(500).send("Error fetching nurses information");
  }
};

const getVaccinesInfo = async (req, res) => {
  try {
    if (req.authPayload.type !== 0) {
      // Ensure strict equality check
      return res.status(403).json("Only Admin can view nurse information");
    }
    // Fetch all vaccine records from the database
    const vaccines = await db.Vaccine.findAll();

    // Send the vaccine data as a JSON response
    res.status(200).json(vaccines);
  } catch (error) {
    console.error("Error fetching vaccine info:", error);
    res.status(500).send("Error fetching vaccine information");
  }
};

const getNurseInfo = async (req, res) => {
  try {
    // Assuming `type` can only be 0 (Admin) or 1 (Nurse)
    // and `empID` is provided as a URL parameter
    if (!(req.authPayload.type === 0 || req.authPayload.type === 1)) {
      return res
        .status(403)
        .json("Only Admin and Nurse can view nurse information");
    }

    // Assuming the empID is passed as a parameter in the URL
    const empID = req.query.empID;
    // console.log(req);
    if (!empID) {
      return res.status(400).json("Employee ID is required");
    }

    const nurse = await db.Nurse.findOne({
      where: { empID: empID },
      //   include: [
      //     {
      //       model: db.User,
      //       as: "user",
      //       attributes: ["name", "email", "type"], // Include user details you want to fetch
      //     },
      //   ],
    });

    if (!nurse) {
      return res.status(404).json("Nurse not found");
    }

    // Respond with the nurse information
    return res.status(200).json(nurse);
  } catch (error) {
    console.error("Error fetching nurse info:", error);
    return res.status(500).json("Error fetching nurse information");
  }
};

const getVaccineInfo = async (req, res) => {
  try {
    if (!(req.authPayload.type === 0 || req.authPayload.type === 1)) {
      return res
        .status(403)
        .json("Only Admin and Nurse can view nurse information");
    }

    const vaccineID = req.query.VaccineID;
    // console.log(req);
    if (!vaccineID) {
      return res.status(400).json("Vaccine ID is required");
    }

    const vaccine = await db.Vaccine.findOne({
      where: { VaccineID: vaccineID },
      //   include: [
      //     {
      //       model: db.User,
      //       as: "user",
      //       attributes: ["name", "email", "type"], // Include user details you want to fetch
      //     },
      //   ],
    });

    if (!vaccine) {
      return res.status(404).json("Vaccine not found");
    }

    return res.status(200).json(vaccine);
  } catch (error) {
    console.error("Error fetching nurse info:", error);
    return res.status(500).json("Error fetching nurse information");
  }
};

const getPatientsInfo = async (req, res) => {
  try {
    const patients = await db.Patient.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["name", "email"],
        },
        {
          model: db.Appointment, // Make sure this matches the model name defined in your associations
          as: "appointments", // Use the alias defined in Patient.associate
          required: false,
        },
        {
          model: db.Record, // Assuming you have a Record model with an association to Patient
          as: "records", // Use the alias defined in Patient.associate
          required: false,
        },
      ],
      attributes: {
        exclude: ["password"], // Exclude sensitive information
      },
      order: [
        ["lastName", "ASC"],
        ["firstName", "ASC"],
        [{ model: db.Appointment, as: "appointments" }, "updatedAt", "ASC"],
        [{ model: db.Record, as: "records" }, "createdAt", "DESC"],
      ],
    });

    const patientInfo = patients.map((patient) => ({
      id: patient.ID,
      name: `${patient.firstName} ${patient.lastName}`,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      appointments: patient.appointments.map((a) => ({
        // Extract the appointment details you need, for example:
        appointmentDate: a.appointmentDate,
        // ... other appointment fields
      })),
      records: patient.records.map((r) => ({
        // Extract the record details you need, for example:
        visitDate: r.createdAt,
        // ... other record fields
      })),
    }));

    res.status(200).json(patientInfo);
  } catch (error) {
    console.error("Error fetching patients info:", error);
    res.status(500).send("Error fetching patients information");
  }
};

module.exports = {
  getNursesInfo,
  getVaccinesInfo,
  getNurseInfo,
  getVaccineInfo,
  getPatientsInfo,
};

const db = require("../models/index");

const getNursesInfo = async (req, res) => {
  try {
    if (req.authPayload.type !== 0) {
      // Ensure strict equality check
      return res.status(403).json("Only Admin can view nurse information");
    }

    const nurses = await db.Nurse.findAll({
      include: [
        {
          model: db.User,
          as: "user",
          attributes: ["name", "email"], // Include 'email' to debug
        },
      ],
      attributes: ["empID", "email"], // Include 'empID' for the response
    });

    // Use .map to create a new array of nurse information
    // console.log(nurses);
    const nurseInfo = nurses.map((nurse) => ({
      name: nurse.user.name,
      email: nurse.email,
      empID: nurse.empID,
    }));

    // Send the nurseInfo array as a JSON response
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

module.exports = {
  getNursesInfo,
  getVaccinesInfo,
  getNurseInfo,
  getVaccineInfo,
};

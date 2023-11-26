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

module.exports = { getNursesInfo, getVaccinesInfo };

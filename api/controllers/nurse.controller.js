const db = require("../models/index");
const bcrypt = require("bcrypt");

const registerNurse = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can register a nurse");
    }
    const { empID, name, age, gender, email, password, phone, address } =
      req.body;

    // Check if the empID or email already exists
    const nurseExists = await db.Nurse.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ empID }, { email }],
      },
    });

    if (nurseExists) {
      return res
        .status(400)
        .json("Nurse with the same empID or email already exists");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 15);

    // Create the Nurse record
    await db.Nurse.create({
      empID,
      name,
      age,
      gender,
      email,
      phone,
      address,
    });

    await db.User.create({
      name,
      email,
      password: hashedPassword,
      type: 1,
    });

    return res.status(200).json("Nurse registration successful");
  } catch (err) {
    console.error(err);
    g;
    return res.status(500).json("Error in registering nurse");
  }
};

const updateNurse = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can register a nurse");
    }

    const { empID } = req.params; // Assuming empID is passed as a URL parameter
    const { name, age, gender, email, newPassword } = req.body;

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

module.exports = { registerNurse, updateNurse, deleteNurse };

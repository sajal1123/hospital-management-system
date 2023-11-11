const db = require("../models/index");
const bcrypt = require("bcrypt");

const registerNurse = async (req, res) => {
  try {
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
      password: hashedPassword,
      phone,
      address,
    });

    return res.status(200).json("Nurse registration successful");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in registering nurse");
  }
};

module.exports = { registerNurse };

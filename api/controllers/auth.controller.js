const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, type } = req.body;
    // Check if the email exists
    const userExists = await db.User.findOne({
      where: { email },
    });
    if (userExists) {
      return res
        .status(400)
        .send("Email is already associated with an account");
    }

    await db.User.create({
      name,
      email,
      password: await bcrypt.hash(password, 15),
      type,
    });

    return res.status(200).send("Registration successful");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error in registering user");
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    console.log(email, password, userType);

    // Find the user by email
    const user = await db.User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json("Email not found");
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res.status(404).json("Incorrect email and password combination");
    }

    // Fetch the empID from the Nurses table
    console.log(user);
    let empID = null;

    if (
      (user.type === 1 && userType != "employee") ||
      (user.type === 2 && userType != "patient")
    ) {
      return res
        .status(403)
        .json("Unauthorized Access. Please Login as per your role!");
    }

    if (user.type === 1) {
      console.log("here");
      const nurse = await db.Nurse.findOne({
        where: { email },
        attributes: ["empID"],
      });
      if (!nurse) {
        return res.status(404).json("Nurse profile not found");
      }
      empID = nurse.empID;
    }

    // Authenticate user with jwt
    const token = jwt.sign(
      { id: user.id, type: user.type },
      process.env.JWT_SECRET
    );

    // Return the user info and token, including empID if it was found
    res.status(200).send({
      id: user.id,
      empID: empID, // This will be null if user is not an employee
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Sign in error");
  }
};

module.exports = { registerUser, signInUser };

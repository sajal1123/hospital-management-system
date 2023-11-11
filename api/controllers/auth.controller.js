const db = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
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
    });
    return res.status(200).send("Registration successful");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error in registering user");
  }
};

const signInUser = async (req, res) => {
  try {
    let { id, email, password, userType } = req.body;
    console.log(email, password, userType)
    if(id && userType === "employee"){
      email = id;
    }
    else if(email && userType === "patient"){
      email = email;
    }
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

    console.log(user.email);

    // Authenticate user with jwt
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign({ id: user.email }, process.env.JWT_SECRET);

    res.status(200).send({
      id: user.id,
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

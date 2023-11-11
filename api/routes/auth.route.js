const express = require("express");
const { registerUser, signInUser } = require("../controllers/auth.controller");
const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Signin route
router.post("/login", signInUser);

module.exports = router;

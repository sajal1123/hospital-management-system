const express = require("express");
const { registerUser, signInUser } = require("../controllers/auth.controller");
const { registerNurse } = require("../controllers/user.controller");
const verifyAccessToken = require("../middlewares/verifyUser");
const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Signin route
router.post("/login", signInUser);

router.post("/register-nurse", verifyAccessToken, registerNurse);

module.exports = router;

const express = require("express");
const { registerUser, signInUser } = require("../controllers/auth.controller");
const {
  registerNurse,
  updateNurse,
  deleteNurse,
} = require("../controllers/nurse.controller");

const {
  registerVaccine,
  updateVaccine,
} = require("../controllers/vaccine.controller");
const verifyAccessToken = require("../middlewares/verifyUser");
const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Signin route
router.post("/login", signInUser);

router.post("/register-nurse", verifyAccessToken, registerNurse);

router.put("/update-nurse/:empID", verifyAccessToken, updateNurse);

router.delete("/delete-nurse/:empID", verifyAccessToken, deleteNurse);

router.post("/add-vaccine", verifyAccessToken, registerVaccine);

router.put("/update-vaccine/:VaccineID", verifyAccessToken, updateVaccine);

module.exports = router;

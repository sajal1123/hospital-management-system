const express = require("express");
const { registerUser, signInUser } = require("../controllers/auth.controller");
const {
  registerNurse,
  updateNurse,
  deleteNurse,
  getAvailableSlots,
  bookSlots,
  cancelSlots,
} = require("../controllers/nurse.controller");

const {
  getNursesInfo,
  getVaccinesInfo,
  getNurseInfo,
  getVaccineInfo,
} = require("../controllers/admin.controller");

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

router.get("/get-nurses", verifyAccessToken, getNursesInfo);

router.get("/get-nurse", verifyAccessToken, getNurseInfo);

router.get("/get-vaccines", verifyAccessToken, getVaccinesInfo);

router.get("/get-vaccine", verifyAccessToken, getVaccineInfo);

router.post("/register-nurse", verifyAccessToken, registerNurse);

router.put("/update-nurse/:empID", verifyAccessToken, updateNurse);

router.delete("/delete-nurse/:empID", verifyAccessToken, deleteNurse);

router.get("/get-slots", verifyAccessToken, getAvailableSlots);

router.post("/book-slots", verifyAccessToken, bookSlots);

router.post("/cancel-slots", verifyAccessToken, cancelSlots);

router.post("/add-vaccine", verifyAccessToken, registerVaccine);

router.put("/update-vaccine/:VaccineID", verifyAccessToken, updateVaccine);

module.exports = router;

const express = require("express");
const { registerUser, signInUser } = require("../controllers/auth.controller");
const {
  registerNurse,
  updateNurse,
  deleteNurse,
  getAvailableSlots,
  bookSlots,
  cancelSlots,
  getNurseInfo,
  recordVaccine,
} = require("../controllers/nurse.controller");

const {
  getNursesInfo,
  getVaccinesInfo,
  getVaccineInfo,
  getPatientsInfo,
} = require("../controllers/admin.controller");

const {
  registerVaccine,
  updateVaccine,
} = require("../controllers/vaccine.controller");

const {
  updatePatient,
  getAppointment,
  bookAppointment,
  getPatientInfo,
  cancelAppointment,
} = require("../controllers/patient.controller");

const verifyAccessToken = require("../middlewares/verifyUser");

const router = express.Router();

// Registration route
router.post("/register", registerUser);

// Signin route
router.post("/login", signInUser);

router.get("/get-nurses", verifyAccessToken, getNursesInfo);
getPatientInfo;

router.get("/get-nurse", verifyAccessToken, getNurseInfo);

router.get("/get-vaccines", verifyAccessToken, getVaccinesInfo);

router.get("/get-vaccine", verifyAccessToken, getVaccineInfo);

router.get("/get-patients", verifyAccessToken, getPatientsInfo);

router.put("/update-patient/:email", verifyAccessToken, updatePatient)

router.post("/register-nurse", verifyAccessToken, registerNurse);

router.put("/update-nurse/:empID", verifyAccessToken, updateNurse);

router.delete("/delete-nurse/:empID", verifyAccessToken, deleteNurse);

router.get("/get-slots", verifyAccessToken, getAvailableSlots);

router.post("/book-slots", verifyAccessToken, bookSlots);

router.post("/cancel-slots", verifyAccessToken, cancelSlots);

router.post("/add-vaccine", verifyAccessToken, registerVaccine);

router.put("/update-vaccine/:VaccineID", verifyAccessToken, updateVaccine);

router.get("/availability", verifyAccessToken, getAppointment);

router.post("/book-appointment", verifyAccessToken, bookAppointment);

router.post("/record-vaccine", verifyAccessToken, recordVaccine);

router.get("/get-patient", verifyAccessToken, getPatientInfo);

router.delete(
  "/cancel-appointment/:appointmentID",
  verifyAccessToken,
  cancelAppointment
);

module.exports = router;

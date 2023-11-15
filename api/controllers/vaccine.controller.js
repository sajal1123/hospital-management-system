const db = require("../models/index");
const bcrypt = require("bcrypt");

// In your vaccine.controller.js

const registerVaccine = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can register a vaccine");
    }
    const { name, companyName, doses, description, inStock } = req.body;

    const newVaccine = await db.Vaccine.create({
      name,
      companyName,
      doses,
      description,
      inStock,
    });

    return res
      .status(201)
      .json({ message: "Vaccine added successfully", newVaccine });
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in adding vaccine");
  }
};

const updateVaccine = async (req, res) => {
  try {
    if (req.authPayload.type != 0) {
      return res.status(403).json("Only Admin can update a vaccine");
    }

    const { VaccineID } = req.params;
    const { name, companyName, doses, description, updateQty } = req.body;

    const vaccine = await db.Vaccine.findOne({ where: { VaccineID } });
    if (!vaccine) {
      return res.status(404).json("Vaccine not found");
    }

    const newVaccineInStock = vaccine.inStock + updateQty;

    console.log(newVaccineInStock, vaccine.inStock, updateQty);
    await vaccine.update({
      name: name || vaccine.name,
      companyName: companyName || vaccine.companyName,
      doses: doses || vaccine.doses,
      description: description || vaccine.description,
      inStock: newVaccineInStock,
    });

    return res.status(200).json("Vaccine updated successfully");
  } catch (err) {
    console.error(err);
    return res.status(500).json("Error in updating vaccine");
  }
};

module.exports = { registerVaccine, updateVaccine };

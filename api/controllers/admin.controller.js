const db = require("../models/index");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const getNursesInfo = async () => {
  try {
    const nurses = await db.Nurse.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"],
        },
      ],
      attributes: ["email"],
    });

    return nurses.map((nurse) => {
      return {
        name: nurse.user.name,
        email: nurse.email,
      };
    });
  } catch (error) {
    console.error("Error fetching nurses info:", error);
    throw error;
  }
};

module.exports = { getNursesInfo };

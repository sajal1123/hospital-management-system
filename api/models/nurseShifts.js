"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NurseShifts extends Model {
    static associate(models) {
      NurseShifts.belongsTo(models.Nurse, {
        foreignKey: "NurseID",
        as: "nurse",
      });
      NurseShifts.belongsTo(models.Schedule, {
        foreignKey: "TimeSlotID",
        as: "timeSlot",
      });
    }
  }

  NurseShifts.init(
    {
      NurseID: {
        type: DataTypes.STRING,
        references: {
          model: "Nurses", // Name of the Nurse table
          key: "empID", // Key in Nurse to which it references
        },
      },
      TimeSlotID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Schedules", // Name of the Schedule table
          key: "id", // Key in Schedule to which it references
        },
      },
    },
    {
      sequelize,
      modelName: "NurseShifts",
      timestamps: true,
    }
  );

  return NurseShifts;
};

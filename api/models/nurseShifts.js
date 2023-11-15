"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class NurseShifts extends Model {
    static associate(models) {
      NurseShifts.belongsTo(models.Nurse, {
        foreignKey: "NurseID",
        as: "nurse",
        onDelete: "CASCADE",
      });
      NurseShifts.belongsTo(models.Schedule, {
        foreignKey: "TimeSlotID",
        as: "timeSlot",
        onDelete: "CASCADE",
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
        primaryKey: true,
      },
      TimeSlotID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Schedules", // Name of the Schedule table
          key: "id", // Key in Schedule to which it references
        },
        primaryKey: true,
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

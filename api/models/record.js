"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    static associate(models) {
      Record.belongsTo(models.Patient, {
        foreignKey: "PatientID",
        as: "patient",
      });
      Record.belongsTo(models.Nurse, {
        foreignKey: "NurseID",
        as: "nurse",
      });
      Record.belongsTo(models.Schedule, {
        foreignKey: "TimeSlotID",
        as: "timeSlot",
      });
      Record.belongsTo(models.Vaccine, {
        foreignKey: "VaccineID",
        as: "vaccine",
      });
    }
  }

  Record.init(
    {
      PatientID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Patients", // Name of the Nurse table
          key: "ID", // Key in Nurse to which it references
        },
      },
      NurseID: {
        type: DataTypes.STRING,
        references: {
          model: "Nurses", // Name of the Nurse table
          key: "empID", // Key in Nurse to which it references
        },
      },
      VaccineID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Vaccines", // Name of the Nurse table
          key: "VaccineID", // Key in Nurse to which it references
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
      modelName: "Record",
      timestamps: true,
    }
  );

  return Record;
};

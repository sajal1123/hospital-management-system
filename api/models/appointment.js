"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.Patient, {
        foreignKey: "PatientID",
        as: "patient",
      });
      Appointment.belongsTo(models.Schedule, {
        foreignKey: "TimeSlotID",
        as: "timeSlot",
      });
      Appointment.belongsTo(models.Vaccine, {
        foreignKey: "VaccineID",
        as: "vaccine",
      });
    }
  }

  Appointment.init(
    {
      PatientID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Patients", // Name of the Nurse table
          key: "ID", // Key in Nurse to which it references
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
      Completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Appointment",
      timestamps: true,
    }
  );

  return Appointment;
};

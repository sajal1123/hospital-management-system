"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.hasMany(models.NurseShifts, {
        foreignKey: "TimeSlotID",
        as: "nurseShifts",
      });
      Schedule.hasMany(models.Appointment, {
        foreignKey: "TimeSlotID",
        as: "appointments",
      });
    }
  }

  Schedule.init(
    {
      // Assuming an auto-generated ID field is desired
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      timeSlot: {
        type: DataTypes.STRING, // Storing as a string in the format "Day, Date, Time"
        allowNull: false,
      },
      numberOfNurses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bookings: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};

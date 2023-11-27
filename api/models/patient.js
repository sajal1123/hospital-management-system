"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Patient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Patient.belongsTo(models.User, {
        foreignKey: "email",
        targetKey: "email",
        as: "user",
      });
      Patient.hasMany(models.Appointment, {
        foreignKey: "PatientID",
        as: "appointments",
      });
      Patient.hasMany(models.Record, {
        foreignKey: "PatientID",
        as: "records",
      });
    }
  }
  Patient.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      SSN: { type: DataTypes.INTEGER, allowNull: false },
      firstName: { type: DataTypes.STRING, allowNull: false },
      middleName: { type: DataTypes.STRING, allowNull: true },
      lastName: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: true },
      gender: { type: DataTypes.STRING, allowNull: true },
      race: { type: DataTypes.STRING, allowNull: true },
      occupation: { type: DataTypes.STRING, allowNull: true },
      medicalHistory: { type: DataTypes.STRING, allowNull: true },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: { model: "Users", key: "email" },
      },
      phone: { type: DataTypes.STRING, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
    },
    {
      sequelize,
      modelName: "Patient",
    }
  );
  return Patient;
};

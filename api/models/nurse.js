"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Nurse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Nurse.belongsTo(models.User, {
        foreignKey: "email",
        targetKey: "email",
        as: "user",
      });
      Nurse.hasMany(models.NurseShifts, {
        foreignKey: "NurseID",
        as: "shifts",
      });
    }
  }
  Nurse.init(
    {
      empID: { type: DataTypes.STRING, primaryKey: true },
      firstName: { type: DataTypes.STRING, allowNull: false },
      middleName: { type: DataTypes.STRING, allowNull: true },
      lastName: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
      gender: { type: DataTypes.STRING, allowNull: false },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        references: { model: "Users", key: "email" },
      },
      phone: { type: DataTypes.STRING, allowNull: false },
      address: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Nurse",
    }
  );
  return Nurse;
};

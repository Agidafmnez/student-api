const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Student = sequelize.define('Student', {
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  student_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  program: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  year_level: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Student;



require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false, // optional for Railway
    },
  },
  logging: false,
});

module.exports = sequelize;


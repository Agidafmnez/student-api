const sequelize = require('./config/database');
const Student = require('./models/Student');

sequelize.sync({ alter: true }) // Creates table if not exists / updates columns
  .then(() => console.log('Tables synced'))
  .catch(err => console.error('Error syncing tables:', err));


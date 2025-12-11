const express = require('express');
const app = express();
require('dotenv').config();
const sequelize = require('./config/database'); // <-- change 'configs' to 'config'
const Student = require('./models/Student');

// Parse JSON bodies
app.use(express.json());

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Register student routes
const studentRoutes = require('./routes/students');
app.use('/students', studentRoutes);

// Test root
app.get('/', (req, res) => res.send('API is running!'));

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Tables synced');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Error syncing tables:', err));

const fs = require('fs');
const Joi = require('joi');
const studentSchema = require('./schemas/studentSchema'); // make sure this path is correct

// Read JSON file
const students = JSON.parse(fs.readFileSync('students_data.json', 'utf-8'));

// Validate each student
students.forEach((student, index) => {
  const { error, value } = studentSchema.validate(student);
  if (error) {
    console.log(`Student ${index + 1} validation error:`, error.details[0].message);
  } else {
    console.log(`Student ${index + 1} is valid:`, value);
  }
});

const Joi = require('joi');

const studentSchema = Joi.object({
  first_name: Joi.string().min(1).required(),
  last_name: Joi.string().min(1).required(),
  student_number: Joi.string().pattern(/^[0-9]{4}-[0-9]{3}$/).required(),
  program: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  year_level: Joi.number().integer().min(1).max(5).required()
});

module.exports = studentSchema;

const Joi = require('joi');
const db = require('../models');
const { sendFormatted } = require('../utils/formatResponse');

const Student = db.Student;

const validationSchema = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).required(),
  student_number: Joi.string().max(50).required(),
  program: Joi.string().max(100).allow(null, ''),
  email: Joi.string().email().required(),
  year_level: Joi.number().integer().min(1).max(8).allow(null)
});

async function list(req, res) {
  const students = await Student.findAll();
  sendFormatted(res, { students }, 200, 'students', req.headers.accept || '');
}

async function create(req, res) {
  // incoming body might be XML parsed into req.body or JSON
  const payload = req.body && Object.keys(req.body).length===1 && req.body.student ? req.body.student : req.body;
  const { error, value } = validationSchema.validate(payload, { abortEarly:false });

  if (error) {
    const details = error.details.reduce((acc, d) => { acc[d.path.join('.')] = d.message; return acc; }, {});
    return sendFormatted(res, { error: 'ValidationError', message: 'Validation failed', fields: details }, 400, 'error', req.headers.accept || '');
  }

  try {
    const created = await Student.create(value);
    sendFormatted(res, created.toJSON(), 201, 'student', req.headers.accept || '');
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return sendFormatted(res, { error: 'Conflict', message: 'Duplicate field', details: err.errors.map(e=>e.message) }, 409, 'error', req.headers.accept || '');
    }
    console.error(err);
    sendFormatted(res, { error: 'ServerError', message: 'Internal server error' }, 500, 'error', req.headers.accept || '');
  }
}

async function getById(req, res) {
  const id = req.params.id;
  const student = await Student.findByPk(id);
  if (!student) return sendFormatted(res, { error: 'NotFound', message: 'Student not found' }, 404, 'error', req.headers.accept || '');
  sendFormatted(res, student.toJSON(), 200, 'student', req.headers.accept || '');
}

async function updateById(req, res) {
  const id = req.params.id;
  const payload = req.body && req.body.student ? req.body.student : req.body;
  const { error, value } = validationSchema.validate(payload, { abortEarly:false });

  if (error) {
    const details = error.details.reduce((acc, d) => { acc[d.path.join('.')] = d.message; return acc; }, {});
    return sendFormatted(res, { error: 'ValidationError', message: 'Validation failed', fields: details }, 400, 'error', req.headers.accept || '');
  }

  const student = await Student.findByPk(id);
  if (!student) return sendFormatted(res, { error: 'NotFound', message: 'Student not found' }, 404, 'error', req.headers.accept || '');

  try {
    await student.update(value);
    sendFormatted(res, student.toJSON(), 200, 'student', req.headers.accept || '');
  } catch (err) {
    console.error(err);
    sendFormatted(res, { error: 'ServerError', message: 'Internal server error' }, 500, 'error', req.headers.accept || '');
  }
}

async function removeById(req, res) {
  const id = req.params.id;
  const student = await Student.findByPk(id);
  if (!student) return sendFormatted(res, { error: 'NotFound', message: 'Student not found' }, 404, 'error', req.headers.accept || '');
  await student.destroy();
  sendFormatted(res, { message: 'Deleted' }, 200, 'result', req.headers.accept || '');
}

module.exports = { list, create, getById, updateById, removeById };

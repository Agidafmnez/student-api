const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const studentSchema = require('../schemas/studentSchema');
const xmlparser = require('express-xml-bodyparser');

// Handle XML
router.use(xmlparser());

// -------------------- CREATE --------------------
router.post('/', async (req, res) => {
  let studentData;
  try {
    if (req.is('application/json')) {
      studentData = req.body;
    } else if (req.is('application/xml')) {
      studentData = req.body.student;
    } else {
      return res.status(400).json({ error: 'Unsupported Content-Type' });
    }

    const { error } = studentSchema.validate(studentData);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const student = await Student.create(studentData);
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- READ ALL --------------------
router.get('/', async (req, res) => {
  try {
    const students = await Student.findAll();
    if (req.accepts('xml')) {
      // Convert to XML for response
      const parser = require('fast-xml-parser');
      const xmlData = parser.parse({ students }, { format: true });
      res.header('Content-Type', 'application/xml');
      res.send(xmlData);
    } else {
      res.json(students);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- READ ONE --------------------
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (req.accepts('xml')) {
      const parser = require('fast-xml-parser');
      const xmlData = parser.parse({ student }, { format: true });
      res.header('Content-Type', 'application/xml');
      res.send(xmlData);
    } else {
      res.json(student);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- UPDATE --------------------
router.put('/:id', async (req, res) => {
  let studentData;
  try {
    if (req.is('application/json')) {
      studentData = req.body;
    } else if (req.is('application/xml')) {
      studentData = req.body.student;
    } else {
      return res.status(400).json({ error: 'Unsupported Content-Type' });
    }

    const { error } = studentSchema.validate(studentData);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await student.update(studentData);
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// -------------------- DELETE --------------------
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

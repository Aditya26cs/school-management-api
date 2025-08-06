const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/addSchool', (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      console.error('Error adding school:', err);
      return res.status(500).json({ error: 'Failed to add school.' });
    }
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  });
});

module.exports = router;
  
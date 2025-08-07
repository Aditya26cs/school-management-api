 const express = require('express');
const router = express.Router();
const db = require('../database');

// POST /addSchool
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

router.get('/api/listSchools', async (req, res) => {
  const userLat = parseFloat(req.query.latitude);
  const userLon = parseFloat(req.query.longitude);

  if (!userLat || !userLon) {
    return res.status(400).json({ message: "Latitude and longitude are required" });
  }

  try {
    const schools = await query('SELECT * FROM schools');

    // Haversine formula
    const toRad = (value) => (value * Math.PI) / 180;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth radius in KM
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const sortedSchools = schools.map(school => ({
      ...school,
      distance: calculateDistance(userLat, userLon, school.latitude, school.longitude)
    })).sort((a, b) => a.distance - b.distance);

    res.json(sortedSchools);
  } catch (err) {
    console.error('Error listing schools:', err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
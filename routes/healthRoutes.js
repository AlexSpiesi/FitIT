const express = require('express');
const router = express.Router();
const healthService = require('../services/healthService');

// BMI endpoint
router.get('/BMI/metric', async (req, res) => {
  const { kg, cm } = req.query;

  if (!kg || !cm) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await healthService.getBMI(kg, cm);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Calories burned endpoint
router.get('/calories', async (req, res) => {
  const { activity, weight, duration } = req.query;

  if (!activity || !weight || !duration) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await healthService.getCalories(activity, weight, duration);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

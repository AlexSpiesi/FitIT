const express = require('express');
const router = express.Router();
const healthService = require('../services/healthService');

// BMI endpoint
router.get('/bmi', async (req, res) => {
  const { age, height, weight } = req.query;

  if (!age || !height || !weight) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    const result = await healthService.getBMI(age, height, weight);
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

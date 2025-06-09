/**
 * @swagger
 * /api/health/BMI/metric:
 *   get:
 *     summary: Get BMI based on weight and height
 *     tags: [Health]
 *     parameters:
 *       - in: query
 *         name: kg
 *         schema:
 *           type: number
 *         required: true
 *       - in: query
 *         name: cm
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: BMI Wert
 *       400:
 *         description: Missing required parameters
 *       500:
 *         description: Server error
 */
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

router.get('/activity', (req, res) => {
  // Beispielantwort: Benutzer war an drei Tagen aktiv
  const activeDays = ['2025-06-01', '2025-06-03', '2025-06-07'];
  res.json(activeDays);
});

module.exports = router;

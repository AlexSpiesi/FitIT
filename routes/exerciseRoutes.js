const express = require('express');
const router = express.Router();
const exerciseService = require('../services/exerciseService');

router.get('/', async (req, res) => {
  try {
    const exercises = await exerciseService.fetchAllExercises();
    res.json(exercises.slice(0, 5)); // Limit output
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/bodyparts', async (req, res) => {
  try {
    const parts = await exerciseService.fetchBodyParts();
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/targets', async (req, res) => {
  try {
    const targets = await exerciseService.fetchTargets();
    res.json(targets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

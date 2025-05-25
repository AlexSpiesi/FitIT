const express = require('express');
const router = express.Router();
const exerciseService = require('../services/exerciseService');

router.get('/', async (req, res) => {
  try {
    const exercises = await exerciseService.fetchAllExercises();
    const shuffled = exercises.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);
    res.json(selected);
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

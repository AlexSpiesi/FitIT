const express = require('express');
const router = express.Router();
const exerciseService = require('../services/exerciseService');
const db = require('../db'); //NEU!!!!!!!!!!

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

router.get('/bodypart/:part', async (req, res) => {
  const { part } = req.params;
  try {
    const exercises = await exerciseService.fetchByBodyPart(req.params.part);
    res.json(exercises.slice(0, 10)); // z. B. nur die ersten 10 anzeigen
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/equipment', async (req, res) => {
  try {
    const list = await exerciseService.fetchEquipmentList();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/equipment/:type', async (req, res) => {
  try {
    const exercises = await exerciseService.fetchByEquipment(req.params.type);
    res.json(exercises.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/target/:target', async (req, res) => {
  try {
    const exercises = await exerciseService.fetchByTarget(req.params.target);
    res.json(exercises.slice(0, 10));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route: /api/exercises/random NEU!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/random', async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM exercises ORDER BY RAND() LIMIT 6'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch random exercises.' });
  }
});

module.exports = router;

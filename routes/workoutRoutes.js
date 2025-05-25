const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { user_id, name, exercises } = req.body;

  if (!user_id || !name || !exercises || exercises.length === 0) {
    return res.status(400).json({ error: 'Ungültige Eingabedaten' });
  }

  db.run(`INSERT INTO workouts (user_id, name) VALUES (?, ?)`, [user_id, name], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    const workoutId = this.lastID;
    const stmt = db.prepare(`
      INSERT INTO workout_exercises (workout_id, exercise_id, name, gif_url, description)
      VALUES (?, ?, ?, ?, ?)
    `);

    exercises.forEach(ex => {
      stmt.run(workoutId, ex.id, ex.name, ex.gifUrl, (ex.instructions || []).join('\n'));
    });

    stmt.finalize();
    res.status(201).json({ message: 'Workout gespeichert', workout_id: workoutId });
  });
});

router.get('/user/:user_id', (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT w.id AS workout_id, w.name AS workout_name,
           we.exercise_id, we.name AS exercise_name, we.gif_url, we.description
    FROM workouts w
    LEFT JOIN workout_exercises we ON w.id = we.workout_id
    WHERE w.user_id = ?
    ORDER BY w.id
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: 'Keine Workouts gefunden' });

    const workouts = rows.reduce((acc, row) => {
      if (!acc[row.workout_id]) {
        acc[row.workout_id] = {
          id: row.workout_id,
          name: row.workout_name,
          exercises: []
        };
      }

      if (row.exercise_id) {
        acc[row.workout_id].exercises.push({
          id: row.exercise_id,
          name: row.exercise_name,
          gif_url: row.gif_url,
          description: row.description
        });
      }
      return acc;
    }, {});

    res.json(Object.values(workouts));
  });
});

module.exports = router;

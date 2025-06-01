/**
 * @swagger
 * tags:
 *   name: Workouts
 *   description: Workout management
 */

/**
 * @swagger
 * /api/workouts:
 *   post:
 *     summary: Create a new workout
 *     tags: [Workouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, name, exercises]
 *             properties:
 *               user_id:
 *                 type: integer
 *               name:
 *                 type: string
 *               exercises:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     gifUrl:
 *                       type: string
 *                     instructions:
 *                       type: array
 *                       items:
 *                         type: string
 *     responses:
 *       201:
 *         description: Workout gespeichert
 *       400:
 *         description: Ungültige Eingabedaten
 */

/**
 * @swagger
 * /api/workouts/{user_id}:
 *   get:
 *     summary: Get all workouts for a specific user
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID des Benutzers
 *     responses:
 *       200:
 *         description: Liste von Workouts
 *       404:
 *         description: Keine Workouts gefunden
 */

/**
 * @swagger
 * /api/workouts/{workout_id}:
 *   delete:
 *     summary: Lösche ein Workout und seine Übungen
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: workout_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workout gelöscht
 *       404:
 *         description: Workout nicht gefunden
 */

/**
 * @swagger
 * /api/workouts/{id}/exercises:
 *   put:
 *     summary: Übung zu einem bestehenden Workout hinzufügen
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exercise:
 *                 type: object
 *                 required: [id, name, gifUrl]
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   gifUrl:
 *                     type: string
 *                   instructions:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       200:
 *         description: Übung hinzugefügt
 *       400:
 *         description: Ungültige Übungsdaten
 */

/**
 * @swagger
 * /api/workouts/{workoutId}/exercises:
 *   post:
 *     summary: Übung manuell zu einem Workout hinzufügen
 *     tags: [Workouts]
 *     parameters:
 *       - in: path
 *         name: workoutId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [exercise_id, name]
 *             properties:
 *               exercise_id:
 *                 type: string
 *               name:
 *                 type: string
 *               gif_url:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Exercise added
 *       400:
 *         description: Ungültige Eingabedaten
 */
const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", (req, res) => {
  const { user_id, name, exercises } = req.body;

  if (!user_id || !name || !exercises || exercises.length === 0) {
    return res.status(400).json({ error: "Ungültige Eingabedaten" });
  }

  db.run(
    `INSERT INTO workouts (user_id, name) VALUES (?, ?)`,
    [user_id, name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const workoutId = this.lastID;
      const stmt = db.prepare(`
      INSERT INTO workout_exercises (workout_id, exercise_id, name, gif_url, description)
      VALUES (?, ?, ?, ?, ?)
    `);

      exercises.forEach((ex) => {
        stmt.run(
          workoutId,
          ex.id,
          ex.name,
          ex.gifUrl,
          (ex.instructions || []).join("\n")
        );
      });

      stmt.finalize();
      res
        .status(201)
        .json({ message: "Workout gespeichert", workout_id: workoutId });
    }
  );
});

router.post("/:workoutId/exercises", (req, res) => {
  const workoutId = req.params.workoutId;
  const { exercise_id, name, gif_url, description } = req.body;

  if (!exercise_id || !name) {
    return res.status(400).json({ error: "exercise_id and name are required" });
  }

  const sql = `
    INSERT INTO workout_exercises (workout_id, exercise_id, name, gif_url, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    sql,
    [workoutId, exercise_id, name, gif_url, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res
        .status(201)
        .json({ message: "Exercise added to workout", id: this.lastID });
    }
  );
});

router.get("/user/:user_id", (req, res) => {
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
    if (rows.length === 0)
      return res.status(404).json({ error: "Keine Workouts gefunden" });

    const workouts = rows.reduce((acc, row) => {
      if (!acc[row.workout_id]) {
        acc[row.workout_id] = {
          id: row.workout_id,
          name: row.workout_name,
          exercises: [],
        };
      }

      if (row.exercise_id) {
        acc[row.workout_id].exercises.push({
          id: row.exercise_id,
          name: row.exercise_name,
          gif_url: row.gif_url,
          description: row.description,
        });
      }
      return acc;
    }, {});

    res.json(Object.values(workouts));
  });
});

// DELETE /api/workouts/:workout_id
router.delete("/:workout_id", (req, res) => {
  const workoutId = req.params.workout_id;

  // Zuerst: zugehörige Übungen löschen
  db.run(
    `DELETE FROM workout_exercises WHERE workout_id = ?`,
    [workoutId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Dann: Workout selbst löschen
      db.run(`DELETE FROM workouts WHERE id = ?`, [workoutId], function (err) {
        if (err) return res.status(500).json({ error: err.message });

        if (this.changes === 0) {
          return res.status(404).json({ error: "Workout nicht gefunden" });
        }

        res.status(200).json({ message: "Workout gelöscht" });
      });
    }
  );
});
router.put("/:id/exercises", (req, res) => {
  const workoutId = req.params.id;
  const { exercise } = req.body;

  if (!exercise || !exercise.id || !exercise.name || !exercise.gifUrl) {
    return res.status(400).json({ error: "Ungültige Übungsdaten" });
  }

  const description = (exercise.instructions || []).join("\n");

  db.run(
    `INSERT INTO workout_exercises (workout_id, exercise_id, name, gif_url, description)
     VALUES (?, ?, ?, ?, ?)`,
    [workoutId, exercise.id, exercise.name, exercise.gifUrl, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(200).json({ message: "Übung hinzugefügt", id: this.lastID });
    }
  );
});

module.exports = router;

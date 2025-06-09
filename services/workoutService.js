const db = require('../db'); // Make sure to set the correct path to your db module

async function getRecentWorkouts(userId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT w.id, w.name, we.gif_url AS image
      FROM workouts w
      JOIN workout_exercises we ON w.id = we.workout_id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
      LIMIT 5
    `;
    db.all(sql, [userId], (err, rows) => {
      if (err) return reject(err);
      // Du bekommst vielleicht mehrfach pro Workout-row mit verschiedenen gif_url. Nimm das erste Bild:
      const distinct = [];
      const ids = new Set();
      if (Array.isArray(rows) && rows.length > 0) {
        rows.forEach((r) => {
          if (!ids.has(r.id)) {
            ids.add(r.id);
            distinct.push({ id: r.id, name: r.name, image: r.image });
          }
        });
        resolve(distinct);
      } else {
        resolve([]);
      }
    });
  });
}

module.exports = {
  getRecentWorkouts,
};

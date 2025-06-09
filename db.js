const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database(":memory:");

bcrypt.hash("password1", 10, (err, hashedPassword) => {
  if (err) throw err;

  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          age INTEGER,
          gender TEXT NOT NULL,
          weight REAL,
          height REAL,
          bmi REAL,
          bmi_category TEXT
      )`);
    //Real = float in SQLite
    db.run(`
      CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS workout_exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_id INTEGER NOT NULL,
        exercise_id TEXT NOT NULL,
        name TEXT NOT NULL,
        gif_url TEXT,
        description TEXT,
        FOREIGN KEY (workout_id) REFERENCES workouts(id)
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    workout_id INTEGER NOT NULL,
    UNIQUE(user_id, workout_id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(workout_id) REFERENCES workouts(id)
  )
    `);

    const stmt = db.prepare(`
          INSERT INTO users (email, password, age, gender, weight, height)
           VALUES (?,?,?,?,?,?)
          `);
    stmt.run(`bob@test.at`, hashedPassword, 30, `male`, 80, 180);
    stmt.finalize();
  });
});
module.exports = db;

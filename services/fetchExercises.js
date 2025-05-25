const fetch = require('node-fetch');
const db = require('../db');

async function fetchAndStoreExercises() {
  try {
    const response = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '015c52bb70msh0ca69c0c0da9fa3p13dce6jsnc05c3d5b2905',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
      }
    });

    const exercises = await response.json();

    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO exercises 
      (id, name, gif_url, target, body_part, equipment, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    exercises.forEach(ex => {
      insertStmt.run([
        ex.id,
        ex.name,
        ex.gifUrl,
        ex.target,
        ex.bodyPart,
        ex.equipment,
        JSON.stringify(ex.instructions || [])
      ]);
    });

    insertStmt.finalize();
    console.log(`${exercises.length} Exercises imported.`);
  } catch (error) {
    console.error('Fehler beim Laden:', error.message);
  }
}

fetchAndStoreExercises();

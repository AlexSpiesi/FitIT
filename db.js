const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        age INTEGER,
        gender TEXT NOT NULL,
        weight REAL,
        height REAL
    )`);
    //Real = float in SQLite
        
    const stmt = db.prepare(`
        INSERT INTO users (email, password, age, gender)
         VALUES (?,?,?,?)
        `);
    stmt.run(`Barbara@gmail.com`,`FatShadow`,30,`female`);
    stmt.finalize();

});
module.exports = db;
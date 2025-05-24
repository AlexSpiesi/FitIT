const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database(':memory:');

db.serialize(async() => {
    db.run(`CREATE TABLE users (
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

    const hashedPassword = await bcrypt.hash('password1', 10);
        
    const stmt = db.prepare(`
        INSERT INTO users (email, password, age, gender, weight, height)
         VALUES (?,?,?,?,?,?)
        `);
    stmt.run(`bob@test.at`,hashedPassword,30,`male`, 80, 180);
    stmt.finalize();

});
module.exports = db;
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run(`Create TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT UNIQUE NOT NULL,
        age INTEGER,
        gender TEXT NOT NULL
    )`);
        
    const stmt = db.prepare(`
        INSERT INTO users (email, password, age, gender)
         VALUES (?,?,?,?)
        `);
    stmt.run(`Barbara@gmail.com`,`FatShadow`,30,`female`);
    stmt.finalize();

});
module.exports = db;
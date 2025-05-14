import mysql from 'mysql2'

import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'TeamAI',
    database: 'Fitness_tracker'
}).promise()

async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

const users = await getUsers()
console.log(users)

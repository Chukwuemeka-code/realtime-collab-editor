const pool = require("./db");
async function setup() {
await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    )
`);
console.log("users table ready");
process.exit();    
}

setup();
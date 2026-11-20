const pool = require("./db");

async function setup() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('code', 'whiteboard')),
      language VARCHAR(30) DEFAULT 'javascript',
      owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS document_members (
      document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role VARCHAR(10) NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
      PRIMARY KEY (document_id, user_id)
    )
  `);

  console.log("documents tables ready");
  process.exit();
}

setup();

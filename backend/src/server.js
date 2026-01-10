
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'appdb',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres'
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create item
app.post('/api/items', async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Initialize database table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    console.log('Database initialized');
  } catch (err) {
    console.error('DB init error:', err);
  }
}

initDB();

app.listen(port, '0.0.0.0', () => {
  console.log(`Backend API listening on port ${port}`);
});
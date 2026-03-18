const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        reflection TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        photo TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } finally {
    client.release();
  }
};

module.exports = async function handler(req, res) {
  // Simple table auto-creation on every request (Vercel serverless ensures this is fast enough for free tier)
  try {
    await initDb();
  } catch (err) {
    console.error('DB Init Error:', err);
    return res.status(500).json({ error: 'Database initialization failed' });
  }

  if (req.method === 'GET') {
    try {
      const { rows } = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
      const { rows: countRows } = await pool.query('SELECT COUNT(*) as count FROM reviews');
      return res.status(200).json({
        reviews: rows,
        totalCount: parseInt(countRows[0].count)
      });
    } catch (err) {
      console.error('GET Error:', err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
  }

  if (req.method === 'POST') {
    const { name, email, reflection, rating, photo } = req.body;

    // Validation
    if (!name || !email || !reflection || !rating) {
      return res.status(400).json({ error: 'All fields (name, email, reflection, rating) are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    try {
      const query = 'INSERT INTO reviews (name, email, reflection, rating, photo) VALUES ($1, $2, $3, $4, $5) RETURNING *';
      const values = [name, email, reflection, rating, photo || null];
      const { rows } = await pool.query(query, values);
      return res.status(201).json(rows[0]);
    } catch (err) {
      console.error('POST Error:', err);
      return res.status(500).json({ error: 'Failed to save review' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

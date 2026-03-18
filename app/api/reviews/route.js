const { Pool } = require('pg');
const { NextResponse } = require('next/server');

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
    
    // Add photo column if it doesn't exist (handle migration for existing tables)
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reviews' AND column_name='photo') THEN
          ALTER TABLE reviews ADD COLUMN photo TEXT;
        END IF;
      END
      $$;
    `);
  } finally {
    client.release();
  }
};

export async function GET() {
  try {
    await initDb();
    const { rows } = await pool.query('SELECT * FROM reviews ORDER BY created_at DESC');
    const { rows: countRows } = await pool.query('SELECT COUNT(*) as count FROM reviews');
    return NextResponse.json({
      reviews: rows,
      totalCount: parseInt(countRows[0].count)
    });
  } catch (err) {
    console.error('GET Error:', err);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await initDb();
    const body = await req.json();
    const { name, email, reflection, rating, photo } = body;

    // Validation
    if (!name || !email || !reflection || !rating) {
      return NextResponse.json({ error: 'All fields (name, email, reflection, rating) are required' }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    const query = 'INSERT INTO reviews (name, email, reflection, rating, photo) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [name, email, reflection, rating, photo || null];
    const { rows } = await pool.query(query, values);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err) {
    console.error('POST Error:', err);
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
  }
}

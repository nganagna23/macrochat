const { neon } = require('@neondatabase/serverless');

let readyPromise = null;

function db() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  if (!url) throw new Error('DATABASE_URL/POSTGRES_URL belum diatur. Hubungkan Neon/Postgres di Vercel.');
  return neon(url);
}

async function ensureSchema() {
  if (readyPromise) return readyPromise;
  readyPromise = (async () => {
    const sql = db();
    await sql`CREATE TABLE IF NOT EXISTS users (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS sessions_expires_idx ON sessions(expires_at)`;
    await sql`CREATE TABLE IF NOT EXISTS macros (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      trigger TEXT NOT NULL,
      macro_text TEXT NOT NULL,
      macro_type TEXT NOT NULL DEFAULT 'text',
      source_file TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await sql`CREATE INDEX IF NOT EXISTS macros_user_idx ON macros(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS macros_trigger_idx ON macros(user_id, trigger)`;
  })().catch(err => {
    readyPromise = null;
    throw err;
  });
  return readyPromise;
}

module.exports = { db, ensureSchema };

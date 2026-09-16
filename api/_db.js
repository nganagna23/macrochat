const { neon } = require('@neondatabase/serverless');

function db() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL belum diatur. Hubungkan Neon/Postgres di Vercel.');
  return neon(process.env.DATABASE_URL);
}
module.exports = { db };

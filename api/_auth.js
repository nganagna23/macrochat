const crypto = require('crypto');
const { db } = require('./_db');

const DAY = 24 * 60 * 60 * 1000;
function cookieToken(req) {
  const raw = req.headers.cookie || '';
  const m = raw.match(/(?:^|;\s*)latoto_session=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(res, token, maxAge) {
  const secure = (process.env.NODE_ENV === 'production' || String(res.req?.headers?.['x-forwarded-proto'] || '') === 'https') ? '; Secure' : '';
  res.setHeader('Set-Cookie', `latoto_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=${maxAge}`);
}
function clearCookie(res) {
  res.setHeader('Set-Cookie', 'latoto_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return new Promise((resolve, reject) => crypto.scrypt(password, salt, 64, (err, key) => err ? reject(err) : resolve(`${salt}:${key.toString('hex')}`)));
}
function verifyPassword(password, encoded) {
  return new Promise((resolve, reject) => {
    const [salt, expected] = String(encoded || '').split(':');
    if (!salt || !expected) return resolve(false);
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) return reject(err);
      const a = Buffer.from(expected, 'hex'), b = key;
      resolve(a.length === b.length && crypto.timingSafeEqual(a, b));
    });
  });
}
async function requireUser(req, res) {
  const token = cookieToken(req);
  if (!token) { res.status(401).json({error:'Belum login'}); return null; }
  const sql = db();
  const rows = await sql`SELECT u.id, u.username FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.id=${token} AND s.expires_at > NOW()`;
  if (!rows[0]) { clearCookie(res); res.status(401).json({error:'Sesi habis'}); return null; }
  return rows[0];
}
function newToken() { return crypto.randomBytes(32).toString('hex'); }
module.exports = { db, DAY, hashPassword, verifyPassword, requireUser, newToken, setCookie, clearCookie };

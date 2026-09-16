const { db, ensureSchema, DAY, hashPassword, verifyPassword, requireUser, newToken, setCookie, clearCookie } = require('./_auth');

module.exports = async (req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');
  try {
    await ensureSchema();
    const sql=db();
    if(req.method!=='POST' && req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
    if(req.method==='GET') {
      const user=await requireUser(req,res); if(!user) return;
      return res.status(200).json({ok:true,user});
    }
    const body=req.body||{}; const action=String(body.action||'').toLowerCase();
    if(action==='register'){
      const username=String(body.username||'').trim(); const password=String(body.password||'');
      if(!/^[A-Za-z0-9_ .-]{2,40}$/.test(username)) return res.status(400).json({error:'Nama harus 2-40 karakter dan hanya huruf, angka, spasi, titik, garis bawah, atau -.'});
      if(password.length<6) return res.status(400).json({error:'Password minimal 6 karakter'});
      const ph=await hashPassword(password);
      try { const rows=await sql`INSERT INTO users(username,password_hash) VALUES(${username},${ph}) RETURNING id, username`; const token=newToken(); await sql`INSERT INTO sessions(id,user_id,expires_at) VALUES(${token},${rows[0].id},NOW()+INTERVAL '30 days')`; setCookie(res,token,30*24*60*60); return res.status(201).json({ok:true,user:rows[0]}); }
      catch(e){ if(String(e.message).includes('duplicate')) return res.status(409).json({error:'Nama sudah digunakan'}); throw e; }
    }
    if(action==='login'){
      const username=String(body.username||'').trim(), password=String(body.password||'');
      const rows=await sql`SELECT id,username,password_hash FROM users WHERE lower(username)=lower(${username}) LIMIT 1`;
      if(!rows[0] || !(await verifyPassword(password,rows[0].password_hash))) return res.status(401).json({error:'Nama atau password salah'});
      const token=newToken(); await sql`INSERT INTO sessions(id,user_id,expires_at) VALUES(${token},${rows[0].id},NOW()+INTERVAL '30 days')`; setCookie(res,token,30*24*60*60);
      return res.status(200).json({ok:true,user:{id:rows[0].id,username:rows[0].username}});
    }
    if(action==='logout'){
      const token=(req.headers.cookie||'').match(/(?:^|;\s*)latoto_session=([^;]+)/)?.[1]; if(token) await sql`DELETE FROM sessions WHERE id=${decodeURIComponent(token)}`; clearCookie(res); return res.status(200).json({ok:true});
    }
    return res.status(400).json({error:'Action tidak dikenal'});
  } catch(e){ console.error(e); return res.status(500).json({error:e.message||'Server error'}); }
};

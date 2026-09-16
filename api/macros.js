const { requireUser, db } = require('./_auth');
const { ensureSchema } = require('./_db');
module.exports = async (req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');
  try{
    await ensureSchema();
    const user=await requireUser(req,res); if(!user)return;
    const sql=db();
    if(req.method==='GET'){
      const rows=await sql`SELECT id,trigger,macro_text AS text,macro_type AS type,source_file,created_at,updated_at FROM macros WHERE user_id=${user.id} ORDER BY id ASC`;
      return res.status(200).json({items:rows});
    }
    if(req.method==='POST'){
      const b=req.body||{}; const trigger=String(b.trigger||'').trim(); const text=String(b.text||'').replace(/\r\n?/g,'\n').replace(/\u0000/g,'').trim(); const type=String(b.type||'text')==='hotkey'?'hotkey':'text';
      if(!trigger||!text)return res.status(400).json({error:'Trigger dan isi macro wajib diisi'});
      const rows=await sql`INSERT INTO macros(user_id,trigger,macro_text,macro_type,source_file) VALUES(${user.id},${trigger},${text},${type},${b.source_file||null}) RETURNING id,trigger,macro_text AS text,macro_type AS type,source_file,created_at,updated_at`;
      return res.status(201).json({item:rows[0]});
    }
    if(req.method==='PUT'){
      const b=req.body||{}; const id=Number(b.id); const trigger=String(b.trigger||'').trim(); const text=String(b.text||'').replace(/\r\n?/g,'\n').replace(/\u0000/g,'').trim(); const type=String(b.type||'text')==='hotkey'?'hotkey':'text';
      if(!Number.isInteger(id)||!trigger||!text)return res.status(400).json({error:'Data edit tidak valid'});
      const rows=await sql`UPDATE macros SET trigger=${trigger}, macro_text=${text}, macro_type=${type}, updated_at=NOW() WHERE id=${id} AND user_id=${user.id} RETURNING id,trigger,macro_text AS text,macro_type AS type,source_file,created_at,updated_at`;
      if(!rows[0])return res.status(404).json({error:'Macro tidak ditemukan'}); return res.status(200).json({item:rows[0]});
    }
    if(req.method==='DELETE'){
      const id=Number(req.query?.id || req.body?.id); if(!Number.isInteger(id))return res.status(400).json({error:'ID tidak valid'});
      const rows=await sql`DELETE FROM macros WHERE id=${id} AND user_id=${user.id} RETURNING id`; if(!rows[0])return res.status(404).json({error:'Macro tidak ditemukan'}); return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'Method not allowed'});
  }catch(e){console.error(e);return res.status(500).json({error:e.message||'Server error'});}
};

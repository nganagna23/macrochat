const { requireUser, db } = require('./_auth');
const { DOMParser } = require('@xmldom/xmldom');
function clean(x){return String(x??'').replace(/\r\n?/g,'\n').replace(/\u0000/g,'').trim()}
function hot(x){return /^(HOTKEY|CTRL\s*\+|ALT\s*\+|SHIFT\s*\+|NUMPAD|COMMA$|PERIOD$|SLASH$)/i.test((x||'').trim())}
function parseXML(str){
  const d=new DOMParser().parseFromString(str,'application/xml');
  if(d.getElementsByTagName('parsererror')[0])throw Error('XML tidak valid');
  const out=[]; for(const m of Array.from(d.getElementsByTagName('macro'))){
    const tr=m.getElementsByTagName('trigger')[0] || null; const mt=m.getElementsByTagName('macroText')[0] || null; const tsNode=tr ? tr.getElementsByTagName('tscut')[0] : null; const text=mt?.textContent||''; const ts=tsNode?.textContent?.trim()||''; const hk=tr?.getAttribute('hk')||'0',hl=tr?.getAttribute('hklp')||'0',kf=tr?.getAttribute('ktflags')||'0';
    const trigger=ts||`HOTKEY hk=${hk} hklp=${hl} ktflags=${kf}`; if(trigger||text)out.push({trigger,text:clean(text),type:hot(trigger)?'hotkey':'text'});
  } return out;
}
function binaryText(buf){ const u=new Uint8Array(buf), chunks=[]; let cur=''; for(let i=0;i<u.length;i++){ const c=u[i]; if(c>=32&&c<127){cur+=String.fromCharCode(c)}else{if(cur.length>=3)chunks.push(cur);cur='';}} if(cur.length>=3)chunks.push(cur); return chunks.join('\n'); }
function parse4pk(buf,name){
  const raw=binaryText(buf);
  const out=[];
  // 4PK is a native Perfect Keyboard macro-set format. When a file exposes readable strings,
  // preserve them as an inspection macro instead of pretending the proprietary binary was fully decoded.
  const lines=raw.split(/\n+/).map(s=>clean(s)).filter(s=>s.length>=3);
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    if(/^https?:\/\//i.test(line)||/^MZ$/i.test(line))continue;
    const lower=line.toLowerCase();
    if(lower.includes('hotkey')||lower.includes('trigger')||lower.includes('macro')||line.startsWith('/')||line.length>30){
      out.push({trigger:`4PK ${i+1}: ${line.slice(0,120)}`,text:line,type:'text'});
    }
    if(out.length>=500)break;
  }
  if(!out.length)out.push({trigger:`4PK: ${name}`,text:`File .4PK diterima. Format binary Perfect Keyboard terdeteksi, tetapi bagian yang bisa dibaca sebagai teks belum ditemukan oleh parser browser. Gunakan Perfect Keyboard untuk export XML lalu impor XML untuk hasil paling lengkap.`,type:'text'});
  return out;
}
module.exports=async(req,res)=>{
  res.setHeader('Content-Type','application/json; charset=utf-8');
  try{
    const user=await requireUser(req,res);if(!user)return;
    if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
    const b=req.body||{}; const data=String(b.data||''); const name=String(b.name||'macro');
    if(!data)return res.status(400).json({error:'File kosong'});
    let arr;
    if(/\.xml$/i.test(name) || /<\s*mtw_export_macros|<\s*macro[ >]/i.test(data)){arr=parseXML(data)}
    else if(/\.4pk$/i.test(name)){const buf=Buffer.from(data,'base64');arr=parse4pk(buf,name)}
    else return res.status(400).json({error:'Format harus .xml atau .4pk'});
    if(!arr.length)return res.status(400).json({error:'Tidak ada macro yang dapat dibaca'});
    const sql=db();
    for(const x of arr) await sql`INSERT INTO macros(user_id,trigger,macro_text,macro_type,source_file) VALUES(${user.id},${x.trigger},${x.text},${x.type},${name})`;
    return res.status(200).json({ok:true,count:arr.length,source:name,partial:/\.4pk$/i.test(name) && arr.length>0});
  }catch(e){console.error(e);return res.status(500).json({error:e.message||'Gagal import'});}
};

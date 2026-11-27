'use client';
import { useState, useEffect, useMemo } from 'react';
import { FULL_MASTER_CONFIG } from '../../lib/siteConfig';
function flatten(obj, prefix='', out=[]) {
  Object.keys(obj).forEach(k=>{
    const path = prefix ? prefix+'.'+k : k;
    const v = obj[k];
    if (v && typeof v==='object' && !Array.isArray(v)) flatten(v, path, out);
    else out.push({ path, value: v, type: typeof v });
  });
  return out;
}
function setPath(obj, path, val){
  const parts = path.split('.'); let cur=obj;
  parts.forEach((p,i)=>{ if(i===parts.length-1) cur[p]=val; else { if(!cur[p]) cur[p]={}; cur=cur[p]; } });
  return obj;
}
export default function Studio(){
  const [cfg,setCfg]=useState(FULL_MASTER_CONFIG);
  const [q,setQ]=useState('');
  const [section,setSection]=useState('all');
  const [msg,setMsg]=useState('');
  const [authed,setAuthed]=useState(false);
  const [pw,setPw]=useState('');
  useEffect(()=>{
    try{ const s=localStorage.getItem('atassatube_site_config'); if(s) setCfg({...FULL_MASTER_CONFIG,...JSON.parse(s)}); }catch(e){}
  },[]);
  const rows = useMemo(()=>flatten(cfg),[cfg]);
  const sections = useMemo(()=>['all',...new Set(rows.map(r=>r.path.split('.')[0]))],[rows]);
  const filtered = rows.filter(r=>{
    if(section!=='all' && !r.path.startsWith(section+'.') && r.path!==section) return false;
    if(!q) return true;
    return (r.path+' '+String(r.value)).toLowerCase().includes(q.toLowerCase());
  });
  function update(path,val,orig){
    let nv=val;
    if(typeof orig==='boolean') nv = (val==='true'||val===true);
    if(typeof orig==='number') nv = Number(val);
    const copy = JSON.parse(JSON.stringify(cfg));
    setPath(copy,path,nv); setCfg(copy);
  }
  function saveLocal(){
    localStorage.setItem('atassatube_site_config', JSON.stringify(cfg));
    setMsg('Saved locally. Now tap Publish to update www.funnyatassa.com + AtassaTube.');
  }
  async function publish(){
    saveLocal();
    setMsg('Publishing to Supabase app_config id=1...');
    try{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if(!url||!key){ setMsg('Saved locally. Add NEXT_PUBLIC_SUPABASE_URL + ANON_KEY in Vercel to Publish to live site.'); return; }
      const res = await fetch(url+'/rest/v1/app_config?id=eq.1',{method:'PATCH',headers:{'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json','Prefer':'return=representation'},body:JSON.stringify({config:cfg,updated_at:new Date().toISOString()})});
      if(!res.ok) throw new Error('Publish failed '+res.status);
      setMsg('Published! Both www.funnyatassa.com + AtassaTube will use this config.');
    }catch(e){ setMsg('Publish error: '+e.message+' — still saved locally.'); }
  }
  if(!authed) return (<main style={{padding:20,fontFamily:'system-ui',maxWidth:480,margin:'0 auto'}}>
    <h1>Studio — Admin Panel</h1><p>Owner only. Session only. Close = logged out.</p>
    <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Owner password" style={{width:'100%',padding:14,borderRadius:10,border:'1px solid #ddd'}} />
    <button onClick={()=>{ if(pw.length<1){setMsg('Enter password');return;} setAuthed(true); }} style={{marginTop:12,width:'100%',padding:14,background:'#D90429',color:'#fff',border:0,borderRadius:10}}>Unlock Studio</button>
    <p>{msg}</p>
  </main>);
  return (<main style={{padding:16,fontFamily:'system-ui',maxWidth:900,margin:'0 auto'}}>
    <h1>Studio — Admin Panel for www.funnyatassa.com</h1>
    <p>Controls EVERYTHING: Header, Hero, Trending, Comedy, Atassa Picks, ATASSA AI, Cast, About, Support, Legal, Footer, Colors, Font, Logos, even smallest text / number / symbol.</p>
    <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search ANY word — e.g. 18+ , ₦ , • , Watch Now , Deals Are Real" style={{width:'100%',padding:14,borderRadius:10,border:'1px solid #ddd',marginBottom:10}} />
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:12}}>{sections.map(s=>(<button key={s} onClick={()=>setSection(s)} style={{padding:'8px 12px',borderRadius:20,border:0,background:section===s?'#D90429':'#eee',color:section===s?'#fff':'#111'}}>{s}</button>))}</div>
    <p>{filtered.length} fields found • {msg}</p>
    {filtered.map(r=>(
      <div key={r.path} style={{border:'1px solid #eee',padding:10,borderRadius:10,marginBottom:8}}>
        <div style={{fontSize:12,color:'#666',wordBreak:'break-all'}}>{r.path}</div>
        {typeof r.value==='boolean' ? (
          <select value={String(r.value)} onChange={e=>update(r.path,e.target.value,r.value)} style={{width:'100%',padding:10}}><option value="true">true — SHOW</option><option value="false">false — HIDE</option></select>
        ) : String(r.value).length>80 ? (
          <textarea value={String(r.value)} onChange={e=>update(r.path,e.target.value,r.value)} style={{width:'100%',padding:10,minHeight:80}} />
        ) : (
          <input value={String(r.value)} onChange={e=>update(r.path,e.target.value,r.value)} style={{width:'100%',padding:10}} />
        )}
      </div>
    ))}
    <div style={{display:'flex',gap:10,position:'sticky',bottom:10,background:'#fff',padding:10}}>
      <button onClick={saveLocal} style={{flex:1,padding:14,background:'#111',color:'#fff',border:0,borderRadius:10}}>Save Draft</button>
      <button onClick={publish} style={{flex:1,padding:14,background:'#D90429',color:'#fff',border:0,borderRadius:10}}>Publish to Live Site</button>
      <button onClick={()=>{localStorage.removeItem('atassatube_site_config'); setCfg(FULL_MASTER_CONFIG); setMsg('Reset to Master Config');}} style={{padding:14,background:'#eee',border:0,borderRadius:10}}>Reset</button>
    </div>
  </main>);
}

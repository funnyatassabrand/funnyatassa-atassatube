'use client';
import { useState } from 'react';
export default function Studio() {
  const [pw, setPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [cfg, setCfg] = useState({ siteTitle: 'AtassaTube', tagline: 'Where Laughter Lives, Videos Trend, and Deals Are Real.', headerBg: '#D90429', accent: '#D90429', fontFamily: 'system-ui', footer: '© AtassaTube • funnyatassa.com', mainSite: 'https://www.funnyatassa.com' });
  const [connect, setConnect] = useState({ firebaseApiKey: '', firebaseAppId: '', supabaseUrl: '', supabaseKey: '', cloudName: 'seajqwas', preset: 'funnyatassa' });
  const login = async () => {
    setErr('');
    if (!pw) { setErr('Type your owner password.'); return; }
    if (!connect.firebaseApiKey || !connect.firebaseAppId) { setErr('Paste Firebase Api Key + App ID in Connect first, then login.'); return; }
    try {
      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
      const app = getApps().find((a) => a.name === 'auth-check') || initializeApp({ apiKey: connect.firebaseApiKey, appId: connect.firebaseAppId, projectId: 'atassatube-1b360' }, 'auth-check');
      await signInWithEmailAndPassword(getAuth(app), 'funnyatassabrand@gmail.com', pw);
      sessionStorage.setItem('atassatube_owner', '1');
      setAuthed(true); setPw('');
    } catch (e) { setErr('Wrong owner password. Studio did NOT open.'); }
  };
  const saveLocal = () => { try { localStorage.setItem('atassatube_site_config', JSON.stringify(cfg)); } catch (e) {} setMsg('Saved locally. Tap Publish to Supabase to make it live on main site + AtassaTube.'); };
  const publish = async () => {
    if (!connect.supabaseUrl || !connect.supabaseKey) { setMsg('Paste Supabase URL + Publishable Key in Connect first.'); return; }
    try {
      const res = await fetch(connect.supabaseUrl.replace(/\/$/, '') + '/rest/v1/app_config?id=eq.1', { method: 'PATCH', headers: { apikey: connect.supabaseKey, Authorization: 'Bearer ' + connect.supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=representation' }, body: JSON.stringify({ config: cfg }) });
      if (!res.ok) throw new Error('Supabase returned ' + res.status);
      setMsg('Published to Supabase app_config id=1 — main site + AtassaTube will read it on next load.');
    } catch (e) { setMsg('Publish failed: ' + e.message + ' — Local save is still kept.'); }
  };
  const saveConnect = () => { localStorage.setItem('atassatube_connect', JSON.stringify(connect)); setMsg('Connect saved on this device only. No secrets in code.'); };
  const field = (label, key) => (<label style={{ display: 'block', marginTop: 10, fontSize: 13 }}>{label}<input value={cfg[key]} onChange={(e) => setCfg({ ...cfg, [key]: e.target.value })} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 10, border: '1px solid #ddd' }} /></label>);
  const cfield = (label, key, ph) => (<input value={connect[key]} onChange={(e) => setConnect({ ...connect, [key]: e.target.value })} placeholder={ph || label} style={{ width: '100%', padding: 10, marginTop: 6, borderRadius: 10, border: '1px solid #ddd' }} />);
  if (!authed) return (<div style={{ maxWidth: 420, margin: '40px auto', padding: 20 }}><h2>Studio 🔒 Owner only</h2><p style={{ fontSize: 13, color: '#666' }}>Press & hold keyhole → password only. Session only — close = logged out.</p><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Owner password" style={{ width: '100%', padding: 12, borderRadius: 999, border: '1px solid #ddd' }} />{err && <div style={{ color: 'red', fontSize: 13, marginTop: 6 }}>{err}</div>}<button onClick={login} style={{ width: '100%', padding: 12, borderRadius: 999, border: 0, background: '#D90429', color: '#fff', fontWeight: 800, marginTop: 10 }}>Log In as Owner</button><h4>Connect (paste once, saved on device)</h4>{cfield('Firebase Api Key', 'firebaseApiKey')}{cfield('Firebase App ID', 'firebaseAppId')}{cfield('Supabase Project URL', 'supabaseUrl')}{cfield('Supabase Publishable Key', 'supabaseKey')}{cfield('Cloudinary Cloud Name', 'cloudName')}{cfield('Cloudinary Unsigned Preset', 'preset')}<button onClick={saveConnect} style={{ width: '100%', padding: 11, borderRadius: 999, border: 0, background: '#111', color: '#fff', marginTop: 8 }}>Save Connect</button>{msg && <div style={{ fontSize: 13, marginTop: 10 }}>{msg}</div>}</div>);
  return (<div style={{ maxWidth: 720, margin: '0 auto', padding: 16 }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2>Studio 🔒 Owner only</h2><button onClick={() => { sessionStorage.removeItem('atassatube_owner'); setAuthed(false); }} style={{ padding: '8px 12px', borderRadius: 999, border: 0, background: '#eee' }}>Log Out</button></div><h3>1 — Site text</h3>{field('Site title', 'siteTitle')}{field('Tagline (under logo)', 'tagline')}{field('Footer', 'footer')}<h3>2 — Colors & font</h3>{field('Header background (e.g. #D90429)', 'headerBg')}{field('Accent', 'accent')}{field('Font family', 'fontFamily')}<h3>3 — Links</h3>{field('Main site link', 'mainSite')}<h3>4 — Connect</h3>{cfield('Supabase Project URL', 'supabaseUrl')}{cfield('Supabase Publishable Key', 'supabaseKey')}<button onClick={saveConnect} style={{ width: '100%', padding: 11, borderRadius: 999, border: 0, background: '#111', color: '#fff', marginTop: 8 }}>Save Connect</button><button onClick={saveLocal} style={{ width: '100%', padding: 12, borderRadius: 999, border: 0, background: '#111', color: '#fff', fontWeight: 800, marginTop: 16 }}>Save (local preview)</button><button onClick={publish} style={{ width: '100%', padding: 12, borderRadius: 999, border: 0, background: '#D90429', color: '#fff', fontWeight: 800, marginTop: 8 }}>Publish to Supabase — live on main site + AtassaTube</button>{msg && <div style={{ fontSize: 13, marginTop: 10 }}>{msg}</div>}<p style={{ fontSize: 13, color: '#666', marginTop: 16 }}>Frame: AtassaTube is allowed to be framed only by funnyatassa.com / www.funnyatassa.com — set in next.config.js + vercel.json. Do not add a rewrite-all rule.</p></div>);
    }

'use client';
import { useState, useRef } from 'react';
export default function AtassaTube() {
  const [filter, setFilter] = useState('All');
  const [videos, setVideos] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const holdTimer = useRef(null);
  const holdFired = useRef(false);
  const startHold = () => {
    holdFired.current = false;
    holdTimer.current = setTimeout(() => {
      holdFired.current = true;
      window.location.href = '/studio';
    }, 1000);
  };
  const endHold = () => {
    clearTimeout(holdTimer.current);
  };
  const cats = ['All','Trending','Comedy','Shop my find','Live','Vlogs','Music'];
  return (
    <div>
      <header style={{ background: '#D90429', color: '#fff', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, fontSize: 22 }}>AtassaTube</div>
          <div style={{ fontSize: 12 }}>Where Laughter Lives, Videos Trend, and Deals Are Real.</div>
        </div>
        <button aria-label="Owner access" onPointerDown={startHold} onPointerUp={endHold} onPointerLeave={endHold} onContextMenu={(e) => e.preventDefault()} style={{ width: 44, height: 44, borderRadius: '50%', border: 0, background: '#0ea5e9', color: '#fff', fontSize: 22 }}>🔑</button>
      </header>
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '10px 14px' }}>
        {cats.map((c) => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '8px 12px', borderRadius: 999, border: '1px solid #ddd', background: filter === c ? '#111' : '#fff', color: filter === c ? '#fff' : '#111', whiteSpace: 'nowrap' }}>{c}</button>
        ))}
      </div>
      <div style={{ padding: '0 14px 20px' }}>
        <div style={{ fontSize: 13, color: '#666' }}>No videos loaded yet — press & hold the keyhole 1 sec to open Studio and Connect your real videos.</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 10 }}>
          {videos.map((v) => (
            <div key={v.id} onClick={() => setPlaying(v)}><img src={v.cover} alt={v.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 8 }} /><div style={{ fontSize: 12 }}>{v.title}</div></div>
          ))}
        </div>
        <div style={{ textAlign: 'center', fontSize: 12, color: '#888', marginTop: 24 }}>© AtassaTube • funnyatassa.com</div>
      </div>
      {playing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.9)', zIndex: 50, padding: 16 }}>
          <button onClick={() => setPlaying(null)} style={{ background: '#fff', border: 0, borderRadius: 999, padding: '8px 12px' }}>Close ✕</button>
          <video src={playing.url} controls autoPlay playsInline style={{ width: '100%', marginTop: 12, borderRadius: 12 }} />
          <div style={{ color: '#fff', marginTop: 8 }}>{playing.title}</div>
        </div>
      )}
      {loginOpen && <div>Owner Login</div>}
    </div>
  );
}

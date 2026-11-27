"use client";
import { useEffect, useRef, useState } from "react";
import { SITE } from "../lib/siteConfig";

const GA_ID = "G-H2YTGQXC8G";
const ADSENSE_ID = "ca-pub-5034040629777244";
const DEFAULT_GAPS = [{id:"gap-1",label:"Gap after header",size:"medium",enabled:true,adEnabled:true,adSlot:"1111111111"},{id:"gap-2",label:"Gap after videos row 1",size:"large",enabled:true,adEnabled:true,adSlot:"2222222222"},{id:"gap-3",label:"Gap before footer",size:"medium",enabled:true,adEnabled:false,adSlot:""}];
const GAP_PX = {small:12,medium:28,large:48};
const FALLBACK_VIDEOS = [
  { id: "v1", title: "Chinese in Africa", category: "Comedy" },
  { id: "v2", title: "Two brothers on one mission to make the world laugh", category: "Comedy" },
  { id: "v3", title: "Viral dance challenge", category: "Trending" },
];

function loadGaps(){ try{ const a=JSON.parse(localStorage.getItem("atassatube_gaps")||"[]"); if(a.length) return a; const b=JSON.parse(localStorage.getItem("siteConfig")||"{}"); if(b.gaps?.length) return b.gaps; if(SITE?.gaps?.length) return SITE.gaps; }catch(e){} return DEFAULT_GAPS; }
function loadVideos(){
  try{
    const a = JSON.parse(localStorage.getItem("atassatube_videos")||"[]");
    if(a.length) return a;
    const b = JSON.parse(localStorage.getItem("siteConfig")||"{}");
    if(b.videos?.length) return b.videos;
    if(SITE?.videos?.length) return SITE.videos;
  }catch(e){}
  return FALLBACK_VIDEOS;
}

function Gap({gap}){ const h=GAP_PX[gap.size]||28; useEffect(()=>{ try{ (window.adsbygoogle=window.adsbygoogle||[]).push({}); }catch(e){} },[gap]); return (<div style={{height:gap.adEnabled?"auto":h,minHeight:h,margin:"8px 16px",textAlign:"center"}}>{gap.adEnabled ? (<ins className="adsbygoogle" style={{display:"block"}} data-ad-client={ADSENSE_ID} data-ad-slot={gap.adSlot||"1111111111"} data-ad-format="auto" data-full-width-responsive="true"></ins>) : null}</div>); }
export default function AtassaTube(){
  const [videos,setVideos]=useState(FALLBACK_VIDEOS);
  const [gaps,setGaps]=useState(DEFAULT_GAPS);
  const [playing,setPlaying]=useState(null);
  const [showLogin,setShowLogin]=useState(false);
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const timer=useRef(null);

  useEffect(()=>{
    setVideos(loadVideos()); setGaps(loadGaps());
    // Google Analytics - visible in code + footer
    if(!document.querySelector(`script[src*="${GA_ID}"]`)){
      const s=document.createElement("script"); s.async=true;
      s.src=`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
      const s2=document.createElement("script");
      s2.innerHTML=`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');`;
      document.head.appendChild(s2);
    }
    if(!document.querySelector('script[src*="adsbygoogle"]')){ const a=document.createElement("script"); a.async=true; a.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+ADSENSE_ID; a.crossOrigin="anonymous"; document.head.appendChild(a); }
    // Try Firestore videos if Firebase config is present in siteConfig
    try{
      const cfg = SITE?.firebase || null;
      if(cfg?.apiKey){
        import("firebase/app").then(async ({initializeApp})=>{
          const {getFirestore,collection,getDocs}=await import("firebase/firestore");
          const app=initializeApp(cfg); const db=getFirestore(app);
          const snap=await getDocs(collection(db,"videos"));
          const list=snap.docs.map(d=>({id:d.id,...d.data()}));
          if(list.length){ setVideos(list); localStorage.setItem("atassatube_videos",JSON.stringify(list)); }
        }).catch(()=>{});
      }
    }catch(e){}
  },[]);

  const startHold=(e)=>{ e.preventDefault(); timer.current=setTimeout(()=>setShowLogin(true),1000); };
  const endHold=()=>{ if(timer.current) clearTimeout(timer.current); };

  const openStudio=(e)=>{
    e.preventDefault();
    // Owner password is checked in /studio - never stored here.
    window.location.href="/studio";
  };

  return (
    <main style={{fontFamily:"system-ui",background:"#fff",minHeight:"100vh",paddingBottom:40}}>
      <header style={{background:"#e11d48",color:"#fff",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:800,fontSize:22,lineHeight:1}}>AtassaTube</div>
          <div style={{fontSize:12,opacity:.95}}>Where Laughter Lives, Videos Trend, and Deals Are Real.</div>
        </div>
        {/* KEYHOLE ONLY - press & hold 1s = login, single tap = also opens Studio login (fallback for mobile) */}
        <button aria-label="Owner keyhole" onMouseDown={startHold} onMouseUp={endHold} onMouseLeave={endHold}
          onTouchStart={startHold} onTouchEnd={endHold} onClick={()=>setShowLogin(true)}
          style={{background:"#facc15",border:"none",borderRadius:"50%",width:44,height:44,fontSize:22,cursor:"pointer"}}>🔑</button>
      </header>

      <div style={{display:"flex",gap:8,padding:"10px 16px",flexWrap:"wrap"}}>
        {["All","Trending","Comedy","Shop my find","Live","Vlogs","Music"].map(c=>(
          <span key={c} style={{border:"1px solid #ddd",borderRadius:999,padding:"6px 12px",fontSize:13,background:c==="All"?"#111":"#fff",color:c==="All"?"#fff":"#111"}}>{c}</span>
        ))}
      </div>

      {gaps.filter(g=>g.enabled)[0] && (<Gap gap={gaps.filter(g=>g.enabled)[0]} />)}
      {videos.length===0 && <p style={{padding:"0 16px"}}>No videos loaded yet — press &amp; hold the keyhole 1 sec to open Studio and Connect your real videos.</p>}

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,padding:"0 16px"}}>
        {videos.map((v,i)=>(
          <div key={v.id||i} onClick={()=>setPlaying(v)} style={{cursor:"pointer"}}>
            {v.url||v.videoUrl ? (
              <video src={v.url||v.videoUrl} preload="metadata" style={{width:"100%",aspectRatio:"9/16",objectFit:"cover",borderRadius:12,background:"#000"}} />
            ) : (
              <div style={{width:"100%",aspectRatio:"9/16",borderRadius:12,background:"#111",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:8,fontSize:13}}>▶<br/>{v.title}</div>
            )}
            <div style={{fontSize:13,fontWeight:600,marginTop:6}}>{v.title}</div>
            <div style={{fontSize:11,color:"#666"}}>{v.category||"Comedy"}</div>
          </div>
        ))}
      </div>

      {gaps.filter(g=>g.enabled)[1] && (<Gap gap={gaps.filter(g=>g.enabled)[1]} />)}
      {playing && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
          <button onClick={()=>setPlaying(null)} style={{alignSelf:"flex-end",background:"#fff",border:"none",borderRadius:999,padding:"8px 14px"}}>✕ Close</button>
          <h3 style={{color:"#fff",textAlign:"center"}}>{playing.title}</h3>
          {(playing.url||playing.videoUrl) ? (
            <video src={playing.url||playing.videoUrl} controls autoPlay playsInline style={{width:"100%",maxWidth:420,borderRadius:12}} />
          ) : (
            <p style={{color:"#fff",textAlign:"center"}}>Video file not connected yet.<br/>Open Studio and Publish this video from Cloudinary / Firestore.</p>
          )}
          <button onClick={openStudio} style={{marginTop:14,background:"#facc15",border:"none",borderRadius:999,padding:"10px 18px",fontWeight:700}}>Open Studio</button>
        </div>
      )}

      {showLogin && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:60,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#fff",borderRadius:16,padding:20,width:"100%",maxWidth:340}}>
            <h3 style={{marginTop:0}}>Owner Login</h3>
            <p style={{fontSize:13,color:"#555"}}>Enter your existing owner password. No new password, no new account.</p>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Owner password"
              style={{width:"100%",padding:12,borderRadius:10,border:"1px solid #ddd",boxSizing:"border-box"}} />
            {err && <p style={{color:"red",fontSize:13}}>{err}</p>}
            <button onClick={()=>{ if(!password){ setErr("Enter your owner password."); return; } sessionStorage.setItem("atassa_owner_try","1"); window.location.href="/studio"; }}
              style={{width:"100%",marginTop:12,background:"#e11d48",color:"#fff",border:"none",borderRadius:999,padding:"12px",fontWeight:700}}>Continue to Studio</button>
            <button onClick={()=>setShowLogin(false)} style={{width:"100%",marginTop:8,background:"#eee",border:"none",borderRadius:999,padding:"10px"}}>Cancel</button>
            <p style={{fontSize:11,color:"#888",textAlign:"center"}}>Press &amp; hold keyhole 1 sec also opens this. Single tap works too.</p>
          </div>
        </div>
      )}

      {gaps.filter(g=>g.enabled)[2] && (<Gap gap={gaps.filter(g=>g.enabled)[2]} />)}
      <footer style={{textAlign:"center",fontSize:12,color:"#666",marginTop:30,padding:"0 16px"}}>
        <div>© AtassaTube • funnyatassa.com</div>
        <div>Google Analytics: G-H2YTGQXC8G</div>
        <div>Google AdSense: ca-pub-5034040629777244</div>
        <div>Visitors, clicks, scroll &amp; time spent are counted by Google Analytics.</div>
      </footer>
    </main>
  );
}

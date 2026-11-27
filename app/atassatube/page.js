"use client";
import { useEffect, useState } from "react";
import { SITE } from "../../lib/siteConfig";
const GA_ID = "G-H2YTGQXC8G";
const ADSENSE_ID = "ca-pub-5034040629777244";
const FALLBACK_VIDEOS = [
  { id: "v1", title: "Chinese in Africa", category: "Comedy" },
  { id: "v2", title: "Two brothers on one mission to make the world laugh", category: "Comedy" },
  { id: "v3", title: "Viral dance challenge", category: "Trending" },
];
export default function AtassaTubePage(){
  const [videos,setVideos]=useState(FALLBACK_VIDEOS);
  const [playing,setPlaying]=useState(null);
  useEffect(()=>{
    try{
      const a=JSON.parse(localStorage.getItem("atassatube_videos")||"[]");
      if(a.length) setVideos(a);
      else if(SITE?.videos?.length) setVideos(SITE.videos);
    }catch(e){}
  },[]);
  return (
    <main style={{fontFamily:"system-ui",background:"#fff",minHeight:"100vh",paddingBottom:40}}>
      <header style={{background:"#e11d48",color:"#fff",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontWeight:800,fontSize:22,lineHeight:1}}>AtassaTube</div>
          <div style={{fontSize:12,opacity:.95}}>Where Laughter Lives, Videos Trend, and Deals Are Real.</div>
        </div>
        <button onClick={()=>window.location.href="/studio"} style={{background:"#facc15",border:"none",borderRadius:"50%",width:44,height:44,fontSize:22,cursor:"pointer"}}>🔑</button>
      </header>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,padding:"16px"}}>
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
      {playing && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.9)",zIndex:50,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}}>
          <button onClick={()=>setPlaying(null)} style={{alignSelf:"flex-end",background:"#fff",border:"none",borderRadius:999,padding:"8px 14px"}}>✕ Close</button>
          <h3 style={{color:"#fff",textAlign:"center"}}>{playing.title}</h3>
          {(playing.url||playing.videoUrl) ? (
            <video src={playing.url||playing.videoUrl} controls autoPlay playsInline style={{width:"100%",maxWidth:420,borderRadius:12}} />
          ) : (
            <p style={{color:"#fff",textAlign:"center"}}>Video file not connected yet.<br/>Open Studio and Publish this video.</p>
          )}
        </div>
      )}
      <footer style={{textAlign:"center",fontSize:12,color:"#666",marginTop:30,padding:"0 16px"}}>
        <div>© AtassaTube • funnyatassa.com</div>
        <div>Google Analytics: G-H2YTGQXC8G</div>
        <div>Google AdSense: ca-pub-5034040629777244</div>
      </footer>
    </main>
  );
}

export const metadata = {
  title: 'AtassaTube',
  description: 'Where Laughter Lives, Videos Trend, and Deals Are Real.',
};

const GA_ID = "G-H2YTGQXC8G";
const ADSENSE_ID = "ca-pub-5034040629777244";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');` }} />
        <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`} crossOrigin="anonymous"></script>
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('atassa_theme')||localStorage.getItem('siteConfig_theme')||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}` }} />
        <style>{`html[data-theme="dark"]{background:#0f0f0f;color:#fff}html[data-theme="dark"] body{background:#0f0f0f;color:#fff}`}</style>
      </head>
      <body style={{ margin: 0, fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif', background: '#fff' }}>
        {children}
      </body>
    </html>
  );
}

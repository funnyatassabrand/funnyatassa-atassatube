export const metadata = {
  title: 'AtassaTube',
  description: 'Where Laughter Lives, Videos Trend, and Deals Are Real.'
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui,-apple-system,Segoe UI,Roboto,sans-serif', background: '#fff' }}>
        {children}
      </body>
    </html>
  );
}

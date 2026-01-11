import "./globals.css";
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Script
         src="https://www.googletagmanager.com/gtag/js?id=G-XVP6V5K2WH"
          strategy="afterInteractive"
        />
      <body>{children}</body>
    </html>
  )
}


// <script>
//   window.dataLayer = window.dataLayer || [];
//   function gtag(){dataLayer.push(arguments);}
//   gtag('js', new Date());

//   gtag('config', 'G-XVP6V5K2WH');
// </script>
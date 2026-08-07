import type { Metadata, Viewport } from "next";
import { Anton, Archivo, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

/* SPEC.md section 2. Anton has one weight only. */
const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-archivo",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
  variable: "--font-plex-mono",
});

const title = "Market Clarity Live. The free weekly market briefing";
const description =
  "A free 45 minute live briefing every Thursday. What moved this week, why it moved, and what careful investors are watching next.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "Market Clarity Live",
  },
};

export const viewport: Viewport = {
  themeColor: "#e63b12",
};

/*
  The live GA4 Measurement ID for this property, supplied by Isaac on
  2026-08-07 (decision D-12). Not a secret: it ships in the client bundle of
  every GA4 site and is visible in page source, so it belongs in the code
  rather than in an environment variable.
*/
const GA_MEASUREMENT_ID = "G-0QXCCQYR17";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${plexMono.variable}`}>
      <body>
        {children}

        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>

        {/*
          Meta Pixel. Left commented deliberately: the Pixel ID is a human gate.
          Uncomment and replace PIXEL_ID once Isaac supplies it.

          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', 'PIXEL_ID');
              fbq('track', 'PageView');
            `}
          </Script>
        */}
      </body>
    </html>
  );
}

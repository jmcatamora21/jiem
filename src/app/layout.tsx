import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./media.css";
import "./classes.css";
import Script from "next/script";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const imperialScriptFont = localFont({
  src: "/fonts/ImperialScript-Regular.ttf",
  variable: "--font-imperial",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jmcadev.site"), // <-- change to your actual domain
  title: {
    default: "John Mark Catamora - Portfolio",
    template: "%s | John Mark Catamora",
  },
  description:
    "Frontend developer crafting fast, accessible, and user-friendly web apps with React, Next.js, and modern design.",
  keywords: [
    "Frontend Developer",
    "Next.js",
    "React",
    "Web Developer Portfolio",
    "John Mark Catamora",
  ],
  authors: [{ name: "John Mark Catamora" }],
  openGraph: {
    title: "John Mark Catamora - Portfolio",
    description:
      "Frontend developer crafting fast, accessible, and user-friendly web apps with React, Next.js, and modern design.",
    url: "https://jmcadev.site",
    siteName: "John Mark Catamora Portfolio",
    locale: "en_US",
    type: "website",
  },

  alternates: {
    canonical: "https://jmcadev.site",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} ${imperialScriptFont.variable} antialiased`}
      >
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-575M451X8K', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        {children}
        
      </body>
    </html>
  );
}

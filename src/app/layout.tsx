import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./media.css";
import "./classes.css";

const interFont = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const imperialScriptFont = localFont({
  src: "/fonts/ImperialScript-Regular.ttf",
  variable: "--font-imperial",
});

export const metadata: Metadata = {
  title: "John Mark Catamora - Portfolio",
  description: "Frontend developer crafting fast, accessible, and user-friendly web apps with React, Next.js, and modern design.",
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
        {children}
      </body>
    </html>
  );
}

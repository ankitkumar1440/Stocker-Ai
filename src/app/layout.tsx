import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stocker-Ai | High-Performance Stock Analysis",
  description: "Invest smarter with AI-powered stock tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="zap-site-verification" content="zap-verify-81612d3a-a65a-4070-a524-16133b61706d" />
        <meta name="owner-email" content="akkr1440@gmail.com" />
      </head>
      <body className={`${spaceGrotesk.variable} ${manrope.variable} antialiased min-h-screen flex flex-col`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

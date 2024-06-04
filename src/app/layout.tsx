import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/react';

import { AuthContextProvider } from "@/context/AuthContext";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// Load the fonts
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

// Metadata for the application
export const metadata = {
  title: "Echoes",
  description: "Where Your Voice is Resonated, Not Judged",
};

// Root layout component for the application
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      {/*
        The <head /> component will contain the components returned by the nearest parent
        head.js. It can be used to define the document head for SEO, metadata, and other purposes.
        Learn more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        {/* Wrap the children with the AuthContextProvider to provide authentication context */}
        <AuthContextProvider>{children}</AuthContextProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import {
  Space_Grotesk,
  Inter,
  IBM_Plex_Mono,
} from "next/font/google";

import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";

/*
  LABSTOCK TYPOGRAPHY SYSTEM
  ===========================

  Space Grotesk
  -------------
  Display / identity font.

  Used for:
  - LabStock wordmark
  - Page titles
  - Large section headings
  - Empty-state headlines

  We deliberately keep this font limited to
  display moments so the application does not
  become visually noisy.


  Inter
  -----
  Primary UI font.

  Used for:
  - Navigation
  - Buttons
  - Filters
  - Form labels
  - Descriptions
  - Small interface text

  Inter remains highly readable at smaller sizes,
  particularly around 13–14px.


  IBM Plex Mono
  -------------
  Scientific / technical data font.

  Used for:
  - Quantities
  - Batch numbers
  - Catalogue IDs
  - Measurements
  - Inventory codes
  - Technical values

  The monospaced appearance helps distinguish
  actual laboratory data from interface text.
*/

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});


export const metadata: Metadata = {
  title: {
    default: "LabStock",
    template: "%s | LabStock",
  },

  description:
    "Laboratory inventory and research material management system",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      className={`
        ${spaceGrotesk.variable}
        ${inter.variable}
        ${plexMono.variable}
        h-full
        antialiased
      `}
    >

      <body className="min-h-full flex flex-col">

        <MainLayout>
          {children}
        </MainLayout>

      </body>

    </html>

  );
}
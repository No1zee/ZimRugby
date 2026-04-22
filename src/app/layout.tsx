import type { Metadata } from "next";
import { Montserrat, Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Zimbabwe Rugby Union | The Sables",
  description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and stay updated with the latest news, fixtures, and results.",
  manifest: "/manifest.json",
  themeColor: "#006432",
};

import dynamic from "next/dynamic";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

const SmoothScrollProvider = dynamic(() => import("@/components/layout/SmoothScrollProvider"), { ssr: false });
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), { ssr: false });
const MobileDock = dynamic(() => import("@/components/layout/MobileDock"), { ssr: false });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${montserrat.variable} ${bebasNeue.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        <SmoothScrollProvider>
          <CustomCursor />
          <Navigation />
          <main className="pb-24">
            {children}
          </main>
          <Footer />
          <MobileDock />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

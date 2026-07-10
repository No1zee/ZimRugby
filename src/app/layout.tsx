import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ClientLayoutShell from "@/components/layout/ClientLayoutShell";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
  openGraph: {
    title: "Zimbabwe Rugby Union | The Sables",
    description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and stay updated with the latest news, fixtures, and results.",
    url: "https://zimrugby.vercel.app/",
    siteName: "Zimbabwe Rugby Union",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Zimbabwe Rugby Union Cover",
      },
    ],
    locale: "en_ZW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body
        className={`${outfit.variable} ${bebasNeue.variable} ${inter.variable} antialiased overflow-x-hidden`}
      >
        <noscript>
          <div className="bg-red-950 text-white p-4 text-center font-bold text-sm font-sans">
            JavaScript is disabled. For the best experience on the Zimbabwe Rugby Union platform, please enable JavaScript in your browser settings.
          </div>
        </noscript>
        <Script src="https://t.contentsquare.net/uxa/97d0dc6c80d47.js" strategy="afterInteractive" />
        <ClientLayoutShell>
          <Navigation />
          <main className="relative overflow-hidden pb-24 min-h-screen bg-rich-black">
            {children}
          </main>
          <Footer />
        </ClientLayoutShell>
      </body>
    </html>
  );
}

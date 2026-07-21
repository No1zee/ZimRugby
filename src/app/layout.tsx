import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ClientLayoutShell from "@/components/layout/ClientLayoutShell";

export const metadata: Metadata = {
  metadataBase: new URL("https://zimrugby.co.zw"),
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
      <body className="antialiased overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-zru-green focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <noscript>
          <div className="bg-red-950 text-white p-4 text-center font-bold text-sm font-sans">
            JavaScript is disabled. For the best experience on the Zimbabwe Rugby Union platform, please enable JavaScript in your browser settings.
          </div>
        </noscript>
        <ClientLayoutShell>
          <Navigation />
          <main id="main-content" className="relative overflow-hidden pb-24 min-h-screen bg-milk-white">
            {children}
          </main>
          <Footer />
        </ClientLayoutShell>
      </body>
    </html>
  );
}

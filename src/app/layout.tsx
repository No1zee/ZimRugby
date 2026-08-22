import type { Metadata, Viewport } from "next";
import { Montserrat, Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import ClientLayoutShell from "@/components/layout/ClientLayoutShell";
import PageTransitionLoader from "@/components/common/PageTransitionLoader";
import { directusFetch } from "@/lib/directus/fetch";
import { AdaptivePerformanceProvider } from "@/components/providers/AdaptivePerformanceProvider";
import { DraftAdminBar } from "@/components/admin/DraftAdminBar";
import { InSituLiveDrawer } from "@/components/admin/InSituLiveDrawer";
import EditModeShell from "@/components/admin/EditModeShell";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFBF0" },
    { media: "(prefers-color-scheme: dark)", color: "#006747" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://zimrugby.co.zw"),
  title: "Zimbabwe Rugby Union | The Sables",
  description: "Official website of the Zimbabwe Rugby Union. Follow the Sables, Lady Sables, and stay updated with the latest news, fixtures, and results.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ZimRugby",
  },
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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerNav = await directusFetch<any>("footer_navigation", {
    sort: ["sort"],
  }).catch(() => []);

  return (
    <html lang="en" className="min-h-dvh">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="ZimRugby" />
      </head>
        <body className={`${montserrat.variable} ${bebasNeue.variable} ${inter.variable} antialiased min-h-dvh flex flex-col justify-between`}>
        <DraftAdminBar />
        <InSituLiveDrawer />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-zru-green focus:text-white focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <noscript>
          <div className="bg-red-950 text-white p-4 text-center font-bold text-sm font-body">
            JavaScript is disabled. For the best experience on the Zimbabwe Rugby Union platform, please enable JavaScript in your browser settings.
          </div>
        </noscript>
        {/* Page transition particle burst loader — fires on mount and on every route change */}
        <PageTransitionLoader />
        <AdaptivePerformanceProvider>
          <EditModeShell>
            <ClientLayoutShell>
              <Navigation />
              <main id="main-content" className="relative min-h-screen bg-milk-white">
                {children}
              </main>
              <Footer initialColumns={footerNav} />
            </ClientLayoutShell>
          </EditModeShell>
        </AdaptivePerformanceProvider>
      </body>
    </html>
  );
}

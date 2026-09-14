import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { DemoRoleSwitcher } from "@/components/common/DemoRoleSwitcher";
import { Navbar } from "@/components/common/Navbar";
import { GovtTopBar } from "@/components/common/GovtTopBar";
import { GovtFooter } from "@/components/common/GovtFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "कार्यसेतु (KaryaSetu) — National Labour Cooperative Federation Platform",
  description:
    "Official Indian Government platform under Ministry of Cooperation for Multi-State Labour Cooperatives. 90% direct artisan remuneration, PMSBY healthcare shield, zero surge fees (SIH26089).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col bg-[#07172B] text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
        <AppProvider>
          <GovtTopBar />
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col bg-[#07172B]">
            {children}
          </main>
          <GovtFooter />
        </AppProvider>
      </body>
    </html>
  );
}

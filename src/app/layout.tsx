import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { DemoRoleSwitcher } from "@/components/common/DemoRoleSwitcher";
import { Navbar } from "@/components/common/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sahakarya (सहकार्य) — Worker-Owned Cooperative Gig Platform",
  description:
    "India's worker-owned gig platform for Labour Cooperative Federations. Ensuring 90% direct payouts, free healthcare, and community trust (SIH26089).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-500">
        <AppProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
        </AppProvider>
      </body>
    </html>
  );
}

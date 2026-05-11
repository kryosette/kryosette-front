import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css' 
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kryosette",
  description:
    "A social network built from the ground up for security, resilience, and true ownership.",
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} relative bg-black text-white antialiased`}>
        <Header />
        <Analytics />
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}
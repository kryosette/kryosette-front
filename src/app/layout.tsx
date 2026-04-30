import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "/Users/dimaeremin/kryosette-front/src/app/globals.css";
import { AuthProvider } from "@/lib/auth-provider";
import { ChatProvider } from "./(private)/home/chat/ChatContext";
import Header from "@/components/Header";
import DotsBackground from "@/components/DotsBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kryosette",
  description:
    "A social network built from the ground up for security, resilience, and true ownership.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative`}>
        <Header />
        {/* Основной контент с белым фоном */}
        <main className="relative z-10 bg-white min-h-screen">{children}</main>
      </body>
    </html>
  );
}
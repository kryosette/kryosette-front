import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import { AuthProvider } from "@/lib/auth-provider";
import { ChatProvider } from "./(private)/home/chat/ChatContext";
import Header from "@/components/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "kryosette",
  description: "A social network built from the ground up for security, resilience, and true ownership.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
            <Header />
            <main>{children}</main>
      </body>
    </html>
  );
}
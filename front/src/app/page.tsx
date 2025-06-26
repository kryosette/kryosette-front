import Card from "@/components/animation/card";
import CookieConsentBanner from "@/components/cookies/cookie-consent";
import { MainMenu } from "@/components/menu/main";
import { Navbar } from "@/components/menu/main/navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Navbar />
      <MainMenu />
      <CookieConsentBanner />
    </div>
  );
}

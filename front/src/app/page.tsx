import CookieConsentBanner from "@/lib/cookies/cookie-consent";
import { MainMenu } from "@/components/menu/main";
import { Navbar } from "@/components/menu/main/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <MainMenu />
      <CookieConsentBanner />
    </div>
  );
}

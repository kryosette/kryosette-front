import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Threat Model – kryosette",
  description: "What kryosette protects against and what it does not.",
};

export default function ThreatModelPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-8">
          Threat Model
        </h1>
        <p className="text-sm text-white/40 mb-10">Last updated: May 2026</p>

        <div className="prose prose-invert max-w-none text-white/70 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white">What kryosette protects against</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Mass surveillance:</strong> No central server collects metadata or message contents.</li>
              <li><strong className="text-white">Third‑party data mining:</strong> No analytics, no tracking, no profiling.</li>
              <li><strong className="text-white">Network eavesdropping:</strong> End‑to‑end encryption and onion routing prevent intermediaries from reading or modifying traffic.</li>
              <li><strong className="text-white">Server‑side compromise:</strong> There is no server that holds user data, so there is nothing to breach.</li>
              <li><strong className="text-white">Content censorship:</strong> Peer‑to‑peer architecture makes it extremely difficult for any single actor to block content.</li>
              <li><strong className="text-white">Forced disclosure:</strong> We cannot hand over what we don't have. User data is local only.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">What kryosette does NOT protect against (because the opposite has not been proven theoretically)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-white">Physical access to your device:</strong> If an attacker has physical access to your unlocked machine, they can access your local data.</li>
              <li><strong className="text-white">Keyloggers or malware on your system:</strong> The security of the Application depends on the security of the underlying operating system.</li>
              <li><strong className="text-white">Social engineering:</strong> No technology can fully protect against manipulation of the human element.</li>
              <li><strong className="text-white">Advanced traffic correlation attacks:</strong> While onion routing obfuscates your traffic, a powerful global adversary may be able to correlate network patterns.</li>
              <li><strong className="text-white">Rubber‑hose cryptanalysis:</strong> We cannot protect you if someone forces you to reveal your keys.</li>
            </ul>
          </section>

          
        </div>
      </div>
    </div>
  );
}
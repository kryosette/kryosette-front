import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Warrant Canary – kryosette",
  description: "Our public statement regarding secret government requests.",
};

export default function WarrantCanaryPage() {
  const currentDate = "May 2026";

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
          Warrant Canary (in future)
        </h1>
        <p className="text-sm text-white/40 mb-10">Last updated: {currentDate}</p>

        <div className="prose prose-invert max-w-none text-white/70 space-y-6">
          <p>
            This page serves as a public declaration that the developers of kryosette have not
            received certain types of secret government requests. This is known as a "warrant
            canary." If this page is removed or stops being updated, you may infer that we have
            been served with a secret order and are legally prevented from disclosing it.
          </p>

          <p>
            As of <strong className="text-white">{currentDate}</strong>, the kryosette project has received:
          </p>

          <ul className="list-none space-y-4 pl-0">
            <li className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✓</span>
              <span><strong className="text-white">0</strong> National Security Letters</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✓</span>
              <span><strong className="text-white">0</strong> Foreign Intelligence Surveillance Act (FISA) court orders</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✓</span>
              <span><strong className="text-white">0</strong> Gag orders under any jurisdiction</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✓</span>
              <span><strong className="text-white">0</strong> Secret warrants or subpoenas for user data</span>
            </li>
            <li className="flex items-center">
              <span className="text-green-500 text-xl mr-3">✓</span>
              <span><strong className="text-white">0</strong> Requests to introduce backdoors or weaken encryption</span>
            </li>
          </ul>

          <p>
            We will update this page monthly. The lack of an update should be considered
            significant. (in future)
          </p>

          <p className="italic text-white/40">
            "If a canary dies, you must leave the coal mine."
          </p>
        </div>
      </div>
    </div>
  );
}
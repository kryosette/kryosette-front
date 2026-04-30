import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Manifesto – kryosette",
  description: "The principles and vision behind kryosette.",
};

export default function ManifestoPage() {
  return (
    <div className="min-h-screen bg-white pt-11">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-black/60 hover:text-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to home
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mb-8">
          Manifesto
        </h1>

        <div className="prose prose-neutral max-w-none text-black/75 space-y-6">
          <p className="text-xl font-medium text-black/80">
            We believe in a digital world where individuals – not corporations, not governments –
            control their own data, identity, and communication.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-black">1. Privacy is not a feature. It is the foundation.</h2>
            <p>
              Every decision we make starts with the question: “Does this protect the user?”
              If the answer is no, we don’t build it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">2. You are not the product.</h2>
            <p>
              There are no advertisers, no data brokers, no hidden trackers. kryosette exists to serve
              its users, not to monetise their behaviour.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">3. The network belongs to its participants.</h2>
            <p>
              There is no central server that can be bought, subpoenaed, or shut down. The power
              resides where it belongs: in the hands of the people who use the network.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">4. Encryption is non‑negotiable.</h2>
            <p>
              Every byte that leaves your machine is encrypted. We do not provide backdoors. We
              do not weaken security for convenience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">5. Transparency builds trust.</h2>
            <p>
              We will always be honest about what we can and cannot protect you from. No marketing
              fluff. No false promises. Just clear, technical truth.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">6. The right to disappear.</h2>
            <p>
              You can delete your local data at any time. There is nothing to “deactivate” on a
              server, because there is no server‑side profile. You were never in our database,
              because our database is your device.
            </p>
          </section>

          <p className="text-lg italic text-black/60 pt-4">
            — The kryosette team
          </p>
        </div>
      </div>
    </div>
  );
}
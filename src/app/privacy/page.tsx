import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – kryosette",
  description: "How kryosette handles your data and privacy.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-sm text-black/50 mb-10">Last updated: May 2026</p>

        <div className="prose prose-neutral max-w-none text-black/75 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-black">1. Introduction</h2>
            <p>
              At kryosette, your privacy is the foundation of our design. This Privacy Policy explains
              how we handle information when you use our Application. Because kryosette is built to
              keep you in control, we intentionally collect as little data as possible—and most
              information stays on your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">2. Information We Collect</h2>
            <p>
              <strong>We do not collect personal information.</strong> The Application is designed to
              store your profile, contacts, messages, and all other data locally on your machine.
              kryosette does not operate central servers that log your activity, harvest your contacts,
              or track your behavior.
            </p>
            <p>
              When you communicate with other users, the Application uses peer‑to‑peer protocols. We
              do not have access to the content of your communications, nor do we store them on our
              systems.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">3. Cookies and Tracking</h2>
            <p>
              <strong>We do not use cookies, analytics trackers, or any other monitoring
              technologies.</strong> Our website does not set any third‑party cookies. The Application
              itself does not embed any telemetry, crash reporting, or usage analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">4. How We Use Your Information</h2>
            <p>
              Because we do not collect personal information, we have nothing to use, share, or sell.
              All processing happens on your device. You decide what data you share and with whom.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">5. Data Sharing and Disclosure</h2>
            <p>
              <strong>We do not share your data with third parties.</strong> Since your data is stored
              locally, we have no ability to hand it over to governments, advertisers, or any other
              entity. Any request for user data would yield nothing, because we simply do not possess
              it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">6. Security</h2>
            <p>
              kryosette employs end‑to‑end encryption, proprietary onion routing, and local‑first
              architecture to protect your communications. While we strive to provide robust security
              measures, no system can be 100% secure. You are responsible for maintaining the security
              of your device and your private keys.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">7. Children's Privacy</h2>
            <p>
              The Application is not directed to individuals under the age of majority in their
              jurisdiction. We do not knowingly collect personal information from children. If you are
              a parent or guardian and believe your child has provided us with personal data, please
              contact us—though, given our architecture, there would be nothing for us to delete.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">8. International Data Transfers</h2>
            <p>
              Since your data stays on your device, no international transfer of personal data occurs
              through our infrastructure. When you use peer‑to‑peer communication, data may be routed
              through nodes located in various countries, but it remains encrypted end‑to‑end.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page. You are advised to review this Privacy
              Policy periodically for any changes. Continued use of the Application after
              modifications constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-black">10. Contact Us</h2>
            <p>
              If you have questions or concerns about this Privacy Policy, please reach out to{" "}
              <a href="mailto:kryosette@gmail.com" className="text-black underline">
                kryosette@gmail.com
              </a>{" "}
              or find our PGP key on the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
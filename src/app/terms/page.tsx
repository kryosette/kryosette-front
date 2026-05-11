import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use – kryosette",
  description: "Terms and conditions for using kryosette.",
};

export default function TermsPage() {
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
          Terms of Use
        </h1>
        <p className="text-sm text-white/40 mb-10">Last updated: May 2026</p>

        <div className="prose prose-invert max-w-none text-white/70 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing or using kryosette ("the Application"), you agree to be bound by these Terms
              of Use. If you do not agree, do not use the Application. The Application is intended for
              users who are at least the age of majority in their jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Description of Service</h2>
            <p>
              kryosette is a security‑focused, decentralized social network designed to run on desktop
              Linux systems. The Application stores your data locally on your device. kryosette does not
              operate central servers that host user content; instead, it facilitates peer‑to‑peer
              communication where you remain in control of your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. User Content and Responsibilities</h2>
            <p>
              You are solely responsible for any content you publish, share, or transmit through the
              Application. You retain all ownership rights to your content. We do not claim any
              ownership over your data. You agree not to post content that is illegal, harmful,
              threatening, abusive, defamatory, or otherwise objectionable.
            </p>
            <p>
              We do not monitor, moderate, or control user‑generated content and disclaim any liability
              arising from such content. If you encounter objectionable content, you may use the
              privacy controls of the Application to limit your exposure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Application for any unlawful purpose or in violation of any applicable laws.</li>
              <li>
                Interfere with or disrupt the Application, its underlying network, or other users'
                enjoyment.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Application or its related
                systems.
              </li>
              <li>Transmit viruses, malware, or any other malicious code.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Disclaimer of Warranties</h2>
            <p>
              THE APPLICATION IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT
              WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED
              BY LAW, KRYOSETTE DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON‑INFRINGEMENT. WE DO NOT WARRANT THAT THE APPLICATION
              WILL BE UNINTERRUPTED, ERROR‑FREE, OR COMPLETELY SECURE.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL KRYOSETTE OR ITS
              DEVELOPERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
              PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR
              PERSONAL INJURY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE APPLICATION,
              WHETHER BASED ON WARRANTY, CONTRACT, TORT, OR ANY OTHER LEGAL THEORY, EVEN IF
              ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Intellectual Property</h2>
            <p>
              The Application and its original content (excluding user‑generated content), features,
              and functionality are owned by the developers of kryosette and are protected by
              international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your access to the Application at any
              time, without prior notice, for conduct that we believe violates these Terms or is
              harmful to other users or the integrity of the Application. Since the Application
              operates locally, termination means you should delete your local instance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the jurisdiction in which the developers
              are based, without regard to conflict of law principles. Any dispute arising from these
              Terms shall be resolved exclusively in the competent courts of that jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Changes to These Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. If a revision is
              material, we will try to provide at least 30 days' notice prior to any new terms taking
              effect. Continued use of the Application after such modifications constitutes your
              acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">11. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:kryosette@gmail.com" className="text-white underline hover:text-white/80">
                kryosette@gmail.com
              </a>{" "}
              or via our PGP key available on the website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
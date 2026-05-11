import Link from "next/link";
import { ArrowLeft, Download, Image, FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press Kit – kryosette",
  description: "Logos, screenshots, and brand assets for kryosette.",
};

export default function PressKitPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      <section className="relative min-h-[50vh] flex items-center px-6 lg:px-16 py-20">
        <div className="max-w-5xl mx-auto w-full">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-white/40 hover:text-white/70 transition-colors mb-16"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to home
          </Link>

          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase mb-8">
              Brand assets
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Press Kit
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              Official logos, screenshots, and brand guidelines for kryosette.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <Image className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Logo</h3>
              <p className="text-sm text-white/40 mb-6">PNG, SVG, and PDF formats</p>
              <a
                href="/assets/logo.png"
                download
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/60 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <FileText className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Brand Guide</h3>
              <p className="text-sm text-white/40 mb-6">Colors, typography, and usage rules</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/30">
                Coming soon
              </span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 text-center">
              <Image className="w-12 h-12 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Screenshots</h3>
              <p className="text-sm text-white/40 mb-6">Interface previews for media use</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-white/30">
                Coming soon
              </span>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="text-sm text-white/30">
              For press inquiries, contact{" "}
              <a href="mailto:kryosette@gmail.com" className="text-white/50 hover:text-white underline">
                kryosette@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
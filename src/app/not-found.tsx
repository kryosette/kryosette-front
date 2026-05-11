// src/app/not-found.tsx
import Link from "next/link";
import { ArrowLeft, Shield, Lock } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Background watermarked kryosette */}
        <div className="relative mb-8">
          <p className="text-[8rem] sm:text-[12rem] lg:text-[16rem] font-extrabold text-white/[0.03] leading-none select-none pointer-events-none tracking-[-0.05em] whitespace-nowrap">
            kryosette
          </p>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <p className="text-[11px] font-semibold tracking-[0.38em] text-white/30 uppercase">
              Error 404
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-[-0.03em] text-white">
              This page doesn't exist
            </h1>
            <p className="text-sm text-white/30 max-w-sm mt-2 leading-relaxed">
              Neither does our database of your activity, our collection of your personal data, or our records of your browsing history.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to home
          </Link>
          <Link
            href="/manifesto"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-white/10 border border-white/10 rounded-full hover:bg-white/20 transition-all"
          >
            <Shield className="w-4 h-4 mr-2" />
            Manifesto
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-xs text-white/15">
          <Lock className="w-3 h-3" />
          <span>This 404 is not logged. We promise.</span>
        </div>
      </div>
    </div>
  );
}
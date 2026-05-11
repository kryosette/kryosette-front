import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Video, ExternalLink, Construction } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events – kryosette",
  description: "Talks, conferences, and appearances.",
};

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-11">
      <section className="relative min-h-[60vh] flex items-center px-6 lg:px-16 py-20">
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
              Talks & appearances
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Events
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              Nothing here yet. We'll be hitting the conference circuit soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
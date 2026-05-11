import Link from "next/link";
import { ArrowLeft, MessageCircle, Github, Send, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community – kryosette",
  description: "Join the kryosette community.",
};

const channels = [
  {
    icon: Send,
    title: "Telegram",
    description: "Real-time discussions, announcements, and polls.",
    href: "https://t.me/kryosette",
    label: "Join Channel",
  },
  {
    icon: MessageCircle,
    title: "Telegram Group",
    description: "Chat with other users, share feedback, and get help.",
    href: "https://t.me/+mWDX9nWoFwdjZTEy",
    label: "Join Group",
  },
  {
    icon: Github,
    title: "GitHub Discussions",
    description: "Technical discussions, feature requests, and development updates.",
    href: "https://github.com/kryosette",
    label: "View GitHub",
    external: true,
  },
  {
    icon: BookOpen,
    title: "Self University",
    description: "Deep-dive articles, PDF library, and our knowledge base.",
    href: "https://selfuniversity.vercel.app",
    label: "Start Learning",
    external: true,
  },
];

export default function CommunityPage() {
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
              Get involved
            </p>
            <h1 className="text-[4.5rem] sm:text-[7rem] lg:text-[9rem] font-extrabold tracking-[-0.04em] leading-[0.9] text-white mb-6">
              Community
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-light text-white/40 max-w-2xl leading-relaxed">
              Join the network. Not the platform.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {channels.map((ch, i) => (
              <a
                key={i}
                href={ch.href}
                target={ch.external ? "_blank" : undefined}
                rel={ch.external ? "noopener noreferrer" : undefined}
                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all"
              >
                <ch.icon className="w-8 h-8 text-white/40 group-hover:text-white/60 transition-colors mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">{ch.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed mb-6">{ch.description}</p>
                <span className="inline-flex items-center text-xs font-semibold tracking-wider text-white/30 uppercase group-hover:text-white/50 transition-colors">
                  {ch.label} →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
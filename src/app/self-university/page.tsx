import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Github,
  Puzzle,
  Gamepad2,
  GitGraph,
  Trophy,
  Microscope,
  Network,
  BrainCircuit,
} from "lucide-react";

export default function SelfUniversityPage() {
  return (
    <div className="min-h-screen bg-black pt-11">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-blue-500/10 rounded-full mb-6">
          <GraduationCap className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
          Self University
        </h1>
        <p className="text-xl md:text-2xl text-white/50 mb-8 max-w-3xl mx-auto">
          A comprehensive curriculum for deep understanding, not just memorization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://selfuniversity.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-black bg-white rounded-full hover:bg-gray-200 transition-colors"
          >
            Start Learning
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/Self-University"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-transparent border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            <Github className="mr-2 w-5 h-5" />
            GitHub
          </Link>
        </div>
      </section>

      {/* What's Coming */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-white text-center mb-16">
          What's Coming
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Mini Courses */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
              <Puzzle className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mini Courses</h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              Deep-dive courses that fit together like puzzle pieces. Each one
              covers a single topic — TCP/IP, memory allocators, or TLS — with
              practical assignments. Complete them to unlock new courses and
              achievements.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              Coming Summer 2026
            </span>
          </div>

          {/* Practicum Arena */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <Gamepad2 className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Practicum Arena</h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              A platform for solving real-world system programming challenges.
              Write your own TCP stack, memory allocator, or cryptographic
              primitive. Compete with others, earn ranks, and build a portfolio
              of verified solutions.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              In Design
            </span>
          </div>

          {/* Knowledge Graph */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <GitGraph className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Knowledge Graph</h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              All topics connected in a neural-like graph. Each completed
              course activates new connections. Missing nodes create a
              compelling urge to fill the gaps. Your progress becomes visible,
              beautiful, and addictive.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              In Development
            </span>
          </div>

          {/* Gamification */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
              <Trophy className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Gamification</h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              Earn achievements like "Network Guru" or "Cryptographer". Build
              your profile with rare badges. Your status reflects real expertise,
              not just course completion. Leaderboards, streaks, and special
              rewards for consistent learners.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              Planned
            </span>
          </div>

          {/* Truth Engine Integration */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Formal Verification
            </h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              Powered by the Truth Engine. Your solutions will be formally
              verified — not just tested against a few examples, but
              mathematically proven correct. A standard that no other
              educational platform offers.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              Research Phase
            </span>
          </div>

          {/* Research Lab */}
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
              <Microscope className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Research Lab</h3>
            <p className="text-sm text-white/45 leading-relaxed flex-1">
              Advanced topics and original research. Deep explorations of
              topics that go beyond textbooks. Some content will be exclusive
              to premium members — because the most valuable knowledge is
              worth protecting.
            </p>
            <span className="text-[11px] font-semibold tracking-wider text-white/20 uppercase mt-4">
              Future
            </span>
          </div>
        </div>
      </section>

      {/* Current Progress */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Current Progress
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">83</div>
            <p className="text-sm text-white/45">PDF Documents</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">4</div>
            <p className="text-sm text-white/45">Blog Posts Published</p>
          </div>
          <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-8">
            <div className="text-4xl font-extrabold text-white mb-2">∞</div>
            <p className="text-sm text-white/45">Topics Planned</p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-10 text-center">
          <p className="text-lg text-white/50 italic leading-relaxed max-w-2xl mx-auto">
            "I have a very interesting idea, so wait a couple of years."
          </p>
        </div>
      </section>
    </div>
  );
}
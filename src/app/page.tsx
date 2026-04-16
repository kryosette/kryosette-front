import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Database, Zap, Globe, Lock } from "lucide-react";
import { technologies } from "@/lib/technologies";
import GraphBackground from "@/components/GraphBackground";

export default function Home() {
  return (
    <>
      {/* Hero Section с 3D‑фоном */}
      <section className="relative min-h-[90vh] flex items-center justify-center text-center overflow-hidden">
        {/* 3D‑фон только для этого блока */}
        <div className="absolute inset-0 -z-10">
          <GraphBackground />
        </div>

        <div className="relative z-10 max-w-5xl px-4 py-20">
  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] [text-shadow:_0_0_10px_rgb(0_0_0_/_80%),_0_0_20px_rgb(0_0_0_/_60%),_0_0_30px_rgb(0_0_0_/_40%)]">
    kryosette
  </h1>
  <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto [text-shadow:_0_0_8px_rgb(0_0_0_/_90%),_0_0_16px_rgb(0_0_0_/_70%),_0_0_24px_rgb(0_0_0_/_50%)]">
    A social network built from the ground up for security, resilience,
    and true ownership. <br className="hidden sm:block" />
    Desktop only · Linux x86 · C/ASM core.
  </p>
  <div className="flex flex-col sm:flex-row gap-4 justify-center">
    <Link
      href="#technologies"
      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl"
    >
      Discover the tech
      <ArrowRight className="ml-2 w-4 h-4" />
    </Link>
    <Link
      href="/self-university"
      className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black/30 backdrop-blur-sm border border-white/40 rounded-full hover:bg-black/50 hover:border-white/60 transition-all shadow-lg [text-shadow:_0_0_8px_rgb(0_0_0_/_80%)]"
    >
      Self University
    </Link>
  </div>
</div>
      </section>

      {/* Остальной контент – обычный светлый фон */}
      <div className="bg-white">
        {/* Preview Image (from GitHub) */}
        <section className="max-w-6xl mx-auto px-4 pb-16 pt-8">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50">
            <Image
              src="https://github.com/user-attachments/assets/93610fa8-71f6-448a-85c4-08d9f96ab8f0"
              alt="kryosette preview interface"
              width={2940}
              height={1786}
              className="w-full h-auto"
              priority
              unoptimized
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Early preview – work in progress
          </p>
        </section>

        {/* Core Principles Section */}
        <section id="details" className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
            Security built into the architecture.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PrincipleCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Proprietary Security Stack"
              description="Custom onion routing, RPKI validator, comprehensive scanners & detectors. No third‑party trust required."
            />
            <PrincipleCard
              icon={<Database className="w-8 h-8 text-blue-600" />}
              title="In‑Memory Database"
              description="Our own blazing‑fast, encrypted in‑memory DB keeps your data local and under your control."
            />
            <PrincipleCard
              icon={<Zap className="w-8 h-8 text-blue-600" />}
              title="Transcendent Bridge"
              description="Extends beyond L2 – a unique network layer that redefines connectivity and bypasses DPI."
            />
            <PrincipleCard
              icon={<Globe className="w-8 h-8 text-blue-600" />}
              title="Serverless Architecture"
              description="Almost everything stored locally. You decide who sees your posts, with infinite fine‑grained control."
            />
            <PrincipleCard
              icon={<Lock className="w-8 h-8 text-blue-600" />}
              title="No ICMP – Custom Replacement"
              description="Every packet visible, every checksum verified. Encryption everywhere."
            />
            <PrincipleCard
              icon={<Shield className="w-8 h-8 text-blue-600" />}
              title="Unblockable Network"
              description="Designed from first principles to resist censorship and interference."
            />
          </div>
        </section>

        {/* Feature Implementation Status */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center text-gray-900">
              Current Status & Upcoming Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Implemented
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• User profile system</li>
                  <li>• Friend adding mechanism</li>
                  <li>• Posts with comments & polls</li>
                  <li>• Public / private chats</li>
                  <li>• Transcendent bridge (prototype)</li>
                  <li>• Security scanners & detectors</li>
                  <li>• Proprietary onion routing</li>
                  <li>• In‑memory DB (base)</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full" />
                  In Near Development
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• RPKI validator</li>
                  <li>• Additional network security tools</li>
                  <li>• Secure private chats</li>
                  <li>• Transparent Editor</li>
                  <li>• Translator</li>
                  <li>• Replication & more</li>
                  <li>• Local truth‑engine analyzer</li>
                  <li>• Advanced DPI bypass</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-600">
                First working demo expected around{" "}
                <span className="font-semibold text-black">May 17–18, 2026</span>
              </p>
            </div>
          </div>
        </section>

        {/* Quote / Vision */}
        <section className="py-16 px-4 max-w-4xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-light italic text-gray-800">
            "There will be features that have never existed or have never been
            implemented in this way."
          </blockquote>
          <p className="mt-6 text-gray-500">
            Almost all code will be hidden, but you can watch every process in
            real time through the translator and fine‑tune settings via the editor.
          </p>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 text-center">
          <Link
            href="/self-university"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Explore Self University
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-gray-500">
            Production will only take place when everything is ready.
          </p>
        </section>

        {/* Core Technologies Section */}
        <section id="technologies" className="py-16 px-4 max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-900">
            Core Technologies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <Link
                  key={tech.slug}
                  href={`/technology/${tech.slug}`}
                  className="group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="mb-4">
                    <Icon className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-black">
                    {tech.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {tech.shortDescription}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                    Learn more
                    <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </>
  );
}

// Reusable card component for principles
function PrincipleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
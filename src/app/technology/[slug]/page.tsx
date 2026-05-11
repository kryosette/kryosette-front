import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next"; 
import { ArrowLeft, CheckCircle2, Clock, Wrench, FlaskConical, Info } from "lucide-react";
import { getTechnologyBySlug, getAllTechnologySlugs } from "@/lib/technologies";

export async function generateStaticParams() {
  const slugs = getAllTechnologySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tech = getTechnologyBySlug(slug);
  if (!tech) return { title: "Technology Not Found" };
  return {
    title: `${tech.title} – kryosette`,
    description: tech.shortDescription,
  };
}

export default async function TechnologyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tech = getTechnologyBySlug(slug);

  if (!tech) {
    notFound();
  }

  const IconComponent = tech.icon;

  const statusConfig = {
    implemented: {
      label: "Implemented",
      icon: CheckCircle2,
      color: "text-green-500 bg-green-500/10",
    },
    prototype: {
      label: "Prototype",
      icon: FlaskConical,
      color: "text-blue-400 bg-blue-400/10",
    },
    "in-development": {
      label: "In Development",
      icon: Wrench,
      color: "text-yellow-500 bg-yellow-500/10",
    },
    planned: {
      label: "Planned",
      icon: Clock,
      color: "text-white/60 bg-white/5",
    },
  };

  const StatusBadge = statusConfig[tech.status];

  return (
    <div className="min-h-screen bg-black text-white pt-11">
      {/* Informational banner */}
      <div className="bg-[#1c1c1e] border-b border-white/5 pt-1"> {/* pt-1 is shit*/}
        <div className="max-w-5xl mx-auto px-4 py-2.5">
          <p className="text-[12px] text-white/50 font-normal text-center whitespace-nowrap overflow-hidden text-ellipsis">
            <Info className="inline-block w-3.5 h-3.5 mr-1.5 -mt-0.5 text-white/30" />
            Information on this page is not fully accurate and reflects the current state of development. Specifications and features are subject to change as the project evolves.
          </p>
        </div>
      </div>

      {/* Back navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <Link
          href="/#technologies"
          className="inline-flex items-center text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to technologies
        </Link>
      </div>

      {/* Hero section */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-white/5 rounded-2xl">
            <IconComponent className="w-8 h-8 text-white/70" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            {tech.title}
          </h1>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${StatusBadge.color}`}
          >
            <StatusBadge.icon className="w-4 h-4" />
            {StatusBadge.label}
          </span>
        </div>

        <p className="text-xl text-white/60 mb-8 max-w-3xl font-normal">{tech.shortDescription}</p>

        <div className="prose prose-invert max-w-none text-white/70">
          <p className="font-normal">{tech.longDescription}</p>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-[#1c1c1e] py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8 text-white">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tech.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-white/60 font-normal">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical details (if provided) */}
      {tech.technicalDetails && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6 text-white">Technical Details</h2>
            <div className="bg-[#1c1c1e] p-8 rounded-2xl border border-white/5">
              <p className="text-white/60 leading-relaxed font-normal">{tech.technicalDetails}</p>
            </div>
          </div>
        </section>
      )}

      {/* Navigation to other technologies */}
      <section className="py-16 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6 text-white">Explore other technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getAllTechnologySlugs()
              .filter((s) => s !== tech.slug)
              .slice(0, 4)
              .map((s) => {
                const otherTech = getTechnologyBySlug(s)!;
                const OtherIcon = otherTech.icon;
                return (
                  <Link
                    key={s}
                    href={`/technology/${s}`}
                    className="group p-4 rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
                  >
                    <OtherIcon className="w-6 h-6 text-white/50 mb-2 group-hover:text-white/80" />
                    <h3 className="font-medium text-white">{otherTech.title}</h3>
                    <p className="text-sm text-white/40 mt-1 line-clamp-2 font-normal">
                      {otherTech.shortDescription}
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock, Wrench, FlaskConical } from "lucide-react";
import { getTechnologyBySlug, getAllTechnologySlugs } from "@/lib/technologies";

// Generate static paths at build time
export async function generateStaticParams() {
  const slugs = getAllTechnologySlugs();
  return slugs.map((slug) => ({ slug }));
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tech = getTechnologyBySlug(params.slug);
  if (!tech) return { title: "Technology Not Found" };
  return {
    title: `${tech.title} – kryosette`,
    description: tech.shortDescription,
  };
}

export default function TechnologyPage({ params }: { params: { slug: string } }) {
  const tech = getTechnologyBySlug(params.slug);

  if (!tech) {
    notFound();
  }

  const IconComponent = tech.icon;

  const statusConfig = {
    implemented: {
      label: "Implemented",
      icon: CheckCircle2,
      color: "text-green-600 bg-green-50",
    },
    prototype: {
      label: "Prototype",
      icon: FlaskConical,
      color: "text-blue-600 bg-blue-50",
    },
    "in-development": {
      label: "In Development",
      icon: Wrench,
      color: "text-yellow-600 bg-yellow-50",
    },
    planned: {
      label: "Planned",
      icon: Clock,
      color: "text-gray-600 bg-gray-50",
    },
  };

  const StatusBadge = statusConfig[tech.status];

  return (
    <div className="min-h-screen bg-white">
      {/* Back navigation */}
      <div className="max-w-5xl mx-auto px-4 pt-8 pb-4">
        <Link
          href="/#technologies"
          className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to technologies
        </Link>
      </div>

      {/* Hero section */}
      <section className="max-w-5xl mx-auto px-4 pb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gray-100 rounded-2xl">
            <IconComponent className="w-8 h-8 text-gray-800" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
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

        <p className="text-xl text-gray-600 mb-8 max-w-3xl">{tech.shortDescription}</p>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p>{tech.longDescription}</p>
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tech.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical details (if provided) */}
      {tech.technicalDetails && (
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">Technical Details</h2>
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
              <p className="text-gray-700 leading-relaxed">{tech.technicalDetails}</p>
            </div>
          </div>
        </section>
      )}

      {/* Navigation to other technologies */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-6">Explore other technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getAllTechnologySlugs()
              .filter((slug) => slug !== tech.slug)
              .slice(0, 4)
              .map((slug) => {
                const otherTech = getTechnologyBySlug(slug)!;
                const OtherIcon = otherTech.icon;
                return (
                  <Link
                    key={slug}
                    href={`/technology/${slug}`}
                    className="group p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
                  >
                    <OtherIcon className="w-6 h-6 text-gray-600 mb-2 group-hover:text-black" />
                    <h3 className="font-medium text-gray-900">{otherTech.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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
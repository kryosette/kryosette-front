import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, Github } from "lucide-react";

export default function SelfUniversityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-6">
          <GraduationCap className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
          Self University
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          A comprehensive curriculum for deep understanding, not just memorization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="https://selfuniversity.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
          >
            Start Learning
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link
            href="https://github.com/Self-University"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-transparent border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Github className="mr-2 w-5 h-5" />
            GitHub
          </Link>
        </div>
      </section>

      {/* Description */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-gray-700 leading-relaxed">
              I&apos;m developing a powerful and comprehensive curriculum (or
              rather an encyclopedia) based on the best books and resources
              available. It is designed for in‑depth study of all topics that
              require special attention. To consolidate each topic, I plan to
              use practical exercises and detailed articles (or several
              articles).
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-6">
              My goal is not just mechanical memorization, but a real
              understanding of the material, the application of theory in
              practice, and the creation of a solid foundation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-6">
              This curriculum is currently under active development and
              refinement. I am constantly improving it to achieve maximum
              efficiency and completeness of the coverage of the material.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Live Preview</h3>
                <p className="text-gray-600 text-sm">
                  Study at{" "}
                  <Link
                    href="https://selfuniversity.vercel.app"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    selfuniversity.vercel.app
                  </Link>
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
              <Github className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Source & Progress</h3>
                <p className="text-gray-600 text-sm">
                  Follow development at{" "}
                  <Link
                    href="https://github.com/Self-University"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                  >
                    github.com/Self-University
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
            <p className="text-gray-700 italic">
              “I have a very interesting idea, so wait a couple of years.”
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTechOpen, setIsTechOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsTechOpen(true);
  };
  const close = () => {
    timeoutRef.current = setTimeout(() => setIsTechOpen(false), 100);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsTechOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/30">
      <nav className="mx-auto flex h-11 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/logo.png"
            alt="kryosette"
            width={80}
            height={50}
            className="h-7 w-auto"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-6 text-[13px] font-light tracking-[0.01em] text-black">
          <li><Link href="/">Home</Link></li>
          <li className="relative" onMouseEnter={open} onMouseLeave={close}>
            <button className="flex items-center gap-1">
              Technologies
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isTechOpen ? "rotate-180" : ""}`} />
            </button>
          </li>
          <li><Link href="/self-university">Self University</Link></li>
          <li><Link href="/#roadmap">Roadmap</Link></li>
        </ul>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-600 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button
            className="md:hidden hover:text-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Full‑width dropdown with background blur */}
      {isTechOpen && (
        <>
          <div
            className="fixed top-11 left-0 right-0 bottom-0 z-40 backdrop-blur-sm"
            onMouseEnter={open}
            onMouseLeave={close}
          />
          <div
            className="fixed top-11 left-0 right-0 z-50 bg-white border-b border-gray-200/30 shadow-2xl shadow-black/5"
            onMouseEnter={open}
            onMouseLeave={close}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-[11px] font-medium text-gray-400 mb-4 tracking-wider uppercase">Core Systems</h3>
                <ul className="space-y-3">
                  <li><Link href="/technology/kryo-arch" className="text-[13px] font-light text-black hover:underline">Kryo Arch</Link></li>
                  <li><Link href="/technology/transcendent-bridge" className="text-[13px] font-light text-black hover:underline">Transcendent Bridge</Link></li>
                  <li><Link href="/technology/in-memory-db" className="text-[13px] font-light text-black hover:underline">In‑Memory DB</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-medium text-gray-400 mb-4 tracking-wider uppercase">Security</h3>
                <ul className="space-y-3">
                  <li><Link href="/technology/security-scanners" className="text-[13px] font-light text-black hover:underline">Security Scanners</Link></li>
                  <li><Link href="/technology/onion-routing" className="text-[13px] font-light text-black hover:underline">Onion Routing</Link></li>
                  <li><Link href="/technology/rpki-validator" className="text-[13px] font-light text-black hover:underline">RPKI Validator</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-medium text-gray-400 mb-4 tracking-wider uppercase">Tools</h3>
                <ul className="space-y-3">
                  <li><Link href="/technology/transparent-editor" className="text-[13px] font-light text-black hover:underline">Transparent Editor</Link></li>
                  <li><Link href="/technology/truth-engine" className="text-[13px] font-light text-black hover:underline">Truth Engine</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[11px] font-medium text-gray-400 mb-4 tracking-wider uppercase">Overview</h3>
                <ul className="space-y-3">
                  <li><Link href="/#technologies" className="text-[13px] font-light text-black hover:underline">All Technologies</Link></li>
                  <li><Link href="/#roadmap" className="text-[13px] font-light text-black hover:underline">Development Status</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-11 bg-white/95 backdrop-blur-xl z-40">
          <div className="h-full overflow-y-auto px-4 py-8">
            <ul className="space-y-5 text-lg font-light text-black">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
              <li><Link href="/#technologies" onClick={() => setIsMobileMenuOpen(false)}>Technologies</Link></li>
              <li><Link href="/self-university" onClick={() => setIsMobileMenuOpen(false)}>Self University</Link></li>
              <li><Link href="/#roadmap" onClick={() => setIsMobileMenuOpen(false)}>Roadmap</Link></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
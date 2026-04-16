"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTechDropdownOpen, setIsTechDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsTechDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsTechDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-semibold tracking-tight">
          kryosette
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-7 text-sm font-medium text-gray-800">
          <li>
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
          </li>
          <li>
            <button
              ref={buttonRef}
              onClick={() => setIsTechDropdownOpen(!isTechDropdownOpen)}
              className="flex items-center gap-0.5 hover:text-black transition-colors"
            >
              Technologies
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isTechDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </li>
          <li>
            <Link href="/self-university" className="hover:text-black transition-colors">
              Self University
            </Link>
          </li>
          <li>
            <Link href="/#roadmap" className="hover:text-black transition-colors">
              Roadmap
            </Link>
          </li>
        </ul>

        {/* Right side icons */}
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          {/* Mobile menu button */}
          <button
            className="md:hidden hover:text-gray-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Technologies Dropdown (desktop) */}
      <div
        ref={dropdownRef}
        className={`absolute left-0 right-0 top-12 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300 ease-out ${
          isTechDropdownOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              CORE SYSTEMS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/technology/kryo-arch"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Kryo Arch
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/transcendent-bridge"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Transcendent Bridge
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/in-memory-db"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  In‑Memory DB
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              SECURITY
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/technology/security-scanners"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Security Scanners
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/onion-routing"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Onion Routing
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/rpki-validator"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  RPKI Validator
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              TOOLS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/technology/transparent-editor"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Transparent Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/truth-engine"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Truth Engine
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              OVERVIEW
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/#technologies"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  All Technologies
                </Link>
              </li>
              <li>
                <Link
                  href="/#roadmap"
                  className="text-gray-800 hover:text-black"
                  onClick={() => setIsTechDropdownOpen(false)}
                >
                  Development Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 top-12 bg-white/95 backdrop-blur-md transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full overflow-y-auto px-4 py-6">
          <ul className="space-y-4 text-lg font-medium text-gray-800">
            <li>
              <Link
                href="/"
                className="block py-2 hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/#technologies"
                className="block py-2 hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Technologies
              </Link>
            </li>
            <li>
              <Link
                href="/self-university"
                className="block py-2 hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Self University
              </Link>
            </li>
            <li>
              <Link
                href="/#roadmap"
                className="block py-2 hover:text-black"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Roadmap
              </Link>
            </li>
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-500 mb-4">
              TECHNOLOGIES
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/technology/kryo-arch"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Kryo Arch
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/transcendent-bridge"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Transcendent Bridge
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/security-scanners"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Security Scanners
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/onion-routing"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Onion Routing
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/in-memory-db"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  In‑Memory DB
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/transparent-editor"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Transparent Editor
                </Link>
              </li>
              <li>
                <Link
                  href="/technology/truth-engine"
                  className="block py-1 text-gray-600 hover:text-black"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Truth Engine
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
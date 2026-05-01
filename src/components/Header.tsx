"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/docs", label: "Docs" }, 
  { href: "/self-university", label: "Self University" },
];

const dropdownColumns = [
  {
    heading: "CORE SYSTEMS",
    links: [
      { href: "/technology/kryo-arch", label: "Kryo Arch" },
      { href: "/technology/transcendent-bridge", label: "Transcendent Bridge" },
      { href: "/technology/in-memory-db", label: "In‑Memory DB" },
    ],
  },
  {
    heading: "SECURITY",
    links: [
      { href: "/technology/security-scanners", label: "Security Scanners" },
      { href: "/technology/onion-routing", label: "Onion Routing" },
      { href: "/technology/rpki-validator", label: "RPKI Validator" },
    ],
  },
  {
    heading: "TOOLS",
    links: [
      { href: "/technology/transparent-editor", label: "Transparent Editor" },
      { href: "/technology/truth-engine", label: "Truth Engine" },
    ],
  },
  {
    heading: "OVERVIEW",
    links: [
      { href: "/#technologies", label: "All Technologies" },
      { href: "/#roadmap", label: "Development Status" },
    ],
  },
];

// All searchable items
const allSearchItems = [
  // Pages
  { href: "/", label: "Home", category: "Pages" },
  { href: "/#technologies", label: "Technologies", category: "Pages" },
  { href: "/self-university", label: "Self University", category: "Pages" },
  { href: "/#roadmap", label: "Roadmap", category: "Pages" },
  { href: "/manifesto", label: "Manifesto", category: "Pages" },
  { href: "/threat-model", label: "Threat Model", category: "Pages" },
  { href: "/warrant-canary", label: "Warrant Canary", category: "Pages" },
  { href: "/privacy", label: "Privacy Policy", category: "Pages" },
  { href: "/terms", label: "Terms of Use", category: "Pages" },
  // Technologies
  { href: "/technology/kryo-arch", label: "Kryo Arch", category: "Technology" },
  { href: "/technology/transcendent-bridge", label: "Transcendent Bridge", category: "Technology" },
  { href: "/technology/in-memory-db", label: "In‑Memory DB", category: "Technology" },
  { href: "/technology/security-scanners", label: "Security Scanners", category: "Technology" },
  { href: "/technology/onion-routing", label: "Onion Routing", category: "Technology" },
  { href: "/technology/rpki-validator", label: "RPKI Validator", category: "Technology" },
  { href: "/technology/transparent-editor", label: "Transparent Editor", category: "Technology" },
  { href: "/technology/truth-engine", label: "Truth Engine", category: "Technology" },
];

// Stagger container variant
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.08,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } as const,
  },
  exit: {
    opacity: 0,
    y: 6,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } as const,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] } as const,
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] } as const,
  },
};

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.closest("header")?.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isSearchOpen) {
      setSearchQuery("");
    }
  }, [isSearchOpen]);

  // Filtered search results
  const filteredResults = searchQuery.trim()
    ? allSearchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Full-page blur overlay for dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 top-12 z-40 bg-black/[0.08] backdrop-blur-[2px]"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Search modal overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="search-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 z-50 w-full bg-white/30 backdrop-blur-xl">
       <div 
  className="absolute bottom-0 left-0 right-0 h-[1px]"
  style={{
    background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.08) 30%, transparent 70%)',
  }}
/>
        <nav className="mx-auto flex h-12 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold tracking-tight">
            kryosette
          </Link>

          {/* Main navigation */}
          <ul className="hidden md:flex items-center space-x-7 text-sm font-medium text-gray-800">
            <li>
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen((v) => !v)}
                className="flex items-center gap-0.5 hover:text-black transition-colors"
              >
                Technologies
                <motion.span
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-black transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-gray-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </nav>

        {/* Dropdown */}
        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              key="dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute left-0 right-0 top-12 bg-white/96 backdrop-blur-xl border-b border-gray-200/60 shadow-2xl shadow-black/[0.06] overflow-hidden"
            >
              <motion.div
                className="max-w-5xl mx-auto px-4 py-9 grid grid-cols-4 gap-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {dropdownColumns.map((col) => (
                  <motion.div key={col.heading} variants={columnVariants}>
                    <motion.h3
                      variants={itemVariants}
                      className="text-[10px] font-semibold text-gray-400 mb-4 tracking-[0.12em] uppercase"
                    >
                      {col.heading}
                    </motion.h3>
                    <ul className="space-y-2.5">
                      {col.links.map((link) => (
                        <motion.li key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            onClick={() => setIsDropdownOpen(false)}
                            className="text-[14px] text-gray-700 hover:text-black transition-colors duration-200 font-[450]"
                          >
                            {link.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            key="search-modal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          >
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-2xl shadow-2xl shadow-black/10 w-full max-w-xl overflow-hidden">
              {/* Search input */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search technologies, pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base text-black placeholder:text-gray-400 bg-transparent outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-3">
                {searchQuery.trim() === "" ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    Start typing to search...
                  </p>
                ) : filteredResults.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-6">
                    No results found
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {filteredResults.map((item) => (
                      <li key={item.href + item.label}>
                        <Link
                          href={item.href}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-black">
                            {item.label}
                          </span>
                          <span className="text-[11px] text-gray-400 uppercase tracking-wider">
                            {item.category}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
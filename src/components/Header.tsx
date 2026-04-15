"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, ChevronDown } from "lucide-react";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDropdownOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50">
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
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-0.5 hover:text-black transition-colors"
            >
              Store
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </li>
          <li>
            <Link href="/mac" className="hover:text-black transition-colors">
              Mac
            </Link>
          </li>
          <li>
            <Link href="/ipad" className="hover:text-black transition-colors">
              iPad
            </Link>
          </li>
          <li>
            <Link href="/iphone" className="hover:text-black transition-colors">
              iPhone
            </Link>
          </li>
          <li>
            <Link href="/watch" className="hover:text-black transition-colors">
              Watch
            </Link>
          </li>
          <li>
            <Link href="/support" className="hover:text-black transition-colors">
              Support
            </Link>
          </li>
          {/* NEW: Self University link */}
          <li>
            <Link href="/self-university" className="hover:text-black transition-colors">
              Self University
            </Link>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-600 transition-colors">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-gray-600 transition-colors">
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Dropdown Menu – unchanged */}
      <div
        ref={dropdownRef}
        className={`absolute left-0 right-0 top-12 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg transition-all duration-300 ease-out ${
          isDropdownOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-4 gap-8">
          {/* Column 1 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              SHOP
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop/mac"
                  className="text-gray-800 hover:text-black"
                >
                  Shop Mac
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/ipad"
                  className="text-gray-800 hover:text-black"
                >
                  Shop iPad
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/iphone"
                  className="text-gray-800 hover:text-black"
                >
                  Shop iPhone
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/watch"
                  className="text-gray-800 hover:text-black"
                >
                  Shop Watch
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 2 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              QUICK LINKS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/accessories"
                  className="text-gray-800 hover:text-black"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  href="/gift-cards"
                  className="text-gray-800 hover:text-black"
                >
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-800 hover:text-black">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              EXPLORE
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/vision-pro"
                  className="text-gray-800 hover:text-black"
                >
                  Vision Pro
                </Link>
              </li>
              <li>
                <Link
                  href="/airpods"
                  className="text-gray-800 hover:text-black"
                >
                  AirPods
                </Link>
              </li>
              <li>
                <Link
                  href="/apple-tv"
                  className="text-gray-800 hover:text-black"
                >
                  Apple TV
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 4 */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-3 tracking-wide">
              SUPPORT
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-gray-800 hover:text-black"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-800 hover:text-black"
                >
                  Contact Us
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
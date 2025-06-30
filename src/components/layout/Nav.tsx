"use client";

import { Menu, ShoppingCart, X, Search, Mic, Phone, User, ChevronDown, Tag } from "lucide-react";
import React, { JSX, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CategoryMenu from "./NavOptions";

const categories = [
  "Forklifts",
  "Pallet Trucks",
  "Stackers",
  "Reach Trucks",
  "Order Pickers",
  "Tow Tractors",
  "Conveyor Systems",
  "Loading Equipment"
];

const navigationLinks = [
  { name: "About", href: "/about" },
  { name: "Rental/Used MHE", href: "/rental" },
  { name: "Attachments", href: "/attachments" },
  { name: "Spare Parts", href: "/spare-parts" },
  { name: "Services", href: "/services" },
  { name: "Training", href: "/training" }
];

export default function Navbar(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      {/* Top Green Banner */}
      <div className="bg-green-600 text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>+91 97456 81234</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/signin" className="hover:text-green-200 transition-colors duration-200">Sign in</Link>
              <span className="text-green-300">|</span>
              <Link href="/signup" className="hover:text-green-200 transition-colors duration-200">Sign up</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image
                  src="/mhe-logo.png"
                  alt="MHE BAZAR Logo"
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: 140 }}
                  priority
                />
              </Link>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by Products, Category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <Link href="/cart" className="flex items-center text-gray-600 hover:text-green-600 transition">
                <ShoppingCart className="w-5 h-5" />
              </Link>
              <Link href="/notifications" className="flex items-center text-gray-600 hover:text-green-600 transition" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Products, Category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 rounded-full p-1 transition">
                <Mic className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-t border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left Navigation */}
            <div className="flex items-center">
              {/* Categories Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-green-600 text-sm font-medium transition"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <Menu className="w-4 h-4" />
                  All Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                <CategoryMenu isOpen={categoriesOpen} />
              </div>

              {/* Navigation Links */}
              <div className="flex items-center">
                {navigationLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="px-4 py-3 text-gray-700 hover:text-green-600 text-sm font-medium transition"
                  >
                    {link.name}
                  </Link>
                ))}
                {/* Brand Store Badge */}
                <Link
                  href="/brand-store"
                  className="ml-2 px-3 py-1 rounded bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-semibold flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
                >
                  <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse"></span>
                  Brand Store
                </Link>
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center">
              <Link href="/help" className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition">
                <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-xs text-white">?</span>
                </div>
                <span className="text-sm">Help</span>
              </Link>
              <Link href="/become-vendor" className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition">
                <User className="w-4 h-4" />
                <span className="text-sm">Become a Vendor</span>
              </Link>
              <Link href="/price-plan" className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition">
                <Tag className="w-4 h-4" />
                <span className="text-sm">Price Plan</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50"
          >
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link href="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
                  <Image
                    src="/mhe-logo.png"
                    alt="MHE BAZAR Logo"
                    width={120}
                    height={32}
                    className="h-8 w-auto object-contain"
                    style={{ maxWidth: 120 }}
                    priority
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {/* Categories Section */}
                <div className="border-b border-gray-200">
                  <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Categories
                  </div>
                  {categories.map((category, index) => (
                    <Link
                      key={index}
                      href={`/app/${category.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block px-6 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category}
                    </Link>
                  ))}
                </div>

                {/* Navigation Links */}
                <div className="flex-1">
                  {navigationLinks.map((link, index) => (
                    <Link
                      key={index}
                      href={link.href}
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/brand-store"
                    className="block px-4 py-3 text-white bg-gradient-to-r from-orange-400 to-rose-400 font-semibold border-b border-gray-100 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse mr-2"></span>
                    Brand Store
                  </Link>
                  <Link
                    href="/help"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>
                  <Link
                    href="/become-vendor"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Become a Vendor
                  </Link>
                  <Link
                    href="/price-plan"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Price Plan
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
"use client";

import { Menu, ShoppingCart, X, Search, Mic, Phone, User, ChevronDown } from "lucide-react";
import React, { useState } from "react";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

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

  return (
    <header className="bg-white shadow-sm relative z-50">
      {/* Top Green Banner */}
      <div className="bg-green-600 text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            {/* Left: Phone Number */}
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>+91 97456 81234</span>
            </div>
            
            {/* Right: Auth Links */}
            <div className="flex items-center gap-4 text-sm">
              <button className="hover:text-green-200 transition-colors duration-200">
                Sign in
              </button>
              <span className="text-green-300">|</span>
              <button className="hover:text-green-200 transition-colors duration-200">
                Sign up
              </button>
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
              <a href="/" className="flex items-center">
                <img
                  src="/mhe-logo.png"
                  alt="MHE BAZAR Logo"
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: 140 }}
                />
    
              </a>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search by Products, Category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Mic className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-6">
              {/* Cart Icon */}
              <button className="flex items-center text-gray-600 hover:text-gray-900">
                <ShoppingCart className="w-5 h-5" />
              </button>

              {/* Notification Icon */}
              <button className="flex items-center text-gray-600 hover:text-gray-900" aria-label="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0"/>
                </svg>
              </button>
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
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
              {/* All Categories Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium"
                  onMouseEnter={() => setCategoriesOpen(true)}
                  onMouseLeave={() => setCategoriesOpen(false)}
                >
                  <Menu className="w-4 h-4" />
                  All Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {/* Categories Dropdown */}
                {categoriesOpen && (
                  <div 
                    className="absolute left-0 top-full w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    onMouseEnter={() => setCategoriesOpen(true)}
                    onMouseLeave={() => setCategoriesOpen(false)}
                  >
                    <div className="py-2">
                      {categories.map((category, index) => (
                        <a
                          key={index}
                          href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {category}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex items-center">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="px-4 py-3 text-gray-700 hover:text-gray-900 text-sm font-medium"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 text-gray-600 px-4 py-3">
                <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-xs text-white">?</span>
                </div>
                <span className="text-sm">Help</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 px-4 py-3">
                <User className="w-4 h-4" />
                <span className="text-sm">Become a Vendor</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 px-4 py-3">
                <div className="w-4 h-4 rounded-sm bg-yellow-400 flex items-center justify-center">
                  <span className="text-xs text-black">₹</span>
                </div>
                <span className="text-sm">Price Plan</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-xl">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <a href="/" className="flex items-center">
                <img
                  src="/mhe-logo.png"
                  alt="MHE BAZAR Logo"
                  className="h-8 w-auto object-contain"
                  style={{ maxWidth: 120 }}
                />
              </a>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto">
              {/* Categories Section */}
              <div className="border-b border-gray-200">
                <div className="px-4 py-3 bg-gray-50 text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Categories
                </div>
                {categories.map((category, index) => (
                  <a
                    key={index}
                    href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-6 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {category}
                  </a>
                ))}
              </div>

              {/* Navigation Links */}
              <div className="flex-1">
                {navigationLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <a
                  href="/help"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Help
                </a>
                <a
                  href="/become-vendor"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Become a Vendor
                </a>
                <a
                  href="/price-plan"
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 border-b border-gray-100 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Price Plan
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
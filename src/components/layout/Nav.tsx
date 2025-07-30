// src/components/layout/Navbar.tsx
"use client";

import {
  Menu,
  ShoppingCart,
  X,
  Phone,
  ChevronDown,
  Tag,
  User,
  Package,
  Heart,
  LogOut,
  UserIcon,
  Repeat
} from "lucide-react";
import { useRef, useState, JSX, useEffect } from "react";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CategoryMenu from "./NavOptions";
import VendorRegistrationDrawer from "@/components/forms/publicforms/VendorRegistrationForm";
import SearchBar from "./SearchBar";
import { useUser } from "@/context/UserContext"; // Correct import
import { useRouter } from "next/navigation"; // Correct import
// import { toast } from "sonner";
import { handleLogout } from "@/lib/auth/logout";

const categories = [
  "Forklifts",
  "Pallet Trucks",
  "Stackers",
  "Reach Trucks",
  "Order Pickers",
  "Tow Tractors",
  "Conveyor Systems",
  "Loading Equipment",
];

const navigationLinks = [
  { name: "About", href: "/about" },
  { name: "Rental/Used MHE", href: "/rental" },
  { name: "Attachments", href: "/attachments" },
  { name: "Spare Parts", href: "/spare-parts" },
  { name: "Services", href: "/services" },
  { name: "Training", href: "/training" },
  { name: "Blogs", href: "/blog" },

];

export default function Navbar(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [vendorDrawerOpen, setVendorDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const categoryMenuRef = useRef<HTMLDivElement>(null);

  const { user, isLoading, setUser } = useUser();
  const router = useRouter();

  // Close dropdown on outside click for profile menu
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    // Only add event listener if menu is open
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    // Cleanup function
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  // Close dropdown on outside click for category menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryMenuRef.current &&
        !categoryMenuRef.current.contains(event.target as Node)
      ) {
        setCategoriesOpen(false);
      }
    }
    // Only add event listener if menu is open
    if (categoriesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    // Cleanup function
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoriesOpen]);

  return (
    <header className="bg-white shadow-sm z-50 sticky top-0">
      {/* Top Green Banner */}
      <div className="bg-[#5CA131] text-white">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <span>+91 97456 81234</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              {isLoading ? (
                <span>Loading...</span>
              ) : user ? (
                <span className="font-semibold">
                  Hello, {user.username || user.email}!
                </span>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hover:text-green-200 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <span className="text-green-300">|</span>
                  <Link
                    href="/register"
                    className="hover:text-green-200 transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </>
              )}
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

            {/* Search Bar with Brand Store - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 items-center gap-4">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              {/* Brand Store Badge */}
              <Link
                href="/vendor-listing"
                className="flex-shrink-0 px-3 py-1 rounded bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-semibold flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse"></span>
                Brand Store
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">

              {/* Compare Icon using Repeat */}
              <Link
                href="/compare"
                className="flex items-center text-gray-600 hover:text-green-600 transition"
                aria-label="Compare Products"
              >
                <Repeat className="w-5 h-5" />
              </Link>


              {/* Conditional rendering for Cart and Notifications: Only if user is logged in */}
              {!isLoading && user && (
                <>
                  <Link
                    href="/cart"
                    className="flex items-center text-gray-600 hover:text-green-600 transition"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center text-gray-600 hover:text-green-600 transition"
                    aria-label="Notifications"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                      <path d="M13.73 21a2 2 0 01-3.46 0" />
                    </svg>
                  </Link>
                </>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen((v) => !v)}
                  className="focus:outline-none"
                  aria-label="Open profile menu"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  ) : user ? (
                    <>
                      {Array.isArray(user.username) &&
                      user.username[0]?.image ? (
                        <Image
                          src={user.username[0].image}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-gray-500" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </button>
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                    >
                      {user ? (
                        <>
                          {/* Common User Account Links */}
                          <Link
                            href="/account"
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <User className="w-5 h-5 text-green-600" />
                            My Account
                          </Link>
                          <div className="border-t border-gray-100" />
                          <Link
                            href="/account/orders"
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Package className="w-5 h-5 text-green-600" />
                            My Orders
                          </Link>
                          <div className="border-t border-gray-100" />
                          <Link
                            href="/account/wishlist"
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <Heart className="w-5 h-5 text-green-600" />
                            Wishlist
                          </Link>

                          {/* Vendor specific links */}
                          {user.role?.id === 2 && (
                            <>
                              <div className="border-t border-gray-100" />
                              <div className="px-6 py-2 text-sm text-gray-500 font-semibold uppercase">
                                Vendor Panel
                              </div>
                              <Link
                                href="/vendor/dashboard"
                                className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-gray-50 transition text-base"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <User className="w-5 h-5 text-blue-600" />
                                Dashboard
                              </Link>
                              <Link
                                href="/vendor/products"
                                className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-gray-50 transition text-base"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <Tag className="w-5 h-5 text-blue-600" />
                                My Products
                              </Link>
                              <Link
                                href="/vendor/profile"
                                className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-gray-50 transition text-base"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <User className="w-5 h-5 text-blue-600" />
                                Vendor Profile
                              </Link>
                            </>
                          )}

                          {/* Admin specific links */}
                          {user.role?.id === 1 && (
                            <>
                              <div className="border-t border-gray-100" />
                              <div className="px-6 py-2 text-sm text-gray-500 font-semibold uppercase">
                                Admin Panel
                              </div>
                              <Link
                                href="/admin/"
                                className="flex items-center gap-3 px-6 py-3 text-gray-800 hover:bg-gray-50 transition text-base"
                                onClick={() => setProfileMenuOpen(false)}
                              >
                                <User className="w-5 h-5 text-red-600" />
                                Admin Dashboard
                              </Link>
                            </>
                          )}

                          <div className="border-t border-gray-100" />
                          <button
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base w-full text-left"
                            onClick={async () => {
                              setProfileMenuOpen(false);
                              await handleLogout(() => setUser(null), router);
                            }}
                          >
                            <LogOut className="w-5 h-5 text-green-600" />
                            Logout
                          </button>
                        </>
                      ) : (
                        // Not logged in, show login/register options
                        <>
                          <Link
                            href="/login"
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <User className="w-5 h-5 text-green-600" />
                            Sign In
                          </Link>
                          <div className="border-t border-gray-100" />
                          <Link
                            href="/register"
                            className="flex items-center gap-3 px-6 py-4 text-gray-800 hover:bg-gray-50 transition text-base"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            <User className="w-5 h-5 text-green-600" />
                            Sign Up
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar with Brand Store */}
          <div className="md:hidden pb-3">
            <div className="flex items-center gap-2">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              {/* Brand Store Badge - Mobile */}
              <Link
                href="/vendor-listing"
                className="flex-shrink-0 px-2 py-1 rounded bg-gradient-to-r from-orange-400 to-rose-400 text-white text-xs font-semibold flex items-center gap-1 shadow-sm hover:scale-105 transition-transform"
              >
                <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse mr-1"></span>
                Store
              </Link>
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
              <div className="relative" ref={categoryMenuRef}>
                <button
                  className="flex items-center gap-2 px-4 py-3 text-gray-700 hover:text-green-600 text-sm font-medium transition"
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                >
                  <Menu className="w-4 h-4" />
                  All Categories
                  <ChevronDown className="w-4 h-4" />
                </button>
                <CategoryMenu
                  isOpen={categoriesOpen}
                  onClose={() => setCategoriesOpen(false)}
                />
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
              </div>
            </div>

            {/* Right Navigation */}
            <div className="flex items-center">
              <Link
                href="/contact"
                className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition"
              >
                <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-xs text-white">?</span>
                </div>
                <span className="text-sm">Help</span>
              </Link>

              {/* Conditional rendering for Become a Vendor / My Vendor Dashboard */}
              {isLoading ? (
                <span className="px-4 py-3 text-sm text-gray-600">
                  Loading...
                </span>
              ) : user ? (
                user.role?.id === 2 ? (
                  <Link
                    href="/vendor/dashboard"
                    className="flex items-center gap-2 text-green-600 px-4 py-3 hover:text-green-700 transition"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      My Vendor Dashboard
                    </span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setVendorDrawerOpen(true)}
                    className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition bg-transparent border-0 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm">Become a Vendor</span>
                  </button>
                )
              ) : null}

              <Link
                href="/services/subscription-plan"
                className="flex items-center gap-2 text-gray-600 px-4 py-3 hover:text-green-600 transition"
              >
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
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 w-80 max-w-[85vw] h-full bg-white shadow-xl flex flex-col"
            >
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link
                  href="/"
                  className="flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
                      href={`/app/${category
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
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
                    href="/vendor-listing"
                    className="block px-4 py-3 text-white bg-gradient-to-r from-orange-400 to-rose-400 font-semibold border-b border-gray-100 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="w-2 h-2 rounded-full bg-white/80 inline-block animate-pulse mr-2"></span>
                    Brand Store
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Help
                  </Link>

                  {isLoading ? (
                    <span className="block px-4 py-3 text-gray-700">
                      Loading...
                    </span>
                  ) : user?.role?.id === 2 ? (
                    <Link
                      href="/vendor/dashboard"
                      className="block px-4 py-3 text-green-700 bg-green-50 font-semibold border-b border-gray-100 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Vendor Dashboard
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setVendorDrawerOpen(true);
                      }}
                      className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-green-50 border-b border-gray-100 font-medium transition bg-transparent"
                    >
                      Become a Vendor
                    </button>
                  )}
                  <Link
                    href="/subscription-plan"
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

      {/* Drawer Component */}
      <VendorRegistrationDrawer
        open={vendorDrawerOpen}
        onClose={() => setVendorDrawerOpen(false)}
      />
    </header>
  );
}

export interface User {
  id: number;
  username?: string;
  email: string;
  role?: {
    id: number;
    name: string;
  };
  user_banner?: { url: string }[]; // Add this line to fix the error
  // ...other properties
}

"use client";

import {
  Globe,
  Headphones,
  ShoppingCart,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
//import Image from "next/image";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      {/* Top blue subscribe section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-8 md:py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Subscribe &amp; Get{" "}
              <span className="text-yellow-400">10% Discount</span>
            </h2>
            <p className="text-base sm:text-lg">
              Get E-mail updates about our latest shop and special offers.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row items-center gap-3 md:gap-0 md:items-stretch justify-center md:justify-end w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter email address"
              className="px-4 py-2 rounded md:rounded-l md:rounded-r-none w-full sm:w-72 text-black bg-white outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-400 text-black px-6 py-2 rounded md:rounded-r md:rounded-l-none font-semibold transition hover:bg-yellow-300 w-full sm:w-auto"
            >
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Main footer content */}
      <div className="bg-gray-50 px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Grid container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">

            {/* Address & Contact - Takes up 1 column */}
            <div className="lg:col-span-2">
              <img
                src="/mhe-logo.png"
                alt="MHE Bazar"
                width={120}
                height={40}
                className="mb-4 h-10 w-auto"
                priority
              />
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Address:</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    E-228, Lower Basement, Lajpat Nagar-I, New Delhi-110024
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Phone:</h3>
                  <p className="text-sm text-gray-600">+91 9289094445</p>
                  <p className="text-sm text-gray-600">+91 9840088428</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">E-mail:</h3>
                  <span className="text-sm text-gray-600 pr-2 border-r-2">sales.1@mhebazar.com</span>
                  <span className="text-sm text-gray-600 pl-2">sales.2@mhebazar.com</span>
                </div>
              </div>
            </div>

            {/* Company - Takes up 1 column */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-blue-700 transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/used-mhe" className="text-gray-600 hover:text-blue-700 transition">
                    Used MHE
                  </Link>
                </li>
                <li>
                  <Link href="/rental" className="text-gray-600 hover:text-blue-700 transition">
                    MHE Rental
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-blue-700 transition">
                    CMC & AMC Services
                  </Link>
                </li>
                <li>
                  <Link href="/training" className="text-gray-600 hover:text-blue-700 transition">
                    Training
                  </Link>
                </li>
                <li>
                  <Link href="/testimonials" className="text-gray-600 hover:text-blue-700 transition">
                    Testimonials
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-blue-700 transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/vendors" className="text-gray-600 hover:text-blue-700 transition">
                    Vendors
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-blue-700 transition">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Category - Takes up 2 columns on large screens */}
            <div className="lg:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <div className="space-y-2">
                  <Link href="/category/battery" className="block text-gray-600 hover:text-blue-700 transition">
                    Battery
                  </Link>
                  <Link href="/category/pallet-truck" className="block text-gray-600 hover:text-blue-700 transition">
                    Pallet Truck
                  </Link>
                  <Link href="/category/stacker" className="block text-gray-600 hover:text-blue-700 transition">
                    Stacker
                  </Link>
                  <Link href="/category/platform-truck" className="block text-gray-600 hover:text-blue-700 transition">
                    Platform Truck
                  </Link>
                  <Link href="/category/tow-truck" className="block text-gray-600 hover:text-blue-700 transition">
                    Tow Truck
                  </Link>
                  <Link href="/category/dock-leveller" className="block text-gray-600 hover:text-blue-700 transition">
                    Dock Leveller
                  </Link>
                  <Link href="/category/scissors-lift" className="block text-gray-600 hover:text-blue-700 transition">
                    Scissors Lift
                  </Link>
                  <Link href="/category/reach-truck" className="block text-gray-600 hover:text-blue-700 transition">
                    Reach Truck
                  </Link>
                </div>
                <div className="space-y-2">
                  <Link href="/category/racking-system" className="block text-gray-600 hover:text-blue-700 transition">
                    Racking System
                  </Link>
                  <Link href="/category/forklift" className="block text-gray-600 hover:text-blue-700 transition">
                    Forklift
                  </Link>
                  <Link href="/category/container-handler" className="block text-gray-600 hover:text-blue-700 transition">
                    Container Handler
                  </Link>
                  <Link href="/category/explosionproof-mhe" className="block text-gray-600 hover:text-blue-700 transition">
                    Explosionproof MHE
                  </Link>
                  <Link href="/category/solution" className="block text-gray-600 hover:text-blue-700 transition">
                    Solution
                  </Link>
                  <Link href="/category/order-picker" className="block text-gray-600 hover:text-blue-700 transition">
                    Order Picker
                  </Link>
                  <Link href="/category/agv" className="block text-gray-600 hover:text-blue-700 transition">
                    AGV (Automated Guided Vehicle)
                  </Link>
                </div>
              </div>
            </div>

            {/* Get support - Takes up 1 column */}
            <div className="lg:col-span-1">
              <h3 className="font-bold text-gray-800 mb-4 text-lg">Get Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-gray-600 hover:text-blue-700 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/live-chat" className="text-gray-600 hover:text-blue-700 transition">
                    Live chat
                  </Link>
                </li>
                <li>
                  <Link href="/order-status" className="text-gray-600 hover:text-blue-700 transition">
                    Check order status
                  </Link>
                </li>
                <li>
                  <Link href="/refunds" className="text-gray-600 hover:text-blue-700 transition">
                    Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/report-abuse" className="text-gray-600 hover:text-blue-700 transition">
                    Report abuse
                  </Link>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* Features row */}
      <div className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-800 mb-1">Worldwide Delivery</span>
              <span className="text-xs text-gray-500 leading-relaxed">
                MHEBazar delivers products globally.
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <Headphones className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-800 mb-1">Support 24/7</span>
              <span className="text-xs text-gray-500 leading-relaxed">
                Reach our experts today!
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <ShoppingCart className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-800 mb-1">First Purchase Discount</span>
              <span className="text-xs text-gray-500 leading-relaxed">Up to 10% discount</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <RotateCcw className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-800 mb-1">Easy Returns</span>
              <span className="text-xs text-gray-500 leading-relaxed">
                Read our return policy
              </span>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-blue-700" />
              </div>
              <span className="font-semibold text-gray-800 mb-1">Secure payment</span>
              <span className="text-xs text-gray-500 leading-relaxed">100% Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-gray-100 text-center text-sm py-4 border-t text-gray-600">
        Copyright © {new Date().getFullYear()} MHE Bazar. All rights reserved.
      </div>
    </footer>
  );
}
"use client";

import {
  Globe,
  Headphones,
  ShoppingCart,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
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

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Address & Contact */}
        <div>
          <Image
            src="/mhe-logo.png"
            alt="MHE Bazar"
            width={96}
            height={40}
            className="mb-4 w-24"
            priority
          />
          <h3 className="font-bold mb-1">Address:</h3>
          <p className="text-sm mb-3">
            E-228, Lower Basement, Lajpat Nagar-I, New Delhi-110024
          </p>
          <h3 className="font-bold mb-1">Phone:</h3>
          <p className="text-sm mb-3">+91 9289094445, +91 9840088428</p>
          <h3 className="font-bold mb-1">E-mail:</h3>
          <p className="text-sm break-all">
            sales.1@mhebazar.com
            <br />
            sales.2@mhebazar.com
          </p>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold mb-2">Company</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/about" className="hover:text-blue-700 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/used-mhe" className="hover:text-blue-700 transition">
                Used MHE
              </Link>
            </li>
            <li>
              <Link href="/rental" className="hover:text-blue-700 transition">
                MHE Rental
              </Link>
            </li>
            <li>
              <Link href="/services" className="hover:text-blue-700 transition">
                CMC & AMC Services
              </Link>
            </li>
            <li>
              <Link href="/training" className="hover:text-blue-700 transition">
                Training
              </Link>
            </li>
            <li>
              <Link href="/testimonials" className="hover:text-blue-700 transition">
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-blue-700 transition">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/vendors" className="hover:text-blue-700 transition">
                Vendors
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-blue-700 transition">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        {/* Category */}
        <div>
          <h3 className="font-bold mb-2">Category</h3>
          <ul className="space-y-1 text-sm columns-2 gap-x-6">
            <li>
              <Link href="/category/battery" className="hover:text-blue-700 transition">Battery</Link>
            </li>
            <li>
              <Link href="/category/pallet-truck" className="hover:text-blue-700 transition">Pallet Truck</Link>
            </li>
            <li>
              <Link href="/category/stacker" className="hover:text-blue-700 transition">Stacker</Link>
            </li>
            <li>
              <Link href="/category/platform-truck" className="hover:text-blue-700 transition">Platform Truck</Link>
            </li>
            <li>
              <Link href="/category/tow-truck" className="hover:text-blue-700 transition">Tow Truck</Link>
            </li>
            <li>
              <Link href="/category/dock-leveller" className="hover:text-blue-700 transition">Dock Leveller</Link>
            </li>
            <li>
              <Link href="/category/scissors-lift" className="hover:text-blue-700 transition">Scissors Lift</Link>
            </li>
            <li>
              <Link href="/category/reach-truck" className="hover:text-blue-700 transition">Reach Truck</Link>
            </li>
            <li>
              <Link href="/category/racking-system" className="hover:text-blue-700 transition">Racking System</Link>
            </li>
            <li>
              <Link href="/category/forklift" className="hover:text-blue-700 transition">Forklift</Link>
            </li>
            <li>
              <Link href="/category/container-handler" className="hover:text-blue-700 transition">Container Handler</Link>
            </li>
            <li>
              <Link href="/category/explosionproof-mhe" className="hover:text-blue-700 transition">Explosionproof MHE</Link>
            </li>
            <li>
              <Link href="/category/solution" className="hover:text-blue-700 transition">Solution</Link>
            </li>
            <li>
              <Link href="/category/order-picker" className="hover:text-blue-700 transition">Order Picker</Link>
            </li>
            <li>
              <Link href="/category/agv" className="hover:text-blue-700 transition">AGV (Automated Guided Vehicle)</Link>
            </li>
          </ul>
        </div>

        {/* Get support */}
        <div>
          <h3 className="font-bold mb-2">Get support</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/help" className="hover:text-blue-700 transition">
                Help Center
              </Link>
            </li>
            <li>
              <Link href="/live-chat" className="hover:text-blue-700 transition">
                Live chat
              </Link>
            </li>
            <li>
              <Link href="/order-status" className="hover:text-blue-700 transition">
                Check order status
              </Link>
            </li>
            <li>
              <Link href="/refunds" className="hover:text-blue-700 transition">
                Refunds
              </Link>
            </li>
            <li>
              <Link href="/report-abuse" className="hover:text-blue-700 transition">
                Report abuse
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Features row */}
      <div className="bg-gray-50 border-t py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 text-center text-sm">
          <div className="flex flex-col items-center min-w-[120px] mb-4 sm:mb-0">
            <Globe className="w-8 h-8 mb-2 text-blue-700" />
            <span className="font-semibold">Worldwide Delivery</span>
            <span className="text-xs text-gray-500">
              MHEBazar delivers products globally.
            </span>
          </div>
          <div className="flex flex-col items-center min-w-[120px] mb-4 sm:mb-0">
            <Headphones className="w-8 h-8 mb-2 text-blue-700" />
            <span className="font-semibold">Support 24/7</span>
            <span className="text-xs text-gray-500">
              Reach our experts today!
            </span>
          </div>
          <div className="flex flex-col items-center min-w-[120px] mb-4 sm:mb-0">
            <ShoppingCart className="w-8 h-8 mb-2 text-blue-700" />
            <span className="font-semibold">First Purchase Discount</span>
            <span className="text-xs text-gray-500">Up to 10% discount</span>
          </div>
          <div className="flex flex-col items-center min-w-[120px] mb-4 sm:mb-0">
            <RotateCcw className="w-8 h-8 mb-2 text-blue-700" />
            <span className="font-semibold">Easy Returns</span>
            <span className="text-xs text-gray-500">
              Read our return policy
            </span>
          </div>
          <div className="flex flex-col items-center min-w-[120px]">
            <ShieldCheck className="w-8 h-8 mb-2 text-blue-700" />
            <span className="font-semibold">Secure payment</span>
            <span className="text-xs text-gray-500">100% Protected</span>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm py-4 border-t text-gray-600">
        Copyright © {new Date().getFullYear()} MHE Bazar. All rights reserved.
      </div>
    </footer>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

interface VendorData {
  user_info: {
    first_name: string;
    email: string;
    phone: string;
  };
  gst_no: string;
  company_name: string;
  products_added: number;
  products_purchased: number;
  description: string;
  brand: string;
}

const VendorProfilePage: React.FC = () => {
  const [vendor, setVendor] = useState<VendorData | null>(null);

  useEffect(() => {
    api
      .get(`/vendor/my-application/`)
      .then((res) => {
        setVendor(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch vendor", err);
      });
  }, []);

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <h1 className="text-xl font-semibold text-gray-900">My Profile</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Banner Image */}
          <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 xl:h-80">
            <Image
              src="/vendor/profilebanner.png"
              alt="Vendor Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Profile Content */}
          <div className="p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8">
              {/* Left Column - Logo and Company Info */}
              <div className="flex-shrink-0 mb-8 lg:mb-0">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                    <div className="w-full h-full bg-white rounded-full border-2 border-red-600 flex items-center justify-center">
                      <div className="text-red-600 font-bold text-lg sm:text-xl">
                        {vendor.brand || "BYD"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                      {vendor.brand}
                    </h2>
                    <p className="text-red-600 font-semibold text-sm sm:text-base">
                      {vendor.company_name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Details */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Email:</p>
                      <p className="text-gray-900">{vendor.user_info?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Phone:</p>
                      <p className="text-gray-900">{vendor.user_info?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">GST Number:</p>
                      <p className="text-gray-900">{vendor.gst_no}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Company Name:</p>
                      <p className="text-gray-900">{vendor.company_name}</p>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Products Added:</p>
                      <p className="text-gray-900 font-semibold">
                        {vendor.products_added}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Products Purchased:</p>
                      <p className="text-gray-900 font-semibold">
                        {vendor.products_purchased}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-500 mb-2">Description:</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {vendor.description}
                  </p>
                </div>

                {/* Edit Button */}
                <div className="mt-6">
                  <Link href="/vendor/profile/edit">
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfilePage;

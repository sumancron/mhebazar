"use client";
import React, { useState } from "react";
//import Image from "next/image";


interface VendorData {
  logo: string;
  banner: string;
  productCount: number;
  description: string;
}

interface VendorBannerProps {
  data?: VendorData;
}

const fallbackData: VendorData = {
  logo: "/mhe-logo.png",
  banner: "/mhevendor.png",
  productCount: Math.floor(Math.random() * 100) + 1,
  description: "No description available for this vendor.",
};

export default function VendorBanner({ data }: VendorBannerProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const vendor = data ?? fallbackData;
  const isLongDesc = vendor.description.length > 200;

  return (
    <div className="w-full bg-white">
      {/* Banner */}
      <div className="w-full aspect-[16/9] sm:aspect-[3/1] lg:aspect-[4/1] relative">
        <img
          src={vendor.banner}
          alt="Vendor Banner"
          fill
          className="object-cover w-full h-full"
          priority
          sizes="100vw"
        />

        {/* Desktop Layout - Logo and Product Count Side by Side */}
        <div className="hidden sm:flex absolute -bottom-12 lg:-bottom-16 xl:-bottom-18 items-start gap-4 lg:gap-6 px-4 sm:px-6 md:px-8 z-30">
          <div className="bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex-shrink-0">
            <img
              src={vendor.logo}
              alt="Vendor Logo"
              width={144}
              height={144}
              className="object-contain w-full h-full p-2"
              priority
            />
          </div>

          <div className="bg-white rounded-full px-3 py-2 lg:px-4 lg:py-2 shadow-lg flex items-center justify-between gap-3 lg:gap-4 text-sm lg:text-base font-medium w-fit mt-6 lg:mt-8">
            <span className="text-gray-700">Products added</span>
            <span className="bg-green-200 text-green-700 px-2 py-1 lg:px-3 lg:py-1 rounded-full font-bold text-xs lg:text-sm">
              {vendor.productCount}
            </span>
          </div>
        </div>

        {/* Mobile Layout - Centered Logo */}
        <div className="sm:hidden absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden w-24 h-24">
            <img
              src={vendor.logo}
              alt="Vendor Logo"
              width={80}
              height={80}
              className="object-contain w-full h-full p-2"
              priority
            />
          </div>
        </div>
      </div>

      {/* Mobile Product Count - Below Banner */}
      <div className="sm:hidden flex justify-center mt-16 mb-4 px-4">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center justify-between gap-4 text-sm font-medium border border-gray-100">
          <span className="text-gray-700">Products added</span>
          <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full font-bold text-xs">
            {vendor.productCount}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="mt-8 sm:mt-12 lg:mt-8 mx-4 sm:ml-36 lg:ml-48 xl:ml-52 sm:mr-4">
        <p className={`text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed ${!descExpanded && isLongDesc
          ? "line-clamp-2"
          : ""}`}>
          {vendor.description}
        </p>

        {isLongDesc && (
          <button
            type="button"
            className="mt-2 text-blue-600 underline font-medium hover:text-blue-800 transition-colors text-sm sm:text-base"
            onClick={() => setDescExpanded((v) => !v)}
          >
            {descExpanded ? "less" : "more"}
          </button>
        )}
      </div>
    </div>
  );
}
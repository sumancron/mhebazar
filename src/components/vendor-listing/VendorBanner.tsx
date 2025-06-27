"use client";
import React, { useState } from "react";
import Image from "next/image";

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

  // Logo size for alignment
  const logoSize = 160; // px

  return (
    <div className="w-full bg-white relative">
      {/* Banner */}
      <div className="w-full aspect-[4/1] relative">
        <Image
          src={vendor.banner}
          alt="Vendor Banner"
          fill
          className="object-cover w-full h-full"
          priority
          sizes="100vw"
        />
      </div>
      
      {/* Content Container */}
      <div className="relative max-w-6xl mx-auto px-4">
        {/* Logo and Products Row */}
        <div 
          className="flex items-end gap-6"
          style={{
            marginTop: `-${logoSize / 2}px`, // pull up to overlap banner
            marginBottom: "24px",
          }}
        >
          {/* Logo */}
          <div
            className="bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden"
            style={{
              width: logoSize,
              height: logoSize,
              minWidth: logoSize,
              minHeight: logoSize,
              zIndex: 30,
            }}
          >
            <Image
              src={vendor.logo}
              alt="Vendor Logo"
              width={logoSize - 16}
              height={logoSize - 16}
              className="object-contain"
              priority
            />
          </div>
          
          {/* Products added pill */}
          <div
            className="bg-white rounded-full px-7 py-3 shadow-lg flex items-center gap-2 text-lg font-medium"
            style={{
              zIndex: 25,
              marginBottom: "32px",
              minWidth: "210px",
            }}
          >
            <span className="text-gray-700">Products added</span>
            <span className="bg-green-200 text-green-700 px-4 py-1 rounded-full font-bold text-lg">
              {vendor.productCount}
            </span>
          </div>
        </div>
        
        {/* Description - Full width below logo and products */}
        <div className="w-full mb-8">
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
            {!descExpanded && isLongDesc
              ? `${vendor.description.substring(0, 200)}...`
              : vendor.description}
            {isLongDesc && (
              <button
                type="button"
                className="ml-2 text-blue-600 underline font-medium hover:text-blue-800 transition-colors"
                onClick={() => setDescExpanded((v) => !v)}
              >
                {descExpanded ? "less" : "more"}
              </button>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
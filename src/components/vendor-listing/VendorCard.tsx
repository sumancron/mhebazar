/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type Vendor = {
  id: number;
  username: string;
  email: string;
  full_name: string;
  company_name: string;
  company_email: string;
  brand: string;
  is_approved: boolean;
  application_date: string;
};

type Props = {
  vendor: Vendor;
};

// Utility to create SEO-friendly slug
const toSlug = (text: string) =>
  text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function VendorCard({ vendor }: Props) {
  const [isAdminPath, setIsAdminPath] = useState(false);

  useEffect(() => {
    setIsAdminPath(window.location.pathname.startsWith("/admin/"));
  }, []);

  const vendorDisplayName =
    vendor.brand || vendor.company_name || vendor.full_name;

  const vendorSlug = toSlug(vendorDisplayName);

  const href = isAdminPath
    ? `/admin/accounts/registered-vendors/${vendorSlug}/?user=${vendor.id}`
    : `/vendor-listing/${vendorSlug}`;

  return (
    <div className="relative border border-gray-200 rounded-2xl p-5 flex flex-col items-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 bg-white w-full max-w-xs min-w-[240px]">
      
     

      {/* Logo / Placeholder */}
      <div className="relative w-24 h-20 mb-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
        <div className="w-16 h-16 bg-[#5CA131] rounded-md flex items-center justify-center text-white font-bold text-xl">
          {vendorDisplayName.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Name */}
      <h3 className="text-base font-semibold text-gray-900 text-center mb-1 line-clamp-2">
        {vendorDisplayName}
      </h3>

      {/* Company Name (if different) */}
      {vendor.company_name !== vendorDisplayName && (
        <p className="text-sm text-gray-500 text-center mb-4 line-clamp-1">
          {vendor.company_name}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 w-full mt-auto">
        <Link href={href} className="flex-1">
          <Button className="w-full text-sm font-medium py-2 rounded-lg bg-[#5CA131] hover:bg-[#4a8f28] text-white transition-colors duration-150">
            View Products
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex-1 text-sm font-medium py-2 rounded-lg border border-[#5CA131] text-[#5CA131] hover:bg-[#f2fbf2] transition-colors duration-150"
        >
          Contact
        </Button>
      </div>
    </div>
  );
}

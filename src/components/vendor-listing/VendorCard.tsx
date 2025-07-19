"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

type Vendor = {
  id: number;
  name: string;
  logo: string;
  items: number;
};

type Props = {
  vendor: Vendor;
};

export default function VendorCard({ vendor }: Props) {
  const [isAdminPath, setIsAdminPath] = useState(false);

  useEffect(() => {
    setIsAdminPath(window.location.pathname.startsWith("/admin/"));
  }, []);

  const href = isAdminPath
    ? `/admin/accounts/registered-vendors/${vendor.name}/?user=${vendor.id}`
    : `/vendor-listing/${vendor.name}`;

  return (
    <div className="relative border border-[#E5F4E8] rounded-2xl p-6 flex flex-col items-center shadow-sm hover:shadow-lg hover:scale-[1.03] transition-all duration-200 bg-white min-w-[220px] max-w-[260px] w-full">
      {/* Items Badge */}
      <span className="absolute top-4 right-4 bg-[#E5F4E8] text-[#6FCF97] text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
        {vendor.items} Items
      </span>
      {/* Logo */}
      <div className="relative w-24 h-20 mb-4 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden">
        <Image
          src={vendor.logo}
          alt={vendor.name}
          fill
          className="object-contain"
          sizes="96px"
        />
      </div>
      {/* Name */}
      <h3 className="text-base font-semibold text-center text-gray-900 mb-6">
        {vendor.name}
      </h3>
      {/* Buttons */}

      <div className="flex gap-2 w-full mt-2">
        <Link href={href}>
          <Button className="flex-1 text-sm font-medium py-2 rounded-lg bg-[#5CA131] hover:bg-[#57b87b] border border-[#6FCF97] text-white transition">
            View Product
          </Button>
        </Link>
        <Button
          variant="outline"
          className="flex-1 text-sm font-medium py-2 rounded-lg border border-[#5CA131] text-[#5CA131] bg-white hover:bg-[#e5f4e8] transition"
        >
          Contact
        </Button>
      </div>
    </div>
  );
}

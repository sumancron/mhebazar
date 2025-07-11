import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorCard from "@/components/vendor-listing/VendorCard";
import Link from "next/link";

import { Metadata } from "next";
import { UserPlusIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Vendors at MHEBazar",
};

type Vendor = {
  id: number;
  name: string;
  logo: string;
  items: number;
};

const fallbackVendor: Vendor = {
  id: 1,
  name: "MHE Bazar",
  logo: "/mhe-logo.png",
  items: 1,
};

async function fetchVendors(): Promise<Vendor[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/vendors-list`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    return data?.vendors ?? [fallbackVendor];
  } catch {
    return [fallbackVendor];
  }
}

export default async function VendorsPage() {
  const vendors = await fetchVendors();

  return (
<>
  <Breadcrumb
    items={[
      { label: "Home", href: "/" },
      { label: "Vendors", href: "/vendors" },
    ]}
  />

  <div className="max-w-7xl mx-auto px-4 flex justify-end items-center mt-6">
    <Link href="/become-vendor" passHref>
      <div className="inline-flex items-center gap-2 bg-[#5CA131] hover:scale-105 text-white font-medium px-5 py-2 rounded-lg shadow transition">
        <UserPlusIcon className="w-5 h-5" />
        Become a Vendor
      </div>
    </Link>
  </div>

  <main className="max-w-7xl mx-auto px-4 py-10">
    <h1 className="text-2xl font-semibold mb-6">Vendors at MHEBazar</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  </main>
</>
  );
}

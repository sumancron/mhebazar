import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorCard from "@/components/vendor-listing/VendorCard";
import Link from "next/link";

import { Metadata } from "next";

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
    <Link href="/become-vendor" passHref legacyBehavior>
      <a className="inline-flex items-center gap-2 bg-[#6FCF97] hover:bg-[#57b87b] text-white font-medium px-5 py-2 rounded-lg shadow transition">
        <svg width="18" height="18" fill="none" viewBox="0 0 20 20">
          <path fill="currentColor" d="M8.5 2a2.5 2.5 0 1 1 5 0v1.5h1.5A2.5 2.5 0 0 1 17.5 6v1.5h-15V6A2.5 2.5 0 0 1 5.5 3.5H7V2Zm2.5 0a1.5 1.5 0 0 0-3 0v1.5h3V2ZM2.5 8.5h15V14a2.5 2.5 0 0 1-2.5 2.5h-10A2.5 2.5 0 0 1 2.5 14V8.5Z"/>
        </svg>
        Become a Vendor
      </a>
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

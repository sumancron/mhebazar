"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product";
import Image from "next/image";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface VendorProduct {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function VendorProductsFeatured() {
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/vendor_products`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: VendorProduct[] = await res.json();
        setVendorProducts(data || []);
      } catch {
        setVendorProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProducts();
  }, []);

  return (
    <section className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Vendor Products
      </h2>
      {loading ? (
        <div className="w-full flex justify-center items-center py-16 text-gray-500 text-lg">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {vendorProducts.length > 0 ? (
            vendorProducts.map((vendor_product) => (
              <div
                key={vendor_product.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] hover:shadow-lg transition p-4 flex flex-col"
              >
                <ProductCard
                  id={Number(vendor_product.id)}
                  image={vendor_product.image}
                  title={vendor_product.title}
                  subtitle={vendor_product.subtitle}
                  price={vendor_product.price}
                  currency={vendor_product.currency}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)]">
              <Image
                src="/no-product.png"
                alt="No product"
                width={112}
                height={112}
                className="mb-4 opacity-70"
              />
              <div className="text-lg font-semibold text-gray-700 mb-1">
                No vendor products available
              </div>
              <div className="text-gray-500">
                There are no vendor products available at the moment.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
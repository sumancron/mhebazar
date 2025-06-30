"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product";
import Image from "next/image";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface RecentProduct {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function RecentlyViewed() {
  const [recent, setRecent] = useState<RecentProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/spare_parts`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: RecentProduct[] = await res.json();
        setRecent(data || []);
      } catch {
        setRecent([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Recently Viewed Products
      </h2>
      {loading ? (
        <div className="w-full flex justify-center items-center py-16 text-gray-500 text-lg">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {recent.length > 0 ? (
            recent.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] hover:shadow-lg transition p-4 flex flex-col"
              >
                <ProductCard
                  id={Number(item.id)}
                  image={item.image}
                  title={item.title}
                  subtitle={item.subtitle}
                  price={item.price}
                  currency={item.currency}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Image
                src="/no-product.png"
                alt="No product"
                width={112}
                height={112}
                className="mb-4 opacity-70"
                priority
              />
              <div className="text-lg font-semibold text-gray-700 mb-1">
                No products viewed yet
              </div>
              <div className="text-gray-500">
                You havent viewed any products recently.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
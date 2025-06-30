"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product";
import Image from "next/image";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface RelatedProduct {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function RelatedProducts() {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/spare_parts`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: RelatedProduct[] = await res.json();
        setRelatedProducts(data || []);
      } catch {
        setRelatedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRelatedProducts();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {relatedProducts.length > 0 ? (
          relatedProducts.map((item) => (
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
              width={112} // equivalent to w-28
              height={112} // equivalent to h-28
              className="mb-4 opacity-70"
            />
            <div className="text-lg font-semibold text-gray-700 mb-1">
              No related products found
            </div>
            <div className="text-gray-500">
              There are no related products available at the moment.
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

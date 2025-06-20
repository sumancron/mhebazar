"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product"; // Adjust the import path as per your folder structure

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface SparePart {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function SparePartsFeatured() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/spare_parts`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: SparePart[] = await res.json();
        setSpareParts(data || []);
      } catch (_error) {
        setSpareParts([]); // in case of error or empty
      } finally {
        setLoading(false);
      }
    };
    fetchSpareParts();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center p-10 text-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-wrap gap-6 justify-center p-4">
      {spareParts.length > 0 ? (
        spareParts.map((spare) => (
          <ProductCard
            key={spare.id}
            image={spare.image}
            title={spare.title}
            subtitle={spare.subtitle}
            price={spare.price}
            currency={spare.currency}
          />
        ))
      ) : (
        <ProductCard
          image="/no-product.png"          // put your placeholder image in `public/no-product.png`
          title="No product"
          subtitle="There are no spare parts available at the moment."
          price={0}
          currency=""                       // hide the currency since price is 0
          onAddToCart={() => {}}           // empty handlers to disable actions
          onWishlist={() => {}}
          onCompare={() => {}}
          onShare={() => {}}
        />
      )}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product"; // Adjust the import path as per your folder structure

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ExportProduct {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function ExportProductsFeatured() {
  const [exportProducts, setExportProducts] = useState<ExportProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExportProducts = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/export_products`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: ExportProduct[] = await res.json();
        setExportProducts(data || []);
      } catch {
        setExportProducts([]); // in case of error or empty
      } finally {
        setLoading(false);
      }
    };
    fetchExportProducts();
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
      {exportProducts.length > 0 ? (
        exportProducts.map((export_product) => (
          <ProductCard
            key={export_product.id}
            image={export_product.image}
            title={export_product.title}
            subtitle={export_product.subtitle}
            price={export_product.price}
            currency={export_product.currency}
          />
        ))
      ) : (
        <ProductCard
          image="/no-product.png"          // put your placeholder image in `public/no-product.png`
          title="No product"
          subtitle="There are no export products available at the moment."
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

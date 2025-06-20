"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/elements/Product"; // Adjust the import path as per your folder structure

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
  const [VendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      try {
        const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/vendor_products`);
        if (!res.ok) throw new Error("Failed to fetch data");
        const data: VendorProduct[] = await res.json();
        setVendorProducts(data || []);
      } catch{
        setVendorProducts([]); // in case of error or empty
      } finally {
        setLoading(false);
      }
    };
    fetchVendorProducts();
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
      {VendorProducts.length > 0 ? (
        VendorProducts.map((vendor_product) => (
          <ProductCard
            key={vendor_product.id}
            image={vendor_product.image}
            title={vendor_product.title}
            subtitle={vendor_product.subtitle}
            price={vendor_product.price}
            currency={vendor_product.currency}
          />
        ))
      ) : (
        <ProductCard
          image="/no-product.png"          // put your placeholder image in `public/no-product.png`
          title="No product"
          subtitle="There are no vendor products available at the moment."
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

// page.tsx (Updated ExportProductsFeatured section)
"use client";

import React, { useEffect, useState } from "react";
// Import ProductCardContainer from Product.tsx, as it's the default export
import ProductCardContainer from "@/components/elements/Product"; 
import Image from "next/image";
import axios from "axios";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

interface ExportProduct {
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
  // Add other properties from your API response that ProductCardContainer might need
  direct_sale: boolean; // Assuming your API returns this
  is_active: boolean;    // Assuming your API returns this
  hide_price: boolean;   // Assuming your API returns this
  stock_quantity: number; // Assuming your API returns this
  type: string;          // Assuming your API returns this (e.g., 'new', 'used', 'rental')
}

export default function ExportProductsFeatured() {
  const [exportProducts, setExportProducts] = useState<ExportProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/products`);
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.results ?? [];

        // Limit the products to only 4 as requested
        setExportProducts(data.slice(0, 4)); 
      } catch (error) {
        console.error("Failed to fetch most popular products:", error);
        setExportProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <section className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Export Products
      </h2>
      {loading ? (
        <div className="w-full flex justify-center items-center py-16 text-gray-500 text-lg">
          Loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
          {exportProducts.length > 0 ? (
            exportProducts.map((export_product) => (
              <div
                key={export_product.id}
                className="bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] hover:shadow-lg transition p-4 flex flex-col"
              >
                {/* Use ProductCardContainer here, passing all necessary props */}
                <ProductCardContainer
                  id={Number(export_product.id)}
                  image={export_product.image}
                  title={export_product.title}
                  subtitle={export_product.subtitle}
                  price={export_product.price}
                  currency={export_product.currency}
                  directSale={export_product.direct_sale}
                  is_active={export_product.is_active}
                  hide_price={export_product.hide_price}
                  stock_quantity={export_product.stock_quantity}
                  type={export_product.type}
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
                No export products available
              </div>
              <div className="text-gray-500">
                There are no export products available at the moment.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

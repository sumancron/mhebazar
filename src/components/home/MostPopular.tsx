"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

// ====================
// Types
// ====================
interface Product {
  image: string;
  label: string;
}
interface Category {
  id?: string;
  title: string;
  subtitle: string;
  mainImage: string;
  mainLabel: string;
  note: string;
  products: Product[];
}
interface ApiResponse {
  success: boolean;
  data: Category[];
}

// ====================
// Fallback Data
// ====================
const FALLBACK_DATA: Category[] = [
  {
    title: "Most Popular",
    subtitle: "Batteries",
    mainImage: "/home/category-main.png",
    mainLabel: "80v / 500ah",
    note: "*Battery Size Customizable",
    products: [
      { image: "/home/battery-1.png", label: "48v / 500ah" },
      { image: "/home/battery-2.png", label: "25.6v / 300ah" },
      { image: "/home/battery-3.png", label: "" },
    ],
  },
  // Add as many fallback items as you want…
];

// ====================
// Main Component
// ====================
export default function MostPopular() {
  const [categories, setCategories] = useState(FALLBACK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data
  const fetchData = useCallback(async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      setIsLoading(false); // No URL? Skip fetch.
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/most_popular`);
      if (!res.ok) throw new Error(`Status: ${res.status}`);
      const result: ApiResponse = await res.json();

      if (result.success && Array.isArray(result.data) && result.data.length) {
        setCategories(result.data);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error while fetching"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <section className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">Top Selling Products</h2>
        <button className="text-green-600 text-sm hover:text-green-700">View more</button>
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-4xl p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <Carousel className="w-full">
          {/* Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 pointer-events-none">
            <CarouselPrevious className="pointer-events-auto left-2 border bg-white" />
            <CarouselNext className="pointer-events-auto right-2 border bg-white" />
          </div>

          {/* Title */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold">{categories[0]?.title}</h3>
            <p className="text-sm text-gray-500">{categories[0]?.subtitle}</p>
          </div>

          {/* Content */}
          <CarouselContent>
            {categories.map((category, idx) => (
              <CarouselItem key={category.id || idx} className="p-4">
                <Card className="p-4 flex flex-col items-center text-center border-none shadow-none">
                  {/* Main Image */}
                  <div className="relative w-64 h-64 mb-4">
                    <Image
                      src={category.mainImage}
                      alt={category.mainLabel}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Label */}
                  <p className="text-green-600 font-bold text-xl mb-2">
                    {category.mainLabel}
                  </p>
                  <p className="text-xs text-gray-500 mb-6">{category.note}</p>

                  {/* Products */}
                  <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                    {category.products.slice(0, 3).map((product, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.label || `Product ${i + 1}`}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        {product.label && (
                          <p className="text-xs mt-1 text-center">{product.label}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {error && (
          <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            
          </p>
        )}
      </div>
    </section>
  );
}

// ====================
// Skeleton Loader
// ====================
function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl p-6 border border-gray-200 rounded-lg bg-white animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
      <div className="h-64 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
        <div className="h-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

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
import axios from "axios";

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
      const res = await axios.get<ApiResponse>(
        `${baseUrl}/products/most_popular/`
      );
      const result = res.data;
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
    <section className="w-full sm:px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
          Top Selling Products
        </h2>
        <button className="text-green-600 text-sm hover:text-green-700">
          View more
        </button>
      </div>

      {/* Carousel */}
      <div className="relative w-full max-w-4xl mx-auto p-3 sm:p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
        <Carousel className="w-full">
          {/* Controls */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 pointer-events-none">
            <CarouselPrevious className="pointer-events-auto left-1 sm:left-2 border bg-white" />
            <CarouselNext className="pointer-events-auto right-1 sm:right-2 border bg-white" />
          </div>

          {/* Title */}
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold">{categories[0]?.title}</h3>
            <p className="text-sm text-gray-500">{categories[0]?.subtitle}</p>
          </div>

          {/* Content */}
          <CarouselContent>
            {categories.map((category, idx) => (
              <CarouselItem key={category.id || idx} className="p-2 sm:p-4">
                <Card className="p-2 sm:p-4 flex flex-col items-center text-center border-none shadow-none">
                  {/* Main Image */}
                  <div className="relative w-48 h-48 sm:w-44 sm:h-44 mb-3 sm:mb-4">
                    <Image
                      src={category.mainImage}
                      alt={category.mainLabel}
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Label */}
                  <p className="text-green-600 font-bold text-lg sm:text-xl mb-2">
                    {category.mainLabel}
                  </p>
                  <p className="text-xs text-gray-500 mb-4 sm:mb-6">{category.note}</p>

                  {/* Products */}
                  <div className="flex justify-evenly w-full gap-2">
                    {category.products.slice(0, 3).map((product, i) => (
                      <div key={i} className="flex flex-col items-center flex-1 max-w-28 sm:max-w-36">
                        <div className="relative w-24 h-24 sm:w-36 sm:h-36 bg-gray-50 rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.label || `Product ${i + 1}`}
                            width={250}
                            height={250}
                            className="object-contain p-1"
                          />
                        </div>
                        {product.label && (
                          <p className="text-xs mt-1 text-center leading-tight">
                            {product.label}
                          </p>
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
          <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded"></p>
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
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6 border border-gray-200 rounded-lg bg-white animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
      <div className="h-48 sm:h-64 bg-gray-200 rounded mb-4" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-20 sm:h-24 bg-gray-200 rounded" />
        <div className="h-20 sm:h-24 bg-gray-200 rounded" />
        <div className="h-20 sm:h-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}
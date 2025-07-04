"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

// Types
interface NewArrival {
  id?: string;
  image: string;
  title?: string;
  alt?: string;
}

interface TopSearchedProduct {
  id?: string;
  image: string;
  label: string;
  alt?: string;
}

interface NewArrivalsApiResponse {
  success: boolean;
  data: {
    count: number;
    products: NewArrival[];
  };
}

interface TopSearchedApiResponse {
  success: boolean;
  data: TopSearchedProduct[];
}

// Fallback data
const FALLBACK_NEW_ARRIVALS: NewArrival[] = [
  { image: "/home/new-1.png", alt: "New Arrival 1" },
  { image: "/home/new-2.png", alt: "New Arrival 2" },
  { image: "/home/new-3.png", alt: "New Arrival 3" },
];

const FALLBACK_TOP_SEARCHED: TopSearchedProduct[] = [
  { image: "/home/search-1.png", label: "Forklift Attachments" },
  { image: "/home/search-2.png", label: "Manual Platform Trolly" },
  { image: "/home/search-3.png", label: "Electric Pallet Truck (BOPT)" },
];

export default function NewArrivalsAndTopSearches() {
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>(FALLBACK_NEW_ARRIVALS);
  const [topSearched, setTopSearched] = useState<TopSearchedProduct[]>(FALLBACK_TOP_SEARCHED);
  const [newArrivalsCount, setNewArrivalsCount] = useState<number>(50);
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] = useState<boolean>(true);
  const [isLoadingTopSearched, setIsLoadingTopSearched] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    newArrivals?: string;
    topSearched?: string;
  }>({});

  const fetchNewArrivals = useCallback(async (): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn("NEXT_PUBLIC_API_BASE_URL not configured for new arrivals, using fallback data");
      setIsLoadingNewArrivals(false);
      return;
    }

    try {
      setErrors(prev => ({ ...prev, newArrivals: undefined }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/new_arrivals`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "force-cache",
          next: { revalidate: 300 },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NewArrivalsApiResponse = await response.json();

      if (result.success && result.data && Array.isArray(result.data.products)) {
        const validProducts = result.data.products.filter((product: NewArrival) =>
          product.image
        );

        if (validProducts.length > 0) {
          setNewArrivals(validProducts.slice(0, 6)); // Limit to 6 items for UI
          setNewArrivalsCount(result.data.count || validProducts.length);
        } else {
          throw new Error("No valid products in API response");
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Failed to fetch new arrivals:", errorMessage);
      setErrors(prev => ({ ...prev, newArrivals: errorMessage }));
    } finally {
      setIsLoadingNewArrivals(false);
    }
  }, []);

  const fetchTopSearched = useCallback(async (): Promise<void> => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      console.warn("NEXT_PUBLIC_API_BASE_URL not configured for top searched, using fallback data");
      setIsLoadingTopSearched(false);
      return;
    }

    try {
      setErrors(prev => ({ ...prev, topSearched: undefined }));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/top_searched`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "force-cache",
          next: { revalidate: 300 },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TopSearchedApiResponse = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const validProducts = result.data.filter((product: TopSearchedProduct) =>
          product.image && product.label
        );

        if (validProducts.length > 0) {
          setTopSearched(validProducts.slice(0, 5)); // Limit to 5 items for UI
        } else {
          throw new Error("No valid products in API response");
        }
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Failed to fetch top searched products:", errorMessage);
      setErrors(prev => ({ ...prev, topSearched: errorMessage }));
    } finally {
      setIsLoadingTopSearched(false);
    }
  }, []);

  useEffect(() => {
    fetchNewArrivals();
    fetchTopSearched();
  }, [fetchNewArrivals, fetchTopSearched]);

  const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-8 w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl px-4">
      {/* New Arrivals */}
      <div className=" ">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">New Arrivals</h2>
            <Link
              href="#"
              className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
            >
              View more
            </Link>
          </div>

          <div className="pb-6">
            <p className="font-medium text-gray-900">
              {newArrivalsCount}+ products added today
            </p>
          </div>

        {isLoadingNewArrivals ? (
          <div className="flex gap-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        ) : (
            <div className="flex gap-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {newArrivals.slice(0, 3).map((item, i) => (
              <div
                key={item.id || i}
                className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.alt || item.title || `New Arrival ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 96px, 128px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-image.png";
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {errors.newArrivals && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {/* Using cached data: {errors.newArrivals} */}
          </div>
        )}
      </div>

      {/* Top Searched Products */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="font-semibold text-lg text-gray-900">Top Searched Products</h2>
          <Link
            href="#"
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors"
          >
            View more
          </Link>
        </div>

        {isLoadingTopSearched ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton key={i} className="flex items-center gap-4 p-2 sm:p-3" />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topSearched.map((item, i) => (
              <div
                key={item.id || i}
                className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              >
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.alt || item.label}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 640px) 48px, 64px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
                <p className="font-medium text-gray-900 flex-1 text-sm sm:text-base">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {errors.topSearched && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {/* Using cached data: {errors.topSearched} */}
          </div>
        )}
      </div>
    </div>
  );
}
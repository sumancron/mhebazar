"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

// Types
interface NewArrival {
  id?: string | number;
  image: string;
  title?: string;
  alt?: string;
}

interface TopSearchedProduct {
  id?: string | number;
  image: string;
  label: string;
  alt?: string;
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
  const [newArrivals, setNewArrivals] = useState<NewArrival[]>(
    FALLBACK_NEW_ARRIVALS
  );
  const [topSearched, setTopSearched] = useState<TopSearchedProduct[]>(
    FALLBACK_TOP_SEARCHED
  );
  const [newArrivalsCount, setNewArrivalsCount] = useState<number>(50);
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] =
    useState<boolean>(true);
  const [isLoadingTopSearched, setIsLoadingTopSearched] =
    useState<boolean>(true);
  const [errors, setErrors] = useState<{
    newArrivals?: string;
    topSearched?: string;
  }>({});

  useEffect(() => {
    // Fetch New Arrivals
    setIsLoadingNewArrivals(true);
    api
      .get("/products/new_arrival/")
      .then(res => {
        const products: NewArrival[] = Array.isArray(res.data?.products)
          ? res.data.products
          : [];
        const validProducts = products.filter(product => product.image);
        if (validProducts.length > 0) {
          setNewArrivals(validProducts.slice(0, 6));
          setNewArrivalsCount(res.data.count || validProducts.length);
        } else {
          setErrors(prev => ({
            ...prev,
            newArrivals: "No valid products in API response",
          }));
        }
      })
      .catch(err => {
        setErrors(prev => ({
          ...prev,
          newArrivals: err?.message || "Unknown error",
        }));
      })
      .finally(() => setIsLoadingNewArrivals(false));

    // Fetch Top Searched (Top Rated)
    setIsLoadingTopSearched(true);
    api
      .get("/products/top_rated/")
      .then(res => {
        // Accept both array and object with products property
        let products: TopSearchedProduct[] = [];
        if (Array.isArray(res.data)) {
          products = res.data;
        } else if (Array.isArray(res.data?.products)) {
          products = res.data.products;
        }
        function hasTitle(obj: unknown): obj is { title: string } {
          return (
            typeof obj === "object" &&
            obj !== null &&
            "title" in obj &&
            typeof (obj as Record<string, unknown>).title === "string"
          );
        }
        const validProducts = products.filter(
          product => product.image && (product.label || hasTitle(product))
        );
        if (validProducts.length > 0) {
          setTopSearched(
            validProducts.slice(0, 5).map(p => ({
              ...p,
              label: p.label || (hasTitle(p) ? p.title : "Top Rated"),
            }))
          );
        } else {
          setErrors(prev => ({
            ...prev,
            topSearched: "No valid products in API response",
          }));
        }
      })
      .catch(err => {
        setErrors(prev => ({
          ...prev,
          topSearched: err?.message || "Unknown error",
        }));
      })
      .finally(() => setIsLoadingTopSearched(false));
  }, []);

  const LoadingSkeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  );

  return (
    <div className="space-y-8 w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
      {/* New Arrivals */}
      <div className=" ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            New Arrivals
          </h2>
          <Link
            href="#"
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
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
              <div
                key={i}
                className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {newArrivals.slice(0, 3).map((item, i) => (
              <div
                key={item.id || i}
                className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                <Image
                  src={item.image}
                  alt={item.alt || item.title || `New Arrival ${i + 1}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 640px) 96px, 128px"
                  onError={e => {
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
            {`Using cached data: ${errors.newArrivals}`}
          </div>
        )}
      </div>

      {/* Top Searched Products */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="font-semibold text-lg text-gray-900">
            Top Searched Products
          </h2>
          <Link
            href="#"
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            View more
          </Link>
        </div>

        {isLoadingTopSearched ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingSkeleton
                key={i}
                className="flex items-center gap-4 p-2 sm:p-3"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topSearched.map((item, i) => (
              <div
                key={item.id || i}
                className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100">
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.alt || item.label}
                    fill
                    className="object-contain p-1"
                    sizes="(max-width: 640px) 48px, 64px"
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
                <p className="font-medium text-gray-900 flex-1 text-sm sm:text-base">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {errors.topSearched && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {`Using cached data: ${errors.topSearched}`}
          </div>
        )}
      </div>
    </div>
  );
}

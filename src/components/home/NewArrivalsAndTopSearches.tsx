// /components/NewArrivalsAndTopSearches.tsx

"use client";

import { useState, useEffect, JSX } from "react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";

// --- Type Definitions (Refined) ---
interface ProductApiResponse {
  id: string | number;
  image: string | null;
  name?: string;
  title?: string;
}

interface DisplayItem {
  id: string | number;
  image: string | null;
  label: string;
  alt: string;
  slug: string;
}

// --- Fallback Data ---
const FALLBACK_NEW_ARRIVALS: DisplayItem[] = [
  { id: 'fallback-na-1', image: "/home/new-1.png", label: "New MHE 1", alt: "New MHE 1", slug: "#" },
  { id: 'fallback-na-2', image: "/home/new-2.png", label: "New MHE 2", alt: "New MHE 2", slug: "#" },
  { id: 'fallback-na-3', image: "/home/new-3.png", label: "New MHE 3", alt: "New MHE 3", slug: "#" },
];

const FALLBACK_TOP_RATED: DisplayItem[] = [
  { id: 'fallback-ts-1', image: "/home/search-1.png", label: "Forklift Attachments", alt: "Forklift Attachments", slug: "#" },
  { id: 'fallback-ts-2', image: "/home/search-2.png", label: "Manual Platform Trolly", alt: "Manual Platform Trolly", slug: "#" },
  { id: 'fallback-ts-3', image: "/home/search-3.png", label: "Electric Pallet Truck (BOPT)", alt: "Electric Pallet Truck (BOPT)", slug: "#" },
];

// --- Helper Component for Top Rated Items ---
function TopRatedItem({ item }: { item: DisplayItem }): JSX.Element {
  const { image, label, alt, slug } = item;
  const [showInitials, setShowInitials] = useState<boolean>(!image);
  const initials = label?.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Link href={`/product/${slug}/?id=${item.id}`} className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100 group">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
        {image && !showInitials ? (
          <Image src={image} alt={alt || label} fill className="object-contain p-1 transform group-hover:scale-105 transition-transform duration-200" sizes="(max-width: 640px) 48px, 64px" onError={() => setShowInitials(true)} />
        ) : (
          <span className="text-blue-500 text-base sm:text-xl font-bold">{initials}</span>
        )}
      </div>
      <p className="font-medium text-gray-900 flex-1 text-sm sm:text-base group-hover:text-blue-700 transition-colors">{label}</p>
    </Link>
  );
}

// --- Main Component ---
export default function NewArrivalsAndTopSearches() {
  const [newArrivals, setNewArrivals] = useState<DisplayItem[]>(FALLBACK_NEW_ARRIVALS);
  const [topRated, setTopRated] = useState<DisplayItem[]>(FALLBACK_TOP_RATED);
  const [newArrivalsCount, setNewArrivalsCount] = useState<number>(0);
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] = useState<boolean>(true);
  const [isLoadingTopRated, setIsLoadingTopRated] = useState<boolean>(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const createSlug = (text: string | undefined) => text ? text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : "#";
  // const getAbsoluteImageUrl = (path: string | null | undefined) => path ? (path.startsWith('http') ? path : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`) : null;

  useEffect(() => {
    // Fetch New Arrivals
    setIsLoadingNewArrivals(true);
    api.get<{ count?: number; products?: ProductApiResponse[] }>(`/products/new-arrival/`)
      .then(res => {
        const products = res.data?.products || [];
        const transformed = products.slice(0, 10).map(p => ({
          id: p.id,
          image: p.images[0]?.image || null,
          label: p.title || p.name || "New Product",
          alt: p.title || p.name || "New Product",
          slug: createSlug(p.title || p.name),
        }));
        if (transformed.length > 0) {
          setNewArrivals(transformed);
          setNewArrivalsCount(res.data?.count || transformed.length);
        }
      }).catch(console.error).finally(() => setIsLoadingNewArrivals(false));

    // Fetch Top Rated
    setIsLoadingTopRated(true);
    api.get<{ count?: number; products?: ProductApiResponse[] }>(`/products/top-rated/`)
      .then(res => {
        const products = res.data?.products || [];
        console.log("Top Rated Products:", products);
        const transformed = products.slice(0, 10).map(p => ({
          id: p.id,
          image: p.images[0]?.image || null,
          label: p.title || p.name || "Top Rated Product",
          alt: p.title || p.name || "Top Rated Product",
          slug: createSlug(p.title || p.name),
        }));
        if (transformed.length > 0) setTopRated(transformed);
      }).catch(console.error).finally(() => setIsLoadingTopRated(false));
  }, [API_BASE_URL]);

  const LoadingBoxSkeleton = () => <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>;
  const LoadingListItemSkeleton = () => (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-200"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  // console.log("New Arrivals:", newArrivals);

  return (
    <div className="space-y-8 w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
      {/* New Arrivals Section */}
      <div>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">New Arrivals</h2>
          <Link href="/products/battery" className="text-green-600 text-sm font-medium hover:text-green-700">View more ({newArrivalsCount})</Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="pb-6">
            <p className="font-semibold text-2xl text-gray-900">
              {newArrivalsCount > 0 ? `${newArrivalsCount}+ products added today` : "No new products today"}
            </p>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {isLoadingNewArrivals ? (
              [...Array(5)].map((_, i) => <LoadingBoxSkeleton key={i} />)
            ) : (
              newArrivals.map((item) => (
                <Link href={`/product/${item.slug}/?id=${item.id}`} key={item.id} className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border group">
                  {item.image && <Image src={item.image} alt={item.alt} fill className="object-contain p-2 group-hover:scale-105 transition-transform" sizes="(max-width: 640px) 96px, 128px" />}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top Searched Products Section */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-lg text-gray-900">Top Searched Products</h2>
          <Link href="/products/battery" className="text-green-600 text-sm font-medium hover:text-green-700">View more</Link>
        </div>

        {/* MODIFIED: Added a wrapper div with max-height and overflow for the scrollable list */}
        <div className="max-h-96 overflow-y-auto pr-2">
          {isLoadingTopRated ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <LoadingListItemSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {topRated.map((item) => <TopRatedItem key={item.id} item={item} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
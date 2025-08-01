"use client";

import { useState, useEffect, JSX } from "react"; // useRef added for image fallback
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api"; // Your custom API client
// import { Loader2 } from "lucide-react"; // For a better loading spinner


// --- Type Definitions (Refined) ---

// Common product fields from API
interface ProductApiResponse {
  id: string | number;
  image: string | null; // URL string or null
  name?: string; // Often 'name' in Django models
  title?: string; // Some products might have a 'title'
  // Add other common product fields if needed, e.g., 'price', 'slug'
}

// Interface for what NewArrivals component expects
interface NewArrivalDisplayItem {
  id: string | number;
  image: string | null; // The URL for the image
  title: string; // The primary text to display
  alt: string; // Alt text for image
  slug: string; // For linking to product details
}

// Interface for what TopSearched component expects
interface TopSearchedDisplayItem {
  id: string | number;
  image: string | null; // The URL for the image
  label: string; // The primary text to display
  alt: string; // Alt text for image
  slug: string; // For linking to product details
}

// --- Fallback Data (for initial render/API failure) ---
// Adjust these paths if your fallback images are in /public/
const FALLBACK_NEW_ARRIVALS: NewArrivalDisplayItem[] = [
  { id: 'fallback-na-1', image: "/home/new-1.png", title: "New MHE 1", alt: "New MHE 1", slug: "cleaning-equipment" },
  { id: 'fallback-na-2', image: "/home/new-2.png", title: "New MHE 2", alt: "New MHE 2", slug: "forklift" },
  { id: 'fallback-na-3', image: "/home/new-3.png", title: "New MHE 3", alt: "New MHE 3", slug: "charger" },
];

const FALLBACK_TOP_SEARCHED: TopSearchedDisplayItem[] = [
  { id: 'fallback-ts-1', image: "/home/search-1.png", label: "Forklift Attachments", alt: "Forklift Attachments", slug: "forklift" },
  { id: 'fallback-ts-2', image: "/home/search-2.png", label: "Manual Platform Trolly", alt: "Manual Platform Trolly", slug: "platform-truck" },
  { id: 'fallback-ts-3', image: "/home/search-3.png", label: "Electric Pallet Truck (BOPT)", alt: "Electric Pallet Truck (BOPT)", slug: "pallet-truck" },
];


// --- Helper Component for Top Searched Items (with Initials Fallback) ---
interface TopSearchedItemProps {
  item: TopSearchedDisplayItem;
}

function TopSearchedItem({ item }: TopSearchedItemProps): JSX.Element {
  const { image, label, alt, slug } = item;
  const [showInitials, setShowInitials] = useState<boolean>(!image); // Initially show initials if no imageSrc
  const initials = label
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleImageError = () => {
    setShowInitials(true); // If image fails to load, trigger fallback to initials
  };

  return (
    <Link href={`/${slug}`} className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100 group">
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0 flex items-center justify-center">
        {image && !showInitials ? (
          <Image
            src={image}
            alt={alt || label}
            fill
            className="object-contain p-1 transform group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 640px) 48px, 64px"
            onError={handleImageError} // Image error handler
          />
        ) : (
          <span className="text-blue-500 text-base sm:text-xl font-bold">
            {initials}
          </span>
        )}
      </div>
      <p className="font-medium text-gray-900 flex-1 text-sm sm:text-base group-hover:text-blue-700 transition-colors">
        {label}
      </p>
    </Link>
  );
}


// --- Main Component ---
export default function NewArrivalsAndTopSearches() {
  const [newArrivals, setNewArrivals] = useState<NewArrivalDisplayItem[]>(
    FALLBACK_NEW_ARRIVALS
  );
  const [topSearched, setTopSearched] = useState<TopSearchedDisplayItem[]>(
    FALLBACK_TOP_SEARCHED
  );
  const [newArrivalsCount, setNewArrivalsCount] = useState<number>(0); // Initialize with 0
  const [isLoadingNewArrivals, setIsLoadingNewArrivals] = useState<boolean>(true);
  const [isLoadingTopSearched, setIsLoadingTopSearched] = useState<boolean>(true);
  const [errors, setErrors] = useState<{
    newArrivals?: string;
    topSearched?: string;
  }>({});

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helper to create URL-friendly slug
  const createSlug = (text: string | undefined) => {
    if (!text) return "#";
    return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''); // Basic slugify
  };

  // Helper to ensure image URLs are absolute if relative
  const getAbsoluteImageUrl = (relativePath: string | null | undefined): string | null => {
    if (!relativePath) return null;
    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return relativePath; // Already an absolute URL
    }
    // If it's a relative path, prepend API_BASE_URL
    return `${API_BASE_URL}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
  };


  useEffect(() => {
    // --- Fetch New Arrivals ---
    setIsLoadingNewArrivals(true);
    setErrors(prev => ({ ...prev, newArrivals: undefined })); // Clear previous error
    api
      .get<{ count?: number; products?: ProductApiResponse[] }>(`${API_BASE_URL}/products/new_arrival/`)
      .then(res => {
        const products: ProductApiResponse[] = Array.isArray(res.data?.products)
          ? res.data.products
          : Array.isArray(res.data) ? res.data : []; // Also handle direct array response
        
        const transformedProducts: NewArrivalDisplayItem[] = products
          .filter(p => p.image) // Only include items with an image initially
          .slice(0, 6) // Limit to 6 items as per previous code
          .map(p => ({
            id: p.id,
            image: getAbsoluteImageUrl(p.image), // Ensure image URL is absolute
            title: p.title || p.name || "New Product", // Use title or name, fallback to "New Product"
            alt: p.title || p.name || "New Product",
            slug: createSlug(p.title || p.name),
          }));

        if (transformedProducts.length > 0) {
          setNewArrivals(transformedProducts);
          setNewArrivalsCount(res.data?.count || transformedProducts.length);
        } else {
          setErrors(prev => ({
            ...prev,
            newArrivals: "API response for new arrivals was empty or invalid. Using fallback data.",
          }));
          setNewArrivals(FALLBACK_NEW_ARRIVALS); // Use fallback if API returns no valid products
        }
      })
      .catch(err => {
        console.error("Error fetching new arrivals:", err);
        setErrors(prev => ({
          ...prev,
          newArrivals: `Failed to load new arrivals: ${err.message || "Unknown error"}. Using fallback data.`,
        }));
        setNewArrivals(FALLBACK_NEW_ARRIVALS); // Use fallback on API error
      })
      .finally(() => setIsLoadingNewArrivals(false));

    // --- Fetch Top Searched (Top Rated) ---
    setIsLoadingTopSearched(true);
    setErrors(prev => ({ ...prev, topSearched: undefined })); // Clear previous error
    api
      .get<{ count?: number; products?: ProductApiResponse[] }>(`${API_BASE_URL}/products/top_rated/`)
      .then(res => {
        const products: ProductApiResponse[] = Array.isArray(res.data?.products)
          ? res.data.products
          : Array.isArray(res.data) ? res.data : []; // Also handle direct array response

        const transformedProducts: TopSearchedDisplayItem[] = products
          .filter(p => p.image && (p.title || p.name)) // Ensure image AND title/name exist
          .slice(0, 5) // Limit to 5 items
          .map(p => ({
            id: p.id,
            image: getAbsoluteImageUrl(p.image), // Ensure image URL is absolute
            label: p.title || p.name || "Top Rated Product", // Use title or name
            alt: p.title || p.name || "Top Rated Product",
            slug: createSlug(p.title || p.name),
          }));

        if (transformedProducts.length > 0) {
          setTopSearched(transformedProducts);
        } else {
          setErrors(prev => ({
            ...prev,
            topSearched: "API response for top searched was empty or invalid. Using fallback data.",
          }));
          setTopSearched(FALLBACK_TOP_SEARCHED); // Use fallback if API returns no valid products
        }
      })
      .catch(err => {
        console.error("Error fetching top searched:", err);
        setErrors(prev => ({
          ...prev,
          topSearched: `Failed to load top searched products: ${err.message || "Unknown error"}. Using fallback data.`,
        }));
        setTopSearched(FALLBACK_TOP_SEARCHED); // Use fallback on API error
      })
      .finally(() => setIsLoadingTopSearched(false));
  }, [API_BASE_URL]); // Dependency array for useEffect

  const LoadingBoxSkeleton = () => (
    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
  );

  const LoadingListItemSkeleton = () => (
    <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg animate-pulse border border-gray-100">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-200 flex-shrink-0"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );


  return (
    <div className="space-y-8 w-full max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl">
      {/* New Arrivals Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
            New Arrivals
          </h2>
          <Link
            href="/products/new-arrivals" // Link to a dedicated new arrivals page
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            View more ({newArrivalsCount})
          </Link>
        </div>

        <div className="pb-6">
          <p className="font-medium text-gray-900">
            {newArrivalsCount > 0 ? `${newArrivalsCount}+ products added today` : "No new products added today."}
          </p>
        </div>

        {isLoadingNewArrivals ? (
          <div className="flex gap-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {[...Array(3)].map((_, i) => (
              <LoadingBoxSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            {newArrivals.map((item, i) => (
              <Link
                href={`/${item.slug}`} // Link to product detail page
                key={item.id || i}
                className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group flex items-center justify-center">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 640px) 96px, 128px"
                    onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-image.png"; // Fallback image if URL is broken
                        target.className += " object-fill p-0"; // Adjust placeholder styling
                    }}
                  />
                ) : (
                    // Fallback to a generic placeholder when image is null
                    <span className="text-gray-500 text-xs text-center font-bold">
                        No Image
                    </span>
                )}
              </Link>
            ))}
          </div>
        )}

        {errors.newArrivals && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {/* {errors.newArrivals} */}
          </div>
        )}
      </div>

      {/* Top Searched Products Section */}
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
          <h2 className="font-semibold text-lg text-gray-900">
            Top Searched Products
          </h2>
          <Link
            href="/products/top-searched" // Link to a dedicated top searched page
            className="text-green-600 text-sm font-medium hover:text-green-700 transition-colors">
            View more
          </Link>
        </div>

        {isLoadingTopSearched ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <LoadingListItemSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topSearched.map((item, i) => (
              <TopSearchedItem key={item.id || i} item={item} />
            ))}
          </div>
        )}

        {errors.topSearched && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
            {/* {errors.topSearched} */}
          </div>
        )}
      </div>
    </div>
  );
}
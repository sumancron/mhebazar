"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/api"; // Assuming your custom api wrapper is correctly configured

// --- Updated Category interface to precisely match API response for a single category ---
interface Category {
  id: number;
  subcategories: never[]; // We'll ignore this for display, but keep it in interface
  cat_image: string | null; // Can be a string (full URL) or null
  cat_banner: string | null; // Can be a string (full URL) or null
  name: string; // The category name
  description: string;
  meta_title: string | null;
  meta_description: string | null;
  product_details: never; // Can be null or JSONB data
  created_at: string;
  updated_at: string;
}

// Internal interface for the component to use, maps API fields to component props
interface CategoryItemProps {
  imageSrc: string | null; // Now directly takes the cat_image value (which might be full URL or null)
  label: string;
  slug: string; // For redirection, e.g., "forklift" for "FORKLIFT"
}

function CategoryItem({ imageSrc, label, slug }: CategoryItemProps): JSX.Element {
  const initials = label
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [showInitials, setShowInitials] = useState<boolean>(!imageSrc); // Initially show initials if no imageSrc

  // Handle image loading error: if image fails, switch to initials
  const handleImageError = () => {
    setShowInitials(true);
  };

  return (
    <Link href={`/${slug}`} className="flex flex-col items-center group"> {/* Redirect on click */}
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-blue-50 flex items-center justify-center mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-200">
        {imageSrc && !showInitials ? (
          <Image
            src={imageSrc}
            alt={label}
            width={100} // Adjust based on your design for better quality
            height={100} 
            className="w-full h-full object-contain" // Use full width/height for responsive fill
            onError={handleImageError} // If image fails to load, trigger fallback
          />
        ) : (
          <span className="text-blue-blue text-xl font-bold">{initials}</span>
        )}
      </div>
      <p className="text-center text-xs sm:text-sm md:text-base font-medium group-hover:text-blue-700 transition-colors">
        {label}
      </p>
    </Link>
  );
}

export default function CategoriesSection(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false); // To toggle between showing initial 6 and all

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Fetch data from your API endpoint
        const response = await api.get<{ count: number; next: string | null; previous: string | null; results: Category[] }>(`${API_BASE_URL}/categories/`);

        let fetchedCategories: Category[] = [];
        if (response.data && Array.isArray(response.data.results)) {
          // DRF's paginated response structure
          fetchedCategories = response.data.results;
        } else if (Array.isArray(response.data)) {
          // Fallback if it's a direct array (not typically for DRF pagination)
          fetchedCategories = response.data;
        } else {
          console.error('Unexpected API response format:', response.data);
          setError('Unexpected data format from server.');
          setCategories([]);
          return;
        }

        // --- No need to prepend API_BASE_URL if cat_image is already a full URL ---
        // Based on your provided API response, `cat_image` is already a full URL.
        // So, no mapping for `cat_image` is needed here, pass it directly.
        setCategories(fetchedCategories);

      } catch (err) {
        console.error('Error fetching categories:', err);
        if (axios.isAxiosError(err)) {
          setError(`Failed to load categories: ${err.message}. Please check your API base URL and server status.`);
        } else {
          setError('Failed to load categories due to an unknown error.');
        }
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [API_BASE_URL]); // `API_BASE_URL` is a dependency as it's used in fetchCategories

  // Determine which categories to display based on 'showAll' state
  // Filter out any categories that might not have a name (though unlikely from your API)
  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="py-8 w-full mx-auto px-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
        MHE Categories
      </h2>

      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6">
          {displayedCategories.map((cat) => (
            <CategoryItem 
              key={cat.id} 
              imageSrc={cat.cat_image} 
              label={cat.name}
              slug={cat.name.toLowerCase().replace(/\s+/g, '-')} // Create a URL-friendly slug
            />
          ))}
          {categories.length > 6 && ( // Only show "All Categories" button if there are more than 6
            <Link
              href={showAll ? "#" : "/categories"} // If showing all, link to '#' (or adjust if you have a separate "Show Less" route)
              onClick={(e) => {
                if (!showAll) { // Prevent default only if navigating away
                  // If clicking 'All Categories', prevent default navigation to handle local state change
                  e.preventDefault(); 
                }
                setShowAll(!showAll); // Toggle local state
              }}
              className="flex flex-col items-center border border-blue-500 rounded-full aspect-square justify-center hover:bg-blue-50 transition-colors w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-blue-50 mb-2 overflow-hidden group"
            >
              <LayoutGrid className="text-blue-500 mb-2 group-hover:text-blue-700" size={24} />
              <span className="text-xs sm:text-sm md:text-base font-medium text-center group-hover:text-blue-700">
                {showAll ? "Show Less" : "All Categories"}
              </span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
// src/components/CategoriesSection.tsx (assuming this is the file path)
"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
// Import the local JSON data
import categoriesData from "@/data/categories.json";

// --- Updated Category interface to match the local JSON data structure ---
interface Category {
  id: number;
  subcategories: {
    id: number;
    name: string;
  }[];
  image_url: string | null;
  name: string;
}

// Internal interface for the component to use
interface CategoryItemProps {
  imageSrc: string | null;
  label: string;
  slug: string;
}

function CategoryItem({ imageSrc, label, slug }: CategoryItemProps): JSX.Element {
  const initials = label
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const [showInitials, setShowInitials] = useState<boolean>(!imageSrc);

  const handleImageError = () => {
    setShowInitials(true);
  };

  return (
    <Link href={`/${slug}`} className="flex flex-col items-center group">
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-blue-50 flex items-center justify-center mb-2 overflow-hidden transform group-hover:scale-105 transition-transform duration-200">
        {imageSrc && !showInitials ? (
          <Image
            src={imageSrc}
            alt={label}
            width={100}
            height={100}
            className="w-full h-full object-contain"
            onError={handleImageError}
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
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    // Simulate a brief loading state if needed, then set data
    setLoading(true);
    const timer = setTimeout(() => {
      // The imported JSON data is already an array of Category objects
      setCategories(categoriesData);
      setLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  // Determine which categories to display based on 'showAll' state
  const displayedCategories = showAll ? categories : categories.slice(0, 6);

  return (
    <section className="py-8 w-full mx-auto px-4">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
        MHE Categories
      </h2>

      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-500">No categories found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4 sm:gap-6">
          {displayedCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              // The JSON data uses 'image_url' instead of 'cat_image'
              imageSrc={cat.image_url}
              label={cat.name}
              slug={cat.name.toLowerCase().replace(/\s+/g, '-')}
            />
          ))}
          {categories.length > 6 && (
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="flex flex-col items-center justify-center border border-blue-500 rounded-full aspect-square hover:bg-blue-50 transition-colors w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-blue-50 mb-2 overflow-hidden group"
              >
                <LayoutGrid className="text-blue-500 mb-2 group-hover:text-blue-700" size={24} />
                <span className="text-xs sm:text-sm md:text-base font-medium text-center group-hover:text-blue-700">
                  {showAll ? "Show Less" : "All Categories"}
                </span>
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
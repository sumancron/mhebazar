"use client";

import { LayoutGrid } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { JSX, useEffect, useState } from "react";
import axios from "axios";

interface Category {
  image?: string;
  label: string;
}

function CategoryItem({ image, label }: Category): JSX.Element {
  const initials = label
    ?.split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-col items-center w-28 sm:w-32 md:w-36 lg:w-40">
      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full bg-blue-50 flex items-center justify-center mb-2 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={label}
            width={50}
            height={50}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <span className="text-blue-500 text-xl font-bold">{initials}</span>
        )}
      </div>
      <p className="text-center text-xs sm:text-sm md:text-base font-medium">
        {label}
      </p>
    </div>
  );
}

export default function CategoriesSection(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`${API_BASE_URL}/categories/`)

        // Ensure the response data is an array
        if (Array.isArray(response.data)) {
          setCategories(response.data)
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated responses
          setCategories(response.data.results)
        } else {
          console.error('Unexpected API response format:', response.data)
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
        setCategories([])
        setError('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const displayed = showAll ? categories : categories.slice(0, 6);

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
          {displayed.map((cat, idx) => (
            <CategoryItem key={idx} image={cat.image} label={cat.label} />
          ))}
          <Link
            href="/categories"
            onClick={() => setShowAll(!showAll)}
            className="flex flex-col items-center border border-blue-500 rounded-full aspect-square justify-center hover:bg-blue-50 transition-colors w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-blue-50 mb-2 overflow-hidden"
          >
            <LayoutGrid className="text-blue-500 mb-2" size={24} />
            <span className="text-xs sm:text-sm md:text-base font-medium text-center">
              {showAll ? "Show Less" : "All Categories"}
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}

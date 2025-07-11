"use client";

import { LayoutGrid, Link } from "lucide-react";
import Image from "next/image";
import { JSX,useEffect, useState } from "react";

interface Category {
  image?: string;
  label: string;
}

// Dummy fallback data (only shown if API returns nothing)
const fallbackCategories: Category[] = [
  { label: "Battery" },
  { label: "Pallet" },
  { label: "Pallet Truck" },
  { label: "Manual Trolly" },
  { label: "Pallet Truck (BOPT)" },
  { label: "Stacker" },
  { label: "Forklift" },
  { label: "Racking System" },
  { label: "Container Handler" },
  { label: "Order Picker" },
];

function CategoryItem({ image, label }: Category): JSX.Element {
  const initials = label
    .split(" ")
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
  const [categories, setCategories] = useState<Category[]>(fallbackCategories); // default is dummy
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data); // replace dummy if real data arrives
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const displayed = showAll ? categories : categories.slice(0, 7);

  return (
    <section className="py-8 w-full mx-auto px-4 max-w-7xl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
        MHE Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
        {displayed.map((cat, idx) => (
          <CategoryItem key={idx} image={cat.image} label={cat.label} />
        ))}
        {/* put original link this is placeholder */}
        <Link href="/categories"
          onClick={() => setShowAll(!showAll)}
          className="flex flex-col items-center border border-blue-500 rounded-full aspect-square justify-center hover:bg-blue-50 transition-colors w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-blue-50 mb-2 overflow-hidden"
        >
          <LayoutGrid className="text-blue-500 mb-2" size={24} />
          <span className="text-xs sm:text-sm md:text-base font-medium text-center">
            {showAll ? "Show Less" : "All Categories"}
          </span>
        </Link>
      </div>
    </section>

  );
}

// NavOptions.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

// Define interfaces for the API response structures
interface Product {
  id: number;
  category_name: string;
  subcategory_name: string;
  images: string[];
  name: string;
  subcategory: number; // Subcategory ID
  category: number; // Category ID
}

interface SubCategory {
  id: number;
  category_name: string;
  sub_image: string | null;
  name: string;
  category: number;
}

interface Category {
  id: number;
  subcategories: SubCategory[];
  name: string;
}

// Updated interfaces to reflect the actual API response (direct array for categories)
// ProductsResponse still has 'results' as per your provided product API
interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

// Define your API_BASE_URL here
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to create slugs
const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function CategoryMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          api.get<Category[]>("/categories/"), // Expecting direct array for categories
          api.get<ProductsResponse>("/products/"),
        ]);
        // Directly set categories as the response is an array
        setCategories(categoriesResponse.data); //
        setProducts(productsResponse.data.results); //

        if (categoriesResponse.data.length > 0) { //
          const defaultCategory =
            categoriesResponse.data.find((cat) => cat.name === "Battery") || //
            categoriesResponse.data[0]; //
          setHoveredCategory(defaultCategory);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (isOpen) {
      fetchData();
    } else {
      setSelectedCategory(null);
      setHoveredCategory(null);
    }
  }, [isOpen]);

  // Memoize product counts for performance
  const { subcategoryProductCounts, categoryTotalProductCounts } = useMemo(() => {
    const subCounts = new Map<number, number>();
    const catCounts = new Map<number, number>();

    for (const product of products) {
      if (product.category) {
        catCounts.set(product.category, (catCounts.get(product.category) || 0) + 1);
      }
      if (product.subcategory) {
        subCounts.set(product.subcategory, (subCounts.get(product.subcategory) || 0) + 1);
      }
    }
    return {
      subcategoryProductCounts: subCounts,
      categoryTotalProductCounts: catCounts,
    };
  }, [products]);

  // Use efficient map lookups for product counts
  const getProductCountForSubcategory = (subcategoryId: number) => {
    return subcategoryProductCounts.get(subcategoryId) || 0;
  };

  const getProductCountForCategory = (categoryId: number) => {
    return categoryTotalProductCounts.get(categoryId) || 0;
  };

  const displaySourceCategory = selectedCategory || hoveredCategory;

  const categoriesCol1 = useMemo(
    () => categories.slice(0, Math.ceil(categories.length / 2)),
    [categories]
  );
  const categoriesCol2 = useMemo(
    () => categories.slice(Math.ceil(categories.length / 2)),
    [categories]
  );

  const getSubCategoryImage = (subCategory: SubCategory) => {
    if (subCategory.sub_image) {
      return subCategory.sub_image.startsWith("http")
        ? subCategory.sub_image
        : `${API_BASE_URL}${subCategory.sub_image}`;
    }
    const productWithImage = products.find(
      (product) =>
        product.subcategory === subCategory.id &&
        product.images &&
        product.images.length > 0
    );
    if (productWithImage && productWithImage.images[0]) {
      return productWithImage.images[0].startsWith("http")
        ? productWithImage.images[0]
        : `${API_BASE_URL}${productWithImage.images[0]}`;
    }
    return null;
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2);
  };

  const handleCategoryNameClick = (category: Category) => {
    if (category.subcategories.length > 0) {
      setSelectedCategory(category.id === selectedCategory?.id ? null : category);
      setHoveredCategory(category);
    } else {
      router.push(`/${createSlug(category.name)}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute left-0 top-full z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="flex min-w-[800px]">
            {/* Left Categories Column 1 */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
              <div className="p-2 h-[400px] overflow-y-auto custom-scrollbar">
                {categoriesCol1.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded transition-colors ${selectedCategory?.id === category.id
                        ? "bg-white text-orange-600 font-medium"
                        : hoveredCategory?.id === category.id
                          ? "bg-gray-100 text-orange-600"
                          : "text-gray-700 hover:bg-white hover:text-orange-600"
                      }`}
                    onMouseEnter={() => {
                      if (!selectedCategory) {
                        setHoveredCategory(category);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!selectedCategory) {
                        setHoveredCategory(null);
                      }
                    }}
                  >
                    <span
                      onClick={() => handleCategoryNameClick(category)}
                      className="flex-1 cursor-pointer"
                    >
                      {category.name}
                    </span>
                    <Link
                      href={`/${createSlug(category.name)}`}
                      passHref
                      onClick={onClose}
                      className="p-1 -mr-1 rounded hover:bg-gray-200"
                      aria-label={`Go to ${category.name} category page`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle Categories Column 2 */}
            <div className="w-64 bg-gray-50 border-r border-gray-200 flex-shrink-0">
              <div className="p-2 h-[400px] overflow-y-auto custom-scrollbar">
                {categoriesCol2.map((category) => (
                  <div
                    key={category.id}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded transition-colors ${selectedCategory?.id === category.id
                        ? "bg-white text-orange-600 font-medium"
                        : hoveredCategory?.id === category.id
                          ? "bg-gray-100 text-orange-600"
                          : "text-gray-700 hover:bg-white hover:text-orange-600"
                      }`}
                    onMouseEnter={() => {
                      if (!selectedCategory) {
                        setHoveredCategory(category);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!selectedCategory) {
                        setHoveredCategory(null);
                      }
                    }}
                  >
                    <span
                      onClick={() => handleCategoryNameClick(category)}
                      className="flex-1 cursor-pointer"
                    >
                      {category.name}
                    </span>
                    <Link
                      href={`/${createSlug(category.name)}`}
                      passHref
                      onClick={onClose}
                      className="p-1 -mr-1 rounded hover:bg-gray-200"
                      aria-label={`Go to ${category.name} category page`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content Column */}
            <div className="w-80 bg-white p-4 flex-shrink-0">
              <div className="h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
                {!displaySourceCategory && (
                  <p className="text-gray-500 text-sm p-3 text-center">
                    Hover over a category to see more.
                  </p>
                )}

                {displaySourceCategory && displaySourceCategory.subcategories.length > 0
                  ? displaySourceCategory.subcategories.map((subCategory) => (
                    <Link
                      key={subCategory.id}
                      href={`/${createSlug(displaySourceCategory.name)}/${createSlug(subCategory.name)}`}
                      passHref
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors border border-gray-100"
                      onClick={onClose}
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {getSubCategoryImage(subCategory) ? (
                          <Image
                            src={getSubCategoryImage(subCategory) as string}
                            alt={subCategory.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                            unoptimized
                            // onLoadingComplete deprecated, use onLoad
                            onLoad={() => { }}
                          />
                        ) : (
                          <span className="text-gray-500 text-xs font-semibold">
                            {getInitials(subCategory.name)}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm mb-1">
                          {subCategory.name}
                        </h4>
                        <div className="inline-flex items-center justify-center bg-orange-100 text-orange-700 rounded-full px-2 py-1 text-xs font-medium min-w-[24px]">
                          {getProductCountForSubcategory(subCategory.id).toString().padStart(2, "0")}
                        </div>
                      </div>
                    </Link>
                  ))
                  : displaySourceCategory && (
                    <motion.div
                      key="no-subcategories-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center p-6 border border-orange-200 bg-orange-50 rounded-lg shadow-md h-full text-center"
                    >
                      <div className="mb-4 text-orange-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-12 h-12 mx-auto"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.75 3.104v5.303m0 0a3.001 3.001 0 1 0 6.002 0V3.104m-6.002 0h-3M9.75 3.104h3c0 1.258-.29 2.474-.836 3.565M9.75 3.104V2.001l-1.426-.399m-5.462 8.528l1.426.399M9.75 3.104h-3c-1.34 0-2.61.425-3.663 1.226C2.213 5.4 1.75 6.703 1.75 8.163V21c0 .828.672 1.5 1.5 1.5h17.5c.828 0 1.5-.672 1.5-1.5V8.163c0-1.46-.463-2.763-1.353-3.791a5.956 5.956 0 0 0-3.663-1.226M15.75 12h.008v.008h-.008V12zm2.25 0h.008v.008h-.008V12zm-4.5 0h.008v.008h-.008V12zm2.25 0h.008v.008h-.008V12z"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-800 text-lg font-semibold mb-2">
                        Browse {displaySourceCategory.name} Products
                      </p>
                      <p className="text-gray-700 text-sm mb-4">
                        Explore all available items under this category.
                      </p>
                      <Link
                        href={`/${createSlug(displaySourceCategory.name)}`}
                        passHref
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
                        onClick={onClose}
                      >
                        View All ({getProductCountForCategory(displaySourceCategory.id)})
                      </Link>
                    </motion.div>
                  )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
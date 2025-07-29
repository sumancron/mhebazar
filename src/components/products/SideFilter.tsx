// src/components/products/SideFilter.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
//import Image from "next/image";

import api from "@/lib/api"; // Import the API client

// Define interfaces for API response
interface ApiSubcategory {
  id: number;
  name: string;
  category: number;
}

interface ApiCategory {
  id: number;
  name: string;
  subcategories: ApiSubcategory[];
}

// Product types as provided by your backend
const PRODUCT_TYPE_CHOICES = ["new", "used", "rental", "attachments"];

interface SideFilterProps {
  selectedFilters: Set<string>;
  onFilterChange: (
    filterValue: string | number,
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating" | "sort_by",
    newValue?: number | string | { min: number | ''; max: number | '' } | null
  ) => void;
  selectedCategoryName: string | null;
  selectedSubcategoryName: string | null;
  selectedTypeName: string | null;
  minPrice: number | '';
  maxPrice: number | '';
  selectedManufacturer: string | null;
  selectedRating: number | null;
}

const SideFilter = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  selectedFilters,
  onFilterChange,
  selectedCategoryName,
  selectedSubcategoryName,
  selectedTypeName,
  minPrice,
  maxPrice,
  selectedManufacturer,
  selectedRating,
}: SideFilterProps) => {
  const [search, setSearch] = useState<string>("");
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [manufacturers, setManufacturers] = useState<string[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [priceRangeExpanded, setPriceRangeExpanded] = useState<boolean>(true);
  const [manufacturerExpanded, setManufacturerExpanded] = useState<boolean>(true);
  const [ratingExpanded, setRatingExpanded] = useState<boolean>(true);
  const [productTypeExpanded, setProductTypeExpanded] = useState<boolean>(true);

  // Fetch categories and their subcategories from the API
  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    setErrorCategories(null);
    try {
      // Adjusted to expect an array directly, not an object with 'results'
      const response = await api.get<ApiCategory[]>("/categories/"); //
      setCategories(response.data); //
      console.log("[SideFilter] Categories fetched successfully.");
    } catch (err: unknown) {
      console.error("[SideFilter] Failed to fetch categories:", err);
      if (err instanceof Error) {
        setErrorCategories(`Failed to load categories: ${err.message}.`);
      } else {
        setErrorCategories("Failed to load categories. Please try again later.");
      }
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  // Fetch unique manufacturers
  const fetchManufacturers = useCallback(async () => {
    try {
      // This API endpoint still returns a 'results' array based on the provided example.
      const response = await api.get<{ results: { manufacturer: string }[] }>("/products/unique-manufacturers/"); //
      const uniqueManufacturers = Array.from(new Set(response.data.results.map(item => item.manufacturer))); //
      setManufacturers(uniqueManufacturers.filter(Boolean) as string[]);
    } catch (err) {
      console.error("[SideFilter] Failed to fetch manufacturers:", err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchManufacturers();
  }, [fetchCategories, fetchManufacturers]);

  // Expand the category if a subcategory within it is currently selected, or if the category itself is selected
  useEffect(() => {
    if (categories.length > 0) {
      const currentCategory = categories.find(cat =>
        (selectedCategoryName && cat.name.toLowerCase() === selectedCategoryName.toLowerCase()) ||
        (selectedSubcategoryName && cat.subcategories.some(sub => sub.name.toLowerCase() === selectedSubcategoryName.toLowerCase()))
      );
      if (currentCategory && expandedCategory !== currentCategory.id) {
        setExpandedCategory(currentCategory.id);
      } else if (!selectedCategoryName && !selectedSubcategoryName) {
        setExpandedCategory(null);
      }
    }
  }, [selectedCategoryName, selectedSubcategoryName, categories, expandedCategory]);

  // Filter categories by search input
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  // Filter product types by search input
  const filteredProductTypes = PRODUCT_TYPE_CHOICES.filter(type =>
    type.toLowerCase().includes(search.toLowerCase())
  );

  const handlePriceChange = useCallback((type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? '' : Number(value);
    const newMinPrice = type === 'min' ? numValue : minPrice;
    const newMaxPrice = type === 'max' ? numValue : maxPrice;
    onFilterChange('price_range', 'price_range', { min: newMinPrice, max: newMaxPrice });
  }, [minPrice, maxPrice, onFilterChange]);

  const handleManufacturerChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? null : e.target.value;
    onFilterChange(value || '', 'manufacturer', value);
  }, [onFilterChange]);

  const handleRatingChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '0' ? null : Number(e.target.value);
    onFilterChange(value || 0, 'rating', value);
  }, [onFilterChange]);

  // Helper to determine if a filter is active for highlighting
  const isFilterActive = (value: string): boolean => {
    if (selectedCategoryName && value.toLowerCase() === selectedCategoryName.toLowerCase()) return true;
    if (selectedSubcategoryName && value.toLowerCase() === selectedSubcategoryName.toLowerCase()) return true;
    if (selectedTypeName && value.toLowerCase() === selectedTypeName.toLowerCase()) return true;
    return false;
  };

  if (isLoadingCategories) {
    return (
      <aside className="sticky top-0 w-full max-w-xs min-h-screen bg-white flex flex-col overflow-y-auto z-20 p-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="w-full h-8 bg-gray-200 rounded-md"></div>
        </div>
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="space-y-2">
          {[...Array(5)].map((_, i: number) => (
            <div key={i} className="h-10 bg-gray-100 rounded-md"></div>
          ))}
        </div>
        <div className="mt-auto p-3 sm:p-4">
          <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </aside>
    );
  }

  if (errorCategories) {
    return (
      <aside className="sticky top-0 w-full max-w-xs min-h-screen bg-white flex flex-col overflow-y-auto z-20 p-4 text-red-600">
        <p className="text-sm mb-4">{errorCategories}</p>
        <button onClick={fetchCategories} className="mt-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Retry</button>
      </aside>
    );
  }

  return (
    <aside className="sticky top-0 w-full max-w-xs min-h-screen bg-white flex flex-col overflow-y-auto z-20 border-r border-gray-100 shadow-sm">
      <div className="p-3 sm:p-4 pb-2">
        <h1 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Filter
        </h1>
        <div className="flex items-center gap-2 mb-4 relative">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by name..."
            className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            aria-label="Filter categories and types by name"
          />
          {search && (
            <button
              className="absolute right-2 text-gray-400 hover:text-red-500 text-xs"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              tabIndex={0}
            >
              ×
            </button>
          )}
        </div>

        {/* Categories Section */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">Categories</h2>
        <div className="space-y-1 mb-4">
          {filteredCategories.length === 0 && !search && (
            <div className="text-gray-400 text-xs px-2 py-2">No categories available.</div>
          )}
          {filteredCategories.length === 0 && search && (
            <div className="text-gray-400 text-xs px-2 py-2">No matching categories found.</div>
          )}
          {filteredCategories.map((category: ApiCategory) => (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => {
                  // Only toggle expansion if there are subcategories
                  if (category.subcategories.length > 0) {
                    setExpandedCategory(
                      expandedCategory === category.id ? null : category.id
                    );
                  }
                  // Always apply category filter when category button is clicked,
                  // regardless of whether it has subcategories or not.
                  onFilterChange(category.name, "category");
                }}
                className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 ${
                  isFilterActive(category.name)
                    ? "bg-green-50 text-green-700 font-medium"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                aria-expanded={expandedCategory === category.id}
                aria-controls={`cat-panel-${category.id}`}
              >
                <span className="text-sm">{category.name}</span>
                {category.subcategories.length > 0 ? (
                  expandedCategory === category.id ? (
                    <ChevronDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )
                ) : null}
              </button>
              <AnimatePresence>
                {expandedCategory === category.id &&
                  category.subcategories.length > 0 && (
                    <motion.div
                      id={`cat-panel-${category.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((subcategory: ApiSubcategory) => (
                          <motion.button
                            key={subcategory.id}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: subcategory.id * 0.02 }}
                            className={`w-full text-left p-2 text-xs rounded-md transition-colors duration-200 ${
                              isFilterActive(subcategory.name)
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-600 hover:bg-green-50"
                            }`}
                            onClick={() => onFilterChange(subcategory.name, "subcategory")}
                          >
                            {subcategory.name}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}
        </div>


        {/* Product Types Section */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">Product Types</h2>
        <div className="space-y-1 mb-4">
          <button
            onClick={() => setProductTypeExpanded(!productTypeExpanded)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 hover:bg-gray-50 text-gray-700"
            aria-expanded={productTypeExpanded}
            aria-controls="product-type-panel"
          >
            <span className="text-sm">Product Types</span>
            {productTypeExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {productTypeExpanded && (
              <motion.div
                id="product-type-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-2"
              >
                {filteredProductTypes.length === 0 && !search && (
                  <div className="text-gray-400 text-xs px-2 py-2">No product types available.</div>
                )}
                {filteredProductTypes.length === 0 && search && (
                  <div className="text-gray-400 text-xs px-2 py-2">No matching product types found.</div>
                )}
                {filteredProductTypes.map((type: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => onFilterChange(type, "type")}
                    className={`w-full text-left px-2 py-2 rounded-md transition-colors duration-200 ${
                      isFilterActive(type)
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <span className="text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>


        {/* Price Range Filter */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">Price Range</h2>
        <div className="space-y-1 mb-4">
          <button
            onClick={() => setPriceRangeExpanded(!priceRangeExpanded)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 hover:bg-gray-50 text-gray-700"
            aria-expanded={priceRangeExpanded}
            aria-controls="price-range-panel"
          >
            <span className="text-sm">Filter by Price</span>
            {priceRangeExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {priceRangeExpanded && (
              <motion.div
                id="price-range-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-2 flex gap-2 items-center"
              >
                <input
                  type="number"
                  placeholder="Min Price"
                  className="w-1/2 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={minPrice === '' ? '' : minPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('min', e.target.value)}
                  aria-label="Minimum price"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-1/2 border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
                  value={maxPrice === '' ? '' : maxPrice}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePriceChange('max', e.target.value)}
                  aria-label="Maximum price"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Manufacturer Filter */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">Manufacturer</h2>
        <div className="space-y-1 mb-4">
          <button
            onClick={() => setManufacturerExpanded(!manufacturerExpanded)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 hover:bg-gray-50 text-gray-700"
            aria-expanded={manufacturerExpanded}
            aria-controls="manufacturer-panel"
          >
            <span className="text-sm">Filter by Manufacturer</span>
            {manufacturerExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {manufacturerExpanded && (
              <motion.div
                id="manufacturer-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-2"
              >
                <select
                  className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  value={selectedManufacturer || 'all'}
                  onChange={handleManufacturerChange}
                  aria-label="Select manufacturer"
                >
                  <option value="all">All Manufacturers</option>
                  {manufacturers.map((manufacturer, index) => (
                    <option key={index} value={manufacturer}>
                      {manufacturer}
                    </option>
                  ))}
                </select>
                {manufacturers.length === 0 && (
                  <div className="text-gray-400 text-xs px-2 py-2">No manufacturers available.</div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rating Filter */}
        <h2 className="text-base font-semibold mb-2 text-gray-800">Rating</h2>
        <div className="space-y-1 mb-4">
          <button
            onClick={() => setRatingExpanded(!ratingExpanded)}
            className="w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 hover:bg-gray-50 text-gray-700"
            aria-expanded={ratingExpanded}
            aria-controls="rating-panel"
          >
            <span className="text-sm">Filter by Rating</span>
            {ratingExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
          <AnimatePresence>
            {ratingExpanded && (
              <motion.div
                id="rating-panel"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-2"
              >
                <select
                  className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 bg-white"
                  value={selectedRating || '0'}
                  onChange={handleRatingChange}
                  aria-label="Select minimum rating"
                >
                  <option value="0">All Ratings</option>
                  <option value="4">4 Stars & Up</option>
                  <option value="3">3 Stars & Up</option>
                  <option value="2">2 Stars & Up</option>
                  <option value="1">1 Star & Up</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      {/* Banner Image */}
      <div className="p-3 sm:p-4 mt-auto">
        <img
          src="/sidebar.png"
          alt="Forklift Service"
          width={400}
          height={300}
          className="rounded-lg object-cover w-full h-auto"
          priority
        />
      </div>
    </aside>
  );
};

export default SideFilter;
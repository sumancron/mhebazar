// src/components/products/ProductListing.tsx
"use client";

import React, { useState } from "react";
import { Grid, List, MenuIcon, X, Heart, Share, ArrowRight, IndianRupee, ShoppingCart } from "lucide-react";
// import { ProductCardContainer } from "@/components/elements/Product";
import SideFilter from "@/components/products/SideFilter";
import Image from "next/image";

// Types
export interface Product {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  direct_sale: boolean;
  category_name: string;
  subcategory_name: string;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  manufacturer: string;
  average_rating: number | null;
}

interface ProductGridProps {
  products: Product[];
  viewMode?: "grid" | "list";
  noProductsMessage: string | null;
}

function ProductGrid({
  products,
  viewMode = "grid",
  noProductsMessage,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        {noProductsMessage || "No products found matching your criteria."}
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-3 sm:space-y-4">
        {products.map((product: Product) => (
          <div
            key={product.id}
            className={`flex flex-col sm:flex-row bg-white rounded-2xl shadow-sm border border-[#ecf0f7] overflow-hidden ${(!product.is_active || (product.direct_sale && product.stock_quantity === 0)) ? 'opacity-50 pointer-events-none' : ''
              }`}
          >
            <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 relative">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-full rounded-t-2xl sm:rounded-l-2xl sm:rounded-t-none"
                quality={85}
              />
              {/* Action buttons for list view */}
              <div className="absolute top-4 left-4 flex flex-col gap-2.5">
                <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 cursor-pointer">
                  <Heart className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 cursor-pointer">
                  <Share className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="flex-1 p-4">
              <h3 className="font-bold text-base text-[#434344] leading-6 font-['Inter-Bold',Helvetica] mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-2">
                {product.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {!product.hide_price && (
                  <div className="flex items-center gap-2">
                    <IndianRupee className="w-6 h-6 text-[#5ca131]" />
                    <span className="font-semibold text-2xl text-[#5ca131] leading-7 font-['Inter-SemiBold',Helvetica]">
                      {product.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {product.direct_sale ? (
                  <div className="flex items-start gap-2.5">
                    <button
                      className="h-auto rounded-lg bg-[#5ca131] hover:bg-[#4a8a29] p-[13px] text-white transition-colors duration-200"
                      disabled={!product.is_active || product.stock_quantity === 0}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    <button
                      className="h-auto flex-1 rounded-lg border border-[#5ca131] text-[#5ca131] hover:text-[#5ca131] hover:bg-transparent py-[11px] px-4 font-medium text-[16px] leading-[24px] transition-colors duration-200"
                      disabled={!product.is_active || product.stock_quantity === 0}
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <button className="h-auto rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-6 py-[11px] font-medium text-[16px] leading-[24px] transition-colors duration-200">
                    Get a Quote
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center">
      {products.map((product: Product) => (
        <div
          key={product.id}
          className={`w-[260px] h-[430px] rounded-2xl border border-[#ecf0f7] p-0 overflow-hidden bg-white shadow-sm ${(!product.is_active || (product.direct_sale && product.stock_quantity === 0)) ? 'opacity-50 pointer-events-none' : ''
            }`}
        >
          <div className="relative">
            <Image
              src={product.image}
              alt={product.title}
              width={260}
              height={220}
              className="w-full h-[220px] object-cover"
              quality={85}
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2.5">
              <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 shadow-none cursor-pointer">
                <Heart className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 shadow-none cursor-pointer">
                <Share className="h-5 w-5 text-gray-600" />
              </div>
              <div className="bg-[#f3faff] hover:bg-[#f3faff] p-2.5 rounded-full border-0 shadow-none cursor-pointer">
                <ArrowRight className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-4 h-[210px]">
            <div className="flex flex-col gap-4 flex-1">
              <h3 className="font-bold text-base text-[#434344] leading-6 font-['Inter-Bold',Helvetica] line-clamp-2">
                {product.title}
              </h3>
              {!product.hide_price && (
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-[#5ca131]" />
                  <span className="font-semibold text-2xl text-[#5ca131] leading-7 font-['Inter-SemiBold',Helvetica]">
                    {product.price.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>
            {product.direct_sale ? (
              <div className="flex items-start gap-2.5 w-full">
                <button
                  className="h-auto rounded-lg bg-[#5ca131] hover:bg-[#4a8a29] shadow-xs p-[13px] text-white transition-colors duration-200"
                  disabled={!product.is_active || product.stock_quantity === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
                <button
                  className="h-auto flex-1 rounded-lg border border-[#5ca131] text-[#5ca131] hover:text-[#5ca131] hover:bg-transparent py-[11px] shadow-xs font-medium text-[16px] leading-[24px] transition-colors duration-200"
                  disabled={!product.is_active || product.stock_quantity === 0}
                >
                  Buy Now
                </button>
              </div>
            ) : (
                <button className="h-auto rounded-lg bg-[#5ca131] hover:bg-[#4a8a29] shadow-xs p-[13px] text-white transition-colors duration-200">
                Get a Quote
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProductListingProps {
  products: Product[];
  title?: string;
  totalCount: number;
  onFilterChange: (
    filterValue: string | number,
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating",
    newValue?: number | string | { min: number | '', max: number | '' } | null
  ) => void;
  selectedFilters: Set<string>;
  selectedCategoryName: string | null;
  selectedSubcategoryName: string | null;
  selectedTypeName: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  noProductsMessage?: string | null;
  minPrice: number | '';
  maxPrice: number | '';
  selectedManufacturer: string | null;
  selectedRating: number | null;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export default function ProductListing({
  products,
  title = "Products",
  totalCount = 0,
  onFilterChange,
  selectedFilters,
  selectedCategoryName,
  selectedSubcategoryName,
  selectedTypeName,
  currentPage,
  totalPages,
  onPageChange,
  noProductsMessage = null,
  minPrice,
  maxPrice,
  selectedManufacturer,
  selectedRating,
  sortBy,
  onSortChange,
}: ProductListingProps) {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const handleViewChange = (view: "grid" | "list") => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block flex-shrink-0 w-72">
          <SideFilter
            selectedFilters={selectedFilters}
            onFilterChange={onFilterChange}
            selectedCategoryName={selectedCategoryName}
            selectedSubcategoryName={selectedSubcategoryName}
            selectedTypeName={selectedTypeName}
            minPrice={minPrice}
            maxPrice={maxPrice}
            selectedManufacturer={selectedManufacturer}
            selectedRating={selectedRating}
          />
        </div>

        {/* Sidebar Mobile Drawer */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${mobileFilterOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
            }`}
          onClick={() => setMobileFilterOpen(false)}
        >
          <aside
            className={`absolute left-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-xl transition-transform duration-300 ${mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            onClick={(e: React.MouseEvent<HTMLElement>) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-lg">Filter</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <SideFilter
              selectedFilters={selectedFilters}
              onFilterChange={onFilterChange}
              selectedCategoryName={selectedCategoryName}
              selectedSubcategoryName={selectedSubcategoryName}
              selectedTypeName={selectedTypeName}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedManufacturer={selectedManufacturer}
              selectedRating={selectedRating}
            />
          </aside>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Controls */}
          <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 sm:py-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block mb-2">
                  {title}
                </div>
                <p className="text-xs text-gray-500 px-3">
                  Showing {products.length} of {totalCount} results
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                {/* Sort By */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <label htmlFor="sort-by" className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    className="p-1.5 sm:p-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white min-w-0"
                    value={sortBy}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value)}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                    <button
                      onClick={() => handleViewChange("grid")}
                      className={`p-1.5 sm:p-2 transition ${currentView === "grid"
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                        }`}
                      aria-label="Grid View"
                    >
                      <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleViewChange("list")}
                      className={`p-1.5 sm:p-2 transition ${currentView === "list"
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                        }`}
                      aria-label="List View"
                    >
                      <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                  {/* Mobile Filter Button */}
                  <button
                    className="lg:hidden flex items-center gap-1.5 sm:gap-2 bg-green-500 hover:bg-green-600 text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md shadow transition text-xs sm:text-sm font-medium"
                    onClick={() => setMobileFilterOpen(true)}
                    aria-label="Open filters"
                  >
                    <MenuIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-3 sm:p-4 md:p-6">
            <ProductGrid products={products} viewMode={currentView} noProductsMessage={noProductsMessage} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-1 sm:gap-2">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i: number) => i + 1).map((page: number) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${currentPage === page
                        ? "text-white bg-green-500 border border-green-500 hover:bg-green-600"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
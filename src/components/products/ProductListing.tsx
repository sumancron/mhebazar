// src/components/products/ProductListing.tsx
"use client";

import React, { useState } from "react";
import { Grid, List, MenuIcon, X } from "lucide-react";
import { ProductCardContainer } from "@/components/elements/Product";
import SideFilter from "@/components/products/SideFilter";
import Image from "next/image";
import { Toaster } from "sonner"; // Import Toaster for sonner

// Types
export interface Product {
  type: string;
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
            className={`flex flex-col sm:flex-row bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${
              (!product.is_active || (product.direct_sale && product.stock_quantity === 0)) ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <div className="w-full sm:w-48 h-48 sm:h-32 flex-shrink-0 relative">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-full rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                quality={85}
              />
            </div>
            <div className="flex-1 p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                {product.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                {!product.hide_price && (
                  <span className="text-lg sm:text-2xl font-bold text-green-600">
                    {product.currency} {product.price.toLocaleString("en-IN")}
                  </span>
                )}
                {product.direct_sale ? (
                  <div className="flex gap-2">
                    <button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
                      disabled={!product.is_active || product.stock_quantity === 0}
                    >
                      Add to Cart {/* This button isn't connected to the actual logic directly here, ProductCardContainer handles it */}
                    </button>
                    <button className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-500 text-black px-4 sm:px-6 py-2 rounded-md transition-colors duration-200 text-sm font-medium"
                      disabled={!product.is_active || product.stock_quantity === 0}
                    >
                      Buy Now
                    </button>
                  </div>
                ) : (
                  <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors duration-200 text-sm font-medium">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 justify-items-center m-5">
      {products.map((product: Product) => (
        <ProductCardContainer
          key={product.id}
          id={parseInt(product.id, 10)}
          image={product.image}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          currency={product.currency}
          directSale={product.direct_sale}
          is_active={product.is_active}
          hide_price={product.hide_price}
          type={product.type} stock_quantity={product.stock_quantity} />
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
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating" | "sort_by",
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
      <Toaster position="top-right" richColors /> {/* Add Sonner Toaster here */}
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
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
            mobileFilterOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileFilterOpen(false)}
        >
          <aside
            className={`absolute left-0 top-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-xl transition-transform duration-300 ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
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
                      className={`p-1.5 sm:p-2 transition ${
                        currentView === "grid"
                          ? "bg-green-500 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                      aria-label="Grid View"
                    >
                      <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleViewChange("list")}
                      className={`p-1.5 sm:p-2 transition ${
                        currentView === "list"
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
                    className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      currentPage === page
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
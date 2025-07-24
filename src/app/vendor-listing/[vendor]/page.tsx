/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/app/vendor-listing/[vendor]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorBanner from "@/components/vendor-listing/VendorBanner";
import api from "@/lib/api";
import React from "react";

interface ApiProduct {
  id: number;
  category_name: string;
  subcategory_name: string;
  images: { id: number; image: string }[];
  name: string;
  description: string;
  price: string;
  direct_sale: boolean;
  type: string;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  manufacturer: string;
  average_rating: number | null;
  user: number; // Add user ID to product interface
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface ApiUser {
  id: number;
  username: string;
  full_name: string;
}

interface ApiVendor {
  user: number;
  company_name: string;
  company_phone: string;
  company_email: string;
  brand: string;
}

const formatNameFromSlug = (slug: string): string => {
  return slug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default function VendorPage({ params }: { params: Promise<{ vendor: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Unwrap params using React.use()
  const { vendor: vendorSlug } = React.use(params);
  const formattedVendorName: string = formatNameFromSlug(vendorSlug);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noProductsFoundMessage, setNoProductsFoundMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set<string>());

  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance');

  const [vendorData, setVendorData] = useState<ApiVendor | null>(null);
  const [vendorUserId, setVendorUserId] = useState<number | null>(null);
  const [isVendorValid, setIsVendorValid] = useState<boolean>(true);

  // Fetch vendor user ID based on brand name
  const fetchVendorUserId = useCallback(async (brandName: string) => {
    try {
      // Assuming 'brand' is available as a filter on users or vendors endpoint
      const response = await api.get<ApiResponse<ApiVendor>>(`/vendor/?brand=${brandName}`);
      if (response.data.results.length > 0) {
        const vendor = response.data.results[0];
        setVendorData(vendor);
        setVendorUserId(vendor.user); // The user ID associated with this vendor
        return vendor.user;
      }
      return null;
    } catch (err) {
      console.error("[Vendor Page] Failed to fetch vendor user ID:", err);
      return null;
    }
  }, []);

  // Fetch products for the specific vendor
  const fetchProductsData = useCallback(async (
    userId: number,
    page: number,
    minPriceFilter: number | '',
    maxPriceFilter: number | '',
    manufacturerFilter: string | null,
    ratingFilter: number | null,
    sortByFilter: string
  ) => {
    setIsLoading(true);
    setNoProductsFoundMessage(null);
    setProducts([]);
    setTotalProducts(0);
    setTotalPages(1);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("user", userId.toString()); // Filter by user ID
      queryParams.append("page", page.toString());

      if (minPriceFilter !== '') {
        queryParams.append("min_price", minPriceFilter.toString());
      }
      if (maxPriceFilter !== '') {
        queryParams.append("max_price", maxPriceFilter.toString());
      }
      if (manufacturerFilter) {
        queryParams.append("manufacturer", manufacturerFilter);
      }
      if (ratingFilter !== null) {
        queryParams.append("min_average_rating", ratingFilter.toString());
      }
      if (sortByFilter && sortByFilter !== 'relevance') {
        let sortParam = '';
        if (sortByFilter === 'price_asc') {
          sortParam = 'price';
        } else if (sortByFilter === 'price_desc') {
          sortParam = '-price';
        } else if (sortByFilter === 'newest') {
          sortParam = '-created_at';
        }
        if (sortParam) {
          queryParams.append("ordering", sortParam);
        }
      }

      const response = await api.get<ApiResponse<ApiProduct>>(
        `/products/?${queryParams.toString()}`
      );

      if (response.data.results.length === 0) {
        setNoProductsFoundMessage(`No products found for ${formattedVendorName} with the selected filters.`);
      }

      const transformedProducts: Product[] = response.data.results.map((p: ApiProduct) => ({
        id: p.id.toString(),
        image: p.images.length > 0 ? p.images[0].image : "/placeholder-product.jpg",
        title: p.name,
        subtitle: p.description,
        price: parseFloat(p.price),
        currency: "₹",
        category_name: p.category_name,
        subcategory_name: p.subcategory_name,
        direct_sale: p.direct_sale,
        is_active: p.is_active,
        hide_price: p.hide_price,
        stock_quantity: p.stock_quantity,
        manufacturer: p.manufacturer,
        average_rating: p.average_rating,
      }));

      setProducts(transformedProducts);
      setTotalProducts(response.data.count);
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page
      console.log(`[Vendor Page] Products for vendor "${formattedVendorName}" fetched successfully.`);
    } catch (err: unknown) {
      console.error(`[Vendor Page] Failed to fetch products for vendor "${formattedVendorName}":`, err);
      setErrorMessage(`Failed to load vendor products. An API error occurred.`);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [formattedVendorName]);

  // Effect to load vendor and then products
  useEffect(() => {
    const loadVendorAndProducts = async () => {
      setIsLoading(true);
      const userId = await fetchVendorUserId(formattedVendorName); // Use formatted name as brand
      if (userId) {
        setVendorUserId(userId);
        setIsVendorValid(true);
        await fetchProductsData(
          userId,
          currentPage,
          minPrice,
          maxPrice,
          selectedManufacturer,
          selectedRating,
          sortBy
        );
      } else {
        setIsLoading(false);
        setIsVendorValid(false);
        notFound(); // Trigger Next.js 404
      }
    };
    loadVendorAndProducts();
  }, [
    vendorSlug,
    formattedVendorName,
    fetchVendorUserId,
    fetchProductsData,
    currentPage,
    minPrice,
    maxPrice,
    selectedManufacturer,
    selectedRating,
    sortBy,
  ]);

  // Handle filter changes (similar to CategoryOrTypePage but without path change for category/type/subcategory)
  const handleFilterChange = useCallback((
    filterValue: string | number,
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating" | "sort_by",
    newValue?: string | number | { min: number | ""; max: number | ""; } | null
  ) => {
    const currentPath = `/vendor-listing/${vendorSlug}`;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (filterType === "price_range") {
      if (typeof newValue === 'object' && newValue !== null && 'min' in newValue && 'max' in newValue) {
        const { min, max } = newValue as { min: number | '', max: number | '' };
        min === '' ? newSearchParams.delete('min_price') : newSearchParams.set('min_price', String(min));
        max === '' ? newSearchParams.delete('max_price') : newSearchParams.set('max_price', String(max));
        setMinPrice(min);
        setMaxPrice(max);
      }
    } else if (filterType === "manufacturer") {
      newValue ? newSearchParams.set('manufacturer', String(newValue)) : newSearchParams.delete('manufacturer');
      setSelectedManufacturer(newValue ? String(newValue) : null);
    } else if (filterType === "rating") {
      newValue ? newSearchParams.set('min_average_rating', String(newValue)) : newSearchParams.delete('min_average_rating');
      setSelectedRating(newValue ? Number(newValue) : null);
    } else if (filterType === "sort_by") {
        if (typeof filterValue === 'string') {
          filterValue === 'relevance' ? newSearchParams.delete('sort_by') : newSearchParams.set('sort_by', filterValue);
          setSortBy(filterValue);
        }
    } else if (filterType === "category" || filterType === "subcategory" || filterType === "type") {
      // For vendor pages, these filters should apply as query params, not change the base URL path
      const formattedFilter = String(filterValue).toLowerCase().replace(/\s+/g, '-');
      if (filterType === "category") {
          newSearchParams.set('category_name', formattedFilter);
          newSearchParams.delete('subcategory_name'); // Clear subcategory if category changes
      } else if (filterType === "subcategory") {
          newSearchParams.set('subcategory_name', formattedFilter);
      } else if (filterType === "type") {
          newSearchParams.set('type', formattedFilter);
      }
      // Update selected filters for highlighting in SideFilter
      setSelectedFilters(prev => {
        const newSet = new Set(prev);
        // Remove references to selectedCategoryName and selectedSubcategoryName
        if (filterType === "category") {
          Array.from(newSet).forEach(f => {
            // Just remove all category/subcategory filters if needed
            newSet.delete(f);
          });
          newSet.add(String(filterValue));
        } else if (filterType === "subcategory") {
          newSet.add(String(filterValue));
        } else if (filterType === "type") {
          Array.from(newSet).forEach(f => {
            if (PRODUCT_TYPE_CHOICES.map(t => t.toLowerCase()).includes(f.toLowerCase())) {
              newSet.delete(f);
            }
          });
          newSet.add(String(filterValue));
        }
        return newSet;
      });
    }

    newSearchParams.set('page', '1');
    setCurrentPage(1);

    router.push(`${currentPath}?${newSearchParams.toString()}`);
  }, [
    vendorSlug,
    searchParams,
    setSelectedFilters,
    router,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', page.toString());
    router.push(currentUrl.toString());
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
    const currentUrl = new URL(window.location.href);
    value === 'relevance' ? currentUrl.searchParams.delete('sort_by') : currentUrl.searchParams.set('sort_by', value);
    currentUrl.searchParams.set('page', '1');
    router.push(currentUrl.toString());
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading vendor products...</p>
      </div>
    );
  }

  if (!isVendorValid) {
    notFound(); // Trigger Next.js 404
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Vendors", href: "/vendors" },
    { label: vendorData?.company_name || formattedVendorName, href: `/vendor-listing/${vendorSlug}` },
  ];

  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      {vendorData && <VendorBanner data={vendorData} />}
      <ProductListing
        products={products}
        title={vendorData?.company_name ? `${vendorData.company_name} Products` : `${formattedVendorName} Products`}
        totalCount={totalProducts}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        selectedCategoryName={null} // Category/Subcategory are handled via query params, not primary route here
        selectedSubcategoryName={null}
        selectedTypeName={null}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        noProductsMessage={noProductsFoundMessage}
        minPrice={minPrice}
        maxPrice={maxPrice}
        selectedManufacturer={selectedManufacturer}
        selectedRating={selectedRating}
        sortBy={sortBy}
        onSortChange={handleSortChange}
      />
    </>
  );
}
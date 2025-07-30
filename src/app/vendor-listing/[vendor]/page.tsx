// src/app/vendor-listing/[vendor]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorBanner from "@/components/vendor-listing/VendorBanner";
import api from "@/lib/api";
import React from "react";

// Define PRODUCT_TYPE_CHOICES or import from the appropriate module
const PRODUCT_TYPE_CHOICES = [
  "Type1",
  "Type2",
  "Type3",
];

// Assuming this structure from your backend Product serializer
interface ApiProduct {
  id: number;
  category_name: string;
  subcategory_name: string;
  images: { id: number; image: string }[];
  name: string;
  description: string;
  price: string; // Price might be string from backend Decimal field
  direct_sale: boolean;
  type: string;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  manufacturer: string;
  average_rating: number | null;
  // Add other fields from your ProductSerializer as needed
}

interface VendorProfile {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        profile_photo: string | null;
        description: string | null;
        // Add other user fields if necessary
    };
    company_name: string;
    brand: string;
    company_email: string;
    company_phone: string;
    company_address: string;
    // Add other vendor profile fields if necessary for your banner
}

export default function VendorPage({ params }: { params: { vendor: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // New states for vendor details
  const [vendorUserId, setVendorUserId] = useState<number | null>(null);
  const [loadingVendor, setLoadingVendor] = useState(true);
  const [vendorData, setVendorData] = useState<VendorProfile | null>(null);

  // Filter states
  const [minPriceFilter, setMinPriceFilter] = useState<number | ''>('');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | ''>('');
  const [manufacturerFilter, setManufacturerFilter] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]); // Assuming 'type' is a filterable field
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance'); // Default sort option

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialize filter states from URL search params on first load
    const initialMinPrice = searchParams.get('min_price');
    const initialMaxPrice = searchParams.get('max_price');
    const initialManufacturer = searchParams.get('manufacturer');
    const initialCategory = searchParams.get('category');
    const initialSubcategory = searchParams.get('subcategory');
    const initialType = searchParams.get('type');
    const initialRating = searchParams.get('rating');
    const initialSortBy = searchParams.get('sort_by');

    if (initialMinPrice) setMinPriceFilter(parseFloat(initialMinPrice));
    if (initialMaxPrice) setMaxPriceFilter(parseFloat(initialMaxPrice));
    if (initialManufacturer) setManufacturerFilter(initialManufacturer.split(','));
    if (initialCategory) setSelectedCategory(initialCategory.split(','));
    if (initialSubcategory) setSelectedSubcategory(initialSubcategory.split(','));
    if (initialType) setSelectedType(initialType.split(','));
    if (initialRating) setSelectedRating(parseInt(initialRating));
    if (initialSortBy) setSortBy(initialSortBy);

    setInitialized(true);
  }, [searchParams]);

  // Fetch vendor details first
  const fetchVendorDetails = useCallback(async (brandName: string) => {
    try {
      setLoadingVendor(true);
      setError(null);
      // Call the new backend endpoint to get vendor by brand name
      const response = await api.get(`/users/vendor/by-brand/${brandName}/`);
      if (response.status === 200 && response.data) {
        setVendorData(response.data);
        setVendorUserId(response.data.user.id); // Assuming the user ID is nested under 'user'
      } else {
        // If data is not found or response is unexpected, treat as not found
        console.error("Vendor details not found or unexpected response:", response);
        notFound();
      }
    } catch (err: any) {
      console.error("[Vendor Page] Failed to fetch vendor details:", err);
      if (err.response && err.response.status === 404) {
        // If vendor brand is not found, show 404 page
        notFound();
      } else {
        setError("Failed to load vendor details. Please try again later.");
      }
    } finally {
      setLoadingVendor(false);
    }
  }, []);

  // Fetch products for the specific vendor once vendorUserId is available
  const fetchProductsData = useCallback(
    async (
      userId: number,
      page: number,
      minPrice: number | '',
      maxPrice: number | '',
      manufacturers: string[],
      categories: string[],
      subcategories: string[],
      types: string[],
      rating: number | null,
      sort: string
    ) => {
      setLoadingProducts(true);
      setError(null);
      try {
        const queryParams: Record<string, any> = {
          page: page,
          user: userId, // Filter by the vendor's user ID
        };

        if (minPrice !== '') queryParams.min_price = minPrice;
        if (maxPrice !== '') queryParams.max_price = maxPrice;
        if (manufacturers.length > 0) queryParams.manufacturer = manufacturers.join(',');
        if (categories.length > 0) queryParams.category = categories.join(',');
        if (subcategories.length > 0) queryParams.subcategory = subcategories.join(',');
        if (types.length > 0) queryParams.type = types.join(',');
        if (rating !== null) queryParams.average_rating__gte = rating; // Assuming average_rating__gte filter
        if (sort) {
          switch (sort) {
            case 'price_asc':
              queryParams.ordering = 'price';
              break;
            case 'price_desc':
              queryParams.ordering = '-price';
              break;
            case 'rating_desc':
              queryParams.ordering = '-average_rating';
              break;
            case 'newest':
              queryParams.ordering = '-created_at';
              break;
            // 'relevance' is default or handled by backend if no ordering
            default:
              break;
          }
        }

        const response = await api.get('/products/', { params: queryParams });
        if (response.status === 200) {
          setProducts(response.data.results);
          setTotalProducts(response.data.count);
        }
      } catch (err) {
        console.error("[Vendor Products Page] Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoadingProducts(false);
      }
    },
    []
  );

  // Effect to fetch vendor details when the brand name changes
  useEffect(() => {
    if (params.vendor) {
      fetchVendorDetails(params.vendor);
    }
  }, [params.vendor, fetchVendorDetails]);

  // Effect to fetch products when vendorUserId or filters change
  useEffect(() => {
    if (vendorUserId !== null && initialized) { // Ensure vendorUserId is set and filters are initialized
      const currentUrl = new URL(window.location.href);
      let changed = false;

      // Update URL for filters
      const updateSearchParam = (key: string, value: string | number | null | string[]) => {
        const currentParam = currentUrl.searchParams.get(key);
        const newValue = Array.isArray(value) ? value.join(',') : value !== null ? String(value) : null;

        if (newValue && newValue !== currentParam) {
          currentUrl.searchParams.set(key, newValue);
          changed = true;
        } else if (!newValue && currentParam) {
          currentUrl.searchParams.delete(key);
          changed = true;
        }
      };

      updateSearchParam('page', currentPage > 1 ? currentPage : null);
      updateSearchParam('min_price', minPriceFilter !== '' ? minPriceFilter : null);
      updateSearchParam('max_price', maxPriceFilter !== '' ? maxPriceFilter : null);
      updateSearchParam('manufacturer', manufacturerFilter.length > 0 ? manufacturerFilter : null);
      updateSearchParam('category', selectedCategory.length > 0 ? selectedCategory : null);
      updateSearchParam('subcategory', selectedSubcategory.length > 0 ? selectedSubcategory : null);
      updateSearchParam('type', selectedType.length > 0 ? selectedType : null);
      updateSearchParam('rating', selectedRating);
      updateSearchParam('sort_by', sortBy !== 'relevance' ? sortBy : null);

      if (changed) {
        router.push(currentUrl.toString(), { scroll: false });
      }

      fetchProductsData(
        vendorUserId,
        currentPage,
        minPriceFilter,
        maxPriceFilter,
        manufacturerFilter,
        selectedCategory,
        selectedSubcategory,
        selectedType,
        selectedRating,
        sortBy
      );
    }
  }, [
    vendorUserId, // New dependency: fetch products only after vendorUserId is resolved
    currentPage,
    minPriceFilter,
    maxPriceFilter,
    manufacturerFilter,
    selectedCategory,
    selectedSubcategory,
    selectedType,
    selectedRating,
    sortBy,
    fetchProductsData,
    router,
    initialized, // Ensure filters are initialized before fetching
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = useCallback(
    (
      filterValue: string | number | string[],
      filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating" | "sort_by",
      newValue?: number | string | { min: number | '', max: number | '' } // Added to handle price range specifically
    ) => {
      setCurrentPage(1); // Reset to first page on any filter change

      switch (filterType) {
        case "category":
          setSelectedCategory(Array.isArray(filterValue) ? filterValue : [String(filterValue)]);
          break;
        case "subcategory":
          setSelectedSubcategory(Array.isArray(filterValue) ? filterValue : [String(filterValue)]);
          break;
        case "type":
          setSelectedType(Array.isArray(filterValue) ? filterValue : [String(filterValue)]);
          break;
        case "price_range":
            if (newValue && typeof newValue === 'object' && 'min' in newValue && 'max' in newValue) {
                setMinPriceFilter(newValue.min);
                setMaxPriceFilter(newValue.max);
            }
          break;
        case "manufacturer":
          setManufacturerFilter(Array.isArray(filterValue) ? filterValue : [String(filterValue)]);
          break;
        case "rating":
          setSelectedRating(typeof filterValue === 'number' ? filterValue : null);
          break;
        case "sort_by":
          setSortBy(String(filterValue));
          break;
        default:
          break;
      }
    },
    []
  );

  const mappedProducts: Product[] = products.map((product) => ({
    id: String(product.id),
    image: product.images[0]?.image || '/images/default_product_image.jpg', // Use a default image if none available
    title: product.name,
    subtitle: product.description, // You might want a shorter 'subtitle' field from your product model
    price: parseFloat(product.price),
    currency: '₹', // Assuming Indian Rupee. Adjust as needed.
    direct_sale: product.direct_sale,
    category_name: product.category_name,
    subcategory_name: product.subcategory_name,
    is_active: product.is_active,
    hide_price: product.hide_price,
    stock_quantity: product.stock_quantity,
    manufacturer: product.manufacturer,
    average_rating: product.average_rating,
  }));

  if (loadingVendor) {
    return <div className="flex justify-center items-center h-screen">Loading vendor details...</div>;
  }

  // If vendorData is null here, it means notFound() was called in fetchVendorDetails
  // No need for explicit check here as notFound() takes care of it.

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Vendors", href: "/vendor-listing" },
            { name: vendorData?.company_name || "Vendor", href: "#" },
          ]}
        />
        {vendorData && (
          <VendorBanner
            vendor={{
              company_name: vendorData.company_name,
              brand: vendorData.brand,
              description: vendorData.user.description || 'No description available.',
              profile_photo: vendorData.user.profile_photo || '/images/default_profile.png',
              // Add other necessary fields from vendorData for the banner
            }}
          />
        )}

        <ProductListing
          products={mappedProducts}
          title={vendorData ? `Products by ${vendorData.company_name}` : "Products"}
          totalCount={totalProducts}
          onFilterChange={handleFilterChange}
          currentPage={currentPage}
          pageSize={10} // Assuming your API returns 10 items per page
          onPageChange={handlePageChange}
          loading={loadingProducts}
          error={error}
          // Pass current filter values to SideFilter for display
          currentFilters={{
            minPrice: minPriceFilter,
            maxPrice: maxPriceFilter,
            manufacturers: manufacturerFilter,
            categories: selectedCategory,
            subcategories: selectedSubcategory,
            types: selectedType,
            rating: selectedRating,
            sortBy: sortBy,
          }}
          // You might need to pass available filter options (categories, manufacturers etc.)
          // This typically comes from a separate API call or a global context
          availableFilterOptions={{
            categories: [], // Populate this from your backend API for categories
            subcategories: [], // Populate this from your backend API for subcategories
            types: PRODUCT_TYPE_CHOICES, // From your choices
            manufacturers: [], // Populate this from your backend API or product data
          }}
        />
      </div>
    </div>
  );
}
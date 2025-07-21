/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/app/[category]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import api from "@/lib/api";

// Helper function to format slugs to display names
const formatNameFromSlug = (slug: string): string => {
  return slug.replace(/-/g, ' ').split(' ').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

// Define API data structures
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
}

interface ApiCategory {
  id: number;
  name: string;
  subcategories: { id: number; name: string }[];
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Product types as defined in your backend
const PRODUCT_TYPE_CHOICES = ["new", "used", "rental", "attachments"];

export default function CategoryOrTypePage({
  params,
}: {
  params: { category: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlParamSlug: string = params.category;
  const formattedUrlParamName: string = formatNameFromSlug(urlParamSlug);

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noProductsFoundMessage, setNoProductsFoundMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set<string>());

  // Filter states
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('relevance'); // Default sort

  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);
  const [activeTypeName, setActiveTypeName] = useState<string | null>(null);
  const [isRouteValid, setIsRouteValid] = useState<boolean>(true);

  // Validate the URL parameter against categories and product types
  const validateRouteContext = useCallback(async (paramSlug: string) => {
    setIsRouteValid(true);
    setActiveCategoryName(null);
    setActiveTypeName(null);
    setErrorMessage(null);

    const formattedName = formatNameFromSlug(paramSlug);

    // 1. Check if it's a product type
    if (PRODUCT_TYPE_CHOICES.includes(paramSlug)) {
      setActiveTypeName(formattedName);
      setSelectedFilters(new Set<string>([formattedName]));
      return { type: 'type', name: formattedName };
    }

    // 2. Check if it's a valid category
    try {
      const categoryResponse = await api.get<ApiResponse<ApiCategory>>(`/categories/?name=${formattedName}`);
      if (categoryResponse.data.results.length > 0) {
        setActiveCategoryName(formattedName);
        setSelectedFilters(new Set<string>([formattedName]));
        return { type: 'category', name: formattedName };
      }
    } catch (err: unknown) {
      console.error("[Category/Type Page] Failed to check category existence:", err);
      // Don't set error message here, as it might just mean no match, not an actual API error for validity.
    }

    // If neither, then it's an invalid route
    setIsRouteValid(false);
    setErrorMessage(`The path "${formattedUrlParamName}" is not a valid category or product type.`);
    return { type: 'invalid', name: null };
  }, [formattedUrlParamName]);

  // Fetch products based on the determined context and filters
  const fetchProductsData = useCallback(async (
    contextType: 'category' | 'type',
    contextName: string,
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
      if (contextType === 'category') {
        queryParams.append("category_name", contextName);
      } else if (contextType === 'type') {
        queryParams.append("type", contextName.toLowerCase());
      }
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
        setNoProductsFoundMessage(`No products found for "${contextName}" with the selected filters.`);
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
      setTotalPages(Math.ceil(response.data.count / 10)); // Assuming 10 items per page from API
      console.log(`[Category/Type Page] Products for "${contextName}" fetched successfully.`);
    } catch (err: unknown) {
      console.error(`[Category/Type Page] Failed to fetch products for "${contextName}":`, err);
      setErrorMessage(`Failed to load products. An API error occurred.`);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to apply filters from URL search params on initial load
  useEffect(() => {
    const minP = searchParams.get('min_price');
    const maxP = searchParams.get('max_price');
    const manufacturer = searchParams.get('manufacturer');
    const rating = searchParams.get('min_average_rating');
    const sort = searchParams.get('sort_by');
    const page = searchParams.get('page');

    if (minP) setMinPrice(Number(minP));
    if (maxP) setMaxPrice(Number(maxP));
    if (manufacturer) setSelectedManufacturer(manufacturer);
    if (rating) setSelectedRating(Number(rating));
    if (sort) setSortBy(sort);
    if (page) setCurrentPage(Number(page));
  }, [searchParams]);

  // Main effect to determine context and fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const context = await validateRouteContext(urlParamSlug);
      if (context.type !== 'invalid' && context.name) {
        await fetchProductsData(
          context.type as 'category' | 'type',
          context.name,
          currentPage,
          minPrice,
          maxPrice,
          selectedManufacturer,
          selectedRating,
          sortBy
        );
      } else {
        setIsLoading(false);
      }
    };
    loadData();
  }, [
    urlParamSlug,
    currentPage,
    validateRouteContext,
    fetchProductsData,
    minPrice,
    maxPrice,
    selectedManufacturer,
    selectedRating,
    sortBy,
  ]);


  // Handle filter changes from SideFilter (this will cause navigation if category/type/subcategory changes)
  const handleFilterChange = useCallback((
    filterValue: string | number,
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating",
    newValue?: number | string | null // For direct value updates
  ) => {
    const currentPath = `/${urlParamSlug}`;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (filterType === "category" || filterType === "subcategory" || filterType === "type") {
        let newPath = "";
        const formattedFilterSlug = String(filterValue).toLowerCase().replace(/\s+/g, '-');

        if (filterType === "category") {
            if (activeCategoryName?.toLowerCase().replace(/\s+/g, '-') === formattedFilterSlug) {
                newPath = `/`;
            } else {
                newPath = `/${formattedFilterSlug}`;
            }
        } else if (filterType === "subcategory") {
            const currentCategorySlug = activeCategoryName?.toLowerCase().replace(/\s+/g, '-');
            if (currentCategorySlug) {
                if (selectedFilters.has(String(filterValue))) {
                    newPath = `/${currentCategorySlug}`;
                } else {
                    newPath = `/${currentCategorySlug}/${formattedFilterSlug}`;
                }
            } else {
                newPath = `/${formattedFilterSlug}`; // Fallback, consider if this route structure is truly supported
            }
        } else if (filterType === "type") {
            if (activeTypeName?.toLowerCase().replace(/\s+/g, '-') === formattedFilterSlug) {
                newPath = `/`;
            } else {
                newPath = `/${formattedFilterSlug}`;
            }
        }
        
        // When category/subcategory/type changes, reset other filters and current page
        router.push(newPath);
        setCurrentPage(1);
        setMinPrice('');
        setMaxPrice('');
        setSelectedManufacturer(null);
        setSelectedRating(null);
        setSortBy('relevance');

    } else {
        // Handle other filter changes (price, manufacturer, rating, sort) without changing the base path
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
        }
        
        newSearchParams.set('page', '1'); // Reset page when filters change
        setCurrentPage(1);

        router.push(`${currentPath}?${newSearchParams.toString()}`);
    }
  }, [activeCategoryName, activeTypeName, router, searchParams, selectedFilters, urlParamSlug]);


  // Construct breadcrumb items
  const breadcrumbItems = [{ label: "Home", href: "/" }];
  if (activeCategoryName) {
    breadcrumbItems.push({
      label: activeCategoryName,
      href: `/${urlParamSlug}`,
    });
  } else if (activeTypeName) {
    breadcrumbItems.push({
      label: activeTypeName,
      href: `/${urlParamSlug}`,
    });
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('page', page.toString());
    router.push(currentUrl.toString());
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset page on sort change
    const currentUrl = new URL(window.location.href);
    value === 'relevance' ? currentUrl.searchParams.delete('sort_by') : currentUrl.searchParams.set('sort_by', value);
    currentUrl.searchParams.set('page', '1');
    router.push(currentUrl.toString());
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  // Show Page Not Found if route is invalid (category/type doesn't exist at all)
  if (!isRouteValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
        <p className="text-gray-700 text-lg mb-6">{errorMessage || "The requested page could not be found."}</p>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Render the UI even if no products, but pass the noProductsFoundMessage
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ProductListing
        products={products}
        title={activeCategoryName || activeTypeName || "All Products"}
        totalCount={totalProducts}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        selectedCategoryName={activeCategoryName}
        selectedSubcategoryName={null}
        selectedTypeName={activeTypeName}
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
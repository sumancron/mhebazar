/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/[category]/page.tsx
/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/app/[category]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import api from "@/lib/api";
import { AxiosError } from "axios"; // Import AxiosError

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
  subcategories: { id: number; name: string }[]; // Subcategories are nested within the category object
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
  params: { category: string; subcategory?: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlParamSlug: string = params.category;
  const subcategoryParamSlug: string | undefined = params.subcategory;
  
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
  const [activeSubcategoryName, setActiveSubcategoryName] = useState<string | null>(null);
  const [activeTypeName, setActiveTypeName] = useState<string | null>(null);

  // Validate the URL parameter against categories and product types
  const validateRouteContext = useCallback(async (paramSlug: string, subParamSlug?: string) => {
    setActiveCategoryName(null);
    setActiveSubcategoryName(null);
    setActiveTypeName(null);
    setErrorMessage(null);

    const formattedParamName = formatNameFromSlug(paramSlug);
    const formattedSubParamName = subParamSlug ? formatNameFromSlug(subParamSlug) : null;

    // 1. Check if it's a product type (e.g., /new, /used)
    if (PRODUCT_TYPE_CHOICES.includes(paramSlug)) {
      if (subParamSlug) { 
        // If a subcategory slug is present with a type slug, it's an invalid route combination
        return { type: 'invalid', name: null, subName: null };
      }
      setActiveTypeName(formattedParamName);
      setSelectedFilters(new Set<string>([formattedParamName]));
      return { type: 'type', name: formattedParamName, subName: null };
    }

    // 2. Check if it's a valid category or subcategory (e.g., /spare-parts, /pallet-trucks/hand-pallet-truck)
    try {
      // Fetch category by name. Your API supports /categories/?name=<category_name>
      const categoryResponse = await api.get<ApiResponse<ApiCategory>>(`/categories/?name=${formattedParamName}`);
      
      // IMPORTANT: Check if response.data and response.data.results exist
      if (categoryResponse.data && categoryResponse.data.results && categoryResponse.data.results.length > 0) {
        const category = categoryResponse.data.results[0];
        setActiveCategoryName(category.name);

        if (formattedSubParamName) {
          // Check if the subcategory exists within this category
          const subcategory = category.subcategories.find(sub => sub.name.toLowerCase() === formattedSubParamName.toLowerCase());
          if (subcategory) {
            setActiveSubcategoryName(subcategory.name);
            setSelectedFilters(new Set<string>([category.name, subcategory.name]));
            return { type: 'subcategory', name: category.name, subName: subcategory.name };
          } else {
            // Subcategory not found under this category
            return { type: 'invalid', name: null, subName: null };
          }
        } else {
          // Valid category, no subcategory specified
          setSelectedFilters(new Set<string>([category.name]));
          return { type: 'category', name: category.name, subName: null };
        }
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("[Category/Type Page] Failed to check category existence (AxiosError):", err.message);
        // Optionally, check err.response for specific HTTP status codes if needed
      } else {
        console.error("[Category/Type Page] Failed to check category existence:", err);
      }
      // If API error or no match, fall through to invalid
    }

    // If neither a product type nor a valid category/subcategory, then it's an invalid route
    return { type: 'invalid', name: null, subName: null };
  }, []);

  // Fetch products based on the determined context and filters
  const fetchProductsData = useCallback(async (
    contextType: 'category' | 'subcategory' | 'type',
    contextName: string,
    contextSubName: string | null,
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
        // For a category page, query products by category_name
        queryParams.append("category_name", contextName);
      } else if (contextType === 'subcategory') {
        // For a subcategory page, query products by both category_name and subcategory_name
        queryParams.append("category_name", contextName);
        queryParams.append("subcategory_name", contextSubName || ''); // subName will always be present for 'subcategory' type
      } else if (contextType === 'type') {
        // For a product type page, query products by type (e.g., 'new', 'used')
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

      // IMPORTANT: Check if response.data and response.data.results exist
      if (response.data && response.data.results) {
        if (response.data.results.length === 0) {
          setNoProductsFoundMessage(`No products found for "${contextSubName || contextName}" with the selected filters.`);
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
        console.log(`[Category/Type Page] Products for "${contextSubName || contextName}" fetched successfully.`);
      } else {
        // Handle case where response.data or response.data.results is null/undefined
        setNoProductsFoundMessage(`Failed to load products. Unexpected API response structure.`);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error(`[Category/Type Page] Failed to fetch products for "${contextSubName || contextName}" (AxiosError):`, err.message);
        setErrorMessage(`Failed to load products. An API error occurred: ${err.message}`);
      } else {
        console.error(`[Category/Type Page] Failed to fetch products for "${contextSubName || contextName}":`, err);
        setErrorMessage(`Failed to load products. An unknown error occurred.`);
      }
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
      const context = await validateRouteContext(urlParamSlug, subcategoryParamSlug);

      if (context.type !== 'invalid' && context.name) {
        await fetchProductsData(
          context.type as 'category' | 'subcategory' | 'type',
          context.name,
          context.subName,
          currentPage,
          minPrice,
          maxPrice,
          selectedManufacturer,
          selectedRating,
          sortBy
        );
      } else {
        setIsLoading(false);
        notFound(); // Trigger Next.js 404
      }
    };
    loadData();
  }, [
    urlParamSlug,
    subcategoryParamSlug,
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
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating" | "sort_by",
    newValue?: string | number | { min: number | ""; max: number | ""; } | null // For direct value updates
  ) => {
    const currentPath = `/${urlParamSlug}${subcategoryParamSlug ? `/${subcategoryParamSlug}` : ''}`;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (filterType === "category" || filterType === "subcategory" || filterType === "type") {
        let newPath = "";
        const formattedFilterSlug = String(filterValue).toLowerCase().replace(/\s+/g, '-');

        // Reset other filters when navigating to a new category/subcategory/type
        newSearchParams.delete('min_price');
        newSearchParams.delete('max_price');
        newSearchParams.delete('manufacturer');
        newSearchParams.delete('min_average_rating');
        newSearchParams.delete('sort_by');
        newSearchParams.set('page', '1');

        setMinPrice('');
        setMaxPrice('');
        setSelectedManufacturer(null);
        setSelectedRating(null);
        setSortBy('relevance');
        setCurrentPage(1);

        if (filterType === "category") {
            newPath = `/${formattedFilterSlug}`;
        } else if (filterType === "subcategory") {
            // Preserve the current category slug in the path if available, otherwise use the new subcategory slug directly
            const currentCategorySlug = activeCategoryName?.toLowerCase().replace(/\s+/g, '-');
            if (currentCategorySlug) {
                newPath = `/${currentCategorySlug}/${formattedFilterSlug}`;
            } else {
                // Fallback: If no activeCategoryName context, navigate to the subcategory directly (might result in 404 if not a top-level category name)
                newPath = `/${formattedFilterSlug}`;
            }
        } else if (filterType === "type") {
            newPath = `/${formattedFilterSlug}`;
        }
        
        router.push(`${newPath}?${newSearchParams.toString()}`);

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
  }, [
    urlParamSlug,
    subcategoryParamSlug,
    activeCategoryName,
    router,
    searchParams
  ]);


  // Construct breadcrumb items
  const breadcrumbItems = [{ label: "Home", href: "/" }];
  if (activeCategoryName) {
    breadcrumbItems.push({
      label: activeCategoryName,
      href: `/${urlParamSlug}`, // Use urlParamSlug for category base URL
    });
    if (activeSubcategoryName) {
      breadcrumbItems.push({
        label: activeSubcategoryName,
        href: `/${urlParamSlug}/${subcategoryParamSlug}`, // Use subcategoryParamSlug for subcategory URL
      });
    }
  } else if (activeTypeName) {
    breadcrumbItems.push({
      label: activeTypeName,
      href: `/${urlParamSlug}`, // Use urlParamSlug for type base URL
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

  // Render the UI even if no products, but pass the noProductsFoundMessage
  return (
    <>
      <Breadcrumb items={breadcrumbItems} />
      <ProductListing
        products={products}
        title={activeSubcategoryName || activeCategoryName || activeTypeName || "All Products"}
        totalCount={totalProducts}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        selectedCategoryName={activeCategoryName}
        selectedSubcategoryName={activeSubcategoryName}
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
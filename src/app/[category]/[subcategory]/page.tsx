/* eslint-disable @typescript-eslint/no-unused-expressions */
// src/app/[category]/[subcategory]/page.tsx
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
interface ApiSubcategory {
  id: number;
  name: string;
  category_name: string;
  category: number;
}

interface ApiCategory {
  id: number;
  name: string;
  subcategories: ApiSubcategory[];
}

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

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function SubCategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlCategorySlug: string = params.category;
  const urlSubcategorySlug: string = params.subcategory;

  const formattedCategoryName: string = formatNameFromSlug(urlCategorySlug);
  const formattedSubcategoryName: string = formatNameFromSlug(urlSubcategorySlug);

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

  const [validCategoryName, setValidCategoryName] = useState<string | null>(null);
  const [validSubcategoryName, setValidSubcategoryName] = useState<string | null>(null);
  const [isRouteValid, setIsRouteValid] = useState<boolean>(true);

  // Validate category and subcategory existence and hierarchy
  const validateRouteAndGetNames = useCallback(async (catSlug: string, subcatSlug: string) => {
    setIsRouteValid(true);
    setValidCategoryName(null);
    setValidSubcategoryName(null);
    setErrorMessage(null);

    const formattedCatName = formatNameFromSlug(catSlug);
    const formattedSubcatName = formatNameFromSlug(subcatSlug);

    try {
      const categoryResponse = await api.get<ApiResponse<ApiCategory>>(`/categories/?name=${formattedCatName}`);
      const category = categoryResponse.data.results.find((c: ApiCategory) => c.name === formattedCatName);

      if (!category) {
        setIsRouteValid(false);
        setErrorMessage(`Category "${formattedCatName}" not found.`);
        return { category: null, subcategory: null };
      }

      const subcategory = category.subcategories.find((sub: ApiSubcategory) => sub.name === formattedSubcatName);

      if (!subcategory) {
        setIsRouteValid(false);
        setErrorMessage(`Subcategory "${formattedSubcatName}" not found under category "${formattedCatName}".`);
        return { category: null, subcategory: null };
      }

      setValidCategoryName(formattedCatName);
      setValidSubcategoryName(formattedSubcatName);
      setSelectedFilters(new Set<string>([formattedCatName, formattedSubcatName]));
      return { category: formattedCatName, subcategory: formattedSubcatName };

    } catch (err: unknown) {
      console.error("[Subcategory Page] Error validating route:", err);
      setIsRouteValid(false);
      if (err instanceof Error) {
        setErrorMessage(`An error occurred while validating the path: ${err.message}. Please try again.`);
      } else {
        setErrorMessage("An unexpected error occurred while validating the path. Please try again.");
      }
      return { category: null, subcategory: null };
    }
  }, []);

  // Fetch products based on validated category and subcategory and filters
  const fetchProductsData = useCallback(async (
    categoryName: string,
    subcategoryName: string,
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
      queryParams.append("category_name", categoryName);
      queryParams.append("subcategory_name", subcategoryName);
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
        setNoProductsFoundMessage(`No products found for "${subcategoryName}" under "${categoryName}" with the selected filters.`);
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
      setTotalPages(Math.ceil(response.data.count / 10));
      console.log("[Subcategory Page] Products fetched successfully.");
    } catch (err: unknown) {
      console.error("[Subcategory Page] Failed to fetch products:", err);
      setErrorMessage("Failed to load products. An API error occurred.");
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


  // Main effect to validate route and fetch data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const { category, subcategory } = await validateRouteAndGetNames(urlCategorySlug, urlSubcategorySlug);
      if (category && subcategory) {
        await fetchProductsData(
          category,
          subcategory,
          currentPage,
          minPrice,
          maxPrice,
          selectedManufacturer,
          selectedRating,
          sortBy
        );
      } else {
        setIsLoading(false);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    };
    loadData();
  }, [
    urlCategorySlug,
    urlSubcategorySlug,
    currentPage,
    validateRouteAndGetNames,
    fetchProductsData,
    minPrice,
    maxPrice,
    selectedManufacturer,
    selectedRating,
    sortBy,
  ]);

  // Handle filter changes (this will trigger navigation)
  const handleFilterChange = useCallback((
    filterValue: string | number,
    filterType: "category" | "subcategory" | "type" | "price_range" | "manufacturer" | "rating",
    newValue?: string | number | { min: number | ""; max: number | ""; } | null // For direct value updates
  ) => {
    const currentPath = `/${urlCategorySlug}/${urlSubcategorySlug}`;
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (filterType === "category" || filterType === "subcategory" || filterType === "type") {
      let newPath = "";
      const formattedFilterSlug = String(filterValue).toLowerCase().replace(/\s+/g, '-');

      if (filterType === "category") {
          if (validCategoryName?.toLowerCase().replace(/\s+/g, '-') === formattedFilterSlug) {
              newPath = `/`;
          } else {
              newPath = `/${formattedFilterSlug}`;
          }
      } else if (filterType === "subcategory") {
          if (validSubcategoryName?.toLowerCase().replace(/\s+/g, '-') === formattedFilterSlug) {
              newPath = `/${urlCategorySlug}`;
          } else {
              newPath = `/${urlCategorySlug}/${formattedFilterSlug}`;
          }
      } else if (filterType === "type") {
          newPath = `/${formattedFilterSlug}`;
      }
      
      router.push(newPath);
      setCurrentPage(1);
      setMinPrice('');
      setMaxPrice('');
      setSelectedManufacturer(null);
      setSelectedRating(null);
      setSortBy('relevance');

    } else {
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
        
        newSearchParams.set('page', '1');
        setCurrentPage(1);

        router.push(`${currentPath}?${newSearchParams.toString()}`);
    }
  }, [urlCategorySlug, urlSubcategorySlug, searchParams, router, validCategoryName, validSubcategoryName]);


  // Construct breadcrumb items
  const breadcrumbItems = [
    { label: "Home", href: "/" },
  ];
  if (validCategoryName) {
    breadcrumbItems.push({ label: validCategoryName, href: `/${urlCategorySlug}` });
  }
  if (validSubcategoryName) {
    breadcrumbItems.push({ label: validSubcategoryName, href: `/${urlCategorySlug}/${urlSubcategorySlug}` });
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

  // Show Page Not Found if route is invalid (category/subcategory hierarchy doesn't exist)
  if (!isRouteValid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] bg-gray-50 p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h2>
        <p className="text-gray-700 text-lg mb-6">{errorMessage || `The path "${formattedCategoryName} / ${formattedSubcategoryName}" is invalid.`}</p>
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
        title={validSubcategoryName || validCategoryName || "Products"}
        totalCount={totalProducts}
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        selectedCategoryName={validCategoryName}
        selectedSubcategoryName={validSubcategoryName}
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
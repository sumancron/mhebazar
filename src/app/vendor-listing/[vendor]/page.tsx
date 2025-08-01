// src/app/vendor-listing/[vendor]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, notFound } from "next/navigation";
import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorBanner from "@/components/vendor-listing/VendorBanner";
import api from "@/lib/api";
import { AxiosError } from "axios";

// --- API Response and Product Type Interfaces ---
interface VendorDetails {
  id: number;
  user_id: number;
  username: string;
  company_name: string;
  brand: string;
}

interface UserProfile {
  id: number;
  description: string | null;
  profile_photo: string | null;
  user_banner: { id: number; image: string }[];
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

export default function VendorPage({ params }: { params: { vendor: string } }) {
  const { vendor: vendorSlug } = params;
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- State for Data and Loading ---
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [vendorDetails, setVendorDetails] = useState<VendorDetails | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noProductsFoundMessage, setNoProductsFoundMessage] = useState<string | null>(null);

  // State for the controlled search input field
  const [searchInput, setSearchInput] = useState('');

  // --- Derived State from URL Search Params ---
  const { currentPage, sortBy, searchQuery } = useMemo(() => {
    const page = parseInt(searchParams.get("page") || "1", 10);
    const sort = searchParams.get("sort_by") || "relevance";
    const query = searchParams.get("search") || "";
    return {
      currentPage: page,
      sortBy: sort,
      searchQuery: query
    };
  }, [searchParams]);

  // Syncs the search input field with the URL query when the page loads or URL changes
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // --- DATA FETCHING ---

  // Effect 1: Fetch Vendor and User Profile details.
  useEffect(() => {
    const fetchVendorContext = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const vendorResponse = await api.get<ApiResponse<VendorDetails>>(`/vendor/?brand=${vendorSlug}`);
        const vendorData = vendorResponse.data?.results?.[0];
        if (!vendorData) {
          notFound();
          return;
        }
        setVendorDetails(vendorData);

        const userProfileResponse = await api.get<UserProfile>(`/users/${vendorData.user_id}/`);
        setUserProfile(userProfileResponse.data);
      } catch (err: unknown) {
        console.error("[Vendor Page] Failed to fetch vendor context:", err);
        if (err instanceof AxiosError && err.response?.status === 404) {
          notFound();
        } else {
          setError("Failed to load vendor details. Please try again later.");
        }
      }
    };
    fetchVendorContext();
  }, [vendorSlug]);


  // Effect 2: Fetch products whenever the vendor or search parameters change.
  useEffect(() => {
    if (!vendorDetails) return;

    const fetchProducts = async () => {
      setIsLoading(true);
      setNoProductsFoundMessage(null);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("user", vendorDetails.user_id.toString());
        queryParams.append("page", currentPage.toString());

        // Add search query if it exists
        if (searchQuery) {
          queryParams.append("search", searchQuery);
        }

        if (sortBy && sortBy !== "relevance") {
          let sortParam = sortBy === "price_asc" ? "price" : sortBy === "price_desc" ? "-price" : "-created_at";
          queryParams.append("ordering", sortParam);
        }

        const response = await api.get<ApiResponse<ApiProduct>>(`/products/?${queryParams.toString()}`);

        if (response.data && response.data.results) {
          const transformedProducts: Product[] = response.data.results.map((p) => ({
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
            type: p.type,
          }));

          setProducts(transformedProducts);
          setTotalProducts(response.data.count);
          setTotalPages(Math.ceil(response.data.count / 20));

          if (response.data.results.length === 0) {
            setNoProductsFoundMessage("No products found for this vendor with the selected filters.");
          }
        } else {
          setError("Failed to load products due to an unexpected API response.");
        }
      } catch (err: unknown) {
        console.error("[Vendor Page] Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [vendorDetails, searchParams, currentPage, sortBy, searchQuery]);


  // --- EVENT HANDLERS ---
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", "1");

    if (searchInput) {
      newSearchParams.set("search", searchInput);
    } else {
      newSearchParams.delete("search");
    }

    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  }

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", "1");
    value === "relevance" ? newSearchParams.delete("sort_by") : newSearchParams.set("sort_by", value);
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  }

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("page", page.toString());
    router.push(`${window.location.pathname}?${newSearchParams.toString()}`);
  }

  // --- RENDER LOGIC ---
  if (isLoading && !vendorDetails) {
    return <div className="flex justify-center items-center min-h-screen">Loading Vendor...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!vendorDetails) {
    return <div className="flex justify-center items-center min-h-screen">Vendor not found.</div>;
  }

  const bannerImageUrls = userProfile?.user_banner?.map(b => b.image) || [];

  console.log(userProfile);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Vendors", href: "/vendor-listing" },
            { label: vendorDetails.company_name, href: `/vendor-listing/${vendorSlug}` },
          ]}
        />
        {userProfile && (
          <VendorBanner
            company_name={vendorDetails.company_name}
            brand={vendorDetails.brand}
            description={userProfile.description || "No description available."}
            profile_photo={userProfile.profile_photo || "/images/default_profile.png"}
            productCount={totalProducts}
            bannerImages={bannerImageUrls.length > 0 ? bannerImageUrls : ['/images/default_banner.jpg']}
          />
        )}

        <div className="my-6 bg-white p-4 rounded-lg shadow">
          <form onSubmit={handleSearch} className="flex items-center gap-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, category, or subcategory..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#5CA131] text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Search
            </button>
          </form>
        </div>

        <ProductListing
          products={products}
          title={`Products from ${vendorDetails.company_name}`}
          totalCount={totalProducts}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
          noProductsMessage={noProductsFoundMessage}
          currentPage={currentPage}
          totalPages={totalPages}
          sortBy={sortBy}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import api from "@/lib/api";
import ProductForm from "@/components/forms/uploadForm/ProductForm";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Pencil, ExternalLink } from "lucide-react";

import { Product } from "@/types";

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

const TYPE_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'used', label: 'Used' },
  { value: 'rental', label: 'Rental' },
  { value: 'attachments', label: 'Attachments' },
];

const API_BASE_URL = "http://localhost:8000";


// Update the getImageUrl function
const getImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) return '/no-product.png';

  try {
    // Check if the URL is already absolute
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }

    // For relative URLs, combine with API base URL
    return `${API_BASE_URL}${imageUrl}`;
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return '/no-product.png';
  }
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  // Update the tab state type
  const [tab, setTab] = useState<'new' | 'used' | 'rental' | 'attachments'>('new');
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  // Add these state variables
 const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(); 
  // const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/vendor/dashboard/");
        const productsData = response.data?.products || [];
        console.log(productsData);
        setProducts(productsData);

        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(productsData.map((p: Product) => p.category_name))
        ) as string[];
        setCategories(uniqueCategories);
        setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const productsPerPage = 4;

  // Update the filtering logic
  let filteredProducts = products.filter((p) => p.type === tab);

  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category_name)
    );
  }

  // Sorting logic
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "az":
        return a.name.localeCompare(b.name);
      case "za":
        return b.name.localeCompare(a.name);
      case "oldest":
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      case "newest":
      default:
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

  // Filter modal handlers
  const handleCategoryChange = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Add this function to handle edit click
  const handleEditClick = async (productId: number) => {
    try {
      const response = await api.get(`/products/${productId}/`);
      setSelectedProduct(response.data);
      // setIsSheetOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Product List</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              // onClick={() => setOpen(true)}
              variant="default"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
            >
              + Add Product
            </Button>
          </SheetTrigger>
          <SheetContent>
            <ProductForm product={selectedProduct} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v as 'new' | 'used' | 'rental' | 'attachments');
            setCurrentPage(1);
          }}
          className="w-full sm:w-auto"
        >
          <TabsList className="bg-white grid grid-cols-4 gap-1">
            {TYPE_OPTIONS.map((type) => (
              <TabsTrigger
                key={type.value}
                value={type.value}
                className="data-[state=active]:border-b-green-500 data-[state=active]:text-green-600 px-3 py-2 font-semibold text-sm"
              >
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 font-medium text-gray-700 px-4 py-2 rounded"
            onClick={() => setShowFilter(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </Button>
          <div className="relative">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 font-medium text-gray-700 px-4 py-2 rounded"
              onClick={() => setShowSort((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={showSort}
            >
              Sort by
              <ChevronDown className="w-4 h-4" />
            </Button>
            {showSort && (
              <div className="absolute right-0 mt-2 z-20 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[160px]">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${sortBy === opt.value ? "text-green-600 font-semibold" : "text-gray-700"
                      }`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSort(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {currentProducts.map((product) => (
          <Card
            key={product.id}
            className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center relative">
              {/* Add dropdown menu at the card level */}
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem onClick={() => handleEditClick(product.id)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open(`/products-details/${product.id}`, '_blank')}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Image container - remove the dropdown from here */}
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={product.images?.[0]?.image
                    ? (product.images[0].image.startsWith('data:')
                      ? product.images[0].image
                      : getImageUrl(product.images[0].image))
                    : "/no-product.png"
                  }
                  alt={product.name || 'Product image'}
                  fill
                  className="object-contain rounded border border-gray-100 bg-white"
                  sizes="96px"
                  priority
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/no-product.png";
                  }}
                />
                <span
                  className={`absolute top-2 left-2 ${(() => {
                    switch (product.type) {
                      case 'new':
                        return 'bg-blue-500';
                      case 'used':
                        return 'bg-orange-500';
                      case 'rental':
                        return 'bg-purple-500';
                      case 'attachments':
                        return 'bg-pink-500';
                      default:
                        return 'bg-gray-500';
                    }
                  })()
                    } text-white px-2 py-0.5 rounded-md text-xs font-semibold shadow`}
                >
                  {TYPE_OPTIONS.find(t => t.value === product.type)?.label || product.type}
                </span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${product.is_active
                      ? "text-green-600 bg-green-50"
                      : "text-yellow-600 bg-yellow-50"
                      }`}
                  >
                    {product.is_active ? "Approved" : "Pending"}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded font-medium">
                    {product.category_name}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">
                    Updated {new Date(product.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {currentProducts.length === 0 && (
          <div className="text-center text-gray-400 py-12">No products found.</div>
        )}
      </div>

      <Pagination className="mt-8 flex justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowFilter(false)}
              aria-label="Close"
            >
              <X />
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900">Filter Products</h3>
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-2">Category</div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                      className="accent-green-600"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  setSelectedCategories([]);
                }}
              >
                Clear
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setShowFilter(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
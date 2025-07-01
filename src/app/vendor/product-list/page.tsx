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
import { useState } from "react";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  status: string;
  isNew?: boolean;
  isOld?: boolean;
  category: string;
}

const allProducts: Product[] = [
  {
    id: 1,
    name: "3 Ton Lithium Forklift Truck with Fast Charger",
    image: "",
    status: "Approve",
    isNew: true,
    category: "Forklift",
  },
  {
    id: 2,
    name: "2 Ton Lithium Forklift Truck With Fast Charger",
    image: "",
    status: "Approve",
    isNew: true,
    category: "Forklift",
  },
  {
    id: 3,
    name: "2 Ton Lithium Powered Battery Operated Pallet Truck",
    image: "",
    status: "Approve",
    isNew: true,
    category: "Electric Pallet Truck (BOPT)",
  },
  {
    id: 4,
    name: "Lithium Powered Electric Stacker",
    image: "",
    status: "Approve",
    isOld: true,
    category: "Forklift",
  },
  {
    id: 5,
    name: "2 Ton Lithium Forklift Truck With Fast Charger",
    image: "",
    status: "Approve",
    isNew: true,
    category: "Forklift",
  },
  {
    id: 6,
    name: "Lithium Powered Electric Stacker",
    image: "",
    status: "Approve",
    isOld: true,
    category: "Forklift",
  },
  {
    id: 7,
    name: "2 Ton Lithium Powered Battery Operated Pallet Truck",
    image: "",
    status: "Approve",
    isNew: true,
    category: "Electric Pallet Truck (BOPT)",
  },
];

const categories = [
  "Forklift",
  "Electric Pallet Truck (BOPT)",
];

const statuses = [
  "Approve",
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "A-Z", value: "az" },
  { label: "Z-A", value: "za" },
];

function getImageSrc(src: string) {
  return src && src !== "" ? src : "/no-product.png";
}

export default function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState<"new" | "old">("new");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState(sortOptions[0].value);

  const productsPerPage = 4;

  // Filtering logic (demo, you can enhance as needed)
  let filteredProducts = allProducts.filter((p) =>
    tab === "new" ? p.isNew : p.isOld
  );
  if (selectedCategories.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedCategories.includes(p.category)
    );
  }
  if (selectedStatuses.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedStatuses.includes(p.status)
    );
  }

  // Sorting logic (demo)
  if (sortBy === "az") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } else if (sortBy === "za") {
    filteredProducts = [...filteredProducts].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
  } else if (sortBy === "oldest") {
    filteredProducts = [...filteredProducts].reverse();
  }

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
  const handleStatusChange = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Product List</h1>
        <Button variant="default" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded">
          + Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <Tabs value={tab} onValueChange={v => { setTab(v as "new" | "old"); setCurrentPage(1); }} className="w-full sm:w-auto">
          <TabsList className="bg-gray-50 border border-gray-200 rounded-lg">
            <TabsTrigger value="new" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-600 px-6 py-2 rounded-lg font-semibold">
              New Products
            </TabsTrigger>
            <TabsTrigger value="old" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-600 px-6 py-2 rounded-lg font-semibold">
              Old Products
            </TabsTrigger>
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
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${
                      sortBy === opt.value ? "text-green-600 font-semibold" : "text-gray-700"
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
        {currentProducts.map(product => (
          <Card
            key={product.id}
            className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow transition"
          >
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative h-24 w-24 flex-shrink-0">
                <Image
                  src={getImageSrc(product.image)}
                  alt={product.name}
                  fill
                  className="object-contain rounded border border-gray-100 bg-white"
                  sizes="96px"
                  priority
                />
                {product.isNew && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold shadow">
                    New
                  </span>
                )}
                {product.isOld && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold shadow">
                    Old
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                    {product.status}
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-50 px-2 py-0.5 rounded font-medium">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="link" className="text-blue-600 px-0 py-0 h-auto text-sm font-medium">
                    Edit
                  </Button>
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
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
            <div className="mb-6">
              <div className="font-semibold text-gray-700 mb-2">Status</div>
              <div className="flex flex-wrap gap-2">
                {statuses.map((status) => (
                  <label key={status} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status)}
                      onChange={() => handleStatusChange(status)}
                      className="accent-green-600"
                    />
                    {status}
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
                  setSelectedStatuses([]);
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
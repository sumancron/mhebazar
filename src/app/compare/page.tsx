// src/app/compare/page.tsx
"use client";
import React, { useState, ChangeEvent, useEffect, useCallback } from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { ProductCardContainer } from "@/components/elements/Product";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "sonner";
// import { useRouter } from "next/navigation";

// Define the Product type based on the API response structure
type Product = {
  id: number;
  name: string;
  description: string;
  price: string;
  direct_sale: boolean;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  images: { id: number; image: string }[];
  category_name: string;
  subcategory_name: string;
  manufacturer: string;
  model: string;
  average_rating: number | null;
  // Add other fields from API response if needed for comparison table
};

// Define a type for the product data as stored in local storage for comparison
type CompareProduct = {
  id: number;
  image: string; // This will be the first image URL
  title: string; // Maps to product.name
  subtitle: string; // Maps to product.description or subcategory_name
  price: string | number;
  currency: string; // Assuming '₹' for now, can be dynamic if available in API
  directSale: boolean;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  category_name: string; // Used for category-based comparison
  manufacturer: string;
  model: string;
  ratings: number; // Maps to product.average_rating
  ratingsCount: number; // Not directly available in API, using a placeholder
  soldBy: string; // Not directly available in API, using a placeholder
  brand: string; // Maps to product.manufacturer
  typeSize: string; // Placeholder, adjust if API provides
  rimSize: string; // Placeholder, adjust if API provides
  vehicleType: string; // Placeholder, adjust if API provides
};

const tableFields = [
  { label: "Price", key: "price", isCurrency: true },
  { label: "Customer Ratings", key: "ratings", isRating: true },
  { label: "Sold by", key: "soldBy" }, // Placeholder
  { label: "Brand", key: "brand" }, // Maps to manufacturer
  { label: "Category", key: "category_name" },
  { label: "Subcategory", key: "subcategory_name" }, // Assuming subcategory_name is available
  { label: "Manufacturer", key: "manufacturer" },
  { label: "Model", key: "model" },
  { label: "Type Size", key: "typeSize" }, // Placeholder
  { label: "Rim Size", key: "rimSize" }, // Placeholder
  { label: "Vehicle Type", key: "vehicleType" }, // Placeholder
];

const maxColumns = 4;
const COMPARE_KEY = 'mhe_compare_products';

const ComparePage = () => {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const router = useRouter();

  // Load products from local storage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedProducts: CompareProduct[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
      if (storedProducts.length > 0) {
        setProducts(storedProducts);
        // Set the category of the first product to ensure subsequent additions are of the same category
        setSelectedCategory(storedProducts[0].category_name);
      }
    }
  }, []);

  // Handle adding a product from the modal to the comparison list
  const handleAddProduct = (product: Product) => {
    // Check if the product is already in the comparison list
    if (products.some((p) => p.id === product.id)) {
      toast.info("This product is already in your comparison list.");
      return;
    }

    // Ensure all products are of the same category
    if (selectedCategory && product.category_name !== selectedCategory) {
      toast.error(`Only products from the "${selectedCategory}" category can be compared together.`);
      return;
    }

    const newCompareProduct: CompareProduct = {
      id: product.id,
      image: product.images[0]?.image || "/images/placeholder.jpg", // Use a placeholder if no image
      title: product.name,
      subtitle: product.subcategory_name || product.description,
      price: product.price,
      currency: "₹", // Assuming Rupee, adjust if API provides
      directSale: product.direct_sale,
      is_active: product.is_active,
      hide_price: product.hide_price,
      stock_quantity: product.stock_quantity,
      category_name: product.category_name,
      manufacturer: product.manufacturer,
      model: product.model,
      ratings: product.average_rating || 0,
      ratingsCount: 0, // Placeholder as not in API
      soldBy: "N/A", // Placeholder as not in API
      brand: product.manufacturer,
      typeSize: "N/A", // Placeholder as not in API
      rimSize: "N/A", // Placeholder as not in API
      vehicleType: "N/A", // Placeholder as not in API
    };

    const updatedProducts = [...products, newCompareProduct];
    setProducts(updatedProducts);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updatedProducts));
    setSelectedCategory(newCompareProduct.category_name); // Set category if it's the first product
    setShowModal(false);
    setSearch("");
    setSearchResults([]); // Clear search results after adding
    toast.success(`${product.name} added to comparison!`);
  };

  // Handle removing a product from the comparison list
  const handleRemoveProduct = (id: number) => {
    const updatedProducts = products.filter((product) => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem(COMPARE_KEY, JSON.stringify(updatedProducts));
    if (updatedProducts.length === 0) {
      setSelectedCategory(null); // Reset category if no products are left
    }
    toast.info("Product removed from comparison.");
  };

  // Handle search input change and fetch results from API
  const handleSearch = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);

    if (searchTerm.length < 2) { // Only search if at least 2 characters
      setSearchResults([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const response = await api.get<{ results: Product[] }>(`/products/`, {
        params: {
          search: searchTerm,
          category_name: selectedCategory || undefined, // Filter by category if one is selected
        },
      });
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error searching products:", error);
      toast.error("Failed to search products.");
      setSearchResults([]);
    } finally {
      setLoadingSearch(false);
    }
  }, [selectedCategory]);

  const displayProducts = products.slice(0, maxColumns);

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Compare", href: "/compare" },
          ]}
        />
      </div>

      {/* Title */}
      <div className="w-full px-4 sm:px-8 mt-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Compare Products</h2>
      </div>

      {/* Product Cards Row */}
      <div className="w-full px-2 sm:px-8 mb-10">
        <div className="flex flex-wrap gap-6 justify-center md:justify-normal overflow-x-auto pb-2">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 relative">
              <ProductCardContainer
                id={product.id}
                image={product.image}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                currency={product.currency}
                directSale={product.directSale}
                is_active={product.is_active}
                hide_price={product.hide_price}
                stock_quantity={product.stock_quantity}
              />
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:bg-red-600 transition-colors z-10"
                aria-label={`Remove ${product.title} from comparison`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          {/* Add Product Card */}
          {displayProducts.length < maxColumns && (
            <div
              onClick={() => setShowModal(true)}
              className="flex-shrink-0 w-80 h-96 bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-all duration-200 p-4"
              tabIndex={0}
              role="button"
              aria-label="Add Product to Compare"
            >
              <Plus className="w-12 h-12 text-green-500 mb-3" />
              <span className="text-green-600 font-semibold text-lg text-center">Add Product</span>
              {selectedCategory && (
                <span className="text-gray-500 text-sm mt-1 text-center">(Only &quot;{selectedCategory}&quot; products)</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      {products.length > 0 && (
        <div className="w-full px-2 sm:px-8 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
            <table className="min-w-full text-sm divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-4 text-left font-semibold text-gray-700 w-44 rounded-tl-xl sticky left-0 bg-gray-50 z-10">
                    {/* Empty for row labels */}
                  </th>
                  {Array.from({ length: maxColumns }).map((_, idx) => (
                    <th
                      key={idx}
                      className={`py-4 px-4 text-center font-semibold text-gray-700 min-w-[280px] ${
                        idx === maxColumns - 1 ? "rounded-tr-xl" : ""
                      }`}
                    >
                      {displayProducts[idx]?.title ? (
                        <span className="block truncate text-gray-900 font-semibold text-base px-2">
                          {displayProducts[idx].title}
                        </span>
                      ) : (
                        <span className="text-gray-400">---</span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableFields.map((field) => (
                  <tr key={field.key} className="border-t last:border-b">
                    <td className="py-4 px-4 font-medium text-gray-700 sticky left-0 bg-gray-50 z-10">
                      {field.label}
                    </td>
                    {Array.from({ length: maxColumns }).map((_, idx) => {
                      const product = displayProducts[idx];
                      if (!product)
                        return (
                          <td
                            key={idx}
                            className="py-4 px-4 text-center text-gray-400"
                          >
                            ----
                          </td>
                        );

                      const value = product[field.key as keyof CompareProduct];

                      if (field.isCurrency)
                        return (
                          <td
                            key={idx}
                            className="py-4 px-4 text-center font-semibold text-green-600"
                          >
                            {product.hide_price ? (
                                <>
                                  {product.currency} *******
                                </>
                              ) : (
                                <>
                                  {product.currency} {typeof product.price === "number" ? product.price.toLocaleString("en-IN") : product.price}
                                </>
                              )
                            }
                          </td>
                        );
                      if (field.isRating)
                        return (
                          <td key={idx} className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1">
                              {product.ratings > 0 ? product.ratings.toFixed(1) : 'N/A'}
                              {product.ratings > 0 && (
                                <span className="text-yellow-400 ml-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`inline w-4 h-4 ${
                                        i < Math.round(product.ratings)
                                          ? "fill-yellow-400"
                                          : "fill-gray-200"
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <polygon points="9.9,1.1 12.3,6.7 18.4,7.5 13.7,11.8 15,17.8 9.9,14.7 4.8,17.8 6.1,11.8 1.4,7.5 7.5,6.7" />
                                    </svg>
                                  ))}
                                </span>
                              )}
                              {product.ratingsCount > 0 && (
                                <span className="text-gray-500 text-xs ml-1">
                                  ({product.ratingsCount})
                                </span>
                              )}
                            </span>
                          </td>
                        );
                      return (
                        <td
                          key={idx}
                          className="py-4 px-4 text-center text-gray-700"
                        >
                          {value ? String(value) : "----"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {products.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          <p className="text-lg mb-4">No products selected for comparison yet.</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add First Product
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-200 transform scale-100 opacity-100 animate-fade-in-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl focus:outline-none"
              onClick={() => {
                setShowModal(false);
                setSearch(""); // Clear search when closing modal
                setSearchResults([]); // Clear search results when closing modal
              }}
              aria-label="Close"
              tabIndex={0}
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-4 text-gray-900 text-center">
              Add Product to Compare
            </h3>
            {selectedCategory && (
              <p className="text-sm text-gray-600 mb-4 text-center">
                Only products from the &quot;<span className="font-semibold">{selectedCategory}</span>&quot; category can be added.
              </p>
            )}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
              aria-label="Search products"
            />
            <div className="max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {loadingSearch ? (
                <div className="text-center py-8 text-gray-500">Loading products...</div>
              ) : searchResults.length === 0 && search.length > 1 ? (
                <div className="text-gray-400 text-center py-8">
                  No products found matching your search.
                </div>
              ) : searchResults.length === 0 && search.length <= 1 ? (
                <div className="text-gray-400 text-center py-8">
                  Start typing to search for products.
                </div>
              ) : (
                searchResults.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors duration-200 my-2
                      ${product.category_name !== selectedCategory && selectedCategory !== null
                        ? "bg-gray-100 opacity-60 cursor-not-allowed"
                        : "hover:bg-green-50"
                      }`}
                    onClick={() => {
                      if (product.category_name === selectedCategory || selectedCategory === null) {
                        handleAddProduct(product);
                      } else {
                        toast.error(`This product is from a different category (${product.category_name}).`);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Add ${product.name}`}
                  >
                    <div className="w-16 h-16 relative flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                      <Image
                        src={product.images[0]?.image || "/images/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-base truncate">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {product.subcategory_name || product.description}
                      </div>
                      {product.category_name && (
                        <div className="text-xs text-gray-400 mt-1">Category: {product.category_name}</div>
                      )}
                    </div>
                    <span className="text-green-600 font-semibold flex-shrink-0 text-base">
                      {product.hide_price ? "₹ *******" : `₹ ${product.price}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparePage;
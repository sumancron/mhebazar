"use client";
import React, { useState, ChangeEvent } from "react";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { ProductCardContainer } from "@/components/elements/Product";
import { Plus } from "lucide-react";
import Image from "next/image";

type Product = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price: string | number;
  currency: string;
  ratings: number;
  ratingsCount: number;
  soldBy: string;
  brand: string;
  typeSize: string;
  rimSize: string;
  vehicleType: string;
};

const fallbackProducts: Product[] = [
  {
    id: 1,
    image: "/images/products/oil-filter.jpg",
    title: "Mhe Bazar Engine Oil Filter D141099 – Fits Doosan...",
    subtitle: "",
    price: "*******",
    currency: "₹",
    ratings: 4.2,
    ratingsCount: 65,
    soldBy: "SFS",
    brand: "GRI",
    typeSize: "STD 21X8.9(200/75-9)",
    rimSize: "6.00F-9",
    vehicleType: "Forklift",
  },
  {
    id: 2,
    image: "/images/products/tyre1.jpg",
    title: "Sfs Forklift Tyres GRI Non-marking Solid Tyre",
    subtitle: "",
    price: "*******",
    currency: "₹",
    ratings: 4.2,
    ratingsCount: 65,
    soldBy: "SFS",
    brand: "GRI",
    typeSize: "STD 21X8.9(200/75-9)",
    rimSize: "6.00F-9",
    vehicleType: "Forklift",
  },
  {
    id: 3,
    image: "/images/products/tyre2.jpg",
    title: "Sfs Forklift Tyres GRI Non-marking Solid Tyre",
    subtitle: "",
    price: "*******",
    currency: "₹",
    ratings: 4.2,
    ratingsCount: 65,
    soldBy: "SFS",
    brand: "GRI",
    typeSize: "STD 21X8.9(200/75-9)",
    rimSize: "6.00F-9",
    vehicleType: "Forklift",
  },
];

const tableFields = [
  { label: "Price", key: "price", isCurrency: true },
  { label: "Customer Ratings", key: "ratings", isRating: true },
  { label: "Sold by", key: "soldBy" },
  { label: "Brand", key: "brand" },
  { label: "Type Size", key: "typeSize" },
  { label: "Rim Size", key: "rimSize" },
  { label: "Vehicle Type", key: "vehicleType" },
];

const mockSearchProducts: Product[] = [
  {
    id: 4,
    image: "/images/products/tyre3.jpg",
    title: "Apollo Forklift Tyre",
    subtitle: "",
    price: "*******",
    currency: "₹",
    ratings: 4.0,
    ratingsCount: 12,
    soldBy: "Apollo",
    brand: "Apollo",
    typeSize: "STD 21X8.9(200/75-9)",
    rimSize: "6.00F-9",
    vehicleType: "Forklift",
  },
  // Add more mock products if needed
];

const maxColumns = 4;

const ComparePage = () => {
  const [products, setProducts] = useState<Product[]>([...fallbackProducts]);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>(mockSearchProducts);

  // Add product from modal
  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
    setShowModal(false);
    setSearch("");
    setSearchResults(mockSearchProducts);
  };

  // Remove product (optional, for swapping)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleRemoveProduct = (idx: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Search filter (mock)
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSearchResults(
      mockSearchProducts.filter((p) =>
        p.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

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
        <div className="flex flex-wrap gap-6 justify-start md:justify-normal overflow-x-auto pb-2">
          {displayProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <ProductCardContainer
                id={product.id}
                image={product.image}
                title={product.title}
                subtitle={product.subtitle}
                price={product.price}
                currency={product.currency}
              />
            </div>
          ))}
          {/* Add Product Card */}
          {displayProducts.length < maxColumns && (
            <div
              onClick={() => setShowModal(true)}
              className="flex-shrink-0 w-72 h-[370px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-all duration-200"
              tabIndex={0}
              role="button"
              aria-label="Add Product"
            >
              <Plus className="w-10 h-10 text-green-500 mb-2" />
              <span className="text-green-600 font-semibold text-lg">Add Product</span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="w-full px-2 sm:px-8 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="py-4 px-4 text-left font-semibold text-gray-700 bg-gray-50 w-44 rounded-tl-xl">
                  {/* Empty for row labels */}
                </th>
                {Array.from({ length: maxColumns }).map((_, idx) => (
                  <th
                    key={idx}
                    className={`py-4 px-4 text-center font-semibold text-gray-700 bg-gray-50 min-w-[180px] ${
                      idx === maxColumns - 1 ? "rounded-tr-xl" : ""
                    }`}
                  >
                    {displayProducts[idx]?.title ? (
                      <span className="block truncate text-gray-900 font-semibold text-base">
                        {displayProducts[idx].title}
                      </span>
                    ) : (
                      <span className="text-gray-400">---</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableFields.map((field) => (
                <tr key={field.key} className="border-t last:border-b">
                  <td className="py-4 px-4 font-medium text-gray-700 bg-gray-50">
                    {field.label}
                  </td>
                  {Array.from({ length: maxColumns }).map((_, idx) => {
                    const product = displayProducts[idx];
                    const value = product?.[field.key as keyof Product];
                    if (!product)
                      return (
                        <td
                          key={idx}
                          className="py-4 px-4 text-center text-gray-400"
                        >
                          ----
                        </td>
                      );
                    if (field.isCurrency)
                      return (
                        <td
                          key={idx}
                          className="py-4 px-4 text-center font-semibold text-green-600"
                        >
                          {product.currency} {product.price}
                        </td>
                      );
                    if (field.isRating)
                      return (
                        <td key={idx} className="py-4 px-4 text-center">
                          <span className="inline-flex items-center gap-1">
                            {product.ratings}
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
                            <span className="text-gray-500 text-xs ml-1">
                              ({product.ratingsCount})
                            </span>
                          </span>
                        </td>
                      );
                    return (
                      <td
                        key={idx}
                        className="py-4 px-4 text-center text-gray-700"
                      >
                        {value || "----"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl focus:outline-none"
              onClick={() => setShowModal(false)}
              aria-label="Close"
              tabIndex={0}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              Add Product to Compare
            </h3>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={handleSearch}
              className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="max-h-64 overflow-y-auto">
              {searchResults.length === 0 && (
                <div className="text-gray-400 text-center py-8">
                  No products found.
                </div>
              )}
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => handleAddProduct(product)}
                  tabIndex={0}
                  role="button"
                  aria-label={`Add ${product.title}`}
                >
                  <div className="w-12 h-12 relative flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain rounded border"
                      sizes="48px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {product.subtitle}
                    </div>
                  </div>
                  <span className="text-green-600 font-semibold flex-shrink-0">
                    {product.currency} {product.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ComparePage;
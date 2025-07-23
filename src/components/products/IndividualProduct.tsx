"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Truck,
  Headphones,
  CreditCard,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

type ProductData = {
  title: string;
  subtitle: string;
  price: number;
  priceWithTax: number;
  currency: string;
  images: string[];
  offers: { label: string; desc: string; extra: string }[];
  vendorOffers: { label: string; desc: string; extra: string }[];
  rating: number;
  reviews: number;
  brand: string;
  stock: number;
  delivery: string;
  description: string;
  specification: string;
  vendor: string;
};

const placeholderData: ProductData = {
  title: "MHE Bazar Engine Oil Filter D141099 – Fits Doosan Forklifts",
  subtitle: "Best for Doosan, Toyota, Komatsu, Hyundai, and more",
  price: 398.52,
  priceWithTax: 470.25,
  currency: "₹",
  images: [
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=700&h=700&fit=crop",
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=700&h=700&fit=crop&sat=50",
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=700&h=700&fit=crop&sat=80",
    "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=700&h=700&fit=crop&sat=120",
  ],
  offers: [
    {
      label: "Cashback",
      desc: "Upto ₹260.00 cashback when you pay with selected Credit Cards",
      extra: "+ 3 offers",
    },
  ],
  vendorOffers: [
    {
      label: "Vendor Offer",
      desc: "Get GST Invoice and save up to 28% on business purchases.",
      extra: "+ 1 offers",
    },
  ],
  rating: 4.8,
  reviews: 35,
  brand: "MHE Bazar",
  stock: 1,
  delivery: "FREE delivery Thursday, 12 June to Ernakulam 682505. Order within 6 hrs 11 mins.",
  description: `MHE Bazar MHLB08500 80V 500Ah Lithium-Ion Battery is a high-capacity energy solution designed for efficient and eco-friendly performance in material handling systems. Built by Greentech India Material Handling LLP, this battery delivers consistent power output, faster charging, and long service life. Ideal for forklifts, cranes, and other industrial machines, it reduces downtime and enhances productivity. The lithium-ion technology ensures zero maintenance, emission-free operation, and greater energy efficiency, making it a reliable upgrade from traditional lead-acid systems.`,
  specification: "Voltage: 80V\nCapacity: 500Ah\nType: Lithium-Ion\nWarranty: 5 Years",
  vendor: "Greentech India Material Handling LLP",
};

export default function ProductSection({ slug }: { slug: string }) {
  const [data, setData] = useState<ProductData | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [openAccordion, setOpenAccordion] = useState<"desc" | "spec" | "vendor" | null>("desc");

  // Fetch product data (simulate API)
  useEffect(() => {
    // Simulate API call
    async function fetchData() {
      try {
        // const res = await fetch(`/products/${slug}`);
        // if (!res.ok) throw new Error("No data");
        // const prod = await res.json();
        // setData(prod);
        // Simulate API fail
        throw new Error("API not available");
      } catch {
        setData(placeholderData);
      }
    }
    fetchData();
  }, [slug]);

  if (!data) {
    // Loading skeleton
    return (
      <div className="animate-pulse p-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="bg-gray-200 rounded-lg w-full md:w-96 h-96 mb-4" />
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4 bg-white">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Side - Product Images */}
        <div className="flex flex-row-reverse gap-2 lg:gap-4 w-full md:w-fit">
          {/* Main Product Image */}
          <div
            className="relative bg-gray-50 rounded-lg overflow-hidden aspect-square w-full max-w-[420px] mx-auto"
            onMouseMove={e => {
              if (isZoomed) {
                const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - left) / width) * 100;
                const y = ((e.clientY - top) / height) * 100;
                setPosition({ x, y });
              }
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={data.images[selectedImage]}
              alt={data.title}
              className="h-full object-contain transition-transform duration-200 ease-out"
              width={700}
              height={700}
              style={{
                transform: isZoomed ? "scale(2)" : "scale(1)",
                transformOrigin: `${position.x}% ${position.y}%`,
              }}
              priority
            />
            {/* Top right icons */}
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <button
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </button>
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          {/* Thumbnail Images */}
          <div className="flex flex-col gap-2">
            {data.images.map((thumb, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-16 h-16 rounded border-2 overflow-hidden ${
                  selectedImage === index ? "border-orange-500" : "border-gray-200"
                } hover:border-orange-300 transition-colors`}
              >
                <Image
                  src={thumb}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                  width={100}
                  height={100}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="space-y-6 w-full">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3">
              {/* Product Title */}
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">{data.title}</h1>
              <div className="text-base text-gray-600 mb-2">{data.subtitle}</div>
              {/* Rating and Reviews */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">({data.rating})</span>
                </div>
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  Reviews ({data.reviews})
                </span>
                <span className="text-sm text-gray-600">by {data.brand}</span>
              </div>
              {/* Green dots indicator */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-green-500 rounded-full" />
                ))}
              </div>
              {/* Price */}
              <div className="mb-2">
                <span className="text-2xl font-bold text-green-700">{data.currency}{data.price.toLocaleString()} </span>
                <span className="text-gray-500 text-base line-through ml-2">{data.currency}{data.priceWithTax.toLocaleString()}</span>
                <span className="ml-2 text-xs text-green-700 font-semibold">You Save: {data.currency}{(data.priceWithTax - data.price).toFixed(2)}</span>
              </div>
              <div className="text-xs text-gray-500 mb-2">Incl. of all taxes</div>
              {/* Offers Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Offers</h3>
                  <div className="flex gap-1">
                    <ChevronLeft className="w-5 h-5 text-gray-400" />
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.offers.map((offer, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="bg-gray-100 text-gray-700 text-xs mb-3 font-normal px-2 py-1 rounded inline-block">
                        {offer.label}
                      </div>
                      <p className="font-semibold text-sm mb-1">{offer.desc}</p>
                      <p className="text-xs text-green-600 font-medium">{offer.extra}</p>
                    </div>
                  ))}
                  {data.vendorOffers.map((offer, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="bg-gray-100 text-gray-700 text-xs mb-3 font-normal px-2 py-1 rounded inline-block">
                        {offer.label}
                      </div>
                      <p className="font-semibold text-sm mb-1">{offer.desc}</p>
                      <p className="text-xs text-green-600 font-medium">{offer.extra}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Delivery & Actions */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              {/* Delivery Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="font-semibold text-green-800">
                    <span className="font-bold">FREE delivery</span> Thursday, 12 June to Ernakulam 682505. Order within 6 hrs 11 mins.{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">Details</span>
                  </p>
                  <p className="text-sm font-semibold text-green-800 mt-3">
                    <span className="font-bold">Only {data.stock} left in stock.</span>
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md text-base transition">
                  Add to Cart
                </button>
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md text-base transition">
                  Buy Now
                </button>
                <button className="w-full border border-gray-300 text-gray-700 font-semibold py-3 rounded-md text-base hover:bg-gray-50 transition">
                  Compare
                </button>
              </div>
            </div>
          </div>
          {/* Features Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-xs mb-1">Worldwide Delivery</p>
              <p className="text-xs text-gray-600">We deliver products globally</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Headphones className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-xs mb-1">Support 24/7</p>
              <p className="text-xs text-gray-600">Reach our experts today!</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-xs mb-1">First Purchase Discount</p>
              <p className="text-xs text-gray-600">Up to 15% discount</p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <RotateCcw className="w-6 h-6 text-blue-600" />
              </div>
              <p className="font-semibold text-xs mb-1">Easy Returns</p>
              <p className="text-xs text-gray-600">Read our return policy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion Section */}
      <div className="mt-8">
        {/* Description */}
        <div className="border rounded-lg mb-4 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => setOpenAccordion(openAccordion === "desc" ? null : "desc")}
          >
            <span className="font-semibold">Description</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${openAccordion === "desc" ? "rotate-180" : ""}`} />
          </button>
          {openAccordion === "desc" && (
            <div className="px-4 py-3 text-gray-700 text-sm whitespace-pre-line">{data.description}</div>
          )}
        </div>
        {/* Specification */}
        <div className="border rounded-lg mb-4 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => setOpenAccordion(openAccordion === "spec" ? null : "spec")}
          >
            <span className="font-semibold">Specification</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${openAccordion === "spec" ? "rotate-180" : ""}`} />
          </button>
          {openAccordion === "spec" && (
            <div className="px-4 py-3 text-gray-700 text-sm whitespace-pre-line">{data.specification}</div>
          )}
        </div>
        {/* Vendor */}
        <div className="border rounded-lg mb-4 overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition"
            onClick={() => setOpenAccordion(openAccordion === "vendor" ? null : "vendor")}
          >
            <span className="font-semibold">Vendor</span>
            <ChevronDown className={`w-5 h-5 transition-transform ${openAccordion === "vendor" ? "rotate-180" : ""}`} />
          </button>
          {openAccordion === "vendor" && (
            <div className="px-4 py-3 text-gray-700 text-sm whitespace-pre-line">{data.vendor}</div>
          )}
        </div>
      </div>
    </div>
  );
}
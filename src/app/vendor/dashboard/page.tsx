"use client";
import { useState } from "react";
import { ShoppingCart, Download, FileText } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AddProductForm from "@/components/forms/product/AddProduct";
import React from "react";

const products = [
  {
    id: 1,
    name: "3 Ton Lithium Forklift Truck with Fast Charger",
    category: "Forklift",
    image: "",
    isOld: true,
  },
  {
    id: 2,
    name: "2 Ton Lithium Forklift Truck with Fast Charger",
    category: "Forklift",
    image: "",
    isNew: true,
  },
  {
    id: 3,
    name: "2 Ton Lithium Powered Battery Operated Pallet Truck",
    category: "Electric Pallet Truck (BOPT)",
    image: "",
    isNew: true,
  },
  {
    id: 4,
    name: "Lithium Powered Electric Stacker",
    category: "Forklift",
    image: "",
    isOld: true,
  },
];

const topSearchedProducts = [
  {
    id: 1,
    name: "Forklift Attachments",
    image: "",
  },
  {
    id: 2,
    name: "Hand Pallet Truck",
    image: "",
  },
  {
    id: 3,
    name: "Electric Pallet Truck (BOPT)",
    image: "",
  },
  {
    id: 4,
    name: "Platform Truck",
    image: "",
  },
  {
    id: 5,
    name: "Scissors Lift",
    image: "",
  },
];

function getImageSrc(src?: string) {
  return src && src !== "" ? src : "/no-product.png";
}

export default function DashboardStats() {
  const [open, setOpen] = useState(false);
  return (
    <>
    
    <AddProductForm open={open} onClose={() => setOpen(false)} />
   
    <div className="space-y-8 px-2 sm:px-6 py-6 max-w-7xl mx-auto">
        
      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 bg-gradient-to-r from-green-50 to-green-100 border-0 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">50</h2>
              <p className="text-gray-500 mt-1">No. of Products Added</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-0 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">250</h2>
              <p className="text-gray-500 mt-1">Offer downloaded</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-full">
              <Download className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-0 shadow-none">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">60</h2>
              <p className="text-gray-500 mt-1">Number of queries</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-full">
              <FileText className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ActionCard
          title="Sell New Products"
          description="List your products and start selling in minutes."
          image=""
        />
        <ActionCard
          title="Sell Old Products"
          description="List your products and start selling in minutes."
          image=""
        />
        <ActionCard
          title="Rent Products"
          description="List your products and start selling in minutes."
          image="/no-product.png"
        />
      </div>

      {/* Product List & Top Searched */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Product List */}
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Product List</h2>
              <Button
              onClick={() => setOpen(true)}
                variant="default"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded flex items-center gap-2"
              >
                + Add Product
              </Button>
            </div>
            <div className="space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow transition"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="h-20 w-20 relative flex-shrink-0">
                      <Image
                        src={getImageSrc(product.image)}
                        alt={product.name}
                        fill
                        className="object-contain rounded"
                        sizes="80px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/no-product.png";
                        }}
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded font-medium">
                          Approve
                        </span>
                        <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded font-medium">
                          {product.category}
                        </span>
                        {product.isNew && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded font-medium">
                            New
                          </span>
                        )}
                        {product.isOld && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded font-medium">
                            Old
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <Button variant="link" className="text-blue-600 px-0 py-0 h-auto text-sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full font-semibold text-green-600 border-green-600 hover:bg-green-50">
              View All
            </Button>
          </div>
        </div>
        {/* Top Searched Products */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Top Searched Products</h2>
            <Button variant="link" className="text-green-600 font-semibold px-0">
              View more
            </Button>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-2 space-y-2">
            {topSearchedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="h-12 w-12 relative flex-shrink-0">
                  <Image
                    src={getImageSrc(product.image)}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                    sizes="48px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/no-product.png";
                    }}
                  />
                </div>
                <span className="font-medium text-gray-900 truncate">{product.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
     </>
  );
}

// ActionCard component for the action buttons
function ActionCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow transition">
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      </div>
      <div className="h-14 w-14 relative flex-shrink-0 ml-4">
        <Image
          src={getImageSrc(image)}
          alt={title}
          fill
          className="object-contain rounded"
          sizes="56px"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/no-product.png";
          }}
        />
      </div>
    </div>
  );
}
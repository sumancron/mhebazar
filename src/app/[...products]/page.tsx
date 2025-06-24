"use client";

import React, { useState } from 'react';
import { Grid, List, X } from 'lucide-react';
import { ProductCardContainer } from '@/components/elements/Product';
import FilterSidebar from '@/components/products/SideFilter';
import Image from "next/image";

// Types
interface Product {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
}

// Enhanced dummy products for demonstration
const dummyProducts: Product[] = [
  {
    id: '1',
    image: '/api/placeholder/300/300',
    title: 'She Forklift Tyres Oil Non-marking Solid Tyre',
    subtitle: 'Premium quality non-marking solid tyre for forklifts',
    price: 4500,
    currency: '₹'
  },
  {
    id: '2',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Engine Oil Filter 0-414589 - Fits Doosan',
    subtitle: 'High-performance engine oil filter for industrial vehicles',
    price: 2018,
    currency: '₹'
  },
  {
    id: '3',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Forklift Forks Chains Conex 1070-54004',
    subtitle: 'Durable forklift fork chains for heavy-duty operations',
    price: 12000,
    currency: '₹'
  },
  {
    id: '4',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Metal Battery For 2-3 Ton Electric Forklifts',
    subtitle: 'Long-lasting metal battery for electric forklifts',
    price: 45000,
    currency: '₹'
  },
  {
    id: '5',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Forklift Lower Drive - Durable Plastic',
    subtitle: 'Robust plastic lower drive component for forklifts',
    price: 3500,
    currency: '₹'
  },
  {
    id: '6',
    image: '/api/placeholder/300/300',
    title: 'She Forklift Tyres Oil Non-marking Solid Tyre Premium',
    subtitle: 'Advanced non-marking solid tyre technology',
    price: 5200,
    currency: '₹'
  },
  {
    id: '7',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Thrust, Knuckle & Joint Ring Bearings For',
    subtitle: 'Professional grade thrust and joint ring bearings',
    price: 2100,
    currency: '₹'
  },
  {
    id: '8',
    image: '/api/placeholder/300/300',
    title: 'She Forklift Tyres Oil Non-marking Solid Tyre',
    subtitle: 'Industrial grade non-marking solid tyre',
    price: 4800,
    currency: '₹'
  },
  {
    id: '9',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Solid Tyres For Forklifts - Multiple Sizes',
    subtitle: 'Versatile solid tyres available in multiple sizes',
    price: 6000,
    currency: '₹'
  },
  {
    id: '10',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Forklift Biometric System With Fingerprint',
    subtitle: 'Advanced biometric security system for forklifts',
    price: 11999,
    currency: '₹'
  },
  {
    id: '11',
    image: '/api/placeholder/300/300',
    title: 'Mhe Bazar Beacon Lamp With Silent LPG DC Led',
    subtitle: 'Energy-efficient LED beacon lamp with silent operation',
    price: 3900,
    currency: '₹'
  },
  {
    id: '12',
    image: '/api/placeholder/300/300',
    title: 'She Forklift Tyres Oil Non-marking Solid Tyre',
    subtitle: 'Professional non-marking solid tyre solution',
    price: 4700,
    currency: '₹'
  }
];

// Product Grid Component
interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
}

function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-48 h-32 flex-shrink-0 relative">
              <Image
                src={product.image}
                alt={product.title}
                width={300}
                height={300}
                className="object-cover w-full h-48 rounded-t-lg"
              />
            </div>
            <div className="flex-1 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {product.subtitle}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {product.currency} {product.price.toLocaleString()}
                </span>
                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md transition-colors duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCardContainer
          key={product.id}
          image={product.image}
          title={product.title}
          subtitle={product.subtitle}
          price={product.price}
          currency={product.currency}
        />
      ))}
    </div>
  );
}

// Loading Component

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
          <div className="bg-gray-200 h-48"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded mb-4 w-1/2"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Main Products Page Component
export default function ProductsPage() {
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [products] = useState<Product[]>(dummyProducts);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const handleViewChange = (view: 'grid' | 'list') => {
    setCurrentView(view);
  };

  const handleFilterChange = (filterId: string) => {
    const newSelected = new Set(selectedFilters);
    if (newSelected.has(filterId)) {
      newSelected.delete(filterId);
    } else {
      newSelected.add(filterId);
    }
    setSelectedFilters(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Desktop */}
        <div className="hidden lg:block flex-shrink-0">
          <FilterSidebar
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Sidebar Mobile Drawer */}
        <div
          className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 lg:hidden ${
            mobileFilterOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileFilterOpen(false)}
        >
          <aside
            className={`absolute left-0 top-0 h-full w-72 bg-white shadow-xl transition-transform duration-300 ${
              mobileFilterOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold text-lg">Filter</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
            />
          </aside>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Controls */}
          <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium inline-block mb-1">
                  New Arrivals
                </div>
                <p className="text-xs text-gray-500">Showing 1-24 of 94</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select className="p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white">
                    <option>Relevance</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest First</option>
                    <option>Customer Rating</option>
                  </select>
                </div>
                {/* View Toggle */}
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleViewChange('grid')}
                    className={`p-2 transition ${
                      currentView === 'grid'
                        ? 'bg-green-500 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewChange('list')}
                    className={`p-2 transition ${
                      currentView === 'list'
                        ? 'bg-green-500 text-white'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
                {/* Mobile Filter Button */}
                <button
                  className="lg:hidden flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md shadow transition"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 7a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                  </svg>
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="p-4 sm:p-6">
            <ProductGrid products={products} viewMode={currentView} />

            {/* Pagination */}
            {products.length > 0 && (
              <div className="mt-10 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
                    1
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                    2
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                    3
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                    4
                  </button>
                  <span className="px-2 text-gray-500">...</span>
                  <button className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500">
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
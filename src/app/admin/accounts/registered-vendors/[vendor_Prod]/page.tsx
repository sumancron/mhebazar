"use client";

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Mail, Eye, FileSpreadsheet } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const VendorProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Latest');
  const [showCount, setShowCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Sample product data
  const allProducts = useMemo(() => [
    {
      id: 1,
      title: "Lithium-Iron Battery",
      category: "Battery",
      subCategory: "Lithium-Iron Battery",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-01-15'),
      approved: true
    },
    {
      id: 2,
      title: "MHE Bazar Used Toyota 2.5t Electric (lead-acid) Forklift (model-7fbmf25) 2500kg 7FBMF25",
      category: "Forklift",
      subCategory: "Electric Lead-Acid Forklift",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-01-20'),
      approved: true
    },
    {
      id: 3,
      title: "Used Bt Sit Down Reach Truck (model-rrb2) 1600kg RRB2",
      category: "Reach Truck",
      subCategory: "Sit Down Reach Truck",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-01-25'),
      approved: true
    },
    {
      id: 4,
      title: "Used Toyota 2t Electric (lead-acid) Forklift (model-7fbmf20) 2000kg 7FBMF20",
      category: "Forklift",
      subCategory: "Electric Lead-Acid Forklift",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-01-30'),
      approved: true
    },
    {
      id: 5,
      title: "Used Toyota 3t Diesel Forklift (model-fdzn30) 3000kg FDZN30",
      category: "Forklift",
      subCategory: "Diesel Forklift",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-02-05'),
      approved: true
    },
    {
      id: 6,
      title: "High Capacity Lithium Battery Pack",
      category: "Battery",
      subCategory: "Lithium-Iron Battery",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 5,
      dateAdded: new Date('2024-02-10'),
      approved: false
    },
    {
      id: 7,
      title: "Electric Pallet Jack 2000kg",
      category: "Forklift",
      subCategory: "Electric Lead-Acid Forklift",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 3,
      dateAdded: new Date('2024-02-15'),
      approved: true
    },
    {
      id: 8,
      title: "Stand-up Reach Truck 1500kg",
      category: "Reach Truck",
      subCategory: "Stand Up Reach Truck",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-02-20'),
      approved: true
    },
    {
      id: 9,
      title: "Warehouse Battery Charger",
      category: "Battery",
      subCategory: "Battery Charger",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 4,
      dateAdded: new Date('2024-02-25'),
      approved: true
    },
    {
      id: 10,
      title: "Heavy Duty Forklift 5000kg",
      category: "Forklift",
      subCategory: "Diesel Forklift",
      status: "Available",
      image: "/api/placeholder/60/60",
      rating: 5,
      dateAdded: new Date('2024-03-01'),
      approved: true
    }
  ], []);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = allProducts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Latest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'Oldest':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'Name A-Z':
          return a.title.localeCompare(b.title);
        case 'Name Z-A':
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allProducts, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / showCount);
  const startIndex = (currentPage - 1) * showCount;
  const endIndex = startIndex + showCount;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, showCount]);

  // Get unique categories for filter
  const categories = ['All', ...new Set(allProducts.map(product => product.category))];

  // Calculate stats
  const totalProducts = allProducts.length;
  const notApprovedCount = allProducts.filter(product => !product.approved).length;

  // Handle pagination
  const handlePageChange = (newPage:number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(currentProducts.map(product => product.id)));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual product selection
  const handleProductSelect = (productId:number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
    setSelectAll(newSelected.size === currentProducts.length);
  };

  // Handle approve selected products
  const handleApproveSelected = () => {
    if (selectedProducts.size === 0) {
      alert('Please select products to approve');
      return;
    }
    alert(`Approved ${selectedProducts.size} products`);
    setSelectedProducts(new Set());
    setSelectAll(false);
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    const dataToExport = selectedProducts.size > 0
      ? filteredAndSortedProducts.filter(product => selectedProducts.has(product.id))
      : filteredAndSortedProducts;

    alert(`Exporting ${dataToExport.length} products to Excel`);
  };

  // Handle send email
  const handleSendEmail = (productId:number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      alert(`Sending email for: ${product.title}`);
    } else {
      alert('Product not found');
    }
  };

  // Handle view product
  const handleViewProduct = (productId:number) => {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
      alert(`Viewing product: ${product.title}`);
    } else {
      alert('Product not found');
    }
  };

  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-2 h-2 rounded-full ${star <= rating ? 'bg-green-500' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  const PaginationButton = ({ onClick, disabled, children, isActive = false }: { onClick: () => void, disabled: boolean, children: React.ReactNode, isActive?: boolean }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-md text-sm transition-colors ${isActive
          ? 'bg-green-600 text-white hover:bg-green-700'
          : disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-50 p-6 overflow-y-auto">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">MHE Bazar</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleApproveSelected}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2 transition-colors"
            >
              <span>✓</span>
              <span>Approve</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export as Excel</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <button className="text-gray-900 font-medium border-b-2 border-blue-500 pb-1">
                  All
                </button>
                <span className="text-sm text-gray-600">Total Products: {totalProducts}</span>
                <span className="text-sm text-gray-600">Not Approved: {notApprovedCount}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Filter</span>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by</span>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Latest">Latest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Name A-Z">Name A-Z</option>
                  <option value="Name Z-A">Name Z-A</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={showCount}
                  onChange={(e) => setShowCount(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-1/3">Title</TableHead>
                <TableHead className="w-1/6">Category</TableHead>
                <TableHead className="w-1/6">Sub-category</TableHead>
                <TableHead className="w-1/12">Status</TableHead>
                <TableHead className="w-1/4 text-right">Enquiry Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-gray-700">IMG</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">
                            {product.title}
                          </h3>
                          <StarRating rating={product.rating} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.category}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.subCategory}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{product.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleSendEmail(product.id)}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 flex items-center space-x-1 transition-colors"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Send email</span>
                        </button>
                        <button
                          onClick={() => handleViewProduct(product.id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 flex items-center space-x-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No products found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center space-x-2">
            <PaginationButton
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationButton>

            {/* Page numbers */}
            {currentPage > 2 && totalPages > 4 && (
              <>
                <PaginationButton
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                  disabled={false}
                >
                  1
                </PaginationButton>
                {currentPage > 3 && totalPages > 5 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </>
            )}

            {Array.from({ length: totalPages }, (_, idx) => idx + 1)
              .filter(p => p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1))
              .map((p) => (
                <PaginationButton
                  key={p}
                  onClick={() => handlePageChange(p)}
                  isActive={currentPage === p}
                  disabled={false}
                >
                  {p}
                </PaginationButton>
              ))}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <span className="px-2 text-gray-400">...</span>
            )}
            {currentPage < totalPages - 1 && totalPages > 4 && (
              <PaginationButton
                onClick={() => handlePageChange(totalPages)}
                isActive={currentPage === totalPages}
                disabled={false}
              >
                {totalPages}
              </PaginationButton>
            )}

            <PaginationButton
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationButton>
          </div>

          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} entries
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
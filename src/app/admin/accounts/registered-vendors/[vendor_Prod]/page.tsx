"use client";

import React, { useState, useMemo, useEffect } from 'react';
// Correctly import useSearchParams
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, FileSpreadsheet, Trash2, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import api from '@/lib/api';

const VendorProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('Latest');
  const [showCount, setShowCount] = useState(10);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Use useSearchParams to get the vendor ID from the query string
  const searchParams = useSearchParams();
  const router = useRouter();
  const vendorId = searchParams.get('user');

  // Fetch products for the specific vendor
  useEffect(() => {
    if (!vendorId) {
      setError("Vendor ID is missing from the URL query parameter.");
      setLoading(false);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await api.get(`products/?user=${vendorId}`);

        // ✅ FIX: Ensure the API response is an array before setting state
        if (Array.isArray(response.data.results)) {
          setProducts(response.data.results);
        } else {
          // Log a warning and set an empty array if the response is not as expected
          console.warn("API response for products was not an array:", response.data.results);
          setProducts([]);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Could not load vendor products. Please try again later.");
        toast.error("Failed to fetch products!");
        setProducts([]); // Also ensure products is an array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [vendorId]); // Re-fetch if vendorId from the query string changes

  console.log(products)

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category_name === selectedCategory);
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'Latest': return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'Oldest': return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'Name A-Z': return a.name.localeCompare(b.name);
        case 'Name Z-A': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });
  }, [products, selectedCategory, sortBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / showCount);
  const startIndex = (currentPage - 1) * showCount;
  const endIndex = startIndex + showCount;
  const currentProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // Reset page number when filters change
  useEffect(() => {
    setCurrentPage(1);
    setSelectAll(false);
    setSelectedProducts(new Set());
  }, [selectedCategory, sortBy, showCount]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category_name)))];
  const totalProducts = products.length;
  const notApprovedCount = products.filter(p => !p.is_active).length;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedProducts(new Set(currentProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleProductSelect = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) newSelected.delete(productId);
    else newSelected.add(productId);
    setSelectedProducts(newSelected);
    setSelectAll(newSelected.size === currentProducts.length && currentProducts.length > 0);
  };

  const handleApproveSelected = async () => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products to approve.');
      return;
    }

    try {
      await api.patch('products/bulk-update-status/', {
        ids: Array.from(selectedProducts),
        is_active: true,
      }
      );

      toast.success(`Approved ${selectedProducts.size} products.`);
      setProducts(prev =>
        prev.map(p =>
          selectedProducts.has(p.id) ? { ...p, is_active: true } : p
        )
      );
      setSelectedProducts(new Set());
      setSelectAll(false);
    } catch (err) {
      console.error("Failed to approve products:", err);
      toast.error("An error occurred while approving products.");
    }
  };


  const handleDeleteProduct = async (productId: number, productTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${productTitle}"?`)) {
      try {
        await api.delete(`products/${productId}/`);
        toast.success(`Product "${productTitle}" deleted.`);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        console.error("Failed to delete product:", err);
        toast.error("Failed to delete the product.");
      }
    }
  };

  const handleViewProduct = (productId: number) => {
    router.push(`/admin/products/edit/${productId}`);
  };

  const StarRating = ({ average_rating }: { average_rating: number }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`w-2 h-2 rounded-full ${star <= average_rating ? 'bg-yellow-300' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );

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

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading products...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500 p-4 text-center">{error}</div>;
  }

  return (
    <div className="bg-gray-50 p-6 overflow-y-auto">
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Products</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleApproveSelected}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center space-x-2 transition-colors disabled:bg-gray-400"
              disabled={selectedProducts.size === 0}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approve Selected</span>
            </button>
            <button
              onClick={() => { /* Implement export logic */ }}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center space-x-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export as Excel</span>
            </button>
          </div>
        </div>

        {/* --- START: Implemented Filter Bar --- */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="show-count" className="text-sm text-gray-600">Show</label>
                <select
                  id="show-count"
                  value={showCount}
                  onChange={(e) => setShowCount(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="sort-by" className="text-sm text-gray-600">Sort by</label>
                <select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option>Latest</option>
                  <option>Oldest</option>
                  <option>Name A-Z</option>
                  <option>Name Z-A</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <label htmlFor="category" className="text-sm text-gray-600">Category</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm focus:ring-green-500 focus:border-green-500"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-medium">{totalProducts}</span> products | Pending Approval: <span className="font-medium text-yellow-700">{notApprovedCount}</span>
            </div>
          </div>
        </div>
        {/* --- END: Implemented Filter Bar --- */}


        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12 px-4">
                  <input type="checkbox" className="rounded" checked={selectAll} onChange={handleSelectAll} />
                </TableHead>
                <TableHead className="w-1/3">Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Sub-category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell className="px-4">
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleProductSelect(product.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img src={product.image || ""} alt={product.name} className="w-16 h-16 object-cover rounded-lg bg-gray-200" />
                        <div>
                          <h3 className="font-medium text-gray-900 text-sm leading-tight">
                            {product.name}
                          </h3>
                          <StarRating average_rating={product.average_rating} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell><span className="text-sm text-gray-600">{product.category_name}</span></TableCell>
                    <TableCell><span className="text-sm text-gray-600">{product.subcategory_name}</span></TableCell>
                    <TableCell><span className="text-sm text-gray-600">{product.type}</span></TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.is_active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {product.is_active ? 'Approved' : 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleViewProduct(product.id)} className="p-2 text-gray-500 hover:text-blue-600" title="View/Update Product"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteProduct(product.id, product.name)} className="p-2 text-gray-500 hover:text-red-600" title="Delete Product"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No products found for this vendor.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* --- START: Implemented Pagination --- */}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-gray-600">
            Showing {Math.min(startIndex + 1, filteredAndSortedProducts.length)} to {Math.min(endIndex, filteredAndSortedProducts.length)} of {filteredAndSortedProducts.length} results
          </span>
          <div className="flex items-center space-x-2">
            <PaginationButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </PaginationButton>
            <span className="text-sm text-gray-500">
              Page {currentPage} of {totalPages > 0 ? totalPages : 1}
            </span>
            <PaginationButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
              Next
            </PaginationButton>
          </div>
        </div>
        {/* --- END: Implemented Pagination --- */}

      </div>
    </div>
  );
};

export default VendorProducts;
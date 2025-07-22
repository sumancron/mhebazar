// src/components/elements/Product.tsx
"use client";

import React, { useState, useCallback } from "react";
import { Heart, BarChart3, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import axios from "axios";
import { useUser } from "@/context/UserContext"; // Import useUser hook
import { toast } from "sonner"; // Assuming you have sonner installed for toasts

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price: string | number;
  currency: string;
  directSale: boolean;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  // New props for interaction handlers
  onAddToCart: (productId: number, quantity?: number) => Promise<void>;
  onWishlist: (productId: number) => Promise<void>;
  onCompare: (productData: Record<string, unknown>) => void;
  productData: Record<string, unknown>; // Pass the whole product data for comparison
}

const ProductCard = ({
  id,
  image,
  title,
  subtitle,
  price,
  currency,
  directSale,
  is_active,
  hide_price,
  stock_quantity,
  onAddToCart,
  onWishlist,
  onCompare,
  productData,
}: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showIcons, setShowIcons] = useState(false);

  const isAvailable = is_active && (!directSale || stock_quantity > 0);

  const handleAddToCartClick = useCallback(async () => {
    if (!isAvailable) {
      toast.error("Product is not available for purchase.");
      return;
    }
    try {
      await onAddToCart(id, 1);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  }, [id, isAvailable, onAddToCart]);

  const handleWishlistClick = useCallback(async () => {
    try {
      await onWishlist(id);
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist!" : "Added to wishlist!");
    } catch (error) {
      console.error("Failed to add/remove from wishlist:", error);
      toast.error("Failed to update wishlist. Please try again.");
    }
  }, [id, isWishlisted, onWishlist]);

  const handleCompareClick = useCallback(() => {
    const dataToCompare = { ...productData };
    if (hide_price) {
      delete dataToCompare.price; // Ensure price is not sent if hidden
    }
    onCompare(dataToCompare);
    toast.info("Product added to comparison!");
  }, [hide_price, onCompare, productData]);

  return (
    <div
      className={`bg-white border border-gray-200 shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-200 flex flex-col items-start p-px w-full max-w-xs sm:max-w-sm md:w-80 h-auto box-border isolate ${
        !isAvailable ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onMouseEnter={() => setShowIcons(true)}
      onMouseLeave={() => setShowIcons(false)}
    >
      {/* Image Container */}
      <div className="relative bg-gray-50 p-2 sm:p-4 w-full flex-shrink-0 h-48 sm:h-[60%] flex justify-center items-center">
        {/* Action Icons */}
        <div
          className={`absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-2 z-10 transition-opacity duration-300 ${
            showIcons ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={handleWishlistClick}
            className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Add to wishlist"
            disabled={!isAvailable}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          <button
            onClick={handleCompareClick}
            className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Compare"
            disabled={!isAvailable}
          >
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/products/${id}`} className="flex justify-center items-center h-full w-full">
          <Image
            src={image}
            alt={title}
            className="max-w-full max-h-full object-contain"
            width={200}
            height={400}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between w-full h-auto md:h-[40%]">
        <div>
          <Link href={`/products/${id}`}>
            <h3 className="text-base sm:text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-green-700 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mb-3 line-clamp-1">{subtitle}</p>

          {/* Price */}
          {!hide_price && (
            <div className="mb-4">
              <span className="text-lg font-semibold text-green-600">
                {currency} {typeof price === 'number' ? price.toLocaleString('en-IN') : price}
              </span>
            </div>
          )}
        </div>

        {/* Action Button: Conditional based on directSale, availability, and hide_price */}
        {directSale ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={handleAddToCartClick}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-md transition-colors text-sm sm:text-base flex items-center justify-center gap-2"
              aria-label="Add to cart"
              disabled={!isAvailable}
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
            <button
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-md transition-colors text-sm sm:text-base"
              aria-label="Buy now"
              disabled={!isAvailable}
            >
              Buy Now
            </button>
            {!isAvailable && ( // Show "Get a Quote" if direct sale but unavailable
              <button
                onClick={() => toast.info('Request a quote logic here!')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-md transition-colors text-sm sm:text-base mt-2"
                aria-label="Get a quote"
              >
                Get a Quote
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => toast.info('Request a quote logic here!')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:py-2.5 sm:px-4 rounded-md transition-colors text-sm sm:text-base"
            aria-label="Get a quote"
            disabled={!is_active} // Disable if not active, even for quote
          >
            Get a Quote
          </button>
        )}
      </div>
    </div>
  );
};

interface ProductCardContainerProps {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price: string | number;
  currency: string;
  directSale: boolean;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
}

export const ProductCardContainer = ({
  id,
  image,
  title,
  subtitle,
  price,
  currency,
  directSale,
  is_active,
  hide_price,
  stock_quantity,
}: ProductCardContainerProps) => {
  const { user } = useUser(); // Get user from context

  const handleAddToCart = async (productId: number, quantity = 1) => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      return;
    }
     //lets print what we are sending to the server
      console.log("Adding to cart:", { product: productId, quantity: quantity });
    try {
      const response = await api.post(`/cart/`, { product: productId, quantity: quantity });
     

      console.log("Added to cart:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || `Failed to add to cart: ${error.response.statusText}`);
      }
      throw new Error("An unexpected error occurred while adding to cart.");
    }
  };

  const handleWishlist = async (productId: number) => {
    if (!user) {
      toast.error("Please log in to add products to your wishlist.");
      return;
    }
    try {
      const response = await api.post(`/wishlist/`, { product: productId });
      console.log("Added to wishlist:", response.data);
      return response.data;
    } catch (error: unknown) {
      console.error("Error adding to wishlist:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Check for specific error like already wishlisted
        if (error.response.status === 400 && error.response.data?.non_field_errors?.[0] === "The fields user, product must make a unique set.") {
            throw new Error("Product is already in your wishlist.");
        }
        throw new Error(error.response.data?.message || `Failed to add to wishlist: ${error.response.statusText}`);
      }
      throw new Error("An unexpected error occurred while adding to wishlist.");
    }
  };

  const handleCompare = (productData: Record<string, unknown>) => {
    const COMPARE_KEY = 'mhe_compare_products';
    if (typeof window !== 'undefined') { // Ensure localStorage is available
        const currentCompare = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
        const existingProduct = currentCompare.find((p: { id: number }) => p.id === id);

        if (!existingProduct) {
            currentCompare.push(productData);
            localStorage.setItem(COMPARE_KEY, JSON.stringify(currentCompare));
            toast.success("Product added to comparison!");
            console.log("Compare products in localStorage:", currentCompare);
        } else {
            toast.info("Product is already in comparison.");
        }
    }
  };

  const productFullData = {
    id,
    image,
    title,
    subtitle,
    price,
    currency,
    direct_sale: directSale,
    is_active,
    hide_price,
    stock_quantity,
  };

  return (
    <ProductCard
      id={id}
      image={image}
      title={title}
      subtitle={subtitle}
      price={price}
      currency={currency}
      directSale={directSale}
      is_active={is_active}
      hide_price={hide_price}
      stock_quantity={stock_quantity}
      onAddToCart={handleAddToCart}
      onWishlist={handleWishlist}
      onCompare={handleCompare}
      productData={productFullData}
    />
  );
};

export default ProductCardContainer;
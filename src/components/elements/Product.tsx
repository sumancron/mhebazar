"use client";

import React from "react";
import { Heart, BarChart3, RefreshCw } from "lucide-react";
import Image from "next/image";

interface ProductCardProps {
  id: number; // Added product ID
  image: string;
  title: string;
  subtitle: string;
  price: string | number;
  currency: string;
  onAddToCart?: (productId: number, quantity?: number) => Promise<void>;
  onWishlist?: (productId: number) => Promise<void>;
  onCompare?: () => void;
  onShare?: () => void;
}

const ProductCard = ({
  id,
  image,
  title,
  subtitle,
  price,
  currency,
  onAddToCart = async () => { },
  onWishlist = async () => { },
  onCompare = () => { },
  onShare = () => { },
}: ProductCardProps) => {
  const handleAddToCart = async () => {
    try {
      await onAddToCart(id, 1);
      // Optionally show a success message
    } catch (error) {
      console.error("Failed to add to cart:", error);
      // Optionally show an error message
    }
  };

  const handleWishlist = async () => {
    try {
      await onWishlist(id);
      // Optionally show a success message
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      // Optionally show an error message
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-72 hover:shadow-md transition-shadow duration-200">
      {/* Image Container */}
      <div className="relative bg-gray-50 p-4">
        {/* Action Icons */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <button
            onClick={handleWishlist}
            className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onCompare}
            className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onShare}
            className="w-8 h-8 bg-white rounded-md shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Product Image */}
        <div className="flex justify-center items-center h-40">
          <Image
            src={image}
            alt={title}
            className="max-w-full max-h-full object-contain"
            width={200}
            height={200}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">{subtitle}</p>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-green-600">
            {currency} {price}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-md transition-colors"
        >
          Add to Cart
        </button>
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
}

export const ProductCardContainer = ({
  id,
  image,
  title,
  subtitle,
  price,
  currency,
}: ProductCardContainerProps) => {
  const handleAddToCart = async (productId: number, quantity = 1) => {
    try {
      const response = await fetch(`/api/products/${productId}/add_to_cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ quantity })
      });

      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }

      const data = await response.json();
      console.log("Added to cart:", data);
      // You might want to update your cart state here or show a success message
      return data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Handle error (show error message to user, etc.)
      throw error;
    }
  };

  const handleWishlist = async (productId: number) => {
    try {
      const response = await fetch(`/api/products/${productId}/add_to_wishlist/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to add to wishlist');
      }

      const data = await response.json();
      console.log("Added to wishlist:", data);
      // Update wishlist state or show success message
      return data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      // Handle error
      throw error;
    }
  };

  const handleCompare = () => {
    console.log("Added to compare");
  };

  const handleShare = () => {
    console.log("Share product");
  };

  return (
    <ProductCard
      id={id}
      image={image}
      title={title}
      subtitle={subtitle}
      price={price}
      currency={currency}
      onAddToCart={handleAddToCart}
      onWishlist={handleWishlist}
      onCompare={handleCompare}
      onShare={handleShare}
    />
  );
};

export default ProductCard;
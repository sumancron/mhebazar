// src/components/elements/Product.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Heart, Repeat, Share2, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Helper function for SEO-friendly slug
const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w-]+/g, '')     // Remove all non-word chars
    .replace(/--+/g, '-')        // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

// Interface for ProductCard display props
interface ProductCardDisplayProps {
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
  isWishlisted: boolean;
  isInCart: boolean;
  currentCartQuantity: number;
  cartItemId: number | null;
  onAddToCartClick: (productId: number) => void;
  onWishlistClick: (productId: number) => void;
  onCompareClick: (productData: Record<string, unknown>) => void;
  onBuyNowClick: (productId: number) => void;
  onShareClick: (url: string, title: string) => void;
  onIncreaseQuantity: (cartItemId: number) => void;
  onDecreaseQuantity: (cartItemId: number) => void;
  onRemoveFromCart: (cartItemId: number) => void; // Pass this down
  productData: Record<string, unknown>;
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
  isWishlisted,
  isInCart,
  currentCartQuantity,
  cartItemId,
  onAddToCartClick,
  onWishlistClick,
  onCompareClick,
  onBuyNowClick,
  onShareClick,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onRemoveFromCart,
  productData,
}: ProductCardDisplayProps) => {
  // Remove showIcons logic, always show icons
  const isAvailable = is_active && (!directSale || stock_quantity > 0);
  const isPurchasable = is_active && (!directSale || stock_quantity > 0);

  const productSlug = slugify(title);
  const productDetailUrl = `/product/${productSlug}?id=${id}`;

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-start w-[240px] h-[340px] text-sm relative ${
        !isAvailable ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative bg-gray-50 pt-2 pb-1 px-2 w-full flex-shrink-0 h-[55%] flex justify-center items-center">
        {/* Action Icons Top-Left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <button
            onClick={() => onWishlistClick(id)}
            className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Add to wishlist"
            disabled={!isPurchasable}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          <button
            onClick={() => onCompareClick(productData)}
            className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Compare"
            disabled={!isPurchasable}
          >
            <Repeat className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={() => onShareClick(window.location.origin + productDetailUrl, title)}
            className="w-7 h-7 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={productDetailUrl} className="flex justify-center items-center h-full w-full">
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
      <div className="p-3 flex-1 flex flex-col justify-between w-full h-[45%]">
        <div>
          <Link href={productDetailUrl}>
            <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-green-700 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mb-2 line-clamp-1">{subtitle}</p>

          {/* Price */}
          <div className="mb-3">
            {hide_price ? (
              <span className="text-lg font-semibold text-gray-500">
                {currency} *******
              </span>
            ) : (
              <span className="text-lg font-semibold text-green-600">
                {currency} {typeof price === 'number' ? price.toLocaleString('en-IN') : price}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {directSale ? (
          <div className="flex flex-col gap-2">
            {isInCart ? (
              <div className="grid grid-cols-[1fr_2fr_1fr_1fr] items-center w-full bg-green-100 text-green-700 font-medium py-1 px-1 rounded-md text-sm">
                <button
                  onClick={() => cartItemId && onDecreaseQuantity(cartItemId)}
                  disabled={currentCartQuantity <= 1 || !isPurchasable}
                  className="w-full h-8 flex items-center justify-center rounded-sm hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-green-800 font-semibold text-center h-8 flex items-center justify-center">{currentCartQuantity}</span>
                <button
                  onClick={() => cartItemId && onIncreaseQuantity(cartItemId)}
                  disabled={!isPurchasable}
                  className="w-full h-8 flex items-center justify-center rounded-sm hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {/* Remove from Cart button */}
                <button
                  onClick={() => cartItemId && onRemoveFromCart(cartItemId)}
                  className="w-full h-8 flex items-center justify-center rounded-sm text-red-500 hover:bg-red-100 transition-colors"
                  aria-label="Remove from cart"
                  title="Remove from Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCartClick(id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm flex items-center justify-center gap-2"
                aria-label="Add to cart"
                disabled={!isPurchasable}
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            )}

            <button
              onClick={() => onBuyNowClick(id)}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium py-2 px-3 rounded-md transition-colors text-sm"
              aria-label="Buy now"
              disabled={!isPurchasable}
            >
              Buy Now
            </button>
            {!isPurchasable && (
              <button
                onClick={() => toast.info('Request a quote logic here!')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm mt-2"
                aria-label="Get a quote"
              >
                Get a Quote
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => toast.info('Request a quote logic here!')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 rounded-md transition-colors text-sm"
            aria-label="Get a quote"
            disabled={!is_active}
          >
            Get a Quote
          </button>
        )}
      </div>
    </div>
  );
};


// Interface for props passed to ProductCardContainer (from ProductListing)
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

// Full product data interface matching API for internal use in container
interface ApiProductData {
  id: number;
  category_name?: string;
  subcategory_name?: string;
  images: { id: number; image: string }[];
  name: string;
  description: string;
  price: string;
  direct_sale: boolean;
  type?: string;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  manufacturer?: string;
  average_rating?: number | null;
}

// Cart Item type from API
interface CartItemApi {
  id: number; // Cart item ID
  product: number; // Product ID
  product_details: ApiProductData; // Full product details are nested
  quantity: number;
  total_price: number;
}

// Wishlist Item type from API
interface WishlistItemApi {
  id: number; // Wishlist item ID
  product: number;
  product_details: ApiProductData;
}


// This component acts as a container to manage state and API interactions for each product card
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
  const { user } = useUser();
  const router = useRouter();

  // States to track product's status for the current user
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState<number | null>(null); // To store the actual cart_item_id

  // Full product data to pass for comparison (matches ProductCardContainerProps)
  const productFullData: ProductCardContainerProps = {
    id, image, title, subtitle, price, currency, directSale, is_active, hide_price, stock_quantity,
  };

  // Function to fetch initial status of wishlist and cart for this product
  // Use a ref to ensure correct values in callbacks
  const latestCartState = React.useRef({ currentCartQuantity, cartItemId, isInCart });
  useEffect(() => {
    latestCartState.current = { currentCartQuantity, cartItemId, isInCart };
  }, [currentCartQuantity, cartItemId, isInCart]);


  const fetchInitialStatus = useCallback(async () => {
    if (user) {
      try {
        // Check wishlist status
        const wishlistResponse = await api.get<{ results: WishlistItemApi[] }>(`/wishlist/?product=${id}&user=${user.id}`);
        setIsWishlisted(wishlistResponse.data.results.length > 0);

        // Check cart status and quantity
        const cartResponse = await api.get<{ results: CartItemApi[] }>(`/cart/?product=${id}&user=${user.id}`);
        if (cartResponse.data.results.length > 0) {
          const itemInCart = cartResponse.data.results[0];
          setIsInCart(true);
          setCurrentCartQuantity(itemInCart.quantity);
          setCartItemId(itemInCart.id); // Store cart item ID
        } else {
          setIsInCart(false);
          setCurrentCartQuantity(0);
          setCartItemId(null);
        }
      } catch (error) {
        console.error("Failed to fetch initial wishlist/cart status:", error);
        // Do not show toast for background checks
      }
    } else {
      // If user is not logged in, reset states
      setIsWishlisted(false);
      setIsInCart(false);
      setCurrentCartQuantity(0);
      setCartItemId(null);
    }
  }, [user, id]);

  useEffect(() => {
    fetchInitialStatus();
  }, [fetchInitialStatus]);

  // --- API Callbacks for ProductCard ---

  const handleAddToCart = useCallback(async (productId: number) => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      return;
    }

    try {
      if (latestCartState.current.isInCart) { // Use ref for latest state
        toast.info("This product is already in your cart.", {
          action: {
            label: 'View Cart',
            onClick: () => router.push('/cart'),
          },
        });
        return;
      }
      const response = await api.post(`/cart/`, { product: productId, quantity: 1 });
      setIsInCart(true); // Optimistically update UI
      setCurrentCartQuantity(1); // Set quantity to 1 for new item
      setCartItemId(response.data.id); // Store the newly created cart item ID
      toast.success("Product added to cart!", {
        action: {
          label: 'View Cart',
          onClick: () => router.push('/cart'),
        },
      });
    } catch (error: unknown) {
      console.error("Error adding to cart:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data?.non_field_errors?.[0] === "The fields user, product must make a unique set.") {
          toast.info("Product is already in your cart.", {
            action: {
              label: 'View Cart',
              onClick: () => router.push('/cart'),
            },
          });
          fetchInitialStatus(); // Re-fetch to sync state if already in cart
        } else {
          toast.error(error.response.data?.message || `Failed to add to cart: ${error.response.statusText}`);
        }
      } else {
        toast.error("An unexpected error occurred while adding to cart. Please try again.");
      }
    }
  }, [user, router, fetchInitialStatus]);


  const handleRemoveFromCart = useCallback(async (cartId: number) => {
    if (!user || !cartId) return;
    try {
      await api.delete(`/cart/${cartId}/`);
      setIsInCart(false); // Optimistically update
      setCurrentCartQuantity(0);
      setCartItemId(null);
      toast.success("Product removed from cart.");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove product from cart.");
    }
  }, [user]); // Only depends on 'user'


  const handleIncreaseQuantity = useCallback(async (cartId: number) => {
    if (!user || !cartId) return;
    try {
      const newQuantity = latestCartState.current.currentCartQuantity + 1; // Use ref for latest state
      // You might want to check against max_stock_quantity here if applicable
      await api.patch(`/cart/${cartId}/`, { quantity: newQuantity });
      setCurrentCartQuantity(newQuantity); // Optimistically update
      toast.success("Quantity increased!");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data?.quantity) {
          toast.error(`Failed to increase quantity: ${error.response.data.quantity[0]}`);
      } else {
          toast.error("Failed to increase quantity.");
      }
    }
  }, [user]); // Depends on user


  const handleDecreaseQuantity = useCallback(async (cartId: number) => {
    if (!user || !cartId) return;
    if (latestCartState.current.currentCartQuantity <= 1) { // Use ref for latest state
      toast.info("Quantity cannot be less than 1. Use the remove button (trash icon) to take it out of cart.", {
        action: {
          label: 'Remove',
          onClick: () => handleRemoveFromCart(cartId),
        },
      });
      return;
    }
    try {
      const newQuantity = latestCartState.current.currentCartQuantity - 1; // Use ref for latest state
      await api.patch(`/cart/${cartId}/`, { quantity: newQuantity });
      setCurrentCartQuantity(newQuantity); // Optimistically update
      toast.success("Quantity decreased!");
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data?.quantity) {
          toast.error(`Failed to decrease quantity: ${error.response.data.quantity[0]}`);
      } else {
          toast.error("Failed to decrease quantity.");
      }
    }
  }, [user, handleRemoveFromCart]); // Depends on user and handleRemoveFromCart


  const handleWishlist = useCallback(async (productId: number) => {
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }

    try {
      if (isWishlisted) {
        // Product is already in wishlist, so remove it
        const wishlistResponse = await api.get<{ results: WishlistItemApi[] }>(`/wishlist/?product=${productId}&user=${user.id}`);
        if (wishlistResponse.data.results.length > 0) {
          const wishlistItemId = wishlistResponse.data.results[0].id;
          await api.delete(`/wishlist/${wishlistItemId}/`);
          setIsWishlisted(false); // Optimistically update UI
          toast.success("Product removed from wishlist!");
        } else {
          // Edge case: UI thought it was wishlisted, but API says no. Sync UI.
          setIsWishlisted(false);
          toast.info("Product was not found in your wishlist. Syncing state.");
        }
      } else {
        // Product is not in wishlist, so add it
        const response = await api.post(`/wishlist/`, { product: productId });
        console.log("Added to wishlist:", response.data);
        setIsWishlisted(true); // Optimistically update UI
        toast.success("Product added to wishlist!");
      }
    } catch (error: unknown) {
      console.error("Error updating wishlist:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data?.non_field_errors?.[0] === "The fields user, product must make a unique set.") {
          toast.info("Product is already in your wishlist.");
          setIsWishlisted(true); // Ensure UI reflects actual wishlist state
        } else {
          toast.error(error.response.data?.message || `Failed to add to wishlist: ${error.response.statusText}`);
        }
      } else {
        toast.error("An unexpected error occurred while updating wishlist. Please try again.");
      }
    }
  }, [user, isWishlisted]);

  const handleCompare = useCallback((data: Record<string, unknown>) => {
    const COMPARE_KEY = 'mhe_compare_products';
    if (typeof window !== 'undefined') {
      const currentCompare: ProductCardContainerProps[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
      const existingProduct = currentCompare.find((p: ProductCardContainerProps) => p.id === id);

      if (!existingProduct) {
        const dataToStore = { ...data };
        if (hide_price) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { price: _, ...restOfData } = dataToStore; // Extract price, ignore it, keep rest
          currentCompare.push(restOfData as unknown as ProductCardContainerProps); // Cast to expected type
        } else {
          currentCompare.push(dataToStore as unknown as ProductCardContainerProps); // Cast to expected type
        }
        localStorage.setItem(COMPARE_KEY, JSON.stringify(currentCompare));
        toast.success("Product added to comparison!");
      } else {
        toast.info("Product is already in comparison.");
      }
    }
  }, [id, hide_price]);

  const handleBuyNow = useCallback(async (productId: number) => {
    if (!user) {
      toast.error("Please log in to proceed with purchase.");
      router.push('/login'); // Redirect to login
      return;
    }
    if (!directSale || stock_quantity === 0 || !is_active) {
      toast.error("This product is not available for direct purchase.");
      return;
    }

    try {
      // First, ensure the item is in the cart
      if (!latestCartState.current.isInCart) { // Use ref for latest state
        await api.post(`/cart/`, { product: productId, quantity: 1 });
      }
      // Then, redirect to the cart page
      router.push('/cart');
    } catch (error: unknown) {
      console.error("Error during buy now process:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || `Failed to add product to cart: ${error.response.statusText}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }, [user, router, directSale, stock_quantity, is_active]); // Removed isInCart from dependencies because we're using latestCartState.current.isInCart

  const handleShare = useCallback((url: string, title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        url: url,
      }).then(() => {
        toast.success('Product link shared successfully!');
      }).catch((error) => {
        if (error.name === 'AbortError') {
          toast.info('Sharing cancelled.');
        } else {
          toast.error('Failed to share product link.');
          console.error('Error sharing:', error);
        }
      });
    } else {
      // Fallback for browsers that do not support the Web Share API
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Product link copied to clipboard!');
      }).catch((err) => {
        toast.error('Failed to copy link to clipboard.');
        console.error('Error copying link:', err);
      });
    }
  }, []);


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
      isWishlisted={isWishlisted}
      isInCart={isInCart}
      currentCartQuantity={currentCartQuantity}
      cartItemId={cartItemId}
      onAddToCartClick={handleAddToCart}
      onWishlistClick={handleWishlist}
      onCompareClick={handleCompare}
      onBuyNowClick={handleBuyNow}
      onShareClick={handleShare} // Pass new share handler
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      onRemoveFromCart={handleRemoveFromCart}
      productData={{ ...productFullData }}
    />
  );
};

export default ProductCardContainer;
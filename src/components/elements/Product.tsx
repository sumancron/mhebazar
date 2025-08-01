"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { Heart, Repeat, Share2, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/api";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import QuoteForm from "../forms/enquiryForm/quotesForm";
import RentalForm from "../forms/enquiryForm/rentalForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import DOMPurify from 'dompurify';

// Helper function for SEO-friendly slug
const slugify = (text: string): string => {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Interface for ProductCard display props
interface ProductCardDisplayProps {
  id: number;
  image: string;
  category_image: string | null; // Added category image
  title: string;
  subtitle: string | null | undefined;
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
  onRemoveFromCart: (cartItemId: number) => void;
  productData: Record<string, unknown>;
  productType: string;
}

// Custom Image component with an error handler to show a fallback
const FallbackImage = ({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc,
  sizes,
  quality,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className: string;
  fallbackSrc?: string | null;
  sizes?: string;
  quality?: number;
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error) {
      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        setImgSrc("/placeholder-image.png");
      }
      setError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={quality}
      sizes={sizes}
      unoptimized={imgSrc.startsWith("/placeholder-image.png") || imgSrc === fallbackSrc}
      onError={handleError}
    />
  );
};


const ProductCard = ({
  id,
  image,
  category_image,
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
  productType,
}: ProductCardDisplayProps) => {
  const isAvailable = is_active && (!directSale || stock_quantity > 0);
  const isPurchasable = is_active && (!directSale || stock_quantity > 0);

  const productSlug = slugify(title || '');
  const productDetailUrl = `/product/${productSlug}/?id=${id}`;

  const formButtonText = productType === 'rental' || productType === 'used' ? "Rent Now" : "Get a Quote";

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col w-full max-w-sm mx-auto h-auto min-h-[400px] ${!isAvailable && directSale ? "opacity-50 pointer-events-none" : ""
        }`}
    >
      {/* Image Container */}
      <div className="relative w-full h-48 sm:h-56 flex-shrink-0 bg-gray-100">
        <Link href={productDetailUrl} className="block w-full h-full">
          <FallbackImage
            src={image}
            alt={title}
            width={320}
            height={224}
            className="object-cover w-full h-full rounded-t-2xl"
            quality={85}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            fallbackSrc={category_image}
          />
        </Link>
        {/* Action Icons Top-Right */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <button
            onClick={() => onWishlistClick(id)}
            className="bg-white p-2 rounded-full border border-gray-200 shadow-sm transition hover:bg-gray-100"
            aria-label="Add to wishlist"
            disabled={!is_active}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
          </button>
          <button
            onClick={() => onCompareClick(productData)}
            className="bg-white p-2 rounded-full border border-gray-200 shadow-sm transition hover:bg-gray-100"
            aria-label="Compare"
            disabled={!is_active}
          >
            <Repeat className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onShareClick(window.location.origin + productDetailUrl, title)}
            className="bg-white p-2 rounded-full border border-gray-200 shadow-sm transition hover:bg-gray-100"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between p-4">
        <div className="flex-1">
          <Link href={productDetailUrl}>
            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-green-700 transition-colors">
              {title}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2 line-clamp-1">
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(subtitle || '') }} />
          </p>
          {/* Price */}
          <div className="mb-3">
            {(hide_price || price <= "0") ? (
              <span className="text-lg font-semibold text-gray-400 tracking-wider">
                {currency} *******
              </span>
            ) : (
              <span className="text-lg font-bold text-green-600 tracking-wide">
                {currency} {typeof price === "number" ? price.toLocaleString("en-IN") : price}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {directSale ? (
          <div className="flex flex-col gap-2 w-full">
            {isInCart ? (
              <div className="flex items-center justify-between bg-green-50 text-green-700 font-medium py-1 px-1 rounded-lg">
                <button
                  onClick={() => cartItemId && onDecreaseQuantity(cartItemId)}
                  disabled={currentCartQuantity <= 1 || !isPurchasable}
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-green-800 font-semibold text-center flex-1 text-base">
                  {currentCartQuantity}
                </span>
                <button
                  onClick={() => cartItemId && onIncreaseQuantity(cartItemId)}
                  disabled={!isPurchasable}
                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => cartItemId && onRemoveFromCart(cartItemId)}
                  className="h-8 w-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors ml-1"
                  aria-label="Remove from cart"
                  title="Remove from Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onAddToCartClick(id)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#5CA131] hover:bg-green-700 py-3 text-white font-medium transition-colors w-full text-base"
                aria-label="Add to cart"
                disabled={!isPurchasable}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onBuyNowClick(id)}
                className="rounded-lg border border-green-600 text-green-600 hover:bg-green-50 py-3 font-medium text-base transition-colors flex-1"
                aria-label="Buy now"
                disabled={!isPurchasable}
              >
                Buy Now
              </button>
              {!isPurchasable && (
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="flex items-center justify-center rounded-lg bg-[#5CA131] hover:bg-green-700 py-3 text-white font-medium transition-colors flex-1 text-base"
                      aria-label="Get a quote"
                    >
                      <span>Get a Quote</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-2xl mx-auto">
                    <QuoteForm product={productData} />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex items-center justify-center rounded-lg bg-[#5CA131] hover:bg-green-700 py-3 text-white font-medium transition-colors w-full text-base"
                aria-label={formButtonText}
                disabled={!is_active}
              >
                {formButtonText}
              </button>
            </DialogTrigger>
            <DialogContent className="w-[95vw] max-w-2xl mx-auto">
              {productType === 'rental' || productType === 'used' ? (
                <RentalForm
                  productId={id}
                  productDetails={{
                    image: image,
                    title: title,
                    description: subtitle || '',
                    price: price,
                    stock_quantity: stock_quantity
                  }}
                />
              ) : (
                <QuoteForm product={productData} />
              )}
            </DialogContent>
          </Dialog>
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
  subtitle: string | null | undefined;
  price: string | number;
  currency: string;
  directSale: boolean;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  type: string;
  category_image: string | null; // Added category image to container props
}

// Full product data interface matching API for internal use in container
interface ApiProductData {
  id: number;
  category_name?: string;
  subcategory_name?: string | null;
  images: { id: number; image: string }[];
  name: string;
  description: string;
  price: string;
  direct_sale: boolean;
  type: string;
  is_active: boolean;
  hide_price: boolean;
  stock_quantity: number;
  manufacturer?: string;
  average_rating?: number | null;
  category_image?: string | null; // Added category image
}

interface CartItemApi {
  id: number;
  product: number;
  product_details: ApiProductData;
  quantity: number;
  total_price: number;
}

interface WishlistItemApi {
  id: number;
  product: number;
  product_details: ApiProductData;
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
  type,
  category_image, // Destructure category image
}: ProductCardContainerProps) => {
  const { user } = useUser();
  const router = useRouter();

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [currentCartQuantity, setCurrentCartQuantity] = useState(0);
  const [cartItemId, setCartItemId] = useState<number | null>(null);

  const productFullData: ProductCardContainerProps = {
    id, image, title, subtitle, price, currency, directSale, is_active, hide_price, stock_quantity, type, category_image
  };

  const latestCartState = useRef({ currentCartQuantity, cartItemId, isInCart });
  useEffect(() => {
    latestCartState.current = { currentCartQuantity, cartItemId, isInCart };
  }, [currentCartQuantity, cartItemId, isInCart]);

  const fetchInitialStatus = useCallback(async () => {
    if (user) {
      try {
        const wishlistResponse = await api.get<{ results: WishlistItemApi[] }>(`/wishlist/?product=${id}&user=${user.id}`);
        setIsWishlisted(wishlistResponse.data.results.length > 0);

        const cartResponse = await api.get<{ results: CartItemApi[] }>(`/cart/?product=${id}&user=${user.id}`);
        if (cartResponse.data.results.length > 0) {
          const itemInCart = cartResponse.data.results[0];
          setIsInCart(true);
          setCurrentCartQuantity(itemInCart.quantity);
          setCartItemId(itemInCart.id);
        } else {
          setIsInCart(false);
          setCurrentCartQuantity(0);
          setCartItemId(null);
        }
      } catch (error) {
        console.error("Failed to fetch initial wishlist/cart status:", error);
      }
    } else {
      setIsWishlisted(false);
      setIsInCart(false);
      setCurrentCartQuantity(0);
      setCartItemId(null);
    }
  }, [user, id]);

  useEffect(() => {
    fetchInitialStatus();
  }, [fetchInitialStatus]);

  const handleAddToCart = useCallback(async (productId: number) => {
    if (!user) {
      toast.error("Please log in to add products to your cart.");
      router.push('/login');
      return;
    }
    try {
      if (latestCartState.current.isInCart) {
        toast.info("This product is already in your cart.", {
          action: {
            label: 'View Cart',
            onClick: () => router.push('/cart'),
          },
        });
        return;
      }
      const response = await api.post(`/cart/`, { product: productId, quantity: 1 });
      setIsInCart(true);
      setCurrentCartQuantity(1);
      setCartItemId(response.data.id);
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
          fetchInitialStatus();
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
      setIsInCart(false);
      setCurrentCartQuantity(0);
      setCartItemId(null);
      toast.success("Product removed from cart.");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove product from cart.");
    }
  }, [user]);

  const handleIncreaseQuantity = useCallback(async (cartId: number) => {
    if (!user || !cartId) return;
    try {
      const newQuantity = latestCartState.current.currentCartQuantity + 1;
      await api.patch(`/cart/${cartId}/`, { quantity: newQuantity });
      setCurrentCartQuantity(newQuantity);
      toast.success("Quantity increased!");
    } catch (error) {
      console.error("Error increasing quantity:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data?.quantity) {
        toast.error(`Failed to increase quantity: ${error.response.data.quantity[0]}`);
      } else {
        toast.error("Failed to increase quantity.");
      }
    }
  }, [user]);

  const handleDecreaseQuantity = useCallback(async (cartId: number) => {
    if (!user || !cartId) return;
    if (latestCartState.current.currentCartQuantity <= 1) {
      toast.info("Quantity cannot be less than 1. Use the remove button (trash icon) to take it out of cart.", {
        action: {
          label: 'Remove',
          onClick: () => handleRemoveFromCart(cartId),
        },
      });
      return;
    }
    try {
      const newQuantity = latestCartState.current.currentCartQuantity - 1;
      await api.patch(`/cart/${cartId}/`, { quantity: newQuantity });
      setCurrentCartQuantity(newQuantity);
      toast.success("Quantity decreased!");
    } catch (error) {
      console.error("Error decreasing quantity:", error);
      if (axios.isAxiosError(error) && error.response && error.response.data?.quantity) {
        toast.error(`Failed to decrease quantity: ${error.response.data.quantity[0]}`);
      } else {
        toast.error("Failed to decrease quantity.");
      }
    }
  }, [user, handleRemoveFromCart]);

  const handleWishlist = useCallback(async (productId: number) => {
    if (!user) {
      toast.error("Please log in to manage your wishlist.");
      router.push('/login');
      return;
    }
    try {
      if (isWishlisted) {
        const wishlistResponse = await api.get<{ results: WishlistItemApi[] }>(`/wishlist/?product=${productId}&user=${user.id}`);
        if (wishlistResponse.data.results.length > 0) {
          const wishlistItemId = wishlistResponse.data.results[0].id;
          await api.delete(`/wishlist/${wishlistItemId}/`);
          setIsWishlisted(false);
          toast.success("Product removed from wishlist!");
        } else {
          setIsWishlisted(false);
          toast.info("Product was not found in your wishlist. Syncing state.");
        }
      } else {
        const response = await api.post(`/wishlist/`, { product: productId });
        setIsWishlisted(true);
        toast.success("Product added to wishlist!");
      }
    } catch (error: unknown) {
      console.error("Error updating wishlist:", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400 && error.response.data?.non_field_errors?.[0] === "The fields user, product must make a unique set.") {
          toast.info("Product is already in your wishlist.");
          setIsWishlisted(true);
        } else {
          toast.error(error.response.data?.message || `Failed to add to wishlist: ${error.response.statusText}`);
        }
      } else {
        toast.error("An unexpected error occurred while updating wishlist. Please try again.");
      }
    }
  }, [user, isWishlisted, router]);

  const handleCompare = useCallback((data: Record<string, unknown>) => {
    const COMPARE_KEY = 'mhe_compare_products';
    if (typeof window !== 'undefined') {
      const currentCompare: ProductCardContainerProps[] = JSON.parse(localStorage.getItem(COMPARE_KEY) || '[]');
      const existingProduct = currentCompare.find((p: ProductCardContainerProps) => p.id === id);
      if (!existingProduct) {
        const dataToStore = { ...data };
        if (hide_price) {
          const { price: _, ...restOfData } = dataToStore;
          currentCompare.push(restOfData as unknown as ProductCardContainerProps);
        } else {
          currentCompare.push(dataToStore as unknown as ProductCardContainerProps);
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
      router.push('/login');
      return;
    }
    if (!directSale || stock_quantity === 0 || !is_active) {
      toast.error("This product is not available for direct purchase.");
      return;
    }
    try {
      if (!latestCartState.current.isInCart) {
        await api.post(`/cart/`, { product: productId, quantity: 1 });
      }
      router.push('/cart');
    } catch (error: unknown) {
      console.error("Error during buy now process:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || `Failed to add product to cart: ${error.response.statusText}`);
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  }, [user, router, directSale, stock_quantity, is_active]);

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
      category_image={category_image}
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
      onShareClick={handleShare}
      onIncreaseQuantity={handleIncreaseQuantity}
      onDecreaseQuantity={handleDecreaseQuantity}
      onRemoveFromCart={handleRemoveFromCart}
      productData={{ ...productFullData }}
      productType={type}
    />
  );
};

export default ProductCardContainer;
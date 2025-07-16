// components/cart/CartSummary.tsx
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import api from "@/lib/api"; // Assuming api.ts is in lib/api.ts

// Define the interfaces for your data structures
interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  // Add other product fields as needed
}

interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  // Add other cart item fields as needed
}

// Define the cartAPI object using the imported axios instance
const cartAPI = {
  getCart: () => api.get<CartItem[]>("/cart/"),
  updateCartItem: (itemId: number, quantity: number) =>
    api.patch(`/cart/${itemId}/`, { quantity }),
  deleteCartItem: (itemId: number) => api.delete(`/cart/${itemId}/`),
  clearCart: () => api.post("/cart/clear/"),
};

export default function CartSummary() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCart();
      setCartItems(response.data);
    } catch (err) {
      setError("Failed to load cart items");
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      await cartAPI.deleteCartItem(itemId);
      await fetchCart(); // Refresh cart data
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => (window.location.href = "/")}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cart Summary</h2>
        <Button variant="outline" onClick={clearCart}>
          Clear Cart
        </Button>
      </div>

      {cartItems.map(item => (
        <Card key={item.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <img
                src={item.product.images?.[0] || "/no-product.png"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600 text-sm">
                  ${item.product.price} each
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateQuantity(item.id, Math.max(1, item.quantity - 1))
                  }>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => removeItem(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
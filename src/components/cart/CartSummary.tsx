// components/cart/CartSummary.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Minus, Plus, X, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  specs?: string;
  inStock: boolean;
}

interface CartSummaryProps {
  onNext: () => void;
}

export default function CartSummary({ onNext }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('MEH200');
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Unik Semi Traction Batteries U-12120 (12v) 140 Ah',
      image: '/api/placeholder/150/150',
      price: 8999,
      originalPrice: 10999,
      quantity: 1,
      specs: '12V 140Ah',
      inStock: true
    },
    {
      id: '2',
      name: 'Unik Semi Traction Batteries U-12120 (12v) 140 Ah',
      image: '/api/placeholder/150/150',
      price: 8999,
      originalPrice: 10999,
      quantity: 1,
      specs: '80v/500Ah',
      inStock: true
    }
  ]);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const couponDiscount = 200; // Fixed discount for demo
  const deliveryCharges = 0; // Free delivery
  const total = subtotal - couponDiscount + deliveryCharges;

  const formatPrice = (price: number) => `₹ ${price.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Shopping Cart</h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  {item.specs && (
                    <p className="text-xs text-gray-500 mb-2">{item.specs}</p>
                  )}
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg font-semibold text-green-600">
                      {formatPrice(item.price)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Coupon Section */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Coupons
              </h4>
              <div className="flex">
                <Input
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  className="ml-2 px-4"
                  onClick={() => {}}
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Price Details</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item 1</span>
                  <span className="font-medium">{formatPrice(cartItems[0]?.price * cartItems[0]?.quantity || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Item 2</span>
                  <span className="font-medium">{formatPrice(cartItems[1]?.price * cartItems[1]?.quantity || 0)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery charges</span>
                  <span className="font-medium text-green-600">Free delivery</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={onNext}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
              disabled={cartItems.length === 0}
            >
              Proceed to Address
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
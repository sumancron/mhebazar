// components/cart/AddressStep.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function AddressStep({ onNext, onBack }: AddressStepProps) {
  const [selectedAddress, setSelectedAddress] = useState<string>('1');
  const [showAddNew, setShowAddNew] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'home' as const,
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [savedAddresses] = useState<Address[]>([
    {
      id: '1',
      type: 'home',
      name: 'John Doe',
      phone: '+91 9876543210',
      address: '123 Main Street, Apartment 4B',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      isDefault: true
    },
    {
      id: '2',
      type: 'work',
      name: 'John Doe',
      phone: '+91 9876543210',
      address: '456 Business Park, Tower A, Floor 5',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      isDefault: false
    }
  ]);

  const handleAddAddress = () => {
    // Add validation and save logic here
    setShowAddNew(false);
    setNewAddress({
      type: 'home',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: ''
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Address Selection */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Address
            </h2>
            <Button
              variant="outline"
              onClick={() => setShowAddNew(true)}
              className="flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          </div>

          {/* Saved Addresses */}
          <div className="space-y-4 mb-6">
            <RadioGroup value={selectedAddress} onValueChange={setSelectedAddress}>
              {savedAddresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative"
                >
                  <Card className={`cursor-pointer transition-all ${
                    selectedAddress === address.id ? 'ring-2 ring-green-600 border-green-600' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <RadioGroupItem
                          value={address.id}
                          id={address.id}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">{address.name}</span>
                              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
                                {address.type}
                              </span>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                          <p className="text-sm text-gray-700 mb-1">{address.address}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </RadioGroup>
          </div>

          {/* Add New Address Form */}
          {showAddNew && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        placeholder="Enter full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        placeholder="+91 9876543210"
                        className="mt-1"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        value={newAddress.address}
                        onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                        placeholder="House no, Building name, Road name, Area"
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        placeholder="City"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                        placeholder="State"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                        placeholder="6-digit pincode"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <Button onClick={handleAddAddress} className="bg-green-600 hover:bg-green-700">
                      Save Address
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddNew(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Delivery Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                    <p className="text-xs text-gray-500">Your order has been placed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Shipped</p>
                    <p className="text-xs text-gray-500">Your order is on the way</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Out for Delivery</p>
                    <p className="text-xs text-gray-500">Your order is out for delivery</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Delivered</p>
                    <p className="text-xs text-gray-500">Expected by Tomorrow</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-green-800 font-medium">Free Delivery</p>
                <p className="text-xs text-green-600">Your order qualifies for free delivery</p>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  Back to Cart
                </Button>
                <Button
                  onClick={onNext}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!selectedAddress}
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
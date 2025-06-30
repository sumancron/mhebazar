// components/cart/PaymentStep.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Building2, Truck, Shield, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  name: string;
  icon: React.ReactNode;
  description?: string;
}

interface PaymentStepProps {
  onComplete: () => void;
  onBack: () => void;
}

export default function PaymentStep({ onComplete, onBack }: PaymentStepProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>('cod');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [upiId, setUpiId] = useState('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Visa, MasterCard, Rupay accepted'
    },
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI',
      icon: <Smartphone className="w-5 h-5" />,
      description: 'Pay using UPI ID or QR code'
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      icon: <Building2 className="w-5 h-5" />,
      description: 'All major banks supported'
    },
    {
      id: 'cod',
      type: 'cod',
      name: 'Cash on Delivery',
      icon: <Truck className="w-5 h-5" />,
      description: 'Pay when your order is delivered'
    }
  ];

  const orderSummary = {
    subtotal: 17998,
    discount: 200,
    delivery: 0,
    total: 17798
  };

  const formatPrice = (price: number) => `₹ ${price.toLocaleString()}`;

  const handlePlaceOrder = () => {
    // Add payment processing logic here
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Method
          </h2>

          <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.01 }}
                  className="relative"
                >
                  <Card className={`cursor-pointer transition-all ${
                    selectedPayment === method.id ? 'ring-2 ring-green-600 border-green-600' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {method.icon}
                          </div>
                          <div>
                            <Label htmlFor={method.id} className="text-base font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            {method.description && (
                              <p className="text-sm text-gray-500">{method.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </RadioGroup>

          {/* Payment Details Forms */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-6"
          >
            {selectedPayment === 'card' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                        maxLength={19}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        placeholder="Name on card"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        placeholder="MM/YY"
                        className="mt-1"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        placeholder="123"
                        className="mt-1"
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPayment === 'upi' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">UPI Payment</h3>
                  <div>
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="mt-1"
                    />
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      You will be redirected to your UPI app to complete the payment
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPayment === 'netbanking' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Select Your Bank</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                      <Button key={bank} variant="outline" className="h-12">
                        {bank}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {selectedPayment === 'cod' && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <Truck className="w-6 h-6 text-green-600 mt-1" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Cash on Delivery</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Pay cash when your order is delivered to your doorstep. Please keep exact change ready.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <strong>Note:</strong> COD orders may take an additional day for processing
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Order Summary & Security */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal (2 items)</span>
                    <span className="font-medium">{formatPrice(orderSummary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(orderSummary.discount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery charges</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total Amount</span>
                    <span>{formatPrice(orderSummary.total)}</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800 font-medium">
                    You will save ₹{orderSummary.discount.toLocaleString()} on this order
                  </p>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-medium"
                  disabled={
                    (selectedPayment === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) ||
                    (selectedPayment === 'upi' && !upiId)
                  }
                >
                  Place Order • {formatPrice(orderSummary.total)}
                </Button>
              </CardContent>
            </Card>

            {/* Security & Delivery Info */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Secure Payment</p>
                      <p className="text-xs text-gray-500">Your payment information is encrypted and secure</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Fast Delivery</p>
                      <p className="text-xs text-gray-500">Expected delivery by tomorrow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Free Returns</p>
                      <p className="text-xs text-gray-500">7-day easy return policy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
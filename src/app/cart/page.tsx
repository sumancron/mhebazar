// app/cart/page.tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StepperHeader from '@/components/cart/StepperHeader';
import CartSummary from '@/components/cart/CartSummary';
import AddressStep from '@/components/cart/AddressStep';
import PaymentStep from '@/components/cart/PaymentStep';
import Breadcrumb from '@/components/elements/Breadcrumb';
import RecentlyViewed from '@/components/cart/RecentlyViewed';
import SparePartsFeatured from '@/components/home/SparepartsFeatured';
import RelatedProducts from '@/components/cart/RelatedProducts';

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    { id: 1, title: 'Cart', description: 'Review items' },
    { id: 2, title: 'Address', description: 'Shipping details' },
    { id: 3, title: 'Payment', description: 'Complete order' }
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCompletedSteps(prev => prev.filter(step => step !== currentStep - 1));
    }
  };

  const handleComplete = () => {
    setCompletedSteps(prev => [...prev, currentStep]);
    // Redirect to order confirmation or handle success
    console.log('Order completed successfully!');
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Cart', href: '/cart' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Stepper Header */}
      <StepperHeader
        steps={steps}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <CartSummary onNext={handleNext} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="address"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <AddressStep onNext={handleNext} onBack={handleBack} />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <PaymentStep onComplete={handleComplete} onBack={handleBack} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Additional Sections - Only show on cart step */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-16">
              <RecentlyViewed />
              <SparePartsFeatured />
              <RelatedProducts />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
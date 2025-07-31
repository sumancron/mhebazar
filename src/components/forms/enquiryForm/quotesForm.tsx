// src/components/forms/enquiryForm/quotesForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import DOMPurify from 'dompurify';
import Image from "next/image";

// Define a more specific type for the product details passed to this form
interface ProductDetailsForForm {
  id: number; // This must be present
  image: string;
  title: string;
  description: string;
  price: string | number;
  stock_quantity?: number;
  name?: string;
  images?: { id: number; image: string }[];
  subtitle?: string;
}

const QuoteForm = ({ productDetails }: { productDetails: ProductDetailsForForm }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const validateForm = () => {
    if (!message.trim()) {
      toast.error('Please provide your message for the quote request.');
      return false;
    }
    // New validation for product ID
    if (!productDetails || typeof productDetails.id !== 'number') {
      toast.error('Product information is missing. Cannot submit quote.');
      console.error('QuotesForm: productDetails or productDetails.id is invalid.', productDetails);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Ensure productDetails.id is safely accessed and is a number
      const productIdToSend = productDetails.id;

      const quotePayload = {
        message: message.trim(),
        product: productIdToSend // productDetails.id is guaranteed to be a number here
      };

      console.log("Sending quote payload:", quotePayload);

      await api.post('/quotes/', quotePayload);

      setSuccess(true);
      setMessage('');

      setTimeout(() => setSuccess(false), 5000);

    } catch (err: any) {
      console.error('Error submitting quote:', err);
      if (err.response) {
        console.error("Error response data:", err.response.data);
        console.error("Error response status:", err.response.status);
        if (err.response.data && typeof err.response.data === 'object' && Object.keys(err.response.data).length > 0) {
          const errorMessages = Object.values(err.response.data).flat().join(". ");
          toast.error(`Failed to submit quote request: ${errorMessages}`);
        } else if (err.response.data && typeof err.response.data === 'string') {
           toast.error(`Failed to submit quote request: ${err.response.data}`);
        } else {
          // This will catch the case where data is {} or null
          toast.error(`Failed to submit quote request. Please check your input and ensure you are logged in.`);
        }
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // The rendering logic for when productDetails is null/undefined
  if (!productDetails) {
    return (
      <div className="h-[90vh] flex items-center justify-center bg-gray-50 p-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-white rounded-lg shadow-lg animate-fade-in">
          <AlertCircle className="h-12 w-12 text-red-500 animate-bounce" />
          <p className="text-red-600 text-lg font-semibold">Product details are missing. Cannot load quote form.</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#5ca131] hover:bg-[#459426] text-white transition-all duration-300 ease-in-out px-6 py-3 rounded-lg"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-[90vh] overflow-auto custom-scrollbar p-4 sm:p-6 lg:p-8 bg-gray-50 rounded-lg shadow-inner">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0 bg-transparent">
          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-[#5ca131]/10 border-2 border-[#5ca131] rounded-lg text-center animate-fade-in">
              <p className="text-[#5ca131] font-semibold text-base">
                ✓ Quote request submitted successfully! We&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-center animate-fade-in">
              <p className="text-red-800 text-base">{error}</p>
            </div>
          )}

          {/* Product Information - Displayed for context */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mb-8 bg-white p-6 rounded-lg shadow-md animate-slide-in-top">
            <div className="w-full lg:w-1/2 xl:w-2/5 flex justify-center items-center">
              <Image
                src={productDetails.image || (productDetails.images && productDetails.images[0]?.image) || "/no-product.png"}
                alt={productDetails.title || productDetails.name || "Product"}
                width={300}
                height={200}
                className="w-full h-48 sm:h-64 lg:h-72 object-contain rounded-lg shadow-sm transition-transform duration-300 hover:scale-105"
                priority
              />
            </div>

            <div className="flex-1 space-y-3 py-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                {productDetails.title || productDetails.name || "Product"}
              </h2>

              <div className="space-y-2 text-sm sm:text-base text-gray-600">
                <p>
                  <span className="font-medium">Price:</span> ₹{typeof productDetails.price === "number" ? productDetails.price.toLocaleString("en-IN") : productDetails.price}
                </p>
                {productDetails.stock_quantity !== undefined && (
                  <p>
                    <span className="font-medium">Available Stock:</span> {productDetails.stock_quantity} units
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quote Form - Simplified */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-md animate-slide-in-bottom">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 text-center border-b pb-4 mb-4">
              Request a Quote
            </h3>

            <div className="space-y-4">
              {/* Message Input */}
              <div>
                <Textarea
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[120px] text-sm resize-none focus:border-[#5ca131] focus:ring-[#5ca131] transition-all duration-200 p-3"
                  placeholder="Type your message or inquiry here..."
                  aria-label="Your Message"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-12 bg-[#5ca131] hover:bg-[#459426] disabled:bg-gray-400 text-white font-bold text-base transition-all duration-300 ease-in-out flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                aria-label="Submit Quote Request"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send Quote Request'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteForm;
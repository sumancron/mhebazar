// src/components/forms/product/ProductReviewForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Star, X } from "lucide-react";
import React, { useState, ChangeEvent } from "react";
//import Image from "next/image";

import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: number;
};

// Assuming Role ID for a regular User from models.py
const USER_ROLE_ID = 3;

export default function MheWriteAReview({ isOpen, onOpenChange, productId }: Props) {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState(""); // Maps to 'review' field in backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stars = Array(5).fill(0);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Limit to a reasonable number of files, e.g., 5
    if (files.length > 5) {
      toast.warning("You can select a maximum of 5 images.");
      setSelectedFiles(files.slice(0, 5));
    } else {
      setSelectedFiles(files);
    }
  };

  const handleImageUpload = async (reviewId: number) => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images", file); // 'images' must match the field name in your `upload_images` action
    });

    try {
      // Use the specific action URL for uploading images to an existing review
      await api.post(`/reviews/${reviewId}/upload_images/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Essential for file uploads
        },
      });
      toast.success("Images uploaded successfully!");
      setSelectedFiles([]); // Clear files after successful upload
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
    } catch (error: unknown) {
      console.error("Error uploading images:", error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Failed to upload images: ${error.response.data?.detail || error.response.data?.message || error.response.statusText || 'Unknown error'}`);
      } else {
        toast.error("An unexpected error occurred during image upload. Please try again.");
      }
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }
    // Check if the authenticated user has the 'User' role (ID 3)
    if (!user.role || user.role.id !== USER_ROLE_ID) {
      toast.error("Only regular users can submit reviews.");
      return;
    }

    if (rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a title for your review.");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write your review.");
      return;
    }

    setIsSubmitting(true);
    let newReviewId: number | null = null;

    try {
      // Phase 1: Submit review text, stars, and title using FormData
      // This is crucial because ReviewViewSet expects multipart/form-data due to ParserClasses
      const reviewFormData = new FormData();
      reviewFormData.append('product', productId.toString());
      reviewFormData.append('stars', rating.toString());
      reviewFormData.append('title', title);
      reviewFormData.append('review', reviewText); // Matches backend model field name

      const reviewResponse = await api.post("/reviews/", reviewFormData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Explicitly set for FormData
        },
      });
      newReviewId = reviewResponse.data.id;
      toast.success("Review submitted successfully!");

      // Phase 2: Upload images if selected
      if (selectedFiles.length > 0 && newReviewId !== null) {
        await handleImageUpload(newReviewId);
      }

      // Clear form states
      setRating(0);
      setTitle("");
      setReviewText("");
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onOpenChange(false); // Close the dialog, triggering parent to refresh reviews
    } catch (error: unknown) {
      console.error("Error submitting review:", error);
      if (axios.isAxiosError(error) && error.response) {
        // Handle specific unique_together error if user already reviewed
        if (error.response.status === 400 &&
            (error.response.data?.non_field_errors?.[0]?.includes("user, product") ||
             error.response.data?.non_field_errors?.[0]?.includes("The fields user, product must make a unique set."))) {
          toast.error("You have already submitted a review for this product.");
        } else if (error.response.data?.detail) {
          toast.error(`Failed to submit review: ${error.response.data.detail}`);
        } else if (error.response.data?.message) {
          toast.error(`Failed to submit review: ${error.response.data.message}`);
        } else {
          // Fallback for other 400 errors like validation issues on fields
          const errorMessages = Object.values(error.response.data).flat().join(". ");
          toast.error(`Failed to submit review: ${errorMessages || error.response.statusText || 'Unknown error'}`);
        }
      } else {
        toast.error("An unexpected error occurred while submitting review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[736px] p-6 gap-6 rounded-lg shadow-lg">
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => onOpenChange(false)}
            aria-label="Close review form"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Header Section */}
        <div className="flex items-start gap-4 sm:gap-8 w-full">
          {/* Product Image Placeholder */}
          <img
            src="/no-product.png" // Placeholder, ideally fetch product image
            alt="Product image for review"
            width={79}
            height={64}
            className="object-cover rounded-md"
          />

          <DialogHeader className="pt-2 sm:pt-4 flex-1">
            <DialogTitle className="font-bold text-xl sm:text-2xl tracking-normal text-gray-900">
              How was the item?
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Rate the item section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mt-4">
          <span className="font-semibold text-base text-gray-800">Rate the item?</span>
          <div className="flex items-center gap-0.5">
            {stars.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={() => setRating(index + 1)}
                aria-label={`Rate ${index + 1} stars`}
              >
                <Star
                  className={`h-6 w-6 transition-colors duration-200 ${
                    index < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 hover:text-yellow-300"
                  }`}
                />
              </Button>
            ))}
          </div>
        </div>

        {/* Write a review section */}
        <div className="flex flex-col items-start gap-4 w-full mt-4">
          <h3 className="font-semibold text-base text-gray-800">Write a review</h3>

          <div className="flex flex-col items-start justify-center gap-6 w-full">
            <Textarea
              className="min-h-[120px] text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 p-3"
              placeholder="What should other customers know?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              aria-label="Review text content"
            />

            {/* Image/Video Upload Card */}
            <Card className="w-full bg-green-50 border-2 border-dashed border-green-300 rounded-lg">
              <CardContent
                className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()} // Trigger file input click
              >
                <Camera className="w-6 h-6 text-green-700" />
                <span className="text-sm text-green-800 font-medium">
                  {selectedFiles.length > 0 ?
                    `${selectedFiles.length} file(s) selected (will be uploaded after review text)` :
                    "Share a video or photo (Optional)"
                  }
                </span>
                
                <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef} // Attach ref
                    accept="image/*,video/*" // Specify accepted file types
                />
              </CardContent>
              {selectedFiles.length > 0 && (
                <div className="p-2 pt-0 text-sm text-gray-700 bg-green-100 border-t border-green-200 rounded-b-lg">
                  <p className="font-medium mb-1">Selected files:</p>
                  <ul className="list-disc list-inside">
                    {selectedFiles.map((file, index) => (
                      <li key={file.name + index} className="text-gray-800">{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* Title your review section */}
            <div className="flex flex-col items-start gap-2 w-full">
              <label htmlFor="review-title" className="font-semibold text-base text-gray-800">
                Title your review{" "}
                <span className="font-normal text-xs text-gray-600">(required)</span>
              </label>
              <Input
                id="review-title"
                className="p-3 text-sm text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="What should other customers know?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-label="Review title"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-full mt-4">
            <Button
              className="w-full py-4 bg-green-600 hover:bg-green-700 text-white text-base font-bold rounded-md shadow-md transition-colors duration-200"
              onClick={handleSubmitReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

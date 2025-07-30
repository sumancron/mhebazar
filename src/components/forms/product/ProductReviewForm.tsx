// src/components/forms/product/ProductReviewForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Star } from "lucide-react";
import React, { useState, ChangeEvent, useEffect } from "react";
import Image from "next/image";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";

type Props = {
  productId: number;
};

// Assuming Role ID for a regular User from models.py
const USER_ROLE_ID = 3;

export default function MheWriteAReview({ productId }: Props) {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [ProductData, setProdData] = useState(null);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState(""); // Maps to 'review' field in backend
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const stars = Array(5).fill(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const response = await api.get(`/products/${productId}/`);
        setProdData(response.data);
        // Assuming the product data is available here if needed
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast.error("Failed to fetch product data.");
      }
    };
    fetchProduct();
  }, [productId]);

  console.log("Product data:", ProductData);

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

      // onOpenChange(false); // Close the dialog, triggering parent to refresh reviews
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
    <>
      <div className="flex items-start gap-8 w-full">
        <Image
          src= {ProductData?.images[0]?.image || "/placeholder.png"}
          alt="Product image for review"
          width={79}
          height={64}
          className="object-cover"
        />

        <div className="pt-4 flex-1">
          <div className="font-bold text-2xl tracking-normal">
            How was the item?
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-bold text-base">Rate the item?</span>
        <div className="flex items-center gap-1">
          {stars.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={() => setRating(index + 1)}
              aria-label={`Rate ${index + 1} stars`}
            >
              <Star
                className={`h-6 w-6 ${index < rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                  }`}
              />
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-start gap-4 w-full">
        <h3 className="font-bold text-base">Write a review</h3>

        <div className="flex flex-col items-start justify-center gap-6 w-full">
          <Textarea
            className="min-h-[124px] text-[13px] text-[#666869]"
            placeholder="What should other customers know?"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            aria-label="Review text content"
          />

          <Card className="w-full bg-[#f9fcf8] border-[1.5px] border-dashed border-[#cdf0b8]">
            <CardContent className="flex items-center justify-center gap-3 p-4 cursor-pointer"
              onClick={() => fileInputRef.current?.click()} // Trigger file input click
            >
              <Camera className="w-6 h-6" />
              <span className="text-[13px] text-[#666869]">
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
              <div className="p-2 pt-0 text-sm text-gray-700">
                <p>Selected files:</p>
                <ul className="list-disc list-inside">
                  {selectedFiles.map((file, index) => (
                    <li key={file.name + index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <div className="flex flex-col items-start gap-2 w-full">
            <label htmlFor="review-title" className="font-bold text-base">
              Title your review{" "}
              <span className="font-normal text-xs">(required)</span>
            </label>
            <Input
              id="review-title"
              className="p-4 text-[13px] text-[#666869]"
              placeholder="What should other customers know?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Review title"
            />
          </div>
        </div>

        <div className="w-full">
          <Button
            className="w-full py-[19px] bg-[#5ca131] hover:bg-[#478831] text-[13px] font-bold"
            onClick={handleSubmitReview}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
}

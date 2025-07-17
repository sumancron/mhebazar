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
import React, { useState, JSX } from "react";
import Image from "next/image";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function MheWriteAReview({ isOpen, onOpenChange }: Props): JSX.Element {
  const [rating, setRating] = useState(0);
  const stars = Array(5).fill(0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[736px] p-6 gap-6">
        <div className="absolute right-4 top-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-start gap-8 w-full">
          <Image
            src="/no-product.png"
            alt="Product image"
            width={79}
            height={64}
            className="object-cover"
          />

          <DialogHeader className="pt-4 flex-1">
            <DialogTitle className="font-bold text-2xl tracking-normal">
              How was the item?
            </DialogTitle>
          </DialogHeader>
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
              >
                <Star
                  className={`h-6 w-6 ${
                    index < rating
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
            />

            <Card className="w-full bg-[#f9fcf8] border-[1.5px] border-dashed border-[#cdf0b8]">
              <CardContent className="flex items-center justify-center gap-3 p-4">
                <Camera className="w-6 h-6" />
                <span className="text-[13px] text-[#666869]">
                  Share a video or photo
                </span>
              </CardContent>
            </Card>

            <div className="flex flex-col items-start gap-2 w-full">
              <label className="font-bold text-base">
                Title your review{" "}
                <span className="font-normal text-xs">(required)</span>
              </label>
              <Input
                className="p-4 text-[13px] text-[#666869]"
                placeholder="What should other customers know?"
              />
            </div>
          </div>

          <div className="w-full">
            <Button className="w-full py-[19px] bg-[#5ca131] hover:bg-[#478831] text-[13px] font-bold">
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

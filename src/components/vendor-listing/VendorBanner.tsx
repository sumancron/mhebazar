"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card"; // Used for Carousel items
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay"; 

// Define the component's props
interface VendorBannerProps {
  company_name: string;
  brand: string;
  description: string;
  profile_photo: string;
  bannerImages: string[]; // Changed to accept an array of banner images
  productCount: number; // Added productCount to props
}

export default function VendorBanner({
  company_name,
  brand,
  description,
  profile_photo,
  bannerImages,
  productCount,
}: VendorBannerProps) {
  const [descExpanded, setDescExpanded] = useState(false);
  const isLongDesc = description.length > 200;

  // Ref for the autoplay plugin
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <div className="w-full bg-white pb-8">
      {/* --- Carousel Banner --- */}
      <div className="w-full aspect-[16/9] sm:aspect-[3/1] lg:aspect-[4/1] relative">
        <Carousel
          plugins={[plugin.current]}
          className="w-full h-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {/* Map through the banner images to create carousel items */}
            {bannerImages.map((src, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full h-full aspect-[16/9] sm:aspect-[3/1] lg:aspect-[4/1]">
                  <Image
                    src={src}
                    alt={`${company_name} Banner Image ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0} // Prioritize loading the first image
                    sizes="100vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4" />
          <CarouselNext className="absolute right-4" />
        </Carousel>

        {/* --- Logo and Product Count (Desktop) --- */}
        <div className="hidden sm:flex absolute -bottom-12 lg:-bottom-16 xl:-bottom-18 items-start gap-4 lg:gap-6 px-4 sm:px-6 md:px-8 z-30">
          <div className="bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 flex-shrink-0">
            <Image
              src={profile_photo} // Corrected: Use profile_photo prop
              alt={`${company_name} Logo`}
              width={144}
              height={144}
              className="object-contain w-full h-full p-2"
              priority
            />
          </div>
          <div className="bg-white rounded-full px-3 py-2 lg:px-4 lg:py-2 shadow-lg flex items-center justify-between gap-3 lg:gap-4 text-sm lg:text-base font-medium w-fit mt-6 lg:mt-8">
            <span className="text-gray-700">Products</span>
            <span className="bg-green-200 text-green-700 px-2 py-1 lg:px-3 lg:py-1 rounded-full font-bold text-xs lg:text-sm">
              {productCount} {/* Corrected: Use productCount prop */}
            </span>
          </div>
        </div>

        {/* --- Logo (Mobile) --- */}
        <div className="sm:hidden absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-30">
          <div className="bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center overflow-hidden w-24 h-24">
            <Image
              src={profile_photo} // Corrected: Use profile_photo prop
              alt={`${company_name} Logo`}
              width={80}
              height={80}
              className="object-contain w-full h-full p-2"
              priority
            />
          </div>
        </div>
      </div>

      {/* --- Product Count (Mobile) --- */}
      <div className="sm:hidden flex justify-center mt-16 mb-4 px-4">
        <div className="bg-white rounded-full px-4 py-2 shadow-lg flex items-center justify-between gap-4 text-sm font-medium border border-gray-100">
          <span className="text-gray-700">Products</span>
          <span className="bg-green-200 text-green-700 px-3 py-1 rounded-full font-bold text-xs">
            {productCount} {/* Corrected: Use productCount prop */}
          </span>
        </div>
      </div>

      {/* --- Description --- */}
      <div className="mt-8 sm:mt-20 lg:mt-24 mx-4 sm:mx-8 md:mx-12">
        <p
          className={`text-gray-700 text-sm sm:text-base leading-relaxed text-center sm:text-left ${!descExpanded && isLongDesc ? "line-clamp-3" : ""
            }`}
        >
          {description} {/* Corrected: Use description prop */}
        </p>
        {isLongDesc && (
          <div className="text-center sm:text-left">
            <button
              type="button"
              className="mt-2 text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
              onClick={() => setDescExpanded((v) => !v)}
            >
              {descExpanded ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
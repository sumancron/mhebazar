"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import MheWriteAReview from "@/components/forms/product/ProductReviewForm";

type Review = {
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  images: string[];
};

type ReviewData = {
  summary: {
    avg: number;
    total: number;
    breakdown: { star: number; percent: number }[];
  };
  say: string;
  reviewImages: string[];
  reviews: Review[];
};

const fallbackData: ReviewData = {
  summary: {
    avg: 4.5,
    total: 65,
    breakdown: [
      { star: 5, percent: 67 },
      { star: 4, percent: 17 },
      { star: 3, percent: 0 },
      { star: 2, percent: 7 },
      { star: 1, percent: 9 },
    ],
  },
  say: "Customers find the product versatile and efficient material handling solution designed for warehouses and distribution centres. With its electric power and precise control.",
  reviewImages: [
    "/rev1.png",
    "/rev2.png",
    "/rev3.png",
    "/rev4.png",
    "/rev5.png",
  ],
  reviews: [
    {
      name: "Surinder",
      avatar: "/avatar1.png",
      rating: 4.5,
      date: "13 October 2024",
      text: "This product is versatile and efficient material handling solution designed for warehouses and distribution centres. With its electric power and precise control.",
      images: ["/rev1.png", "/rev2.png"],
    },
    {
      name: "Naresh",
      avatar: "/avatar2.png",
      rating: 4.5,
      date: "13 October 2024",
      text: "This product is versatile and efficient material handling solution designed for warehouses and distribution centres. With its electric power and precise control.",
      images: ["/rev1.png", "/rev2.png"],
    },
    {
      name: "Avinash samrat",
      avatar: "/avatar3.png",
      rating: 4.5,
      date: "13 October 2024",
      text: "This product is versatile and efficient material handling solution designed for warehouses and distribution centres. With its electric power and precise control.",
      images: ["/rev1.png", "/rev2.png"],
    },
  ],
};

export default function ReviewSection({ slug }: { slug: string }) {
  const [data, setData] = useState<ReviewData | null>(null);
  const [imgScroll, setImgScroll] = useState(0);
  const [reviewOpen, setReviewOpen] = useState(false);


  // Simulate API fetch
  useEffect(() => {
    async function fetchData() {
      try {
        // const res = await fetch(`/reviews/${slug}`);
        // if (!res.ok) throw new Error("No data");
        // const reviewData = await res.json();
        // setData(reviewData);
        throw new Error("API not available");
      } catch {
        setData(fallbackData);
      }
    }
    fetchData();
  }, [slug]);

  if (!data) {
    // Skeleton
    return (
      <div className="max-w-7xl mx-auto p-4 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded w-full" />
            <div className="h-32 bg-gray-200 rounded w-full" />
          </div>
        </div>
      </div>
    );
  }

  // For image carousel
  const visibleImages = data.reviewImages.slice(imgScroll, imgScroll + 5);
  const canScrollLeft = imgScroll > 0;
  const canScrollRight = imgScroll + 5 < data.reviewImages.length;

  return (
    <div className="max-w-7xl mx-auto p-2 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Summary */}
        <div>
          <div className="bg-white rounded-lg border p-5 shadow-sm mb-6">
            <h3 className="font-semibold text-lg mb-2">Customer Reviews</h3>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-yellow-500">
                {data.summary.avg.toFixed(1)}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <span className="text-gray-600 text-sm">
                {data.summary.avg} out of 5
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-4">
              {data.summary.total} ratings
            </div>
            <div className="space-y-2 mb-4">
              {data.summary.breakdown.map((item) => (
                <div key={item.star} className="flex items-center gap-2">
                  <span className="w-8 text-xs">{item.star} star</span>
                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                  <span className="w-8 text-xs text-right">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <div className="font-semibold mb-1 text-gray-800">
                Review this product
              </div>
              <div className="text-xs text-gray-500 mb-2">
                Share your thoughts with other customers
              </div>
              <button
                className="w-full border border-green-600 text-green-600 font-semibold px-4 py-2 rounded hover:bg-green-50 transition"
                onClick={() => setReviewOpen(true)}
              >
                Write your product review
              </button>

              <MheWriteAReview
                isOpen={reviewOpen}
                onOpenChange={setReviewOpen}
              />
            </div>
          </div>
        </div>

        {/* Right: Reviews */}
        <div className="md:col-span-2 space-y-8">
          {/* Customers Say */}
          <div className="bg-white rounded-lg border p-5 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Customers Say</h3>
            <p className="text-gray-600 text-sm">{data.say}</p>
          </div>

          {/* Reviews with Images */}
          <div className="bg-white rounded-lg border p-5 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Reviews with Images</h4>
              <Link
                href="#"
                className="text-green-600 text-sm font-medium hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="relative">
              <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                {canScrollLeft && (
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-1"
                    onClick={() => setImgScroll(imgScroll - 1)}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="flex gap-4 ml-6 mr-6">
                  {visibleImages.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-gray-100 shadow"
                    >
                      <Image
                        src={src}
                        alt={`Review ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                {canScrollRight && (
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border rounded-full shadow p-1"
                    onClick={() => setImgScroll(imgScroll + 1)}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Top Reviews */}
          <div className="bg-white rounded-lg border p-5 shadow-sm">
            <h4 className="font-semibold mb-4">Top Reviews</h4>
            {data.reviews.map((review, i) => (
              <div
                key={i}
                className="mb-8 border-b last:border-b-0 pb-6 last:pb-0"
              >
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {review.avatar ? (
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-500">
                        {review.name[0]}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{review.name}</span>
                  <div className="flex items-center gap-1 ml-2">
                    {[1, 2, 3, 4, 5].map((j) => (
                      <Star
                        key={j}
                        className={`w-4 h-4 ${
                          review.rating >= j
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      {review.rating} out of 5
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Reviewed on {review.date}
                </div>
                <div className="text-sm mb-2">{review.text}</div>
                <div className="flex gap-2 mt-2">
                  {review.images.map((img, k) => (
                    <div
                      key={k}
                      className="relative w-16 h-16 rounded overflow-hidden bg-gray-100 shadow"
                    >
                      <Image
                        src={img}
                        alt="review image"
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-6 text-sm text-green-600 mt-2">
                  <button className="hover:underline">Helpful</button>
                  <button className="hover:underline">Report</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Responsive tweaks */}
      <style>{`
        @media (max-width: 768px) {
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        }
      `}</style>
    </div>
  );
}

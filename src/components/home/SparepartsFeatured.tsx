"use client";

import React, { useEffect, useState } from "react";
//import Image from "next/image";

import api from "@/lib/api";
import ProductCard from "@/components/elements/Product";

// Import shadcn/ui carousel components
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SparePart {
  images: { image: string }[];
  is_active: boolean;
  hide_price: boolean;
  direct_sale: boolean;
  stock_quantity: number;
  name: string;
  id: string | number;
  title: string;
  subtitle: string;
  price: number;
  currency: string;
  image: string;
}

export default function SparePartsFeatured() {
  const [spareParts, setSpareParts] = useState<SparePart[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpareParts = async () => {
      try {
        // Fetch products specifically from category 18
        const res = await api.get(`/products/`, {
          params: {
            category: 18,
          },
        });

        console.log("Fetched spare parts:", res.data);
        // Correctly access data from the response
        setSpareParts(res.data?.results || []);
      } catch (error) {
        console.error("Failed to fetch spare parts:", error);
        setSpareParts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSpareParts();
  }, []);

  return (
    <section className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Spare Parts
      </h2>
      {loading ? (
        <div className="w-full flex justify-center items-center py-16 text-gray-500 text-lg">
          Loading...
        </div>
      ) : spareParts.length > 0 ? (
        // Replaced the grid with the Carousel component
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {spareParts.map((spare) => (
              <CarouselItem
                key={spare.id}
                className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                  {/* <div className="bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)] hover:shadow-lg transition p-4 flex flex-col h-full"> */}
                    <ProductCard
                      id={Number(spare.id)}
                      image={spare.images[0].image}
                      title={spare.name}
                      subtitle={spare.subtitle}
                      price={spare.price}
                      currency={spare.currency}
                      directSale={spare.direct_sale}
                      is_active={spare.is_active}
                      hide_price={spare.hide_price}
                      stock_quantity={spare.stock_quantity}
                    />
                  {/* </div> */}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      ) : (
        // No products available message
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.04)]">
          <img
            src="/no-product.png"
            alt="No product"
            width={112}
            height={112}
            className="mb-4 opacity-70"
          />
          <div className="text-lg font-semibold text-gray-700 mb-1">
            No spare parts available
          </div>
          <div className="text-gray-500">
            There are no spare parts in this category at the moment.
          </div>
        </div>
      )}
    </section>
  );
}
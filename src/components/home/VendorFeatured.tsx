"use client";

// import React, { useEffect, useState } from "react";
// import ProductCard from "@/components/elements/Product";
import VendorCard from "../vendor-listing/VendorCard";
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "../ui/carousel";
import api from "@/lib/api";
import { useEffect, useState } from "react";


const VendorProductsFeatured: React.FC = () => {
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get("/vendor/approved/");
        // const sorted = sortPreferred(response.data.results || []);
        setVendors(response.data.results || []);
        // setFiltered(response.data.results || []);
        // setTotalCount(response.data.count || 0);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  return (
    <section className="w-full mx-auto px-4 py-10">
      <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">
        Vendor Products
      </h2>
      <Carousel>
        <CarouselContent>
          {vendors.map((vendor) => (
            <div key={vendor.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <VendorCard vendor={vendor} />
            </div>
            
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default VendorProductsFeatured;
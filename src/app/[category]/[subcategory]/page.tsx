"use client";
import ProductListPage, { Product } from "@/components/products/ProductList";
import { useEffect, useState } from "react";

const fallbackProducts: Product[] = [
  // ...same as above
];

export interface SubCategoryPageProps {
  params: { category: string; subcategory: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function SubCategoryPage({ params }: SubCategoryPageProps) {
  const { category, subcategory } = params;
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    // Replace this URL with your real API endpoint
    fetch(`/api/products?category=${category}&subcategory=${subcategory}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setProducts(data))
      .catch(() => setProducts(fallbackProducts)); // fallback on error
  }, [category, subcategory]);

  return <ProductListPage products={products} category={category} subcategory={subcategory} />;
}
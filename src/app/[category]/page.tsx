"use client";
import ProductListPage, { Product } from "@/components/products/ProductList";
import { useEffect, useState } from "react";

const fallbackProducts: Product[] = [
  // ...same as above
  {
    id: "1",
    image: "/api/placeholder/300/300",
    title: "She Forklift Tyres Oil Non-marking Solid Tyre",
    subtitle: "Premium quality non-marking solid tyre for forklifts",
    price: 4500,
    currency: "₹",
    category: "tyres",
    subcategory: "non-marking",
  },
  {
    id: "2",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Engine Oil Filter 0-414589 - Fits Doosan",
    subtitle: "High-performance engine oil filter for industrial vehicles",
    price: 2018,
    currency: "₹",
    category: "filters",
    subcategory: "oil-filter",
  },
  
];

export default function CategoryPage({ params }: { params: { category: string } }) {
  const { category } = params;
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    // Replace this URL with your real API endpoint
    fetch(`/api/products?category=${category}`)
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => setProducts(data))
      .catch(() => setProducts(fallbackProducts)); // fallback on error
  }, [category]);

  return <ProductListPage products={products} category={category} />;
}
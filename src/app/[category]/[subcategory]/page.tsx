"use client";
import ProductListPage, { Product } from "@/components/products/ProductList";
import { useEffect, useState } from "react";

const fallbackProducts: Product[] = [
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

export default function SubCategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { category, subcategory } = params;
  const [products, setProducts] = useState<Product[]>(fallbackProducts);

  useEffect(() => {
    fetch(`/api/products?category=${category}&subcategory=${subcategory}`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setProducts(data))
      .catch(() => setProducts(fallbackProducts));
  }, [category, subcategory]);

  return (
    <ProductListPage
      products={products}
      category={category}
      subcategory={subcategory}
    />
  );
}
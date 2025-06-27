import ProductListPage, { Product } from "@/components/products/ProductList";


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

// Server Component
export default async function SubCategoryPage(props: {
  params: { category: string; subcategory: string };
}) {
  // You can fetch data here using params
  // For now, just pass fallbackProducts
  // If you want to fetch from your API, use fetch() here (not useEffect)
  const { params } = await props;

  return (
    <ProductListPage
      products={fallbackProducts}
      category={params.category}
      subcategory={params.subcategory}
    />
  );
}
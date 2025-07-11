import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";

// Dummy data, replace with your API/fetch logic
const dummyProducts: Product[] = [
  {
    id: "1",
    image: "/api/placeholder/300/300",
    title: "She Forklift Tyres Oil Non-marking Solid Tyre",
    subtitle: "Premium quality non-marking solid tyre for forklifts",
    price: 4500,
    currency: "₹",
  },
  {
    id: "2",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Engine Oil Filter 0-414589 - Fits Doosan",
    subtitle: "High-performance engine oil filter for industrial vehicles",
    price: 2018,
    currency: "₹",
  },
  {
    id: "3",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Forklift Forks Chains Conex 1070-54004",
    subtitle: "Durable forklift fork chains for heavy-duty operations",
    price: 12000,
    currency: "₹",
  },
  {
    id: "4",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Forklift Forks Chains Conex 1070-54004",
    subtitle: "Durable forklift fork chains for heavy-duty operations",
    price: 12000,
    currency: "₹",
  },
  {
    id: "5",
    image: "/api/placeholder/300/300",
    title: "She Forklift Tyres Oil Non-marking Solid Tyre",
    subtitle: "Premium quality non-marking solid tyre for forklifts",
    price: 4500,
    currency: "₹",
  },
  {
    id: "6",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Engine Oil Filter 0-414589 - Fits Doosan",
    subtitle: "High-performance engine oil filter for industrial vehicles",
    price: 2018,
    currency: "₹",
  },
  {
    id: "7",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Forklift Forks Chains Conex 1070-54004",
    subtitle: "Durable forklift fork chains for heavy-duty operations",
    price: 12000,
    currency: "₹",
  },
  {
    id: "8",
    image: "/api/placeholder/300/300",
    title: "Mhe Bazar Forklift Forks Chains Conex 1070-54004",
    subtitle: "Durable forklift fork chains for heavy-duty operations",
    price: 12000,
    currency: "₹",
  },
];

export default function CategoryPage() {
  // You can fetch products based on category params here
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Category", href: "/category" },
          { label: "Subcategory", href: "/category/subcategory" },
        ]}
      />
    <ProductListing
      products={dummyProducts}
      title="Category Products"
      totalCount={94}
    />
    </>
  );
}
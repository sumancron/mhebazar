import ProductListing, { Product } from "@/components/products/ProductListing";
import Breadcrumb from "@/components/elements/Breadcrumb";
import VendorBanner from "@/components/vendor-listing/VendorBanner";

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

// Vendor data - move this to your actual data fetching logic
const vendorData = {
  logo: "/mhe-logo.png",
  banner: "/mhevendor.png",
  productCount: 54,
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum...",
};


export default function VendorPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Vendors", href: "/vendors" },
          { label: "Vendor Name", href: "/vendors/vendor-name" },
        ]}
      />
      <VendorBanner data={vendorData} />
      <ProductListing
        products={dummyProducts}
        title="Vendor Products"
        totalCount={94}
      />
    </>
  );
}

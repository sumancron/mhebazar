"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";
import AccountTabsUI from "@/components/account/OrderWishTabs";

// Dummy data for orders only
type OrderStatus = "In Transit" | "Cancelled" | "Delivered";

type Order = {
  id: string;
  status: OrderStatus;
  statusColor: string;
  product: {
    title: string;
    image: string;
    price: string;
  };
};

const orders: Order[] = [
  {
    id: "ABCD-12345",
    status: "In Transit",
    statusColor: "bg-blue-100 text-blue-700",
    product: {
      title: "Unik Semi Traction Batteries U-12120 (12v) 140 Ah...",
      image: "/battery.png",
      price: "₹ ******",
    },
  },
  {
    id: "ABCD-12346",
    status: "Cancelled",
    statusColor: "bg-red-100 text-red-700",
    product: {
      title: "Unik Semi Traction Batteries U-12120 (12v) 140 Ah...",
      image: "/battery.png",
      price: "₹ ******",
    },
  },
  {
    id: "ABCD-12347",
    status: "Delivered",
    statusColor: "bg-green-100 text-green-700",
    product: {
      title: "Unik Semi Traction Batteries U-12120 (12v) 140 Ah...",
      image: "/battery.png",
      price: "₹ ******",
    },
  },
];

export default function OrdersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account/orders" },
        ]}
      />
      <AccountTabsUI activeTab="orders" orders={orders} />
    </div>
  );
}
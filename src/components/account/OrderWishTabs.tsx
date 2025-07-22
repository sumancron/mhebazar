// src/components/account/OrderWishTabs.tsx
"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface Order {
  id: string; // This is now order_number (string) from backend
  status: "Pending" | "Confirmed" | "In Transit" | "Shipped" | "Delivered" | "Cancelled"; // Updated status types, added "Shipped"
  statusColor: string;
  product: { // Simplified to represent the main product in the order for display
    title: string;
    image: string;
    price: string; // Formatted price (e.g., "₹ 4500.00")
  };
}
interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: string; // Formatted price (e.g., "₹ 4500.00" or "₹ ******")
}
type TabType = "orders" | "wishlist";

const tabs = [
  { label: "My Orders", value: "orders" },
  { label: "Wishlist", value: "wishlist" },
];
// Updated statusTabs to reflect common order states from backend, mapped by component
const statusTabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" }, // Corresponds to 'pending'
  { label: "Confirmed", value: "Confirmed" }, // Corresponds to 'confirmed'
  { label: "In Progress", value: "In Transit" }, // Corresponds to 'shipped' (in_transit, out_for_delivery)
  { label: "Delivered", value: "Delivered" }, // Corresponds to 'delivered'
  { label: "Cancelled", value: "Cancelled" }, // Corresponds to 'cancelled'
];

export default function AccountTabsUI({
  activeTab,
  orders = [],
  wishlist = [],
}: {
  activeTab: TabType;
  orders?: Order[];
  wishlist?: WishlistItem[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState("all");

  // Filtered orders by status
  const filteredOrders =
    status === "all"
      ? orders
      : orders.filter((o) => {
          if (status === "In Transit") {
            // Include 'shipped' as 'In Transit'
            return o.status === "In Transit" || o.status === "Shipped"; // Assuming backend maps shipped to In Transit
          }
          return o.status === status;
        });

  // Tab click handler
  const handleTabClick = (tab: TabType) => {
    router.replace(`/account/${tab}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start gap-6 mt-4">
      {/* Tabs */}
      <div className="flex sm:flex-col w-full sm:w-56 mb-4 sm:mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTabClick(tab.value as TabType)}
            className={`w-full text-left px-6 py-4 rounded-lg font-medium text-base transition
              ${
                activeTab === tab.value
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-gray-50 text-gray-700"
              }
              `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          {activeTab === "orders" ? "My Orders" : "Wishlist"}
        </h1>
        {/* Status Tabs (only for orders) */}
        {activeTab === "orders" && (
          <div className="flex gap-6 mb-4 text-base font-medium overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                className={`pb-2 transition whitespace-nowrap ${
                  status === tab.value
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-green-600"
                }`}
                onClick={() => setStatus(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {/* List */}
        {activeTab === "orders" ? (
          <div className="flex flex-col gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <div
                  key={idx} // Using index is okay here if IDs are not unique or for mapping transformed data
                  className="flex items-center bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.03)] px-6 py-6"
                >
                  <Image
                    src={order.product.image}
                    alt={order.product.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain mr-6 flex-shrink-0"
                    unoptimized={order.product.image.startsWith('http')}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-800 text-base truncate">
                        Order ID: {order.id}
                      </span>
                    </div>
                    <div className="text-gray-700 text-base mb-1 truncate max-w-[calc(100%-1rem)]">
                      {order.product.title}
                    </div>
                    <div className="text-green-700 font-bold text-lg">
                      {order.product.price}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-10">No orders found.</div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {wishlist.length > 0 ? (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.03)] px-6 py-6"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain mr-6 flex-shrink-0"
                    unoptimized={item.image.startsWith('http')}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-800 text-base mb-1 truncate">
                      {item.title}
                    </div>
                    <div className="text-green-700 font-bold text-lg">
                      {item.price}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-10">No wishlist items found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
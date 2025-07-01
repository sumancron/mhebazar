"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

interface Order {
  id: string;
  status: "In Transit" | "Cancelled" | "Delivered";
  statusColor: string;
  product: {
    title: string;
    image: string;
    price: string;
  };
}
interface WishlistItem {
  id: string;
  title: string;
  image: string;
  price: string;
}
type TabType = "orders" | "wishlist";

const tabs = [
  { label: "My Orders", value: "orders" },
  { label: "Wishlist", value: "wishlist" },
];
const statusTabs = [
  { label: "All", value: "all" },
  { label: "In Progress", value: "In Transit" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
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
      : orders.filter((o) => o.status === status);

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
        {/* Status Tabs */}
        <div className="flex gap-6 mb-4 text-base font-medium">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              className={`pb-2 transition ${
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
        {/* List */}
        {activeTab === "orders" ? (
          <div className="flex flex-col gap-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.03)] px-6 py-6"
                >
                  <Image
                    src={order.product.image}
                    alt={order.product.title}
                    width={80}
                    height={80}
                    className="rounded-lg object-contain mr-6"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${order.statusColor}`}
                      >
                        {order.status}
                      </span>
                      <span className="font-bold text-gray-800 text-base">
                        Order ID: {order.id}
                      </span>
                    </div>
                    <div className="text-gray-700 text-base mb-1 truncate max-w-xs sm:max-w-md">
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
                    className="rounded-lg object-contain mr-6"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-base mb-1">
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
// src/app/account/orders/page.tsx
"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";
import AccountTabsUI from "@/components/account/OrderWishTabs";
import { useEffect, useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner"; // For error notifications
import { Button } from "@/components/ui/button"; // Assuming you have this button component

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

// Define the structure of product details nested within an order item
interface ProductDetailsInOrder {
  id: number;
  name: string;
  images: { id: number; image: string }[];
  price: string;
  // Add other relevant product fields if needed
}

// Define the structure of an order item
interface OrderItemApi {
  id: number;
  product: number;
  product_details: ProductDetailsInOrder;
  quantity: number;
  unit_price: string;
  total_price: string;
}

// Define the structure of an order from the API
interface OrderApi {
  id: number; // Backend Order ID
  order_number: string;
  status: OrderStatus;
  total_amount: string;
  shipping_address: string;
  phone_number: string;
  created_at: string;
  items: OrderItemApi[]; // Nested order items
}

interface ApiResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming /orders/ endpoint returns a list of orders for the logged-in user
      const response = await api.get<ApiResponse<OrderApi>>("/orders/");
      setOrders(response.data.results);
      console.log("Orders fetched:", response.data.results);
    } catch (err: unknown) {
      console.error("Failed to fetch orders:", err);
      setError("Failed to load your orders. Please try again later.");
      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Helper to map backend status to display status and color
  const mapStatusToDisplay = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { display: "Pending", color: "bg-yellow-100 text-yellow-700" };
      case "confirmed":
        return { display: "Confirmed", color: "bg-green-100 text-green-700" };
      case "shipped":
        return { display: "In Transit", color: "bg-blue-100 text-blue-700" };
      case "delivered":
        return { display: "Delivered", color: "bg-green-100 text-green-700" };
      case "cancelled":
        return { display: "Cancelled", color: "bg-red-100 text-red-700" };
      default:
        return { display: "Unknown", color: "bg-gray-100 text-gray-700" };
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 text-center">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
          <p className="ml-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={fetchOrders} className="mt-4">Retry Loading Orders</Button>
      </div>
    );
  }

  // Transform fetched orders into the format expected by AccountTabsUI
  const transformedOrders = orders.map(order => {
    const statusMap = mapStatusToDisplay(order.status);
    return {
      id: order.order_number, // Use order_number for display ID
      status: statusMap.display as "In Transit" | "Cancelled" | "Delivered", // Cast to match AccountTabsUI's type
      statusColor: statusMap.color,
      // Display first product's image and name, total order price
      product: {
        title: order.items[0]?.product_details?.name || "N/A",
        image: order.items[0]?.product_details?.images?.[0]?.image || "/no-product.png",
        price: `₹ ${parseFloat(order.total_amount).toLocaleString('en-IN')}`, // Display total order amount
      },
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account/orders" },
        ]}
      />
      <AccountTabsUI activeTab="orders" orders={transformedOrders} />
    </div>
  );
}
"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";
import AccountTabsUI from "@/components/account/OrderWishTabs";

// Dummy data for wishlist only
const wishlist = [
  {
    id: "WISH-1",
    title: "Unik Semi Traction Batteries U-12120 (12v) 140 Ah...",
    image: "/battery.png",
    price: "₹ ******",
  },
  {
    id: "WISH-2",
    title: "Exide Inva Tubular IT500 Battery (12v) 150 Ah...",
    image: "/battery.png",
    price: "₹ ******",
  },
];

export default function WishlistPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "My Account", href: "/account/wishlist" },
        ]}
      />
      <AccountTabsUI activeTab="wishlist" wishlist={wishlist} />
    </div>
  );
}
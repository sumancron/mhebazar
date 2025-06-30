"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";
import { Package, BookCheck, ShieldCheck, CreditCard, Headphones } from "lucide-react";

const accountOptions = [
  {
    title: "My Orders",
    desc: "Track Return or buy things again",
    icon: <Package className="w-14 h-14 text-green-600 stroke-[1.5]" />,
    href: "/orders",
  },
  {
    title: "Address",
    desc: "Edit addresses for orders and gifts",
    icon: <BookCheck className="w-14 h-14 text-green-600 stroke-[1.5]" />,
    href: "/account/address",
  },
  {
    title: "Login and Security",
    desc: "Edit login name, and mobile number",
    icon: <ShieldCheck className="w-14 h-14 text-green-600 stroke-[1.5]" />,
    href: "/account/security",
  },
  {
    title: "Payment Options",
    desc: "Edit or add payment methods",
    icon: <CreditCard className="w-14 h-14 text-green-600 stroke-[1.5]" />,
    href: "/account/payment",
  },
  {
    title: "Contact us",
    desc: "Contact our customer support",
    icon: <Headphones className="w-14 h-14 text-green-600 stroke-[1.5]" />,
    href: "/contact",
  },
];

const AccountPage = () => {
  return (
    <>
      <div className="w-full px-4 sm:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "My Account", href: "/account" },
          ]}
        />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">My Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {accountOptions.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.03)] border border-gray-100 p-7 flex flex-col items-start hover:shadow-lg transition group"
            >
              <div className="mb-6">{item.icon}</div>
              <div>
                <div className="font-semibold text-gray-800 text-lg group-hover:text-green-700">{item.title}</div>
                <div className="text-gray-500 text-base mt-1">{item.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default AccountPage;
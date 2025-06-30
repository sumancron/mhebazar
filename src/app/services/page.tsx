"use client";
import Breadcrumb from "@/components/elements/Breadcrumb";
import HomeBanner from "@/components/layout/HomeBanner";
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';


const ServicesPage = () => {
  const [isOpen, setIsOpen] = useState(true); // Toggle state

  return (
    <>
      {/* Breadcrumb */}
      <div className="w-full px-4 sm:px-8 pt-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", href: "/services" },
          ]}
        />
      </div>

      {/* Page Title */}
      <section className="bg-white p-6 md:p-8 w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Services
        </h1>
      </section>

      {/* HomeBanner Section */}
      <div className="w-full ">
        <HomeBanner />
      </div>

      <div className="w-full px-4 md:px-8 py-6">
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden transition-all duration-300">
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 cursor-pointer select-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold text-gray-800">Service Inquiry</h2>
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Collapsible Content */}
        <div
          className={`transition-all duration-500 ${
            isOpen ? 'max-h-[400px] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 py-0 px-6'
          } overflow-hidden`}
        >
          <p className="text-gray-700 mb-6">
            Fill in the form below to send us your inquiry. Our team will get back to you shortly.
          </p>

          <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-5 py-2 rounded-md transition">
            Send Inquiry
          </button>
        </div>
      </div>
    </div>

      
    </>
  );
};

export default ServicesPage;

"use client";
import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function VendorRegistrationDrawer({ open, onClose }: Props) {
  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          className="absolute right-4 top-4 text-2xl text-gray-700 hover:text-black"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {/* Content */}
        <div className="p-8 pt-14 flex-1 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-8">Become a Vendor</h2>
          <form
            className="flex flex-col gap-5"
            onSubmit={e => {
              e.preventDefault();
              // handle submit here
            }}
          >
            <div>
              <label className="block font-medium mb-1">
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter name"
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Company Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter company name"
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="Enter email"
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="************"
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Confirm-Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="************"
                className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <button
              type="submit"
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded py-3 text-base transition-colors"
            >
              Register as a Vendor
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Search } from "lucide-react";
import Image from "next/image";

interface Category {
  id: number;
  name: string;
  subcategories: string[];
}

// Example: Add subcategories for demo
const categories: Category[] = [
  { id: 1, name: "Battery", subcategories: ["Lithium", "Lead Acid", "Gel"] },
  { id: 2, name: "Manual Platform Trolly", subcategories: ["Mild Steel", "Stainless Steel"] },
  { id: 3, name: "Pallet Truck", subcategories: ["Hand Pallet Truck", "Electric Pallet Truck"] },
  { id: 4, name: "Stacker", subcategories: ["Manual Stacker", "Semi Electric Stacker", "Full Electric Stacker"] },
  { id: 5, name: "Dock Leveler", subcategories: [] },
  { id: 6, name: "Scissors Lift", subcategories: ["Electric", "Hydraulic"] },
  { id: 7, name: "Electric Pallet Truck (BOPT)", subcategories: [] },
  { id: 8, name: "Reach Truck", subcategories: ["Standard", "Double Deep"] },
  { id: 9, name: "Rocking System", subcategories: [] },
  { id: 10, name: "Forklift", subcategories: ["Diesel Forklift", "Electric Forklift", "LPG Forklift"] },
  { id: 11, name: "Container Handler", subcategories: [] },
  // ...aur bhi add kar sakte ho
];

const SideFilter = ({
  selectedFilters,
  onFilterChange,
}: {
  selectedFilters?: Set<string>;
  onFilterChange?: (id: string) => void;
}) => {
  const [search, setSearch] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // Filter categories by search
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="sticky top-0 w-full max-w-xs min-h-screen bg-white border-r border-gray-200 flex flex-col overflow-y-auto z-20">
      <div className="p-3 sm:p-4 pb-2">
        <h1 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Filter
        </h1>
        <div className="flex items-center gap-2 mb-4 relative">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by"
            className="w-full border border-gray-200 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="absolute right-2 text-gray-400 hover:text-red-500 text-xs"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              tabIndex={0}
            >
              ×
            </button>
          )}
        </div>
        <h2 className="text-base font-semibold mb-2 text-gray-800">Categories</h2>
        <div className="space-y-1">
          {filteredCategories.length === 0 && (
            <div className="text-gray-400 text-xs px-2 py-2">No categories found.</div>
          )}
          {filteredCategories.map((category) => (
            <div key={category.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() =>
                  setExpandedCategory(
                    expandedCategory === category.id ? null : category.id
                  )
                }
                className={`w-full flex items-center justify-between px-2 py-2 rounded-md transition-colors duration-200 ${
                  expandedCategory === category.id ? "bg-green-50" : "hover:bg-gray-50"
                }`}
                aria-expanded={expandedCategory === category.id}
                aria-controls={`cat-panel-${category.id}`}
              >
                <span className="text-gray-700 text-sm">{category.name}</span>
                {category.subcategories.length > 0 ? (
                  expandedCategory === category.id ? (
                    <ChevronDown className="w-4 h-4 text-green-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )
                ) : null}
              </button>
              <AnimatePresence>
                {expandedCategory === category.id &&
                  category.subcategories.length > 0 && (
                    <motion.div
                      id={`cat-panel-${category.id}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 mt-1 space-y-1">
                        {category.subcategories.map((subcategory, index) => (
                          <motion.button
                            key={index}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className={`w-full text-left p-2 text-xs rounded-md transition-colors duration-200 ${
                              selectedFilters?.has(subcategory)
                                ? "bg-green-100 text-green-700 font-semibold ring-2 ring-green-300"
                                : "text-gray-600 hover:bg-green-50"
                            }`}
                            onClick={() =>
                              onFilterChange && onFilterChange(subcategory)
                            }
                          >
                            {subcategory}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      {/* Banner Image */}
      <div className="p-3 sm:p-4 mt-auto">
        <Image
          src="/sidebar.png"
          alt="Forklift Service"
          width={400}
          height={300}
          className="rounded-lg object-cover w-full h-auto"
          priority
        />
      </div>
    </aside>
  );
};

export default SideFilter;
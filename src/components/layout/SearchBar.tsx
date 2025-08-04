// SearchBar.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Search, Mic } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; // Assuming you have an api.ts for API calls

// TypeScript support for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
type SpeechRecognition = any;
type SpeechRecognitionEvent = any;

interface Product {
  id: number;
  name: string;
  category_name: string;
  subcategory_name: string;
}

interface SubCategory {
  id: number;
  name: string;
  category_name: string;
}

interface Category {
  id: number;
  name: string;
}

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

// Helper function to create slugs
const createSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<Category | SubCategory | Product>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Fetch all categories, subcategories, and products on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
          api.get<Category[]>("/categories/"),
          api.get<SubCategory[]>("/subcategories/"),
          api.get<{ results: Product[] }>("/products/"),
        ]);
        setAllCategories(categoriesRes.data);
        setAllSubcategories(subcategoriesRes.data);
        setAllProducts(productsRes.data.results);
      } catch (error) {
        console.error("Error fetching search data:", error);
      }
    };
    fetchAllData();
  }, []);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const filteredCategories = allCategories.filter((cat) =>
        cat.name.toLowerCase().includes(lowerCaseQuery)
      );

      const filteredSubcategories = allSubcategories.filter((subcat) =>
        subcat.name.toLowerCase().includes(lowerCaseQuery)
      );

      // FIX: Add null checks before calling .toLowerCase() on optional properties
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        (product.category_name && product.category_name.toLowerCase().includes(lowerCaseQuery)) ||
        (product.subcategory_name && product.subcategory_name.toLowerCase().includes(lowerCaseQuery))
      );

      // Combine and remove duplicates based on name and type
      const combinedSuggestions = [
        ...filteredCategories.map((item) => ({ ...item, type: "category" })),
        ...filteredSubcategories.map((item) => ({ ...item, type: "subcategory" })),
        ...filteredProducts.map((item) => ({ ...item, type: "product" })),
      ];

      const uniqueSuggestions = Array.from(
        new Map(combinedSuggestions.map((item) => [`${item.type}-${item.name}`, item])).values()
      );

      setSuggestions(uniqueSuggestions.slice(0, 10)); // Limit suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allCategories, allSubcategories, allProducts]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Start/stop voice recognition
  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setListening(false);
        setShowSuggestions(true); // Show suggestions after voice input
      };

      recognitionRef.current.onerror = () => {
        setListening(false);
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    if (!listening) {
      setListening(true);
      recognitionRef.current.start();
    } else {
      setListening(false);
      recognitionRef.current.stop();
    }
  };

  const handleSuggestionClick = useCallback((item: Category | SubCategory | Product & { type: string }) => {
    setShowSuggestions(false);
    setSearchQuery(""); // Clear search query after selection
    if (item.type === "category") {
      router.push(`/${createSlug(item.name)}`);
    } else if (item.type === "subcategory") {
      const subCategoryItem = item as SubCategory;
      router.push(`/${createSlug(subCategoryItem.category_name)}/${createSlug(subCategoryItem.name)}`);
    } else if (item.type === "product") {
      router.push(`/product/${createSlug(item.name)}`);
    }
  }, [router, setSearchQuery]);

  return (
    <div className="relative w-full" ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search by Products, Category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 0 && setSuggestions(suggestions.length > 0 ? suggestions : []) && setShowSuggestions(true)}
        className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-shadow"
        autoComplete="off"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <button
        type="button"
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1 transition
          ${listening ? "bg-green-100 animate-pulse shadow-lg" : "hover:bg-gray-100"}
        `}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        onClick={handleMicClick}
      >
        <Mic className={`w-4 h-4 ${listening ? "text-green-600" : "text-gray-400"}`} />
        {listening && (
          <span className="absolute -top-2 -right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
        )}
      </button>
      {listening && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-white border border-green-200 rounded px-2 py-1 text-xs text-green-700 shadow animate-fade-in">
          Listening...
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm flex justify-between items-center"
              onClick={() => handleSuggestionClick(item as (Category | SubCategory | Product) & { type: string })}
            >
              <span>
                {item.name}
                {" "}
                {/* Display category/subcategory name for products */}
                {'category_name' in item && item.category_name && item.type === 'product' && (
                  <span className="text-gray-500 text-xs"> (in {item.category_name})</span>
                )}
                 {'category_name' in item && item.category_name && item.type === 'subcategory' && (
                  <span className="text-gray-500 text-xs"> (Category: {item.category_name})</span>
                )}
              </span>
              <span className="text-xs text-gray-400 capitalize">{item.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
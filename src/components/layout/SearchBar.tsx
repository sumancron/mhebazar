// SearchBar.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Search, Mic } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "sonner"; // For better user feedback than alert

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
  category_name: string; // Subcategory needs its parent category name for routing
}

interface Category {
  id: number;
  name: string;
}

interface Vendor {
  id: number;
  brand: string;
  company_name: string;
  username: string; // Often matches brand or company name if brand is empty
}

type SearchSuggestion = (Category | SubCategory | Product | Vendor) & { type: string };

type SearchBarProps = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

// Helper function to create slugs
const createSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  const [listening, setListening] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allSubcategories, setAllSubcategories] = useState<SubCategory[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allVendors, setAllVendors] = useState<Vendor[]>([]); // New state for vendors

  // Fetch all categories, subcategories, products, and vendors on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, productsRes, vendorsRes] = await Promise.all([
          api.get<Category[]>("/categories/"),
          api.get<SubCategory[]>("/subcategories/"),
          api.get<{ results: Product[] }>("/products/"),
          api.get<{ results: Vendor[] }>("/vendor/"), // Fetch vendors
        ]);
        setAllCategories(categoriesRes.data);
        setAllSubcategories(subcategoriesRes.data);
        setAllProducts(productsRes.data.results);
        setAllVendors(vendorsRes.data.results.filter(vendor => vendor.is_approved)); // Filter approved vendors
      } catch (error) {
        console.error("Error fetching search data:", error);
        toast.error("Failed to load search data. Please try again.");
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

      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.category_name.toLowerCase().includes(lowerCaseQuery) ||
        product.subcategory_name.toLowerCase().includes(lowerCaseQuery)
      );

      // New: Filter vendors by brand or company name
      const filteredVendors = allVendors.filter((vendor) =>
        (vendor.brand && vendor.brand.toLowerCase().includes(lowerCaseQuery)) ||
        (vendor.company_name && vendor.company_name.toLowerCase().includes(lowerCaseQuery)) ||
        (vendor.username && vendor.username.toLowerCase().includes(lowerCaseQuery))
      );

      // Combine and remove duplicates based on name and type
      const combinedSuggestions: SearchSuggestion[] = [
        ...filteredCategories.map((item) => ({ ...item, type: "category" })),
        ...filteredSubcategories.map((item) => ({ ...item, type: "subcategory" })),
        ...filteredProducts.map((item) => ({ ...item, type: "product" })),
        ...filteredVendors.map((item) => ({ ...item, type: "vendor" })), // Add vendors
      ];

      // Use a map to ensure uniqueness by combining type and a relevant name field
      const uniqueSuggestions = Array.from(
        new Map(combinedSuggestions.map((item) => {
          let key;
          if (item.type === 'vendor') {
            // Use brand or company_name for vendor uniqueness
            key = `${item.type}-${(item as Vendor).brand || (item as Vendor).company_name || (item as Vendor).username}`;
          } else {
            key = `${item.type}-${item.name}`;
          }
          return [key, item];
        })).values()
      );

      setSuggestions(uniqueSuggestions.slice(0, 10)); // Limit suggestions
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allCategories, allSubcategories, allProducts, allVendors]);

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
    // Check for global SpeechRecognition object, which includes webkitSpeechRecognition
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      toast.info("Voice search is not fully supported in this browser. Try Chrome or Edge for best experience.");
      setListening(false); // Ensure listening state is false
      return;
    }

    // Initialize recognition only once
    if (!recognitionRef.current) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-IN"; // Set language for Indian English
      recognitionRef.current.interimResults = false; // Only return final results
      recognitionRef.current.maxAlternatives = 1; // Get the most likely transcription

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setListening(false);
        setShowSuggestions(true); // Show suggestions after voice input
        toast.success("Voice input received!");
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionEvent) => {
        setListening(false);
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed') {
          toast.error("Microphone access denied. Please allow microphone in browser settings.");
        } else if (event.error === 'no-speech') {
          toast.info("No speech detected. Please try again.");
        } else {
          toast.error("Voice input error. Please try typing.");
        }
      };

      recognitionRef.current.onend = () => {
        setListening(false);
      };
    }

    if (!listening) {
      try {
        setListening(true);
        recognitionRef.current.start();
        toast.info("Listening... Please speak now.");
      } catch (e: any) {
        // Catch potential errors if start() is called multiple times or rapidly
        console.error("Error starting speech recognition:", e);
        setListening(false);
        toast.error("Could not start voice input. Please try again or type.");
      }
    } else {
      setListening(false);
      recognitionRef.current.stop();
      toast.info("Stopped listening.");
    }
  };

  const handleSuggestionClick = useCallback((item: SearchSuggestion) => {
    setShowSuggestions(false);
    setSearchQuery(""); // Clear search query after selection
    if (item.type === "category") {
      router.push(`/${createSlug(item.name)}`);
    } else if (item.type === "subcategory") {
      const subCategoryItem = item as SubCategory;
      // Ensure category_name exists for subcategory routing
      if (subCategoryItem.category_name) {
        router.push(`/${createSlug(subCategoryItem.category_name)}/${createSlug(subCategoryItem.name)}`);
      } else {
        router.push(`/search?q=${createSlug(subCategoryItem.name)}`); // Fallback if category name is missing
      }
    } else if (item.type === "product") {
      // Products might need ID for specific routing, adjust as per your product page logic
      router.push(`/product/${createSlug(item.name)}/?id=${item.id}`);
    } else if (item.type === "vendor") {
      const vendorItem = item as Vendor;
      // Prioritize brand, then company_name, then username for slug
      const vendorSlug = createSlug(vendorItem.brand || vendorItem.company_name || vendorItem.username || 'unknown-vendor');
      router.push(`/vendor-listing/${vendorSlug}`);
    }
  }, [router, setSearchQuery]);

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={searchBarRef}>
      <input
        type="text"
        placeholder="Search by Products, Categories, Subcategories, or Vendors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 0 && setSuggestions(suggestions.length > 0 ? suggestions : []) && setShowSuggestions(true)}
        className="w-full px-4 py-2 pl-10 pr-12 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm md:text-base transition-all duration-200 ease-in-out placeholder:text-gray-500 hover:border-gray-400"
        autoComplete="off"
        aria-label="Search input with suggestions and voice search"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <button
        type="button"
        className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-1.5 transition-all duration-200 ease-in-out
          ${listening ? "bg-green-100 animate-pulse shadow-lg ring-2 ring-green-400 ring-opacity-75" : "hover:bg-gray-100"}
        `}
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        onClick={handleMicClick}
        title={listening ? "Stop Voice Search" : "Start Voice Search"}
      >
        <Mic className={`w-4 h-4 ${listening ? "text-green-600" : "text-gray-500"}`} />
        {listening && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping-slow"></span>
        )}
      </button>

      {/* Live region for accessibility feedback on voice search status */}
      <div
        aria-live="polite"
        className="sr-only" // Visually hidden, but announced by screen readers
      >
        {listening ? "Voice search activated." : "Voice search deactivated."}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto custom-scrollbar-y transform animate-fade-in-down origin-top">
          {suggestions.map((item, index) => (
            <div
              key={`${item.type}-${item.id || item.name}-${index}`} // More robust key
              className="px-4 py-3 hover:bg-green-50 cursor-pointer text-sm md:text-base flex justify-between items-center transition-colors duration-150 ease-in-out border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(item)}
            >
              <span className="flex-1 text-gray-800 font-medium">
                {item.name}
                {" "}
                {/* Display supplementary info */}
                {'category_name' in item && item.category_name && item.type === 'product' && (
                  <span className="text-gray-500 text-xs italic"> (in {item.category_name})</span>
                )}
                {'category_name' in item && item.category_name && item.type === 'subcategory' && (
                  <span className="text-gray-500 text-xs italic"> (Category: {item.category_name})</span>
                )}
                {'brand' in item && item.type === 'vendor' && item.brand && (
                  <span className="text-gray-500 text-xs italic"> ({item.brand})</span>
                )}
                 {'company_name' in item && item.type === 'vendor' && !item.brand && item.company_name && (
                  <span className="text-gray-500 text-xs italic"> ({item.company_name})</span>
                )}
              </span>
              <span className="text-xs text-green-600 font-semibold capitalize bg-green-50 px-2 py-0.5 rounded-full min-w-[70px] text-center ml-2">
                {item.type}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
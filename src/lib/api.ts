import axios, { AxiosInstance } from "axios";

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          `${API_BASE_URL}/api/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
  banner?: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  banner?: string;
  image?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  description?: string;
  category: number;
  banner?: string;
  image?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  subcategory: number;
  vendor: number;
  images?: string[];
  brochure?: string;
  rating?: number;
  review_count?: number;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  user: number;
}

export interface WishlistItem {
  id: number;
  product: Product;
  user: number;
}

export interface Quote {
  id: number;
  product: Product;
  user: number;
  quantity: number;
  message?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface Rental {
  id: number;
  product: Product;
  user: number;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "rejected" | "returned";
  created_at: string;
}

export interface Review {
  id: number;
  product: Product;
  user: User;
  rating: number;
  comment: string;
  images?: string[];
  created_at: string;
}

export interface Banner {
  id: number;
  title: string;
  description?: string;
  image: string;
  link?: string;
  is_active: boolean;
}

export interface ContactForm {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

// Auth API
export const authAPI = {
  // Google Login
  googleLogin: (access_token: string) =>
    api.post("/api/google/login/", { access_token }),

  // User Registration
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => api.post("/api/register/", userData),

  // Token Login
  login: (credentials: { username: string; password: string }) =>
    api.post("/api/token/", credentials),

  // Token Refresh
  refreshToken: (refresh: string) =>
    api.post("/api/token/refresh/", { refresh }),
};

// User API
export const userAPI = {
  // Get current user
  getMe: () => api.get<User>("/api/users/me/"),

  // Get user by ID
  getUser: (id: number) => api.get<User>(`/api/users/${id}/`),

  // Update user
  updateUser: (id: number, userData: Partial<User>) =>
    api.patch<User>(`/api/users/${id}/`, userData),

  // Upload user banner
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/api/users/${id}/upload_banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Role API
export const roleAPI = {
  // Get all roles
  getRoles: () => api.get("/api/roles/"),

  // Get role by ID
  getRole: (id: number) => api.get(`/api/roles/${id}/`),
};

// Category API
export const categoryAPI = {
  // Get all categories
  getCategories: () => api.get<Category[]>("/api/categories/"),

  // Get category by ID
  getCategory: (id: number) => api.get<Category>(`/api/categories/${id}/`),

  // Create category
  createCategory: (categoryData: Partial<Category>) =>
    api.post<Category>("/api/categories/", categoryData),

  // Update category
  updateCategory: (id: number, categoryData: Partial<Category>) =>
    api.patch<Category>(`/api/categories/${id}/`, categoryData),

  // Delete category
  deleteCategory: (id: number) => api.delete(`/api/categories/${id}/`),

  // Upload category banner
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/api/categories/${id}/upload_Banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload category image
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/api/categories/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Subcategory API
export const subcategoryAPI = {
  // Get all subcategories
  getSubcategories: () => api.get<Subcategory[]>("/api/subcategories/"),

  // Get subcategory by ID
  getSubcategory: (id: number) =>
    api.get<Subcategory>(`/api/subcategories/${id}/`),

  // Create subcategory
  createSubcategory: (subcategoryData: Partial<Subcategory>) =>
    api.post<Subcategory>("/api/subcategories/", subcategoryData),

  // Update subcategory
  updateSubcategory: (id: number, subcategoryData: Partial<Subcategory>) =>
    api.patch<Subcategory>(`/api/subcategories/${id}/`, subcategoryData),

  // Delete subcategory
  deleteSubcategory: (id: number) => api.delete(`/api/subcategories/${id}/`),

  // Upload subcategory banner
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/api/subcategories/${id}/upload_Banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload subcategory image
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/api/subcategories/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Product API
export const productAPI = {
  // Get all products
  getProducts: (params?: {
    category?: number;
    subcategory?: number;
    search?: string;
    page?: number;
    page_size?: number;
  }) => api.get<Product[]>("/api/products/", { params }),

  // Get product by ID
  getProduct: (id: number) => api.get<Product>(`/api/products/${id}/`),

  // Get most popular products
  getMostPopular: () => api.get<Product[]>("/api/products/most_popular/"),

  // Get new arrivals
  getNewArrivals: () => api.get<Product[]>("/api/products/new_arrival/"),

  // Get top rated products
  getTopRated: () => api.get<Product[]>("/api/products/top_rated/"),

  // Create product
  createProduct: (productData: Partial<Product>) =>
    api.post<Product>("/api/products/", productData),

  // Update product
  updateProduct: (id: number, productData: Partial<Product>) =>
    api.patch<Product>(`/api/products/${id}/`, productData),

  // Delete product
  deleteProduct: (id: number) => api.delete(`/api/products/${id}/`),

  // Add to cart
  addToCart: (id: number, quantity: number = 1) =>
    api.post(`/api/products/${id}/add_to_cart/`, { quantity }),

  // Add to wishlist
  addToWishlist: (id: number) =>
    api.post(`/api/products/${id}/add_to_wishlist/`),

  // Upload product brochure
  uploadBrochure: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("brochure", file);
    return api.post(`/api/products/${id}/upload_brochure/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload product images
  uploadImages: (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    return api.post(`/api/products/${id}/upload_images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Cart API
export const cartAPI = {
  // Get cart items
  getCart: () => api.get<CartItem[]>("/api/cart/"),

  // Clear cart
  clearCart: () => api.post("/api/cart/clear/"),

  // Get cart item by ID
  getCartItem: (id: number) => api.get<CartItem>(`/api/cart/${id}/`),

  // Update cart item
  updateCartItem: (id: number, quantity: number) =>
    api.patch<CartItem>(`/api/cart/${id}/`, { quantity }),

  // Delete cart item
  deleteCartItem: (id: number) => api.delete(`/api/cart/${id}/`),
};

// Wishlist API
export const wishlistAPI = {
  // Get wishlist items
  getWishlist: () => api.get<WishlistItem[]>("/api/wishlist/"),

  // Get wishlist item by ID
  getWishlistItem: (id: number) =>
    api.get<WishlistItem>(`/api/wishlist/${id}/`),

  // Delete wishlist item
  deleteWishlistItem: (id: number) => api.delete(`/api/wishlist/${id}/`),
};

// Quote API
export const quoteAPI = {
  // Get all quotes
  getQuotes: () => api.get<Quote[]>("/api/quotes/"),

  // Get quote by ID
  getQuote: (id: number) => api.get<Quote>(`/api/quotes/${id}/`),

  // Create quote
  createQuote: (quoteData: Partial<Quote>) =>
    api.post<Quote>("/api/quotes/", quoteData),

  // Update quote
  updateQuote: (id: number, quoteData: Partial<Quote>) =>
    api.patch<Quote>(`/api/quotes/${id}/`, quoteData),

  // Delete quote
  deleteQuote: (id: number) => api.delete(`/api/quotes/${id}/`),

  // Approve quote
  approveQuote: (id: number) => api.post(`/api/quotes/${id}/approve/`),

  // Reject quote
  rejectQuote: (id: number) => api.post(`/api/quotes/${id}/reject/`),
};

// Rental API
export const rentalAPI = {
  // Get all rentals
  getRentals: () => api.get<Rental[]>("/api/rentals/"),

  // Get rental by ID
  getRental: (id: number) => api.get<Rental>(`/api/rentals/${id}/`),

  // Create rental
  createRental: (rentalData: Partial<Rental>) =>
    api.post<Rental>("/api/rentals/", rentalData),

  // Update rental
  updateRental: (id: number, rentalData: Partial<Rental>) =>
    api.patch<Rental>(`/api/rentals/${id}/`, rentalData),

  // Delete rental
  deleteRental: (id: number) => api.delete(`/api/rentals/${id}/`),

  // Approve rental
  approveRental: (id: number) => api.post(`/api/rentals/${id}/approve/`),

  // Reject rental
  rejectRental: (id: number) => api.post(`/api/rentals/${id}/reject/`),

  // Mark rental as returned
  markReturned: (id: number) => api.post(`/api/rentals/${id}/mark_returned/`),
};

// Contact Form API
export const contactFormAPI = {
  // Get all contact forms
  getContactForms: () => api.get<ContactForm[]>("/api/contact-forms/"),

  // Get contact form by ID
  getContactForm: (id: number) =>
    api.get<ContactForm>(`/api/contact-forms/${id}/`),

  // Create contact form
  createContactForm: (formData: Partial<ContactForm>) =>
    api.post<ContactForm>("/api/contact-forms/", formData),

  // Update contact form
  updateContactForm: (id: number, formData: Partial<ContactForm>) =>
    api.patch<ContactForm>(`/api/contact-forms/${id}/`, formData),

  // Delete contact form
  deleteContactForm: (id: number) => api.delete(`/api/contact-forms/${id}/`),
};

// Banner API
export const bannerAPI = {
  // Get all banners
  getBanners: () => api.get<Banner[]>("/api/banners/"),

  // Get banner by ID
  getBanner: (id: number) => api.get<Banner>(`/api/banners/${id}/`),

  // Create banner
  createBanner: (bannerData: Partial<Banner>) =>
    api.post<Banner>("/api/banners/", bannerData),

  // Update banner
  updateBanner: (id: number, bannerData: Partial<Banner>) =>
    api.patch<Banner>(`/api/banners/${id}/`, bannerData),

  // Delete banner
  deleteBanner: (id: number) => api.delete(`/api/banners/${id}/`),

  // Upload banner image
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/api/banners/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Review API
export const reviewAPI = {
  // Get all reviews
  getReviews: (params?: { product?: number }) =>
    api.get<Review[]>("/api/reviews/", { params }),

  // Get review by ID
  getReview: (id: number) => api.get<Review>(`/api/reviews/${id}/`),

  // Create review
  createReview: (reviewData: Partial<Review>) =>
    api.post<Review>("/api/reviews/", reviewData),

  // Update review
  updateReview: (id: number, reviewData: Partial<Review>) =>
    api.patch<Review>(`/api/reviews/${id}/`, reviewData),

  // Delete review
  deleteReview: (id: number) => api.delete(`/api/reviews/${id}/`),

  // Upload review images
  uploadImages: (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    return api.post(`/api/reviews/${id}/upload_images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;

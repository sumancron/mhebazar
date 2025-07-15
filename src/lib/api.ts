import axios, { AxiosInstance } from "axios";

// API base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to every request
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

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If token expired (401) and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          {
            refresh: refreshToken,
          }
        );

        // Update token and retry original request
        localStorage.setItem("access_token", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// TypeScript interfaces for type safety
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

// Authentication API endpoints
export const authAPI = {
  // Usage: await authAPI.googleLogin(token)
  googleLogin: (access_token: string) =>
    api.post("/google/login/", { access_token }),

  // Usage: await authAPI.register({username, email, password, first_name, last_name})
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => api.post("/register/", userData),

  // Usage: await authAPI.login({username, password})
  login: (credentials: { username: string; password: string }) =>
    api.post("/token/", credentials),

  // Usage: await authAPI.refreshToken(refreshToken)
  refreshToken: (refresh: string) =>
    api.post("/token/refresh/", { refresh }),
};

// User management API endpoints
export const userAPI = {
  // Get current authenticated user
  // Usage: const user = await userAPI.getMe()
  getMe: () => api.get<User>("/users/me/"),

  // Get specific user by ID
  // Usage: const user = await userAPI.getUser(123)
  getUser: (id: number) => api.get<User>(`/users/${id}/`),

  // Update user information
  // Usage: await userAPI.updateUser(123, {first_name: "John"})
  updateUser: (id: number, userData: Partial<User>) =>
    api.patch<User>(`/users/${id}/`, userData),

  // Upload user banner image
  // Usage: await userAPI.uploadBanner(123, fileObject)
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/users/${id}/upload_banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Role management API endpoints
export const roleAPI = {
  // Get all available roles
  // Usage: const roles = await roleAPI.getRoles()
  getRoles: () => api.get("/roles/"),

  // Get specific role by ID
  // Usage: const role = await roleAPI.getRole(1)
  getRole: (id: number) => api.get(`/roles/${id}/`),
};

// Category management API endpoints
export const categoryAPI = {
  // Get all categories
  // Usage: const categories = await categoryAPI.getCategories()
  getCategories: () => api.get<Category[]>("/categories/"),

  // Get specific category by ID
  // Usage: const category = await categoryAPI.getCategory(1)
  getCategory: (id: number) => api.get<Category>(`/categories/${id}/`),

  // Create new category
  // Usage: await categoryAPI.createCategory({name: "Electronics", description: "..."})
  createCategory: (categoryData: Partial<Category>) =>
    api.post<Category>("/categories/", categoryData),

  // Update existing category
  // Usage: await categoryAPI.updateCategory(1, {name: "New Name"})
  updateCategory: (id: number, categoryData: Partial<Category>) =>
    api.patch<Category>(`/categories/${id}/`, categoryData),

  // Delete category
  // Usage: await categoryAPI.deleteCategory(1)
  deleteCategory: (id: number) => api.delete(`/categories/${id}/`),

  // Upload category banner
  // Usage: await categoryAPI.uploadBanner(1, fileObject)
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/categories/${id}/upload_Banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload category image
  // Usage: await categoryAPI.uploadImage(1, fileObject)
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/categories/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Subcategory management API endpoints
export const subcategoryAPI = {
  // Get all subcategories
  // Usage: const subcategories = await subcategoryAPI.getSubcategories()
  getSubcategories: () => api.get<Subcategory[]>("/subcategories/"),

  // Get specific subcategory by ID
  // Usage: const subcategory = await subcategoryAPI.getSubcategory(1)
  getSubcategory: (id: number) =>
    api.get<Subcategory>(`/subcategories/${id}/`),

  // Create new subcategory
  // Usage: await subcategoryAPI.createSubcategory({name: "Laptops", category: 1})
  createSubcategory: (subcategoryData: Partial<Subcategory>) =>
    api.post<Subcategory>("/subcategories/", subcategoryData),

  // Update existing subcategory
  // Usage: await subcategoryAPI.updateSubcategory(1, {name: "New Name"})
  updateSubcategory: (id: number, subcategoryData: Partial<Subcategory>) =>
    api.patch<Subcategory>(`/subcategories/${id}/`, subcategoryData),

  // Delete subcategory
  // Usage: await subcategoryAPI.deleteSubcategory(1)
  deleteSubcategory: (id: number) => api.delete(`/subcategories/${id}/`),

  // Upload subcategory banner
  // Usage: await subcategoryAPI.uploadBanner(1, fileObject)
  uploadBanner: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("banner", file);
    return api.post(`/subcategories/${id}/upload_Banner/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload subcategory image
  // Usage: await subcategoryAPI.uploadImage(1, fileObject)
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/subcategories/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Product management API endpoints
export const productAPI = {
  // Get all products with optional filters
  // Usage: await productAPI.getProducts({category: 1, search: "laptop", page: 1})
  getProducts: (params?: {
    category?: number;
    subcategory?: number;
    search?: string;
    page?: number;
    page_size?: number;
  }) => api.get<Product[]>("/products/", { params }),

  // Get specific product by ID
  // Usage: const product = await productAPI.getProduct(1)
  getProduct: (id: number) => api.get<Product>(`/products/${id}/`),

  // Get most popular products
  // Usage: const products = await productAPI.getMostPopular()
  getMostPopular: () => api.get<Product[]>("/products/most_popular/"),

  // Get new arrivals
  // Usage: const products = await productAPI.getNewArrivals()
  getNewArrivals: () => api.get<Product[]>("/products/new_arrival/"),

  // Get top rated products
  // Usage: const products = await productAPI.getTopRated()
  getTopRated: () => api.get<Product[]>("/products/top_rated/"),

  // Create new product
  // Usage: await productAPI.createProduct({name: "Laptop", price: 999, category: 1})
  createProduct: (productData: Partial<Product>) =>
    api.post<Product>("/products/", productData),

  // Update existing product
  // Usage: await productAPI.updateProduct(1, {price: 899})
  updateProduct: (id: number, productData: Partial<Product>) =>
    api.patch<Product>(`/products/${id}/`, productData),

  // Delete product
  // Usage: await productAPI.deleteProduct(1)
  deleteProduct: (id: number) => api.delete(`/products/${id}/`),

  // Add product to cart
  // Usage: await productAPI.addToCart(1, 2) // product id, quantity
  addToCart: (id: number, quantity: number = 1) =>
    api.post(`/products/${id}/add_to_cart/`, { quantity }),

  // Add product to wishlist
  // Usage: await productAPI.addToWishlist(1)
  addToWishlist: (id: number) =>
    api.post(`/products/${id}/add_to_wishlist/`),

  // Upload product brochure
  // Usage: await productAPI.uploadBrochure(1, fileObject)
  uploadBrochure: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("brochure", file);
    return api.post(`/products/${id}/upload_brochure/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Upload product images
  // Usage: await productAPI.uploadImages(1, [file1, file2])
  uploadImages: (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    return api.post(`/products/${id}/upload_images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Shopping cart API endpoints
export const cartAPI = {
  // Get all cart items for current user
  // Usage: const cartItems = await cartAPI.getCart()
  getCart: () => api.get<CartItem[]>("/cart/"),

  // Clear all items from cart
  // Usage: await cartAPI.clearCart()
  clearCart: () => api.post("/cart/clear/"),

  // Get specific cart item by ID
  // Usage: const cartItem = await cartAPI.getCartItem(1)
  getCartItem: (id: number) => api.get<CartItem>(`/cart/${id}/`),

  // Update cart item quantity
  // Usage: await cartAPI.updateCartItem(1, 5) // cart item id, new quantity
  updateCartItem: (id: number, quantity: number) =>
    api.patch<CartItem>(`/cart/${id}/`, { quantity }),

  // Remove item from cart
  // Usage: await cartAPI.deleteCartItem(1)
  deleteCartItem: (id: number) => api.delete(`/cart/${id}/`),
};

// Wishlist API endpoints
export const wishlistAPI = {
  // Get all wishlist items for current user
  // Usage: const wishlistItems = await wishlistAPI.getWishlist()
  getWishlist: () => api.get<WishlistItem[]>("/wishlist/"),

  // Get specific wishlist item by ID
  // Usage: const wishlistItem = await wishlistAPI.getWishlistItem(1)
  getWishlistItem: (id: number) =>
    api.get<WishlistItem>(`/wishlist/${id}/`),

  // Remove item from wishlist
  // Usage: await wishlistAPI.deleteWishlistItem(1)
  deleteWishlistItem: (id: number) => api.delete(`/wishlist/${id}/`),
};

// Quote request API endpoints
export const quoteAPI = {
  // Get all quotes for current user
  // Usage: const quotes = await quoteAPI.getQuotes()
  getQuotes: () => api.get<Quote[]>("/quotes/"),

  // Get specific quote by ID
  // Usage: const quote = await quoteAPI.getQuote(1)
  getQuote: (id: number) => api.get<Quote>(`/quotes/${id}/`),

  // Create new quote request
  // Usage: await quoteAPI.createQuote({product: 1, quantity: 10, message: "Bulk order"})
  createQuote: (quoteData: Partial<Quote>) =>
    api.post<Quote>("/quotes/", quoteData),

  // Update existing quote
  // Usage: await quoteAPI.updateQuote(1, {quantity: 15})
  updateQuote: (id: number, quoteData: Partial<Quote>) =>
    api.patch<Quote>(`/quotes/${id}/`, quoteData),

  // Delete quote
  // Usage: await quoteAPI.deleteQuote(1)
  deleteQuote: (id: number) => api.delete(`/quotes/${id}/`),

  // Approve quote (admin/vendor action)
  // Usage: await quoteAPI.approveQuote(1)
  approveQuote: (id: number) => api.post(`/quotes/${id}/approve/`),

  // Reject quote (admin/vendor action)
  // Usage: await quoteAPI.rejectQuote(1)
  rejectQuote: (id: number) => api.post(`/quotes/${id}/reject/`),
};

// Rental API endpoints
export const rentalAPI = {
  // Get all rentals for current user
  // Usage: const rentals = await rentalAPI.getRentals()
  getRentals: () => api.get<Rental[]>("/rentals/"),

  // Get specific rental by ID
  // Usage: const rental = await rentalAPI.getRental(1)
  getRental: (id: number) => api.get<Rental>(`/rentals/${id}/`),

  // Create new rental request
  // Usage: await rentalAPI.createRental({product: 1, start_date: "2024-01-01", end_date: "2024-01-07"})
  createRental: (rentalData: Partial<Rental>) =>
    api.post<Rental>("/rentals/", rentalData),

  // Update existing rental
  // Usage: await rentalAPI.updateRental(1, {end_date: "2024-01-10"})
  updateRental: (id: number, rentalData: Partial<Rental>) =>
    api.patch<Rental>(`/rentals/${id}/`, rentalData),

  // Delete rental
  // Usage: await rentalAPI.deleteRental(1)
  deleteRental: (id: number) => api.delete(`/rentals/${id}/`),

  // Approve rental (admin/vendor action)
  // Usage: await rentalAPI.approveRental(1)
  approveRental: (id: number) => api.post(`/rentals/${id}/approve/`),

  // Reject rental (admin/vendor action)
  // Usage: await rentalAPI.rejectRental(1)
  rejectRental: (id: number) => api.post(`/rentals/${id}/reject/`),

  // Mark rental as returned
  // Usage: await rentalAPI.markReturned(1)
  markReturned: (id: number) => api.post(`/rentals/${id}/mark_returned/`),
};

// Contact form API endpoints
export const contactFormAPI = {
  // Get all contact forms (admin only)
  // Usage: const forms = await contactFormAPI.getContactForms()
  getContactForms: () => api.get<ContactForm[]>("/contact-forms/"),

  // Get specific contact form by ID
  // Usage: const form = await contactFormAPI.getContactForm(1)
  getContactForm: (id: number) =>
    api.get<ContactForm>(`/contact-forms/${id}/`),

  // Create new contact form submission
  // Usage: await contactFormAPI.createContactForm({name: "John", email: "john@example.com", subject: "Help", message: "..."})
  createContactForm: (formData: Partial<ContactForm>) =>
    api.post<ContactForm>("/contact-forms/", formData),

  // Update contact form (admin only)
  // Usage: await contactFormAPI.updateContactForm(1, {status: "resolved"})
  updateContactForm: (id: number, formData: Partial<ContactForm>) =>
    api.patch<ContactForm>(`/contact-forms/${id}/`, formData),

  // Delete contact form
  // Usage: await contactFormAPI.deleteContactForm(1)
  deleteContactForm: (id: number) => api.delete(`/contact-forms/${id}/`),
};

// Banner management API endpoints
export const bannerAPI = {
  // Get all banners
  // Usage: const banners = await bannerAPI.getBanners()
  getBanners: () => api.get<Banner[]>("/banners/"),

  // Get specific banner by ID
  // Usage: const banner = await bannerAPI.getBanner(1)
  getBanner: (id: number) => api.get<Banner>(`/banners/${id}/`),

  // Create new banner
  // Usage: await bannerAPI.createBanner({title: "Sale", description: "50% off", is_active: true})
  createBanner: (bannerData: Partial<Banner>) =>
    api.post<Banner>("/banners/", bannerData),

  // Update existing banner
  // Usage: await bannerAPI.updateBanner(1, {is_active: false})
  updateBanner: (id: number, bannerData: Partial<Banner>) =>
    api.patch<Banner>(`/banners/${id}/`, bannerData),

  // Delete banner
  // Usage: await bannerAPI.deleteBanner(1)
  deleteBanner: (id: number) => api.delete(`/banners/${id}/`),

  // Upload banner image
  // Usage: await bannerAPI.uploadImage(1, fileObject)
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post(`/banners/${id}/upload_Image/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Review management API endpoints
export const reviewAPI = {
  // Get all reviews, optionally filtered by product
  // Usage: const reviews = await reviewAPI.getReviews({product: 1})
  getReviews: (params?: { product?: number }) =>
    api.get<Review[]>("/reviews/", { params }),

  // Get specific review by ID
  // Usage: const review = await reviewAPI.getReview(1)
  getReview: (id: number) => api.get<Review>(`/reviews/${id}/`),

  // Create new review
  // Usage: await reviewAPI.createReview({product: 1, rating: 5, comment: "Great product!"})
  createReview: (reviewData: Partial<Review>) =>
    api.post<Review>("/reviews/", reviewData),

  // Update existing review
  // Usage: await reviewAPI.updateReview(1, {rating: 4, comment: "Good product"})
  updateReview: (id: number, reviewData: Partial<Review>) =>
    api.patch<Review>(`/reviews/${id}/`, reviewData),

  // Delete review
  // Usage: await reviewAPI.deleteReview(1)
  deleteReview: (id: number) => api.delete(`/reviews/${id}/`),

  // Upload review images
  // Usage: await reviewAPI.uploadImages(1, [file1, file2])
  uploadImages: (id: number, files: File[]) => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    return api.post(`/reviews/${id}/upload_images/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;

/*
HOW TO USE IN COMPONENTS:

1. With useApi hook (recommended):
```tsx
import { useApi } from './hooks/useApi';
import { productAPI } from './api';

const ProductList = () => {
  const { data: products, loading, error, execute } = useApi(productAPI.getProducts);

  useEffect(() => {
    execute(); // Fetch products on component mount
  }, [execute]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
};
```

2. Direct API calls:
```tsx
import { productAPI } from './api';

const handleAddToCart = async (productId: number, quantity: number) => {
  try {
    await productAPI.addToCart(productId, quantity);
    alert('Added to cart!');
  } catch (error) {
    console.error('Failed to add to cart:', error);
  }
};
```

3. With form handling:
```tsx
import { authAPI } from './api';

const LoginForm = () => {
  const [credentials, setCredentials] = useState({username: '', password: ''});
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      // form fields...
    </form>
  );
};
```
*/
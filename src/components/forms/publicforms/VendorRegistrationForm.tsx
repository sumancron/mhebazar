"use client"; // This directive marks the component as a Client Component

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import Cookies from "js-cookie"; // Library to handle browser cookies
import api from "@/lib/api"; // For making HTTP requests
import { toast } from "sonner"; // Assuming you have sonner for displaying toasts/notifications

// Define the structure of a User object based on your backend's /users/me endpoint response.
// It's crucial that this interface accurately reflects the data you receive.
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  is_email_verified: boolean;
  date_joined: string;
  last_login: string;
  role: { // The role object is key for authorization
    id: number; // 1 for Admin, 2 for Vendor, 3 for User (as per your models.py)
    name: string;
    description: string;
  };
  // Add any other user properties you receive from your backend's /users/me endpoint
}

// Define the shape of the UserContext, including the user object and helper states/functions.
interface UserContextType {
  user: User | null; // The current authenticated user, or null if not logged in
  setUser: (user: User | null) => void; // Function to update the user state
  isLoading: boolean; // True while user data is being fetched
  isAuthenticated: boolean; // True if a user is logged in
  isAdmin: boolean; // True if the logged-in user is an Admin
  isVendor: boolean; // True if the logged-in user is a Vendor
  isRegularUser: boolean; // True if the logged-in user is a regular User
}

// Create the React Context. Default value is undefined, and we'll check for it in useUser hook.
const UserContext = createContext<UserContextType | undefined>(undefined);

// Define the props for the UserProvider component. It will wrap other components.
interface UserProviderProps {
  children: ReactNode; // ReactNode allows any valid React child (elements, strings, etc.)
}

/**
 * UserProvider component manages the global user state and authentication status.
 * It fetches user data on initial load and provides it to all components wrapped within it.
 */
export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null); // State to hold user data
  const [isLoading, setIsLoading] = useState(true); // State to track loading status

  // Retrieve API base URL and API key from environment variables.
  // These should be configured in your .env.local file (e.g., NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api)

  /**
   * Fetches user data from the backend using the access token.
   * This function is called on component mount to re-authenticate the user if a token exists.
   */
  const fetchUser = React.useCallback(async () => {
    // Get access token from cookies. Cookies are preferred for security and middleware access.
    const accessToken = Cookies.get("access_token");
    // Also check localStorage for access token, especially if Google login stores it there.
    const localStorageAccessToken = localStorage.getItem("access_token");

    // Prioritize cookie token, then localStorage token.
    const tokenToUse = accessToken || localStorageAccessToken;

    if (tokenToUse) {
      try {
        // Make an API call to your backend's /users/me/ endpoint to get user details.
        const userResponse = await api.get('/users/me/');
        setUser(userResponse.data); // Set the fetched user data into the state
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        // If fetching user data fails (e.g., token expired or invalid), clear all tokens
        // and set user to null, effectively logging them out on the client side.
        Cookies.remove("access_token");
        localStorage.removeItem("access_token");
        Cookies.remove("refresh_token"); // Also remove refresh token if access token is bad
        setUser(null); // Clear user data from context
        toast.error("Your session has expired. Please log in again."); // Notify the user
      } finally {
        setIsLoading(false); // Loading is complete, regardless of success or failure
      }
    } else {
      setIsLoading(false); // No token found, so no loading needed
    }
  }, []);

  // useEffect hook to run fetchUser only once when the component mounts.
  // This ensures the user's session is checked when the application loads.
  useEffect(() => {
    fetchUser();
  }, [fetchUser]); // Empty dependency array means this effect runs only once after the initial render

  // Derived states for easy access to authentication and role status.
  const isAuthenticated = !!user; // True if `user` object is not null
  const isAdmin = user?.role?.id === 1; // Check if user's role ID is 1 (Admin)
  const isVendor = user?.role?.id === 2; // Check if user's role ID is 2 (Vendor)
  const isRegularUser = user?.role?.id === 3; // Check if user's role ID is 3 (Regular User)

  // Provide the user data and helper states/functions to all children components.
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        isAdmin,
        isVendor,
        isRegularUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * Custom hook to consume the UserContext.
 * This hook makes it easy for any component to access the user's information.
 */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    // This error helps ensure that useUser is always called within a UserProvider.
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
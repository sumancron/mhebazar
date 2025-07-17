// src/context/UserContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback // Import useCallback
} from "react";
import Cookies from "js-cookie";
import axios from "axios"; // Assuming you will use an axiosInstance from lib eventually

// Define the UserBannerItem interface
interface UserBannerItem {
  id: number;
  url: string;
  // Add other properties if your banner items have them
}

// Define the User interface based on your provided user object
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  phone: string | null;
  address: string | null;
  user_banner: UserBannerItem[]; // Corrected type
  is_email_verified: boolean;
  is_account_locked: boolean;
  date_joined: string;
  last_login: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = process.env.X_API_KEY;

  // Wrap fetchUser in useCallback to memoize it
  const fetchUser = useCallback(async (accessToken: string) => {
    try {
      const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-API-KEY": API_KEY,
        },
      });
      // Ensure the fetched data matches the User interface
      setUser(userResponse.data as User); // Cast here as well for consistency
    } catch (error) {
      console.error("Failed to fetch user during context initialization:", error);
      setUser(null);
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, API_KEY]); // Dependencies for useCallback

  useEffect(() => {
    const accessToken = Cookies.get("access_token");
    if (accessToken) {
      fetchUser(accessToken);
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]); // Now fetchUser is a dependency and won't cause infinite re-renders

  const logout = () => {
    setUser(null);
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    // Optionally redirect to login page. In Next.js, useRouter is preferred
    // If you plan to use useRouter here, you'd need to pass it into the context or make logout async
    // For simplicity, sticking to window.location.href here if not changing context logic.
    // If using router.push, you'd need to import it here or pass it from _app.tsx if UserProvider was there.
    window.location.href = "/login"; // This works fine
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
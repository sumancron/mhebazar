// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios"; // Used to make API calls for token validation/refresh

// Define the role IDs as per your Django `models.py` Role class.
// This ensures consistency between frontend and backend role definitions.
const ROLES = {
  ADMIN: 1,
  VENDOR: 2,
  USER: 3,
};

// Define paths that are publicly accessible without any authentication.
// Users can visit these pages whether they are logged in or not.
const publicPaths = ["/login", "/register", "/forgot-password", "/"]; // Add more as needed, e.g., "/products", "/contact"

/**
 * Middleware function to handle authentication and role-based authorization.
 * It runs before a request is completed, allowing for redirects or modifications.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl; // Get the current path of the request

  // Retrieve access and refresh tokens from the request's cookies.
  // Middleware runs on the server/edge, so `localStorage` is not available here.
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  let userRole: number | null = null; // Stores the user's role ID (1, 2, or 3)
  let isAuthenticated = false; // Flag to track if the user is authenticated

  // --- Authentication Check and Token Refresh Logic ---
  // Define API base URL and API key at the top of the middleware function so they're accessible everywhere.
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY; // Ensure this env var is accessible in middleware

  // If an access token exists, try to validate it and get the user's role.
  if (accessToken) {
    try {
      // In a production environment, if your JWT token is self-contained and signed,
      // you could decode and verify it directly here to extract the role without an API call.
      // For this example, we'll make an API call to your backend's /users/me/ endpoint
      // to get the user's full details and role, which is a robust way to ensure token validity.

      const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Send the access token
          "X-API-KEY": API_KEY, // Include your custom API key
        },
      });
      userRole = userResponse.data?.role?.id; // Extract the role ID from the response
      isAuthenticated = true; // Mark as authenticated
    } catch (error) {
      console.error("Middleware: Access token validation failed:", error);
      // If access token is invalid or expired, try to refresh it using the refresh token.
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/token/refresh/`,
            { refresh: refreshToken }, // Send the refresh token to your backend
            {
              headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json",
              },
            }
          );
          const newAccessToken = refreshResponse.data?.access; // Get the new access token

          // If refresh is successful, create a new response to set the new access token cookie.
          const response = NextResponse.next();
          response.cookies.set("access_token", newAccessToken, {
            httpOnly: true, // Make it HttpOnly for better security (cannot be accessed by client-side JS)
            secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
            sameSite: "lax", // Protects against some CSRF attacks
            maxAge: 60 * 60, // Set expiry (e.g., 1 hour for access token)
          });

          // Re-fetch user data with the new access token to get the updated role.
          const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "X-API-KEY": API_KEY,
            },
          });
          userRole = userResponse.data?.role?.id;
          isAuthenticated = true;
          return response; // Continue with the request, now with the new token
        } catch (refreshError) {
          console.error("Middleware: Token refresh failed:", refreshError);
          // If refresh also fails, clear all tokens and redirect to login.
          const response = NextResponse.redirect(new URL("/login", request.url));
          response.cookies.delete("access_token");
          response.cookies.delete("refresh_token");
          return response;
        }
      } else {
        // No refresh token available, so clear the invalid access token and redirect to login.
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }
    }
  }

  // --- Public Path Handling ---
  // If the requested path is in the list of public paths:
  if (publicPaths.includes(pathname)) {
    // If an authenticated user tries to access login or register pages, redirect them to home.
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // Allow access to public paths
  }

  // --- Protected Path Handling (requires authentication for all non-public paths) ---
  // If the user is not authenticated and tries to access any path that is not public,
  // redirect them to the login page.
  if (!isAuthenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    // Clear any stale tokens just in case, before redirecting.
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  }

  // --- Role-Based Access Control (User is authenticated at this point) ---

  // Admin (Role ID 1): Can access any page. No restrictions.
  if (userRole === ROLES.ADMIN) {
    return NextResponse.next(); // Allow access
  }

  // Vendor (Role ID 2): Cannot access paths starting with "/admin".
  // They can access all other paths, including "/vendor/*" paths.
  if (userRole === ROLES.VENDOR) {
    if (pathname.startsWith("/admin")) {
      // Redirect vendors trying to access admin pages to their dashboard.
      return NextResponse.redirect(new URL("/vendor/dashboard", request.url));
    }
    return NextResponse.next(); // Allow access to other paths
  }

  // Regular User (Role ID 3): Cannot access paths starting with "/admin" or "/vendor".
  // They can access all other general user pages.
  if (userRole === ROLES.USER) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/vendor")) {
      // Redirect regular users trying to access admin or vendor pages to the home page.
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next(); // Allow access to other paths
  }

  // Fallback: If a user is authenticated but their role is unknown or not explicitly handled,
  // you might choose to allow access (as done here) or redirect them to a default page.
  return NextResponse.next();
}

/**
 * Configuration for the middleware.
 * The `matcher` array specifies which paths the middleware should apply to.
 * It's crucial to exclude static assets and API routes to prevent performance issues
 * and infinite loops.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - /api (API routes)
     * - /_next/static (Next.js static files)
     * - /_next/image (Next.js image optimization files)
     * - /favicon.ico (favicon file)
     * - Any files in the public folder (e.g., /images, /docs) - represented by `.*\\..*`
     *
     * The regex `"/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"` means:
     * Match any path that does NOT contain "api", "_next/static", "_next/image",
     * "favicon.ico", or a file extension (like .css, .js, .png).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

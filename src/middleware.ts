// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface UserRole {
  id: number;
  name: string;
}

interface MiddlewareUser {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  // Add other fields if needed, e.g., for user_banner if you use it in middleware
  user_banner?: { id: number; url: string }[];
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshToken = request.cookies.get('refresh_token')?.value; // Though refresh token should ideally be HttpOnly

  // Define public paths that anyone can access
  const publicPaths = [
    '/login', '/register', '/forgot-password', '/', '/contact', '/about',
    '/rental', '/attachments', '/spare-parts', '/services', '/training',
    '/vendor-listing', '/subscription-plan'
  ];

  // Paths that are publicly viewable even if they contain dynamic segments
  const publicPrefixPaths = [
    '/product/', // e.g., /product/some-id
    '/category/' // e.g., /category/some-name
  ];

  // Paths that require *any* authenticated user (logged in, regardless of role)
  const authRequiredPaths = ['/cart', '/wishlist', '/account'];

  // Paths specifically for Admin role (ID 1)
  const adminOnlyPaths = ['/admin', '/admin/dashboard', '/admin/users', '/admin/products'];

  // Paths specifically for Vendor role (ID 2)
  const vendorOnlyPaths = ['/vendor', '/vendor/dashboard', '/vendor/products', '/vendor/profile', '/vendor/orders'];

  const currentPath = request.nextUrl.pathname;

  // --- 1. Check for Public Access First ---
  const isPublicPath = publicPaths.includes(currentPath) || publicPrefixPaths.some(prefix => currentPath.startsWith(prefix));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // --- 2. Authenticated User Check (Fetch User Role) ---
  let userRole: number | null = null;
  let isAuthenticated = false;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = process.env.X_API_KEY;

  if (accessToken && API_BASE_URL && API_KEY) {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-API-KEY': API_KEY,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json() as MiddlewareUser;
        userRole = userData.role?.id;
        isAuthenticated = true;
      } else {
        // Token might be expired or invalid, log and attempt to clear.
        console.warn(`Middleware: Failed to fetch user (status: ${userResponse.status}). Token might be expired.`);
        // Attempt to clear potentially bad tokens to force re-login
        request.cookies.delete('access_token');
        request.cookies.delete('refresh_token'); // Make sure backend sets this as HttpOnly for security
        // Redirect if the path is not public (already handled above)
        if (!isPublicPath) { // Redundant but good for safety
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }
    } catch (error) {
      console.error("Middleware: Error fetching user data:", error);
      // Clear tokens on network/fetch error too
      request.cookies.delete('access_token');
      request.cookies.delete('refresh_token');
      if (!isPublicPath) { // Redundant but good for safety
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  // --- 3. Enforce Authentication for General Authenticated Paths ---
  const requiresAuth = authRequiredPaths.some(path => currentPath.startsWith(path));
  if (requiresAuth && !isAuthenticated) {
    console.log(`Middleware: Redirecting unauthenticated access to ${currentPath} to /login`);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // --- 4. Enforce Role-Based Access for Restricted Paths ---
  // Check Admin-only paths
  const isTryingToAccessAdmin = adminOnlyPaths.some(path => currentPath.startsWith(path));
  if (isTryingToAccessAdmin) {
    if (!isAuthenticated || userRole !== 1) { // User must be authenticated AND admin
      console.warn(`Middleware: Unauthorized access attempt to admin path ${currentPath} by role ${userRole}. Redirecting.`);
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to home or a 403 page
    }
  }

  // Check Vendor-only paths
  const isTryingToAccessVendor = vendorOnlyPaths.some(path => currentPath.startsWith(path));
  if (isTryingToAccessVendor) {
    if (!isAuthenticated || userRole !== 2) { // User must be authenticated AND vendor
      console.warn(`Middleware: Unauthorized access attempt to vendor path ${currentPath} by role ${userRole}. Redirecting.`);
      return NextResponse.redirect(new URL('/', request.url)); // Redirect to home or a 403 page
    }
  }

  // If none of the above conditions triggered a redirect, allow the request to proceed.
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all paths except Next.js internal files (_next),
    // static assets, and the API route (if you have /api/ folder)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
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
  user_banner?: { id: number; url: string }[];
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshToken = request.cookies.get('refresh_token')?.value; // Refresh token should be HttpOnly in backend

  const publicPaths = [
    '/login', '/register', '/forgot-password', '/', '/contact', '/about',
    '/rental', '/attachments', '/spare-parts', '/services', '/training',
    '/vendor-listing', '/subscription-plan'
  ];
  const publicPrefixPaths = [
    '/product/',
    '/category/'
  ];
  const authRequiredPaths = ['/cart', '/wishlist', '/account'];
  const adminOnlyPaths = ['/admin', '/admin/dashboard', '/admin/users', '/admin/products'];
  const vendorOnlyPaths = ['/vendor', '/vendor/dashboard', '/vendor/products', '/vendor/profile', '/vendor/orders'];

  const currentPath = request.nextUrl.pathname;

  console.log(`[Middleware] Path: ${currentPath}`);
  console.log(`[Middleware] Has Access Token: ${!!accessToken}`);

  // --- 1. Check for Public Access First ---
  const isPublicPath = publicPaths.includes(currentPath) || publicPrefixPaths.some(prefix => currentPath.startsWith(prefix));
  if (isPublicPath) {
    console.log(`[Middleware] Path ${currentPath} is public. Allowing access.`);
    return NextResponse.next();
  }

  // --- 2. Authenticated User Check (Fetch User Role) ---
  let userRole: number | null = null;
  let isAuthenticated = false;

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = process.env.X_API_KEY;

  if (!API_BASE_URL || !API_KEY) {
      console.error("[Middleware] API_BASE_URL or API_KEY is not defined. Check .env variables.");
      // Decide if this should immediately redirect or fail. For production, probably redirect.
      return NextResponse.redirect(new URL('/login', request.url));
  }

  if (accessToken) {
    try {
      console.log(`[Middleware] Fetching user data for token validation: ${accessToken.substring(0,10)}...`);
      const userResponse = await fetch(`${API_BASE_URL}/users/me/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-API-KEY': API_KEY,
        },
        // IMPORTANT: In middleware, do not include 'withCredentials: true' for server-side fetches.
        // Cookies are automatically sent by the browser to the domain, but here we explicitly use `request.cookies.get`.
      });

      if (userResponse.ok) {
        const userData = await userResponse.json() as MiddlewareUser;
        userRole = userData.role?.id;
        isAuthenticated = true;
        console.log(`[Middleware] User authenticated. Role ID: ${userRole}. Username: ${userData.username || userData.email}`);
      } else {
        console.warn(`[Middleware] Failed to fetch user (status: ${userResponse.status}). Token might be expired or invalid.`);
        // Attempt to clear potentially bad tokens to force re-login
        request.cookies.delete('access_token');
        request.cookies.delete('refresh_token');
        // Redirect only if the path is not public (which we checked at the start)
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      console.error("[Middleware] Error fetching user data:", error);
      request.cookies.delete('access_token');
      request.cookies.delete('refresh_token');
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    console.log("[Middleware] No access token found.");
  }

  // --- 3. Enforce Authentication for General Authenticated Paths ---
  const requiresAuth = authRequiredPaths.some(path => currentPath.startsWith(path));
  if (requiresAuth) { // Only proceed if the current path requires authentication
      if (!isAuthenticated) { // If user is NOT authenticated
          console.log(`[Middleware] Path ${currentPath} requires authentication, but user is not authenticated. Redirecting to /login.`);
          return NextResponse.redirect(new URL('/login', request.url));
      } else {
          console.log(`[Middleware] Path ${currentPath} requires authentication. User is authenticated. Proceeding to role check.`);
      }
  }


  // --- 4. Enforce Role-Based Access for Restricted Paths ---
  // Check Admin-only paths
  const isTryingToAccessAdmin = adminOnlyPaths.some(path => currentPath.startsWith(path));
  if (isTryingToAccessAdmin) {
    if (!isAuthenticated || userRole !== 1) { // User must be authenticated AND admin
      console.warn(`[Middleware] Unauthorized access attempt to admin path ${currentPath} by role ${userRole}. Redirecting.`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log(`[Middleware] Admin user (Role ID: ${userRole}) accessing admin path ${currentPath}. Allowing.`);
  }

  // Check Vendor-only paths
  const isTryingToAccessVendor = vendorOnlyPaths.some(path => currentPath.startsWith(path));
  if (isTryingToAccessVendor) {
    if (!isAuthenticated || userRole !== 2) { // User must be authenticated AND vendor
      console.warn(`[Middleware] Unauthorized access attempt to vendor path ${currentPath} by role ${userRole}. Redirecting.`);
      return NextResponse.redirect(new URL('/', request.url));
    }
    console.log(`[Middleware] Vendor user (Role ID: ${userRole}) accessing vendor path ${currentPath}. Allowing.`);
  }

  // If we reach here, the request is allowed.
  console.log(`[Middleware] Allowing access to ${currentPath}.`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
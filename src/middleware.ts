// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const accessToken = request.cookies.get('access_token')?.value;

  // Define restricted prefixes
  const IS_ACCOUNT_PATH = currentPath.startsWith('/account/');
  const IS_VENDOR_PATH = currentPath.startsWith('/vendor/');
  const IS_ADMIN_PATH = currentPath.startsWith('/admin/');

  // If the path is one of the restricted ones
  if (IS_ACCOUNT_PATH || IS_VENDOR_PATH || IS_ADMIN_PATH) {
    // If no access token, redirect to login
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // --- IMPORTANT SIMPLIFICATION: ---
    // At this point, we know the user has *some* accessToken.
    // However, to enforce specific role-based access (user, vendor, admin),
    // you *must* hit your backend's /users/me/ endpoint to get the user's role.
    // Without that, we cannot differentiate between a regular user, vendor, or admin.
    // The instructions "user can't go to vendor/admin", "vendor can't go to admin",
    // "admin can go anywhere" REQUIRE this backend call.

    // If you explicitly want to skip the backend call in middleware
    // and ONLY check if *any* token exists for *any* restricted path,
    // then the following lines effectively allow any authenticated user to any of these:
    // /account/*, /vendor/*, /admin/*. This is a security risk if roles matter.

    // Given the extreme simplicity request, this middleware WILL NOT perform
    // specific role-based checks (e.g., stopping a regular user from /vendor/).
    // It will only ensure *some* login is present for these prefixes.
    // If role-based filtering is needed, the full middleware from previous responses
    // (with backend fetch for user role) is necessary.
  }

  // Allow all other paths (public paths) or paths where authentication was sufficient.
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths except Next.js internals and static assets.
  // matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|woff|woff2|ttf|css|js)$).*)'],
};
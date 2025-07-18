import { toast } from "sonner";
import Cookies from "js-cookie";

/**
 * Perfect logout: removes all tokens from cookies & localStorage, clears user context, and redirects.
 * @param clearUser - function to clear user context (setUser(null))
 * @param router - Next.js router instance (useRouter)
 */
export const handleLogout = async (
  clearUser?: () => void,
  router?: { push: (path: string) => void }
): Promise<void> => {
  try {
    // Remove tokens from cookies
    Cookies.remove("access_token", { path: "/" });
    Cookies.remove("refresh_token", { path: "/" });
    Cookies.remove("user_role", { path: "/" });

    // Remove tokens from localStorage (if any)
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");

    // Clear user context
    if (clearUser) clearUser();

    toast.success("You have been logged out successfully.");

    // Wait a moment so the toast is visible
    setTimeout(() => {
      if (router) {
        router.push("/login");
      } else {
        window.location.href = "/login";
      }
    }, 700);
  } catch {
    toast.error("Logout failed. Please try again.");
  }
};
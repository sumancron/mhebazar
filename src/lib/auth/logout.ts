// /src/lib/auth/logout.ts

import { toast } from "sonner";

export const handleLogout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // Optional: clear global state like user context if needed
  // Example: setUser(null);

  toast.success("You have been logged out successfully.");
  window.location.href = "/login";
};

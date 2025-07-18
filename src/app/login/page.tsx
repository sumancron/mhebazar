// src/app/login/page.tsx
"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import GoogleLoginButton from "@/components/elements/GoogleAuth";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useUser } from "@/context/UserContext"; // Import useUser hook
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useUser(); // Get setUser from context
  const router = useRouter(); // Initialize router

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_KEY = process.env.X_API_KEY;

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/token/`,
        { email, password },
        {
          headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json",
          },
          withCredentials: true, // Allow cookies to be set by backend
        }
      );

      const accessToken = response.data?.access;
      const refreshToken = response.data?.refresh;
      let userData = null;

      // Fetch user info using access token
      if (accessToken) {
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "X-API-KEY": API_KEY,
            },
          });
          userData = userResponse.data;
          console.log("User data fetched successfully:", userData);
          setUser(userData); // Set user data in context

          // --- UPDATED: Set user_role cookie for middleware ---
          if (userData?.role?.id) {
            // Set a non-HttpOnly cookie that the middleware can read.
            // This cookie will contain the user's role ID.
            // IMPORTANT: Removed 'secure' flag condition for development ease.
            // Added 'path: /' to ensure cookie is available across the entire site.
            Cookies.set("user_role", userData.role.id.toString(), {
              expires: 7, // Expires in 7 days, or match your refresh token expiry
              sameSite: "Lax",
              path: '/', // Ensure cookie is available for all paths
            });
            console.log("Cookie 'user_role' set:", userData.role.id.toString());
          }
          // --- END UPDATED ---

        } catch (err) {
          toast.error("Failed to fetch user profile. Please try again.");
          console.error("User fetch error:", err);
          // If user data fetching fails, we might still want to proceed with token storage
          // but the user object in context will remain null or previous state.
        }
      }

      // Store access token (non-HttpOnly) only if needed (optional)
      if (accessToken && rememberme) {
        Cookies.set("access_token", accessToken, {
          expires: 1 / 24, // 1 hour = 1/24 of a day
          // IMPORTANT: Removed 'secure' flag condition for development ease.
          // Added 'path: /' to ensure cookie is available across the entire site.
          sameSite: "Lax",
          path: '/', // Ensure cookie is available for all paths
        });
        console.log("Cookie 'access_token' set (remember me):", accessToken);
      } else if (accessToken) { // If not remember me, set a session-based token or short expiry
         Cookies.set("access_token", accessToken, {
          expires: 1 / 24, // Example: 1 hour, or adjust as needed for non-remembered sessions
          sameSite: "Lax",
          path: '/',
        });
        console.log("Cookie 'access_token' set (session):", accessToken);
      }


      // set refresh token in cookies
      Cookies.set("refresh_token", refreshToken, {
        expires: 7,
        // IMPORTANT: Removed 'secure' flag condition for development ease.
        // Added 'path: /' to ensure cookie is available across the entire site.
        sameSite: "Lax",
        path: '/', // Ensure cookie is available for all paths
      });
      console.log("Cookie 'refresh_token' set:", refreshToken);

      // Redirect based on user role using Next.js router
      if (userData?.role?.id === 1) {
        router.push("/admin");
      } else if (userData?.role?.id === 2) {
        router.push("/vendor/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data;

        const getFriendlyError = (message: string) => {
          if (message.includes("No active account found")) {
            return "Invalid email or password. Please try again.";
          }
          if (
            message.toLowerCase().includes("email") &&
            message.toLowerCase().includes("required")
          ) {
            return "Please enter your email.";
          }
          if (
            message.toLowerCase().includes("password") &&
            message.toLowerCase().includes("required")
          ) {
            return "Please enter your password.";
          }
          return message || "Login failed. Please try again.";
        };

        const rawMessage =
          typeof data === "string"
            ? data
            : data?.detail || data?.message || "Login failed";

        toast.error(getFriendlyError(rawMessage));
      } else {
        toast.error("Something went wrong during login. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email Id!"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="************"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-500 text-base">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
                checked={rememberme}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-gray-500 text-base hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded py-3 text-lg transition-colors"
          >
            Sign In
          </button>
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 font-semibold">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <GoogleLoginButton
          variant="custom"
          buttonText="Continue with Google Account"
          className="bg-white w-full "
          size="large"
          showIcon={true}
          onSuccess={(data) => {
            console.log("Success:", data);
            const accessToken = (data as { access: string }).access;
            // IMPORTANT: For Google Login, you *must* fetch user data here
            // to get the role and set the 'user_role' cookie,
            // similar to the regular handleLogin function.
            // Without setting `user_role` cookie, middleware won't know the role.

            // Example of how you would fetch user data and set cookies after Google login:
            axios.get(`${API_BASE_URL}/users/me/`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-API-KEY": API_KEY,
              },
            }).then(userResponse => {
              const userData = userResponse.data;
              setUser(userData);
              if (userData?.role?.id) {
                Cookies.set("user_role", userData.role.id.toString(), {
                  expires: 7,
                  sameSite: "Lax",
                  path: '/',
                });
                console.log("Cookie 'user_role' set (Google login):", userData.role.id.toString());
              }
              // Also set access_token and refresh_token if your backend provides them via Google login
              // Cookies.set("access_token", accessToken, { expires: 1/24, sameSite: "Lax", path: '/' });
              // Cookies.set("refresh_token", data.refreshToken, { expires: 7, sameSite: "Lax", path: '/' }); // Assuming data has refreshToken
              router.push("/"); // Redirect after Google login
            }).catch(err => {
              console.error("Failed to fetch user data after Google login:", err);
              toast.error("Google login successful, but failed to get user profile.");
              router.push("/login"); // Redirect to login if user data fetch fails
            });

            // For now, if Google login directly gives you a full user object, you'd do:
            // setUser(data.userObject); // Removed: Incorrect usage, see above for correct user fetch and setUser usage
            // router.push("/"); // Redirect after Google login

            // As a temporary measure for demonstration if GoogleLoginButton doesn't return full user data,
            // we'll just redirect. But for full functionality, the above commented block is needed.
            router.push("/");
          }}
          onError={(error) => console.log("Error:", error)}
        />
        <div className="mt-8 text-center text-base">
          Do not have an account{" "}
          <Link href="/register" className="text-green-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

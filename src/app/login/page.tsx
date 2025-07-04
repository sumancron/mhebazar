"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import GoogleLoginButton from "@/components/elements/GoogleAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberme, setRememberMe] = useState(false);
  const [error, setError] = useState("");

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
        }
      );
      // handle success (e.g., save token, redirect)
      const accessToken = response.data?.access;
      let userData = null;
      if (accessToken) {
        try {
          const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "X-API-KEY": API_KEY,
            },
          });
          userData = userResponse.data;
        } catch (err) {
          console.error("Failed to fetch user data:", err);
        }
      }
      
      if (accessToken && rememberme) {
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", response.data.refresh);
        // Redirect or update UI as needed
        if (userData.role.id === 1) {
          window.location.href = "/admin/";
        } else if (userData.role.id === 2) {
          window.location.href = "/vendor/dashboard/";
        } else {
          window.location.href = "/";
        }
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-2">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleLogin}
        >
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email Id!"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-gray-500 text-base">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
                checked={rememberme}
                onChange={e => setRememberMe(e.target.checked)}
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
            console.log('Success:', data)
            const accessToken = (data as { access: string }).access;
            localStorage.setItem("access_token", accessToken);
          }}
          onError={(error) => console.log('Error:', error)}
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
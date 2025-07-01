"use client";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import GoogleLoginButton from "@/components/elements/GoogleAuth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        { email, password },
        {
          headers: {
            "X_API_KEY": process.env.X_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      // handle success (e.g., save token, redirect)
      console.log(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2">
      <div className="w-full max-w-lg mx-auto">
        <h2 className="text-center text-lg font-medium mt-4 mb-2">Sign In</h2>
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleLogin}
        >
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="email"
              required
              placeholder="Enter you email Id!"
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
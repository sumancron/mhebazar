"use client";
import { useState } from "react";
import axios from "axios";
import GoogleLoginButton from "@/components/elements/GoogleAuth";
import Link from "next/link";
import { RegisterForm } from "@/types/index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_X_API_KEY;

const RegisterPage = () => {
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Directly call backend API using axios
      await axios.post(
        `${API_BASE_URL}/register/`,
        {
          username: form.name,
          email: form.email,
          password: form.password,
          password2: form.confirmPassword,
          role_id: 3
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY,
          },
        }
      );
      // Redirect or show success message
      window.location.href = "/login";
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Registration failed."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-6 py-8">
      <div className="w-full max-w-lg mx-auto">
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block font-medium mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="Enter email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              required
              placeholder="************"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Confirm-Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              placeholder="************"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded py-3 text-lg transition-colors"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 font-semibold">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>
        </form>
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
        <div className="mt-4 text-center text-base">
          Already have an account?{" "}
          <Link href="/login" className="text-green-600 hover:underline font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
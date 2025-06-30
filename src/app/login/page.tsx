"use client";
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2">
      <div className="w-full max-w-lg mx-auto">
        <h2 className="text-center text-lg font-medium mt-4 mb-2">Sign In</h2>
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={e => {
            e.preventDefault();
            // handle login here
          }}
        >
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="email"
              required
              placeholder="Enter you email Id!"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="************"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
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
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded py-3 text-base font-medium hover:bg-gray-50 transition"
        >
          <span className="text-xl">🌐</span>
          Login with Google
        </button>
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
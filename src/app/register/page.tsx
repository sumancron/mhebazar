"use client";
import GoogleLoginButton from "@/components/elements/GoogleAuth";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-2">
      <div className="w-full max-w-lg mx-auto">
        <h2 className="text-center text-lg font-medium mt-4 mb-2">Register</h2>
        <h1 className="text-center text-3xl sm:text-4xl font-bold text-green-600 mb-8">
          Welcome to MHE Bazar!
        </h1>
        <form
          className="flex flex-col gap-5"
          onSubmit={e => {
            e.preventDefault();
            // handle registration here
          }}
        >
          <div>
            <label className="block font-medium mb-1">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Enter name"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="Enter email"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="************"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Confirm-Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              placeholder="************"
              className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-base"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded py-3 text-lg transition-colors"
          >
            Sign Up
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
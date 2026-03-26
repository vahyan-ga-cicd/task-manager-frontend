"use client";

import { ILoginRequest } from "@/@types/interface/auth.interfaces";
import { useAuthContext } from "@/context/AuthContext";
// import { loginUser } from "@/pages/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // npm install lucide-react
import { loginUser } from "@/utils/api/auth";
import Image from "next/image";

export default function Login() {
  const [formData, setFormData] = useState<ILoginRequest>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { fetchUser, authenticated } = useAuthContext();

  useEffect(() => {
    if (authenticated) {
      router.replace("/user");
    }
  }, [authenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error on input change
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res?.access_token);
      await fetchUser();
      router.replace("/");
    } catch (error: unknown) {
      console.error("Login failed:", error);
      setIsSubmitting(false);
      setError((error as { message?: string }).message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 blur-3xl -z-10 animate-pulse" />

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-white/50">
          {/* Logo/Brand - Optional */}
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 
shadow-[0_0_25px_rgba(0,0,0,0.2)] bg-white/80 backdrop-blur-md border border-gray-200"
            >
              <Image src="/H-LOGO.png" alt="Logo" width={100} height={100} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-5 py-4 bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg text-black placeholder-gray-500 backdrop-blur-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-5 py-4 pr-14 bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg text-black placeholder-gray-500 backdrop-blur-sm hover:shadow-md"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:bg-gray-100 rounded-xl"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Divider */}
            {/* <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-300" />
              <span className="flex-shrink mx-4 text-xs text-gray-500 font-medium">
                or continue with
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div> */}
          </form>

          {/* Footer */}
          {/* <div className="text-center pt-6">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a
                href="/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Create one
              </a>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

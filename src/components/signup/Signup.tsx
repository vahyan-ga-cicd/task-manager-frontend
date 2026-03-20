"use client";

import { useState } from "react";
import { ISignupRequest } from "@/@types/interface/auth.interfaces";
// import { createUser } from "@/pages/api/auth";
import { AxiosError } from "axios";
import { Eye, EyeOff, Loader2, User, Mail } from "lucide-react"; // npm install lucide-react
import { useRouter } from "next/navigation";
import { createUser } from "@/utils/api/auth";

function Signup() {
  const [formData, setFormData] = useState<ISignupRequest>({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await createUser(formData);
      console.log("Signup success:", res);

      // Redirect to login after successful signup
      router.push("/login");
    } catch (error: any) {
      setError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 blur-3xl -z-10 animate-pulse" />

        {/* Main Card */}
        <div className="relative bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 sm:p-10 border border-white/50">
          {/* Logo/Brand Section */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Join us today
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Username Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-700">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-12 pr-5 py-3.5 bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-base text-gray-900 placeholder-gray-400 backdrop-blur-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-700">
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
                  disabled={loading}
                  className="w-full pl-12 pr-5 py-3.5 bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-base text-gray-900 placeholder-gray-400 backdrop-blur-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2.5">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="w-full pl-5 pr-14 py-3.5 bg-white/50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300 text-base text-gray-900 placeholder-gray-400 backdrop-blur-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:bg-gray-100 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3.5 px-6 rounded-2xl font-semibold text-base shadow-xl hover:shadow-2xl hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center gap-4 py-6">
              <div className="flex-grow border-t border-gray-300" />
              <span className="flex-shrink-0 text-xs text-gray-500 font-medium uppercase tracking-wide">
                or
              </span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

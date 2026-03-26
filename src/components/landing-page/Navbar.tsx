"use client";
import { useAuthContext } from "@/context/AuthContext";
import Link from "next/link";
import { useState } from "react";
import { Code, Menu, X } from "lucide-react"; // npm install lucide-react
import Image from "next/image";

export default function Navbar() {
  const { userData, authenticated } = useAuthContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  // In your navbar component
  const navbarItems = [
    // ... your existing items
    {
      label: "Docs",
      href: "/docs/frontend",
      icon: Code,
      children: [
        { label: "Frontend", href: "/docs/frontend" },
        { label: "Backend", href: "/docs/backend" },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image src="/H-LOGO.png" alt="Logo" width={50} height={50} />
            <Link
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              Vahyan TaskFlow
            </Link>
          </div>

          {/* Desktop Menu - Hidden on Mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</Link> */}
            {authenticated && (
              <Link
                href="/user"
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 
      hover:text-white hover:bg-blue-600 
      transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Account
              </Link>
            )}

            {/* <Link
              href="/ddocs/ddocs-frontend"
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 
    hover:text-white hover:bg-indigo-600 
    transition-all duration-200 shadow-sm hover:shadow-md"
            >
              DDocs
            </Link> */}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {authenticated ? (
              <Link
                href={
                  userData?.data?.user_data?.role === "admin"
                    ? "/admin-dashboard/users"
                    : "/user"
                }
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                {userData?.data?.user_data?.role === "admin"
                  ? "Admin Dashboard"
                  : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  Log in
                </Link>
                {/* <Link
                  href="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link> */}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Fullscreen Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl z-40">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="space-y-4">
              {/* Mobile Nav Links */}
              <div className="space-y-2 pt-2">
                {/* <Link
                  href="#features"
                  className="block py-3 px-4 text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  Features
                </Link> */}
                {authenticated && (
                  <Link
                    href="/user"
                    className="block py-3 px-4 text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                    onClick={closeMobileMenu}
                  >
                    Account
                  </Link>
                )}
                <Link
                  href="/ddocs/ddocs-frontend"
                  className="block py-3 px-4 text-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all font-medium"
                  onClick={closeMobileMenu}
                >
                  DDocs
                </Link>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-100">
                {authenticated ? (
                  <Link
                    href="/user"
                    className="block w-full text-center py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold text-lg"
                    onClick={closeMobileMenu}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full text-center py-3 px-6 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 font-medium text-lg transition-all border border-gray-200"
                      onClick={closeMobileMenu}
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full text-center py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                      onClick={closeMobileMenu}
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

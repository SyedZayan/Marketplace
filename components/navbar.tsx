// components/Navbar.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface User {
  id: number;
  name: string;
  email: string;
}

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // On mount, load user from localStorage (if exists)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
  }, []);

  const handleSignOut = () => {
    // Clear stored user and update state
    localStorage.removeItem("user");
    setUser(null);
    // Redirect to sign in page
    router.push("/signin");
  };

  return (
    <div className="bg-white">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/25"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
          {/* Mobile Off-canvas Menu */}
          <div className="relative z-50 flex h-full w-full max-w-xs flex-col bg-white pb-12 shadow-xl">
            <div className="flex px-4 pt-5 pb-2 justify-end">
              <button
                type="button"
                className="rounded-md p-2 text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav className="mt-2">
              <ul className="space-y-4">
                <li>
                  <Link href="/luxury">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Luxury
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/economy">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Economy
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      About Us
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/locations">
                    <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                      Locations
                    </span>
                  </Link>
                </li>
                {user ? (
                  <>
                    <li>
                      <span className="block px-4 py-2 text-gray-700">
                        {user.name}
                      </span>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/signin">
                        <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          Sign In
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup">
                        <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
                          Create Account
                        </span>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white">
        <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
          Enjoy flexible car rentals with no hidden fees!
        </p>
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Mobile menu toggle and Logo */}
              <div className="flex items-center">
                <button
                  type="button"
                  className="lg:hidden rounded-md bg-white p-2 text-gray-400"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <span className="sr-only">Open menu</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
                <div className="ml-4">
                  <Link href="/">
                    <span className="text-xl font-bold text-indigo-600 cursor-pointer">
                      Rental Car Co.
                    </span>
                  </Link>
                </div>
              </div>
              {/* Center: Desktop Navigation Links */}
              <div className="hidden lg:flex space-x-8">
                <Link href="/economy">
                  <span className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
                    Economy
                  </span>
                </Link>
                <Link href="/luxury">
                  <span className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
                    Luxury
                  </span>
                </Link>
                <Link href="/about">
                  <span className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
                    About Us
                  </span>
                </Link>
              </div>
              {/* Right: Desktop Account Links */}
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-sm font-medium text-gray-700">
                      Welcome, {user.name}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin">
                      <span className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
                        Sign In
                      </span>
                    </Link>
                    <Link href="/signup">
                      <span className="text-sm font-medium text-gray-700 hover:text-gray-800 cursor-pointer">
                        Create Account
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;

"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-gray-900 text-white">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <Image src="/logo.png" alt="Company Logo" width={40} height={40} />
        <span className="text-xl font-bold">VegaPredict</span>
      </div>

      {/* Right: Navigation Links */}
      <div className="space-x-6 text-lg">
        <Link href="/" className="hover:text-yellow-400">Home</Link>
        <Link href="/register" className="hover:text-yellow-400">Register</Link>
        <Link href="/login" className="hover:text-yellow-400">Login</Link>
        <Link href="/contact" className="hover:text-yellow-400">Contact Us</Link>
      </div>
    </nav>
  );
}

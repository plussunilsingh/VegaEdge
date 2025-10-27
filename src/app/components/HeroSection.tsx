"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[90vh]">
      <Image
        src="/market-bg.jpg"
        alt="Market Background"
        fill
        className="object-cover brightness-75"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Predict the Market with Vega
        </h1>
        <div className="space-x-4">
          <Link href="/register" className="bg-blue-500 px-6 py-3 rounded hover:bg-blue-600">
            Register
          </Link>
          <Link href="/login" className="bg-green-500 px-6 py-3 rounded hover:bg-green-600">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

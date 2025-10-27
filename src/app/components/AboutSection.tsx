"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="grid md:grid-cols-2 gap-8 py-12 px-8 bg-gray-50">
      <div className="flex flex-col justify-center space-y-4">
        <h2 className="text-3xl font-bold">About VegaPredict</h2>
        <p className="text-gray-700">
          VegaPredict helps you analyze market patterns and predict trends using advanced analytics.
        </p>
      </div>
      <Image
        src="/about-1.jpg"
        alt="About Image"
        width={600}
        height={400}
        className="rounded-lg object-cover"
      />
    </section>
  );
}

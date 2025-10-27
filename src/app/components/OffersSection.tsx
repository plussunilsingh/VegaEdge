"use client";

export default function OffersSection() {
  return (
    <section className="py-12 text-center bg-gray-200">
      <h2 className="text-3xl font-semibold mb-6">Our Offers</h2>
      <div className="flex flex-wrap justify-center gap-8">
        <div className="bg-white shadow-md p-6 rounded-md w-64">
          <h3 className="text-xl font-bold mb-2">Starter Plan</h3>
          <p>Get started with basic backtesting tools.</p>
        </div>
        <div className="bg-white shadow-md p-6 rounded-md w-64">
          <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
          <p>Advanced analytics and prediction models.</p>
        </div>
      </div>
    </section>
  );
}

"use client";

export default function FAQSection() {
  return (
    <section className="py-12 px-8 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6 text-center">FAQs</h2>
      <div className="space-y-4 max-w-3xl mx-auto">
        <div>
          <h3 className="font-bold">What is VegaPredict?</h3>
          <p>It’s a platform to help traders predict market behavior.</p>
        </div>
        <div>
          <h3 className="font-bold">Is there a free trial?</h3>
          <p>Yes, you can try our basic tools for 10 days.</p>
        </div>
        <div>
          <h3 className="font-bold">How can I make payments?</h3>
          <p>Use the UPI QR code provided in the payments section.</p>
        </div>
      </div>
    </section>
  );
}

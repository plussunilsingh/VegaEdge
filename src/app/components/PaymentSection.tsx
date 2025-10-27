"use client";

import Image from "next/image";

export default function PaymentSection() {
  return (
    <section className="py-10 bg-white text-center">
      <h2 className="text-2xl font-semibold mb-4">Payments</h2>
      <p className="mb-6 text-gray-700">Scan the QR code below to pay via UPI (PhonePe)</p>
      <div className="flex justify-center">
        <Image src="/upi-barcode.png" alt="UPI QR Code" width={200} height={200} />
      </div>
    </section>
  );
}

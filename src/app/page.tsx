import Navbar from "./components/Navbar";
import BackTestSection from "./components/BackTestSection";
import HeroSection from "./components/HeroSection";
import PaymentSection from "./components/PaymentSection";
import AboutSection from "./components/AboutSection";
import OffersSection from "./components/OffersSection";
import FAQSection from "./components/FAQSection";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero / Landing Banner */}
      <HeroSection />

      {/* Backtesting CTA */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-14 text-center">
        <h2 className="text-3xl font-bold mb-4">Back Test Your Strategy for 10 Days</h2>
        <p className="text-lg mb-6 opacity-90">
          Test, analyze, and optimize your trading performance before you go live.
        </p>
        <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
          Start Back Test
        </button>
      </section>

      {/* Payment Section */}
      <PaymentSection />

      {/* About Section */}
      <AboutSection />

      {/* Offers Section */}
      <OffersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 text-center mt-16">
        <p>© {new Date().getFullYear()} VegaPredict. All Rights Reserved.</p>
      </footer>
    </main>
  );
}

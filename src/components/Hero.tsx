import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 2;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="relative">
      {/* Backtest Banner */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <h4 className="text-lg md:text-xl font-bold text-black">
              <span className="text-primary uppercase">10 DAYS BACKTEST AVAILABLE</span>
            </h4>
            <Button asChild className="rounded-full bg-primary hover:bg-primary/90 px-6">
              <Link to="/openchart">CLICK HERE</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="relative min-h-[600px] overflow-hidden">
        <img src="/img/carousel-1.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Background" />
        <div className="absolute inset-0 bg-black/50" />

        {/* Carousel Content */}
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h4 className="text-primary text-xl font-bold uppercase mb-6 animate-fade-in">
              Welcome To Vega Greeks
            </h4>
            <h1 className="text-white text-4xl md:text-6xl font-bold uppercase mb-8 leading-tight animate-fade-in">
              TO PREDICT MARKET DIRECTION WITH THE HELP OF VEGA
            </h1>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in">
              <Button asChild size="lg" variant="secondary" className="rounded-full px-8 bg-white hover:bg-gray-100 text-black">
                <Link to="/register">
                  <span className="mr-2">●</span> Register
                </Link>
              </Button>
              <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90">
                <Link to="/login">Login</Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <h2 className="text-white text-xl font-semibold">Follow Us:</h2>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-primary transition-colors flex items-center justify-center">
                  <Facebook className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-primary transition-colors flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-primary transition-colors flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-black" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white hover:bg-primary transition-colors flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-black" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-8 bottom-8 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center z-10"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute left-24 bottom-8 w-12 h-12 rounded-full bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center z-10"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </div>
  );
};

export default Hero;

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, PlayCircle, Rocket } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Dynamic Background Image */}
      <div 
        className="absolute inset-0 z-0 scale-105 animate-slow-zoom"
        style={{
          backgroundImage: 'url("/img/home_bg.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 z-20">
        <div className="max-w-3xl">
          <h4 className="text-primary text-xl font-bold uppercase mb-4 tracking-[0.2em] animate-fade-in-up">
            Visualize Your Option Greeks in Real Time
          </h4>
          <h1 className="text-white text-4xl md:text-7xl font-extrabold uppercase mb-6 leading-tight animate-fade-in-up delay-100">
            Delta, Gamma, Theta, Vega - <span className="text-primary">sab ek hi smart dashboard par.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl animate-fade-in-up delay-200">
            The ultimate tool for traders to predict market direction with precision. Experience the power of real-time data visualization.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold h-14 group">
              <Link to="/login" className="flex items-center gap-2">
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                Launch Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 border-white text-white hover:bg-white hover:text-black font-bold h-14 transition-all">
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Join Channel
              </a>
            </Button>

            <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto rounded-full px-8 text-white hover:bg-white/10 font-bold h-14">
              <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-primary" />
                View Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

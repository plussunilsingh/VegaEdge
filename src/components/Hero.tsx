import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageCircle, PlayCircle, Rocket } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

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
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 z-20">
        <div className="max-w-3xl">
          <h4 className="text-primary text-xl font-bold uppercase mb-4 tracking-[0.2em] animate-fade-in-up">
            Visualize Your Option Greeks in Real Time
          </h4>
          <h1 className="text-slate-900 text-4xl md:text-7xl font-extrabold uppercase mb-6 leading-tight animate-fade-in-up delay-100">
            Delta, Gamma, Theta, Vega - <span className="text-primary">sab ek hi smart dashboard par.</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-xl mb-10 max-w-2xl animate-fade-in-up delay-200">
            The ultimate tool for traders to predict market direction with precision. Experience the power of real-time data visualization.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up delay-300">
            <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold h-14 group">
              <Link to="/live-data" className="flex items-center gap-2">
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                Launch Dashboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-8 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold h-14 transition-all">
              <a href="https://wa.me/something" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Join Channel
              </a>
            </Button>

            <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="lg" className="w-full sm:w-auto rounded-full px-8 text-slate-900 hover:bg-slate-100 font-bold h-14">
                  <div className="flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-primary" />
                    View Demo
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none">
                <div className="aspect-video w-full">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

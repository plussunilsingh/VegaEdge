import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Youtube, Instagram, Send, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Close menu on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <>
      {/* Overlay Backdrop - Fix visibility and clickoutside */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Left Section: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleMenu} 
                className="text-slate-900 p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none z-[70]"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-8 w-8 text-primary" /> : <Menu className="h-8 w-8" />}
              </button>
              
              <Link to="/" className="flex items-center">
                <h1 className="text-primary text-xl font-bold flex items-center gap-2">
                  <img src="/img/logo.png" alt="Logo" className="h-10 w-auto object-contain" /> 
                  <span className="hidden sm:inline">Vega Greeks</span>
                </h1>
              </Link>
            </div>

            {/* Middle Section: Desktop Horizontal Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-slate-700 hover:text-primary transition-colors font-semibold">Home</Link>
              <Link to="/about" className="text-slate-700 hover:text-primary transition-colors font-semibold">About Us</Link>
              <Link to="/contact" className="text-slate-700 hover:text-primary transition-colors font-semibold">Contact</Link>
              {user && (
                <Link to="/live-data" className="text-slate-700 hover:text-primary transition-colors font-semibold">Dashboard</Link>
              )}
            </div>

            {/* Right Section: Launch/Login Button */}
            <div className="flex items-center gap-4">
               {!user ? (
                 <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90 text-white font-bold h-11">
                   <Link to="/login">Login</Link>
                 </Button>
               ) : (
                 <Link to="/my-account" className="hidden sm:block text-slate-700 hover:text-primary font-semibold">
                   My Account
                 </Link>
               )}
            </div>
          </div>
        </div>

        {/* Unified Slide-out Menu Drawer - Left Aligned */}
        <div className={`fixed top-0 left-0 h-full w-[300px] sm:w-[400px] bg-white border-r border-gray-100 z-[65] transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex flex-col h-full p-8 pt-24">
            <div className="space-y-6 flex-1 overflow-y-auto">
              <Link to="/" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                Home
              </Link>
              <Link to="/live-data" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                Live Data
              </Link>
              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                  Admin Panel
                </Link>
              )}
              {user ? (
                 <Link to="/my-account" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                   My Account
                 </Link>
              ) : (
                <>
                  <Link to="/register" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                    Create Account
                  </Link>
                  <Link to="/login" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                    Sign In
                  </Link>
                </>
              )}
              <Link to="/contact" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                Support
              </Link>
              <Link to="/about" onClick={toggleMenu} className="block text-2xl font-bold text-slate-900 hover:text-primary transition-colors">
                About
              </Link>
            </div>

            {/* Connect With Us Section */}
            <div className="mt-auto pt-8 border-t border-gray-100">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Connect With Us</h3>
              <div className="grid grid-cols-4 gap-4">
                <a href="https://wa.me/something" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition-all hover:scale-110">
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#0088cc] hover:text-white transition-all hover:scale-110">
                  <Send className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#E1306C] hover:text-white transition-all hover:scale-110">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#FF0000] hover:text-white transition-all hover:scale-110">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

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
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <h1 className="text-primary text-xl font-bold flex items-center gap-2">
                <img src="/img/logo.png" alt="Logo" className="h-10 w-auto object-contain" /> 
                <span className="hidden sm:inline">Vega Greeks</span>
              </h1>
            </Link>

            {/* Desktop & Mobile: Single Hamburger Button at Top Right */}
            <div className="flex items-center gap-4">
               {/* Show Launch Dashboard button on desktop navigation if not logged in */}
               {!user && (
                 <Button asChild variant="outline" className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white rounded-full">
                   <Link to="/login">Launch Dashboard</Link>
                 </Button>
               )}
               <button 
                onClick={toggleMenu} 
                className="text-white p-2 hover:bg-gray-800 rounded-full transition-colors focus:outline-none z-[70]"
                aria-label="Toggle Menu"
               >
                {isOpen ? <X className="h-8 w-8 text-primary" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Unified Slide-out Menu Drawer */}
        <div className={`fixed top-0 right-0 h-full w-[300px] sm:w-[400px] bg-black border-l border-gray-800 z-[65] transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full p-8 pt-24">
            <div className="space-y-6 flex-1">
              <Link to="/" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                Home
              </Link>
              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                  Admin Dashboard
                </Link>
              )}
              {user ? (
                 <Link to="/my-account" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                   My Account
                 </Link>
              ) : (
                <>
                  <Link to="/register" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                    Register
                  </Link>
                  <Link to="/login" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                    Login
                  </Link>
                </>
              )}
              <Link to="/contact" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                Contact Us
              </Link>
              <Link to="/about" onClick={toggleMenu} className="block text-2xl font-semibold text-white hover:text-primary transition-colors">
                About Vega Greeks
              </Link>
            </div>

            {/* Connect With Us Section */}
            <div className="mt-auto pt-8 border-t border-gray-800">
              <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-6">Connect With Us</h3>
              <div className="grid grid-cols-4 gap-4">
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white hover:bg-[#25D366] transition-all hover:scale-110">
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white hover:bg-[#0088cc] transition-all hover:scale-110">
                  <Send className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white hover:bg-[#E1306C] transition-all hover:scale-110">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center text-white hover:bg-[#FF0000] transition-all hover:scale-110">
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

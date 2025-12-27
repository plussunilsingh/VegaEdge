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
        <div 
          className={`fixed top-0 left-0 h-full w-[280px] bg-white border-r border-gray-100 z-[65] transform transition-transform duration-300 ease-in-out shadow-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full p-8 pt-24">
            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-2">
              <Link to="/" onClick={toggleMenu} className="block text-xl font-bold text-slate-900 hover:text-primary transition-colors">
                Home
              </Link>
              
              {user && (
                <>
                  <div className="pt-4 pb-2">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Analysis Tools</h3>
                    <div className="space-y-3 pl-2 border-l-2 border-slate-50">
                      <Link to="/live-data" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Live Data (Upstox) </Link>
                      <Link to="/angleone-live-data" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> AngleOne Live </Link>
                      <Link to="/chart" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Premium Charts </Link>
                      <Link to="/openchart" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Backtest Charts </Link>
                    </div>
                  </div>

                  <div className="pt-4 pb-2">
                    <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Account</h3>
                    <div className="space-y-3 pl-2 border-l-2 border-slate-50">
                      <Link to="/my-account" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Profile Details </Link>
                      <Link to="/change-password" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Change Password </Link>
                      {user?.role === 'ADMIN_USER' && (
                        <Link to="/admin" onClick={toggleMenu} className="block text-sm font-semibold text-[#00bcd4] hover:text-[#00acc1] transition-colors"> Admin Panel </Link>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Information</h3>
                <div className="space-y-3 pl-2 border-l-2 border-slate-50">
                  <Link to="/about" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> About Us </Link>
                  <Link to="/contact" onClick={toggleMenu} className="block text-sm font-semibold text-slate-700 hover:text-primary transition-colors"> Contact Support </Link>
                </div>
              </div>
            </div>

            {/* Connect With Us Section */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Connect With Us</h3>
              <div className="grid grid-cols-4 gap-3">
                <a href="https://wa.me/918700583733" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="https://t.me/vegagreeks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#0088cc] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <Send className="w-5 h-5" />
                </a>
                <a href="https://instagram.com/vegagreeks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#E1306C] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://youtube.com/@vegagreeks" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-slate-600 hover:bg-[#FF0000] hover:text-white transition-all hover:scale-110 shadow-sm">
                  <Youtube className="w-5 h-5" />
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

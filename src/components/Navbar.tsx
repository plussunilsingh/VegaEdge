import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Topbar */}
      <div className="bg-white border-b border-border px-4 lg:px-8 py-2 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:7830175650" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              7830175650
            </a>
            <a href="mailto:contact@vegagreeks.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              contact@vegagreeks.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center">
              <h1 className="text-primary text-xl font-bold flex items-center gap-2">
                <img src="/img/logo_red.png" alt="Logo" className="h-10 w-auto object-contain" /> 
                <span>Vega Greeks</span>
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white hover:text-primary transition-colors font-medium">
                Home
              </Link>
              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" className="text-white hover:text-primary transition-colors font-medium">
                  Admin
                </Link>
              )}
              {user ? (
                 <Link to="/my-account" className="text-white hover:text-primary transition-colors font-medium">
                   My Account
                 </Link>
              ) : (
                <>
                  <Link to="/register" className="text-white hover:text-primary transition-colors font-medium">
                    Register
                  </Link>
                  <Link to="/login" className="text-white hover:text-primary transition-colors font-medium">
                    Login
                  </Link>
                </>
              )}
              <Link to="/contact" className="text-white hover:text-primary transition-colors font-medium">
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-white focus:outline-none">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                Home
              </Link>
              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                  Admin
                </Link>
              )}
              {user ? (
                 <Link to="/my-account" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                   My Account
                 </Link>
              ) : (
                <>
                  <Link to="/register" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                    Register
                  </Link>
                  <Link to="/login" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                    Login
                  </Link>
                </>
              )}
              <Link to="/contact" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

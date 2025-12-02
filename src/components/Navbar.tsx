import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";

const Navbar = () => {
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

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-white hover:text-primary transition-colors font-medium">
                Home
              </Link>
              <Link to="/register" className="text-white hover:text-primary transition-colors font-medium">
                Register
              </Link>
              <Link to="/login" className="text-white hover:text-primary transition-colors font-medium">
                Login
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors font-medium">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

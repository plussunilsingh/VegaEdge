import { Link } from "react-router-dom";
import { Phone, Mail, Clock, Menu, X } from "lucide-react";
import { useAuth, useSession } from "@/contexts/AuthContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const AuthenticatedNavbar = () => {
  const { logout, user } = useAuth();
  const { sessionTimeLeft } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  
  const toggleMenu = () => setIsOpen(!isOpen);

// ... (formatTime helper remains same)

// ... (JSX structure)

              <div className="flex items-center gap-2 ml-4">
                <Button variant="outline" size="sm" onClick={async () => {
                  try {
                    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/upstox-login-url`, {
                      method: 'GET',
                    });
                    if (!resp.ok) throw new Error(`Status ${resp.status}`);
                    const data = await resp.json();
                    
                    if (data.url) {
                        toast({
                        title: 'Redirecting to Upstox...',
                        description: "Please login to authorize.",
                        variant: 'default',
                      });
                      window.location.href = data.url;
                    } else {
                         throw new Error("No URL received");
                    }

                  } catch (e) {
                    console.error(e);
                    toast({
                      title: 'Connection Failed',
                      description: (e as Error).message,
                      variant: 'destructive',
                    });
                  }
                }}>
                  Connect Upstox
                </Button>
              </div>
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-white border-b border-border px-4 lg:px-8 py-2 hidden lg:flex">
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
            {sessionTimeLeft > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className={`font-medium ${sessionTimeLeft <= 30 ? 'text-red-600' : 'text-muted-foreground'}`}>
                Session: {formatTime(sessionTimeLeft)}
              </span>
            </div>
            )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-black border-b border-gray-800 sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/my-account" className="flex items-center gap-3">
              <h1 className="text-primary text-xl font-bold flex items-center gap-2">
                <img src="/img/logo_red.png" alt="Logo" className="h-10 w-auto object-contain" /> 
                <span>Vega Greeks</span>
              </h1>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {user && (
                  <span className="text-gray-300 font-medium">
                    Welcome, {user.firstName || user.name.split(' ')[0]}
                  </span>
              )}

              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" className="text-white hover:text-primary transition-colors font-medium">
                  Admin
                </Link>
              )}
              <Link to="/chart" className="text-white hover:text-primary transition-colors font-medium">
                Chart
              </Link>
              <Link to="/live-data" className="text-white hover:text-primary transition-colors font-medium">
                Live Data
              </Link>
              <Link to="/upstox-token" className="text-white hover:text-primary transition-colors font-medium">
                Upstox Token
              </Link>
              <Link to="/my-account" className="text-white hover:text-primary transition-colors font-medium">
                My Account
              </Link>
              <button type="button" onClick={logout} className="text-white hover:text-primary transition-colors font-medium">
                Logout
              </button>
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
              {user && (
                  <div className="px-3 py-2 text-base font-medium text-gray-300 border-b border-gray-700 mb-2">
                    Welcome, {user.firstName || user.name.split(' ')[0]}
                  </div>
              )}
              {user?.role === 'ADMIN_USER' && (
                <Link to="/admin" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                  Admin
                </Link>
              )}
              <Link to="/chart" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                Chart
              </Link>
              <Link to="/live-data" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                Live Data
              </Link>
              <Link to="/my-account" onClick={toggleMenu} className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                My Account
              </Link>
              <button onClick={() => { toggleMenu(); logout(); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-primary hover:bg-gray-900">
                Logout
              </button>
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

export default AuthenticatedNavbar;

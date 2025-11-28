import { Link } from "react-router-dom";
import { Phone, Mail, Clock } from "lucide-react";
import { useAuth, useSession } from "@/contexts/AuthContext";
 
const AuthenticatedNavbar = () => {
  const { logout } = useAuth();
  const { sessionTimeLeft } = useSession();
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Topbar */}
      <div className="bg-white border-b border-border px-4 lg:px-8 py-2 hidden lg:block">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:8279506049" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              8279506049
            </a>
            <a href="mailto:contact@alphaedge.team" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail className="w-4 h-4 text-primary" />
              contact@alphaedge.team
            </a>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className={`font-medium ${sessionTimeLeft <= 30 ? 'text-red-600' : 'text-muted-foreground'}`}>
              Session: {formatTime(sessionTimeLeft)}
            </span>
          </div>
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

            <div className="hidden md:flex items-center gap-8">
              <Link to="/chart" className="text-white hover:text-primary transition-colors font-medium">
                Chart
              </Link>
              <Link to="/greeks" className="text-white hover:text-primary transition-colors font-medium">
                Greeks Analysis
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
          </div>
        </div>
      </nav>
    </>
  );
};

export default AuthenticatedNavbar;

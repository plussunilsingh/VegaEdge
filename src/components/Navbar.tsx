import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Youtube, Instagram, Send, MessageCircle, Phone, Mail, Clock, LayoutDashboard, History, User, LogOut, Shield, LineChart, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth, useSession, AuthStatus } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { COMPANY_NAME, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_WHATSAPP, COMPANY_TELEGRAM, COMPANY_INSTAGRAM, COMPANY_YOUTUBE_CHANNEL } from "@/config";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, status, profileImageUrl } = useAuth();
  const { sessionTimeLeft } = useSession();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Pattern: Centralized status flags
  const isAuthenticated = status === AuthStatus.AUTHENTICATED;
  const isExpired = status === AuthStatus.EXPIRED;
  const showAuthLinks = isAuthenticated && user;

  const formatTime = (seconds: number) => {
    if (isExpired) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
          className="fixed inset-0 bg-black/60 z-[100] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Unified Slide-out Menu Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-card z-[110] transform transition-transform duration-300 ease-in-out shadow-[10px_0_30px_rgba(0,0,0,0.15)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Menu Header with User Greeting */}
          <div className="bg-[#0f172a] p-8 pt-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/50 overflow-hidden">
                <img 
                  src={profileImageUrl || "/img/default_user.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes("/img/default_user.png")) return;
                    target.src = "/img/default_user.png";
                  }}
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest leading-none mb-1">
                  {showAuthLinks ? "Welcome back," : "Guest User"}
                </p>
                <p className="text-white font-extrabold text-lg truncate whitespace-nowrap">
                  {showAuthLinks ? user.name : COMPANY_NAME}
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            <div className="space-y-1">
              {/* Common Links */}
              <MenuLink to="/" icon={<LayoutDashboard size={18} />} label="Home" onClick={toggleMenu} />

              {/* Conditional Links based on AuthStatus */}
              {showAuthLinks ? (
                <>
                  {user.role === 'ADMIN_USER' && (
                    <MenuLink to="/admin" icon={<Shield size={18} />} label="Admin Panel" onClick={toggleMenu} className="text-red-500 hover:bg-red-50" />
                  )}
                  <MenuLink to="/chart" icon={<LineChart size={18} />} label="Chart" onClick={toggleMenu} />
                  <MenuLink to="/live-data" icon={<History size={18} />} label="Live Data" onClick={toggleMenu} />
                  <MenuLink to="/strategies" icon={<LayoutDashboard size={18} />} label="Strategies" onClick={toggleMenu} />
                  <MenuLink to="/my-account" icon={<User size={18} />} label="My Account" onClick={toggleMenu} />
                  <MenuLink to="/contact" icon={<Mail size={18} />} label="Contact Us" onClick={toggleMenu} />
                  
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <button 
                      onClick={() => { logout(); toggleMenu(); }}
                      className="flex items-center gap-4 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-extrabold transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-colors">
                        <LogOut size={20} />
                      </div>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <MenuLink to="/about" icon={<User size={18} />} label="About Us" onClick={toggleMenu} />
                  <MenuLink to="/contact" icon={<Mail size={18} />} label="Contact Us" onClick={toggleMenu} />
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <MenuLink 
                      to="/login" 
                      icon={<LogOut size={18} />} 
                      label={isExpired ? "Login (Session Expired)" : "Login / Sign In"} 
                      onClick={toggleMenu} 
                      className="text-primary hover:bg-primary/5" 
                    />
                  </div>
                </>
              )}
            </div>

            {/* Social Connectivity */}
            <div className="mt-8">
               <p className="text-slate-900 text-[10px] font-black uppercase tracking-widest px-4 mb-4">Connect With Us</p>
               <div className="grid grid-cols-4 gap-3 px-2">
                  <SocialIcon href={COMPANY_WHATSAPP} color="#25D366" icon={<MessageCircle size={20} />} />
                  <SocialIcon href={COMPANY_TELEGRAM} color="#0088cc" icon={<Send size={20} />} />
                  <SocialIcon href={COMPANY_INSTAGRAM} color="#E1306C" icon={<Instagram size={20} />} />
                  <SocialIcon href={COMPANY_YOUTUBE_CHANNEL} color="#FF0000" icon={<Youtube size={20} />} />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Info Bar */}
      <div className="bg-black text-white py-2 border-b border-white/10 relative z-[55]">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-medium tracking-wider gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href={`tel:${COMPANY_PHONE}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Phone className="h-3 w-3" /> {COMPANY_PHONE}
            </a>
            <a href={`mailto:${COMPANY_EMAIL}`} className="flex items-center gap-2 hover:text-primary transition-colors">
              <Mail className="h-3 w-3" /> {COMPANY_EMAIL}
            </a>
          </div>


          <div className={`flex items-center gap-2 font-bold ${isExpired ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
            <Clock className="h-3 w-3" /> {isExpired ? "Session Expired" : `Session: ${formatTime(sessionTimeLeft)}`}
          </div>
        </div>
      </div>

      <nav className="bg-[#0f172a] border-b border-white/5 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={toggleMenu} 
                className="text-white p-2 hover:bg-white/10 rounded-full transition-colors focus:outline-none z-[70]"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-7 w-7 sm:h-8 sm:w-8 text-primary" /> : <Menu className="h-7 w-7 sm:h-8 sm:w-8" />}
              </button>
              
              <Link to="/" className="flex items-center">
                <h1 className="text-white text-lg sm:text-xl font-bold flex items-center gap-2">
                  <img src="/img/logo.png" alt="Logo" className="h-8 w-8 sm:h-10 sm:w-10 object-contain" /> 
                  <span className="hidden xs:inline">{COMPANY_NAME}</span>
                </h1>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-white/80 hover:text-white transition-colors font-semibold text-sm">Home</Link>
              <Link to="/about" className="text-white/80 hover:text-white transition-colors font-semibold text-sm">About Us</Link>
              <Link to="/contact" className="text-white/80 hover:text-white transition-colors font-semibold text-sm">Contact</Link>
              {showAuthLinks && (
                  <Link to="/chart" className="text-white/80 hover:text-white transition-colors font-semibold text-sm">Chart</Link>
                )}
            {showAuthLinks && (
                    <Link to="/live-data" className="text-white/80 hover:text-white transition-colors font-semibold text-sm">Dashboard</Link>
                    )}
            <a href={COMPANY_WHATSAPP}
                target="_blank"
                 rel="noopener noreferrer"
                     className="group flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-1.5 rounded-full font-bold text-xs transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(37,211,102,0.4)] animate-pulse hover:animate-none">
               <MessageCircle size={14} className="animate-bounce group-hover:animate-none" />
                          JOIN CHANNEL
               </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
               <button
                 onClick={toggleTheme}
                 className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
                 aria-label="Toggle Theme"
               >
                 {theme === 'light' ? <Moon size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Sun size={20} className="sm:w-[22px] sm:h-[22px]" />}
               </button>

               {!isAuthenticated ? (
                 <Button asChild className="rounded-full px-5 sm:px-8 bg-primary hover:bg-primary/90 text-white font-bold h-9 sm:h-11 shadow-lg shadow-primary/20">
                   <Link to="/login">{isExpired ? "Login" : "Login"}</Link>
                 </Button>
               ) : (
                 <div className="flex items-center gap-4">
                    <Link to="/my-account" className="flex items-center gap-2 hidden sm:inline-flex text-white/80 hover:text-white font-semibold text-sm border-r border-white/20 pr-4">
                      My Account  </Link>
                    <button 
                      onClick={logout}
                      className="text-white/80 hover:text-red-400 font-semibold text-sm transition-colors"
                    >
                      Logout
                    </button>
                 </div>
               )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

// Helper Components for Cleaner Sidebar
const MenuLink = ({ to, icon, label, onClick, className = "" }: any) => (
  <Link 
    to={to} 
    onClick={onClick} 
    className={`flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-muted font-extrabold text-foreground transition-all group ${className}`}
  >
    <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center group-hover:scale-110 shadow-sm transition-transform">
      {icon}
    </div>
    <span className="text-base tracking-tight">{label}</span>
  </Link>
);

const SocialIcon = ({ href, color, icon }: any) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center text-foreground hover:text-white transition-all hover:scale-110 shadow-sm border border-border"
        style={isHovered ? { backgroundColor: color, borderColor: color } : {}}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {icon}
      </a>
    );
};

export default Navbar;

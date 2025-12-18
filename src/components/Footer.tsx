import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Footer = () => {
  const [apiVersion, setApiVersion] = useState<string>("Loading...");
  const uiVersion = "1.0.7-4"; // Sync with package.json or hardcode for now

  useEffect(() => {
    fetch("http://localhost:8000/system/version")
      .then(res => res.json())
      .then(data => setApiVersion(data.version))
      .catch(e => {
          console.error("Failed to fetch API version", e);
          setApiVersion("Offline");
      });
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <h1 className="text-white text-xl font-bold flex items-center gap-2">
                <img src="/img/logo_red.png" alt="Logo" className="h-10 w-auto object-contain" /> 
                <span>Vega Greeks</span>
              </h1>
            </Link>
            <p className="text-gray-400 mb-6">
              Tickertape provides data, information & content for Indian stocks, mutual funds, ETFs & indices.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary transition-colors flex items-center justify-center">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary transition-colors flex items-center justify-center">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary transition-colors flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary transition-colors flex items-center justify-center">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Overview</h4>
            <ul className="space-y-2">
              <li><Link to="/disclaimer" className="text-gray-400 hover:text-primary transition-colors">Disclaimer</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Markets</a></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Customers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-primary transition-colors">About</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</a></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-gray-400">
              <li>contact@vegagreeks.com</li>
              <li>7830175650</li>
              <li>www.vegagreeks.com</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400">
            <span>© Vega Greeks, All right reserved.</span>
            <div className="text-xs mt-2 text-gray-600">
                UI: v{uiVersion} | API: v{apiVersion}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from "react";
import { Link } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MyAccount = () => {
  const { user, profileImageUrl } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      toast({
        title: "Profile Updated",
        description: "Your profile picture has been updated successfully.",
      });
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthenticatedNavbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Strategy Buttons */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button className="bg-primary hover:bg-primary/90 rounded-full">
              Event-Driven Strategies
            </Button>
            <Button variant="secondary" className="rounded-full">
              Neutral Market Strategies
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 rounded-full">
              Bearish Market Strategies
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 rounded-full">
              Bullish Market Strategies
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* Profile Picture Section */}
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <div className="flex flex-col items-center">
                  <div className="w-64 h-64 rounded-full overflow-hidden mb-6 bg-muted">
                    <img 
                      src={profileImageUrl || "/img/user.jpg"} 
                      alt="Profile"
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      fetchPriority="low"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (target.src.includes("/img/user.jpg")) return; // Prevent loop
                        target.src = "/img/user.jpg";
                      }}
                    />
                  </div>
                  
                  <form onSubmit={handleUpdateProfile} className="w-full text-center">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="mb-4"
                    />
                    <Button 
                      type="submit" 
                      className="bg-red-600 hover:bg-red-700 w-full"
                      disabled={!selectedFile}
                    >
                      Update Profile Pic
                    </Button>
                  </form>
                </div>
              </div>

              {/* User Details Section */}
              <div className="bg-card rounded-2xl p-8 shadow-lg">
                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-lg">
                        <span className="font-semibold">Name: </span>
                        {user?.name || "User"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-lg break-all">
                        <span className="font-semibold">Email: </span>
                        {user?.email || ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-lg">
                        <span className="font-semibold">Phone: </span>
                        {user?.phone || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Link to="/chart">
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-lg">
                      Explore Our Vega Charts
                    </Button>
                  </Link>

                  <Link to="/change-password">
                    <Button className="w-full bg-primary hover:bg-primary/90 rounded-full py-6 text-lg">
                      Change Password
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MyAccount;

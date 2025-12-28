import { useState } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "@/config";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MyAccount = () => {
  const { user, profileImageUrl, updateUserImage } = useAuth();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    try {
        const token = localStorage.getItem('alphaedge_session'); // Or use useAuth().token
        const response = await fetch(endpoints.user.image, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Upload failed");
        }
        
        const data = await response.json();
        
        // Update context immediately
        if (data.path) {
            updateUserImage(data.path);
        }

        toast({
          title: "Success",
          description: "Profile image uploaded successfully!",
          className: "bg-green-500 text-white border-none",
        });
        
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: error.message
        });
    } finally {
        setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Strategy Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            <Link to="/strategies">
              <Button className="bg-[#00e5bc] hover:bg-[#00d4ae] text-white font-bold rounded-full px-6 py-2 transition-transform hover:scale-105 shadow-sm border-none">
                Event-Driven Strategies
              </Button>
            </Link>
            <Link to="/strategies">
              <Button variant="secondary" className="bg-muted hover:bg-muted/80 text-foreground font-bold rounded-full px-6 py-2 transition-transform hover:scale-105 shadow-sm border-none">
                Neutral Market Strategies
              </Button>
            </Link>
            <Link to="/strategies">
              <Button className="bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full px-6 py-2 transition-transform hover:scale-105 shadow-sm border-none">
                Bearish Market Strategies
              </Button>
            </Link>
            <Link to="/strategies">
              <Button className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full px-6 py-2 transition-transform hover:scale-105 shadow-sm border-none">
                Bullish Market Strategies
              </Button>
            </Link>
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
                      {...({ fetchpriority: "low" } as any)}
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
                      className="bg-[#f0a0a0] hover:bg-[#e09090] text-white font-bold w-full rounded-full transition-transform hover:scale-[1.02] border-none"
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
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 min-w-[60px]">Name:</span>
                       <span className="text-slate-600 font-medium">{user?.name || "User"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 min-w-[60px]">Email:</span>
                       <span className="text-slate-600 font-medium break-all">{user?.email || ""}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 min-w-[60px]">Phone:</span>
                       <span className="text-slate-600 font-medium">{user?.phone || ""}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-[10px] font-bold">✓</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="font-bold text-slate-800 min-w-[100px]">Subscription:</span>
                       <span className={cn("font-bold text-sm", user?.is_subscribed ? "text-[#10b981]" : "text-red-500")}>
                         {user?.is_subscribed ? "Active" : "Inactive"}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-50">
                  {user?.is_subscribed ? (
                    <Link to="/live-data">
                        <Button className="w-full bg-[#00e5bc] hover:bg-[#00d4ae] text-white font-bold rounded-full py-6 text-lg transition-transform hover:scale-[1.02] shadow-md border-none">
                        Explore Our Vega Charts
                        </Button>
                    </Link>
                  ) : (
                    <Button 
                        disabled 
                        className="w-full bg-slate-200 text-slate-400 cursor-not-allowed rounded-full py-6 text-lg border-none"
                    >
                        Chart Access Restricted (Contact Admin)
                    </Button>
                  )}

                  <Link to="/change-password">
                    <Button className="w-full bg-[#00e5bc] hover:bg-[#00d4ae] text-white font-bold rounded-full py-6 text-lg transition-transform hover:scale-[1.02] shadow-md border-none">
                      Change Password
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>


    </div>
  );
};

export default MyAccount;

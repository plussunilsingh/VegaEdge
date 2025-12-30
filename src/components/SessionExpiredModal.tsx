import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface SessionExpiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SessionExpiredModal = ({ open, onOpenChange }: SessionExpiredModalProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Don't show modal on login or register pages
  const isAuthPage = window.location.pathname === "/login" || window.location.pathname === "/register";
  const shouldShow = open && !isAuthPage;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const success = await login(email, password);
      if (success) {
        toast.success("Session restored successfully!");
        onOpenChange(false); // Close Modal
        setPassword(""); // Clear sensitive data
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Callback to proactively check if session is live (requested by user)
  // This handles cases where user might have logged in in another tab
  useEffect(() => {
    if (!shouldShow) return;

    const checkInterval = setInterval(() => {
        const storedUser = localStorage.getItem('alphaedge_user');
        const sessionToken = localStorage.getItem('alphaedge_session');
        
        if (storedUser && sessionToken) {
            console.log("[Session Recovery] Valid session detected, closing modal.");
            onOpenChange(false);
        }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [shouldShow, onOpenChange]);

  return (
    <Dialog open={shouldShow} onOpenChange={(val) => !val && onOpenChange(val)}> 
      {/* Prevent closing by clicking outside if strict enforcement needed, but allow for now */}
      <DialogContent className="sm:max-w-[425px] border-red-500/20 shadow-2xl">
        <DialogHeader>
          <div className="mx-auto bg-red-100 p-3 rounded-full w-fit mb-2">
             <Lock className="w-6 h-6 text-red-600" />
          </div>
          <DialogTitle className="text-center text-xl">Session Expired</DialogTitle>
          <DialogDescription className="text-center">
            Your session has timed out due to inactivity. Please log in again to continue working. 
            Don't worry, you won't lose your current page.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email / Username</Label>
            <Input 
              id="email" 
              placeholder="Enter your username" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Restore Session
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

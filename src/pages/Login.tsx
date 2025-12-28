import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back to Vega Greeks Calculator!",
          className: "bg-green-500 text-white border-none",
        });
        navigate("/my-account");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password" 
                  className="mt-2"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>
                <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
              </div>
              <Button 
                type="submit" 
                className="w-full rounded-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
            
            {/* Session Timeout Notice */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-xs text-center text-blue-700 dark:text-blue-300">
                🔒 Sessions expire after <strong>10 minutes</strong> of inactivity for security
              </p>
            </div>
            
            <p className="text-center mt-6 text-muted-foreground">
              Don't have an account? <a href="/register" className="text-primary hover:underline">Register here</a>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Login;

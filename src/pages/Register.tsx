import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { endpoints } from "@/config";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validatePhone = (p: string) => /^\d{10}$/.test(p);
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side Validation
    if (!validatePhone(phone)) {
        toast({
            title: "Invalid Phone Number",
            description: "Phone number must be exactly 10 digits for Indian users.",
            variant: "destructive"
        });
        return;
    }
    if (!validateEmail(email)) {
        toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
        return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(endpoints.auth.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          password: password,
          first_name: firstName,
          last_name: lastName,
          phone_number: phone
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }

      const data = await response.json();

      if (data.id) {
        // Auto-login after successful registration
        const loginSuccess = await login(email, password);
        
        if (loginSuccess) {
          toast({
            title: "Registration Successful",
            description: "Welcome to Vega Greeks!",
          });
          navigate("/my-account");
        }
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Please check your details and try again.",
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
            <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First Name" 
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last Name" 
                      className="mt-1"
                      required
                    />
                  </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number (10 Digits)</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                  }}
                  placeholder="9876543210" 
                  className="mt-1"
                  required
                />
                <p className="text-[10px] text-muted-foreground mt-1">Indian format required (10 digits)</p>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password" 
                  className="mt-1"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full rounded-full mt-4" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Now"}
              </Button>
            </form>
            <p className="text-center mt-6 text-muted-foreground">
              Already have an account? <a href="/login" className="text-primary hover:underline">Login here</a>
            </p>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Register;

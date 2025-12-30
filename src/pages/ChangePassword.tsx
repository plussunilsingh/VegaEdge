import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Password Changed",
      description: "Your password has been updated successfully.",
    });
    
    navigate("/my-account");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-card rounded-2xl p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-8">Change Password</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="current-password">Current Password</Label>
                <Input 
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input 
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-2"
                  required
                />
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input 
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-2"
                  required
                />
              </div>

              <Button type="submit" className="w-full rounded-full" size="lg">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      </main>


    </div>
  );
};

export default ChangePassword;

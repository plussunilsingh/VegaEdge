import { useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ShieldCheck, Key, RefreshCw, Smartphone } from "lucide-react";
import { BACKEND_API_BASE_URL } from "@/config";
import { useAuth } from "@/contexts/AuthContext";

const UpstoxToken = () => {
  const [manualToken, setManualToken] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { token } = useAuth(); // Get the app's auth token

  const handleManualSave = async () => {
    if (!manualToken.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter an access token.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
        toast({
            title: "Authentication Error",
            description: "You must be logged in to save the token.",
            variant: "destructive",
        });
        return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${BACKEND_API_BASE_URL}/auth/save-manual-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ access_token: manualToken.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to save token");
      }

      toast({
        title: "Success",
        description: "Token saved successfully!",
      });
      setManualToken("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not save token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateToken = async () => {
    try {
        const resp = await fetch(`${BACKEND_API_BASE_URL}/auth/upstox-login-url`, {
            method: 'GET',
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        
        if (data.url) {
            toast({
            title: 'Redirecting...',
            description: "Redirecting to Upstox login.",
            });
            window.location.href = data.url;
        } else {
                throw new Error("No URL received");
        }
    } catch (e) {
        toast({
            title: 'Connection Failed',
            description: (e as Error).message,
            variant: 'destructive',
        });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AuthenticatedNavbar />
      <div className="container mx-auto py-10 px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-primary" /> Upstox Token Management
        </h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          
          {/* Option 1: Manual Entry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-500" /> Manual Entry
              </CardTitle>
              <CardDescription>
                Paste your existing Upstox Access Token here. Useful if auto-generation fails.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Paste Access Token here..." 
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                rows={6}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleManualSave} 
                disabled={isSaving || !manualToken}
                className="w-full"
              >
                {isSaving ? "Saving..." : "Save Token Manually"}
              </Button>
            </CardContent>
          </Card>

          {/* Option 2: Auto Generate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-green-500" /> Auto Generate
              </CardTitle>
              <CardDescription>
                Initiate the Upstox login flow to automatically generate and save a new token.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted p-4 rounded-md text-sm text-muted-foreground">
                <ol className="list-decimal list-inside space-y-2">
                    <li>Click the button below.</li>
                    <li>Log in to Upstox in the popup/redirect.</li>
                    <li>You will be redirected back here.</li>
                    <li>Token will be saved automatically.</li>
                </ol>
              </div>
              <Button onClick={handleGenerateToken} variant="secondary" className="w-full">
                Generate New Token
              </Button>
            </CardContent>
          </Card>

        </div>

         {/* Note */}
         <div className="mt-8 p-4 border border-yellow-500/20 bg-yellow-500/10 rounded-md flex gap-3 text-sm text-yellow-600">
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <p>
                <strong>Tip:</strong> Tokens usually expire daily. If your charts aren't loading, try generating a new token here.
                Only one valid token is needed for the entire system (backend and frontend).
            </p>
         </div>

      </div>
    </div>
  );
};

export default UpstoxToken;

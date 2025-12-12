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

  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const handleGenerateToken = async () => {
    try {
        const resp = await fetch(`${BACKEND_API_BASE_URL}/auth/upstox-login-url`, {
            method: 'GET',
        });
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data = await resp.json();
        
        if (data.url) {
            // Open Popup
            const width = 600;
            const height = 700;
            const left = (window.screen.width - width) / 2;
            const top = (window.screen.height - height) / 2;
            
            const popup = window.open(
                data.url, 
                "UpstoxLogin", 
                `width=${width},height=${height},top=${top},left=${left},resizable,scrollbars`
            );

            if (!popup) {
                 toast({
                    title: "Popup Blocked",
                    description: "Please allow popups for this site to log in.",
                    variant: "destructive"
                 });
                 return;
            }

            // Listen for message
            const handleMessage = (event: MessageEvent) => {
                // Trust only your own origin if needed, but here we listen for specific type
                if (event.data?.type === "UPSTOX_SUCCESS") {
                   toast({
                       title: "Success",
                       description: event.data.message || "Token generated successfully!",
                   });
                   
                   // Start Cooldown
                   startCooldown(15);
                   
                   // Cleanup
                   window.removeEventListener("message", handleMessage);
                }
            };
            
            window.addEventListener("message", handleMessage);

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

  const startCooldown = (seconds: number) => {
      setIsCoolingDown(true);
      setCooldownTime(seconds);
      
      const interval = setInterval(() => {
          setCooldownTime((prev) => {
              if (prev <= 1) {
                  clearInterval(interval);
                  setIsCoolingDown(false);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
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
              <Button 
                onClick={handleGenerateToken} 
                variant="secondary" 
                className="w-full"
                disabled={isCoolingDown}
              >
                {isCoolingDown ? `Please wait ${cooldownTime}s` : "Generate New Token"}
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

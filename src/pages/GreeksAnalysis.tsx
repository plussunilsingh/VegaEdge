import { useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GreeksData {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
}

interface AggregatedGreeks {
  call: GreeksData;
  put: GreeksData;
  net: GreeksData;
}

const GreeksAnalysis = () => {
  const { user } = useAuth();
  const [instrumentKey, setInstrumentKey] = useState("NSE_INDEX|Nifty 50");
  const [expiryDate, setExpiryDate] = useState("2025-11-27");
  const [data, setData] = useState<AggregatedGreeks | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [upstoxToken, setUpstoxToken] = useState(""); 

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/market/greeks?instrument_key=${instrumentKey}&expiry_date=${expiryDate}&upstox_access_token=${upstoxToken}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('alphaedge_session')}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const result = await response.json();
      if (result.status === "success") {
        setData(result.data);
      } else {
        setError("API returned error status");
      }
    } catch (err) {
      setError("Error fetching data. Please check your inputs and token.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthenticatedNavbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Market Greeks Analysis</h1>
          
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div>
              <label className="block text-sm font-medium mb-2">Instrument Key</label>
              <Input 
                value={instrumentKey} 
                onChange={(e) => setInstrumentKey(e.target.value)} 
                placeholder="e.g. NSE_INDEX|Nifty 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Expiry Date</label>
              <Input 
                type="date" 
                value={expiryDate} 
                onChange={(e) => setExpiryDate(e.target.value)} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Upstox Access Token</label>
              <Input 
                type="password" 
                value={upstoxToken} 
                onChange={(e) => setUpstoxToken(e.target.value)} 
                placeholder="Enter Upstox Token"
              />
            </div>
            <div className="md:col-span-3">
              <Button onClick={fetchData} disabled={loading} className="w-full md:w-auto">
                {loading ? "Loading..." : "Analyze Greeks"}
              </Button>
            </div>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {data && (
            <div className="grid gap-6 md:grid-cols-3">
              {/* Call Greeks */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Call Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Delta:</span> <span className="font-mono">{data.call.delta.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Gamma:</span> <span className="font-mono">{data.call.gamma.toFixed(4)}</span></div>
                    <div className="flex justify-between"><span>Vega:</span> <span className="font-mono">{data.call.vega.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Theta:</span> <span className="font-mono">{data.call.theta.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Put Greeks */}
              <Card className="bg-red-50 border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Put Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Delta:</span> <span className="font-mono">{data.put.delta.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Gamma:</span> <span className="font-mono">{data.put.gamma.toFixed(4)}</span></div>
                    <div className="flex justify-between"><span>Vega:</span> <span className="font-mono">{data.put.vega.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Theta:</span> <span className="font-mono">{data.put.theta.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Net Greeks */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">Net Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between"><span>Net Delta:</span> <span className={`font-mono font-bold ${data.net.delta > 0 ? 'text-green-600' : 'text-red-600'}`}>{data.net.delta.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Net Gamma:</span> <span className="font-mono">{data.net.gamma.toFixed(4)}</span></div>
                    <div className="flex justify-between"><span>Net Vega:</span> <span className="font-mono">{data.net.vega.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Net Theta:</span> <span className="font-mono">{data.net.theta.toFixed(2)}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GreeksAnalysis;

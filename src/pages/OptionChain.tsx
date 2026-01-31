import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/config";
import { OptionChainTable } from "@/components/OptionChainExtensions/OptionChainTable";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

const OptionChain = () => {
  const { isAuthenticated, token } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Map option ID to symbol for API
  const getSymbol = (id: string) => {
    switch(id) {
        case "1": return "NIFTY";
        case "2": return "BANKNIFTY";
        case "3": return "SENSEX";
        case "4": return "FINNIFTY";
        case "5": return "MIDCPNIFTY";
        default: return "NIFTY";
    }
  };

  const getDisplayName = (id: string) => {
      switch(id) {
          case "1": return "NIFTY 50";
          case "2": return "BANKNIFTY";
          case "3": return "SENSEX";
          case "4": return "FINNIFTY";
          case "5": return "MIDCPNIFTY";
          default: return "NIFTY";
      }
  };

  // Query for Option Chain Greeks
  const { data: optionChainData, isLoading: isLoadingChain } = useQuery({
    queryKey: ["option-chain-greeks", selectedOption, selectedDate],
    queryFn: async () => {
       const symbol = getSymbol(selectedOption);
       const res = await fetch(endpoints.market.optionChain(symbol, selectedDate), {
         headers: {
           Authorization: `Bearer ${token}`
         }
       });
       if (res.status === 401) {
          // Handle unauthorized potentially
          throw new Error("Unauthorized");
       }
       const json = await res.json();
       return json.status === "success" ? json.data : null;
    },
    enabled: isAuthenticated && !!token,
    refetchInterval: 2000, 
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
      <SEOHead title={`${getDisplayName(selectedOption)} Option Chain | Vega Market Edge`} />
      
      <main className="flex-1 py-8">
        <div className="container mx-full px-4">
            
          <h1 className="text-2xl font-bold mb-6 text-foreground">Option Chain Analytics</h1>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                Instrument Selection
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full max-w-xs bg-background text-foreground border border-border rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="1">Nifty 50</option>
                <option value="2">BANKNIFTY</option>
                <option value="3">SENSEX</option>
                <option value="4">FINNIFTY</option>
                <option value="5">MIDCPNIFTY</option>
              </select>
            </div>

            <div className="ml-auto">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1 text-right">
                Expiry / Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-muted border-border rounded-xl font-semibold"
              />
            </div>
          </div>

          {/* Option Chain Table */}
          <div className="w-full">
               <OptionChainTable data={optionChainData} isLoading={isLoadingChain} />
          </div>

        </div>
      </main>
    </div>
  );
};

export default OptionChain;

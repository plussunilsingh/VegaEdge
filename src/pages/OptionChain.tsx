import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/config";
import { OptionChainTable } from "@/components/OptionChainExtensions/OptionChainTable";
import { SEOHead } from "@/components/SEOHead";
import { useAuth } from "@/contexts/AuthContext";

const OptionChain = () => {
  const { isAuthenticated, token } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Delta filter state - default to "sweet spot" range
  // STRICT REQUIREMENT: Start point 0.05 must be INCLUDED (inclusive range)
  const [minDelta, setMinDelta] = useState<number>(0.05);
  const [maxDelta, setMaxDelta] = useState<number>(0.6);

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

  // Query for expiry dates
  const { data: expiryData } = useQuery({
    queryKey: ["expiry-dates", selectedOption],
    queryFn: async () => {
      const symbol = getSymbol(selectedOption);
      const res = await fetch(endpoints.market.expiries(symbol), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      const json = await res.json();
      return json.status === "success" ? json.expiries : [];
    },
    enabled: isAuthenticated && !!token,
  });

  // Auto-select first expiry when data loads
  useQuery({
    queryKey: ["auto-select-expiry", expiryData],
    queryFn: () => {
      if (expiryData && expiryData.length > 0 && !selectedDate) {
        setSelectedDate(expiryData[0].value);
      }
      return null;
    },
    enabled: !!expiryData && expiryData.length > 0,
  });

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
    enabled: isAuthenticated && !!token && !!selectedDate,
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
                onChange={(e) => {
                  setSelectedOption(e.target.value);
                  setSelectedDate(""); // Reset date when changing instrument
                }}
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
                Expiry Date
              </label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-background text-foreground border border-border rounded-xl px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all min-w-[180px]"
                disabled={!expiryData || expiryData.length === 0}
              >
                {!expiryData || expiryData.length === 0 ? (
                  <option value="">Loading expiries...</option>
                ) : (
                  expiryData.map((expiry: { value: string; label: string }) => (
                    <option key={expiry.value} value={expiry.value}>
                      {expiry.label}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Delta Filter */}
          <div className="mb-6 bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Delta Range Filter
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={minDelta}
                  onChange={(e) => setMinDelta(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-background text-foreground border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Min"
                />
                <span className="text-muted-foreground font-bold">to</span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01"
                  value={maxDelta}
                  onChange={(e) => setMaxDelta(parseFloat(e.target.value) || 1)}
                  className="w-24 bg-background text-foreground border border-border rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Max"
                />
                <button
                  onClick={() => {
                    setMinDelta(0.05);
                    setMaxDelta(0.6);
                  }}
                  className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-semibold transition-colors"
                  title="Reset to sweet spot (0.05-0.6)"
                >
                  Sweet Spot
                </button>
                <button
                  onClick={() => {
                    setMinDelta(0.0);
                    setMaxDelta(1.0);
                  }}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg text-sm font-semibold transition-colors"
                  title="Show all strikes (0.0-1.0)"
                >
                  Show All
                </button>
              </div>
            </div>
          </div>

          {/* Option Chain Table */}
          <div className="w-full">
               <OptionChainTable 
                 data={optionChainData} 
                 isLoading={isLoadingChain}
                 deltaRange={{ min: minDelta, max: maxDelta }}
               />
          </div>

        </div>
      </main>
    </div>
  );
};

export default OptionChain;

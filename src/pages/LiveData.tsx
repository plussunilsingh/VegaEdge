import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, Activity, TrendingUp, Waves, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { endpoints } from "@/config";
import { SEOHead } from "@/components/SEOHead";
import { GreeksAnalysisSection } from "@/components/GreeksAnalysis";
import { cn, getMsToNextMinute } from "@/lib/utils";
import { DataSource, MarketProvider } from "@/types/enums";
import { formatToIST, formatChartTime } from "@/lib/time";
import { logger, ErrorCodes } from "@/lib/logger";

interface GreeksData {
  timestamp: string;
  greeks: {
    call_vega: number;
    put_vega: number;
    diff_vega: number;
    call_delta: number;
    put_delta: number;
    diff_delta: number;
    call_gamma: number;
    put_gamma: number;
    diff_gamma: number;
    call_theta: number;
    put_theta: number;
    diff_theta: number;
  } | null;
}

const getInitialDate = () => {
  return new Date();
};

const LiveData = () => {
  const { token, isAuthenticated, validateSession } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY");
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");

  const [selectedSource, setSelectedSource] = useState<string>("REST_API");
  const [selectedProvider, setSelectedProvider] = useState<string>("UPSTOX");

  // Helper to generate full day time slots (09:15 to 15:30)
  const timeSlots = useMemo(() => {
    const slots = [];
    const start = new Date(selectedDate);
    start.setHours(9, 15, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(15, 30, 0, 0);

    let current = start;
    while (current <= end) {
      slots.push(new Date(current));
      current = new Date(current.getTime() + 60000);
    }
    return slots;
  }, [selectedDate]);

  // Fetch Expiry List via useQuery for automatic caching and deduplication
  const { data: expiryList = [] } = useQuery({
    queryKey: ["expiry-list", selectedIndex],
    queryFn: async () => {
      const res = await fetch(endpoints.market.expiryList, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch expiry list");
      const list = await res.json();
      const todayStr = format(new Date(), "yyyy-MM-dd");
      return Array.isArray(list) ? list.filter((exp) => exp >= todayStr) : [];
    },
    enabled: !!token && isAuthenticated,
    staleTime: Infinity, // Load only once per session
    gcTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Auto-select closest future expiry
  useEffect(() => {
    if (expiryList.length > 0) {
      if (!selectedExpiry || !expiryList.includes(selectedExpiry)) {
        setSelectedExpiry(expiryList[0]);
      }
    }
  }, [expiryList, selectedIndex, selectedExpiry]);

  // Fetch History Data via useQuery (Proxy/Cache Pattern)
  const { data: historyData = [], isFetching: loading } = useQuery({
    queryKey: [
      "market-history",
      format(selectedDate, "yyyy-MM-dd"),
      selectedIndex,
      selectedExpiry,
      selectedSource,
      selectedProvider,
    ],
    queryFn: async () => {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const baseUrl = endpoints.market.history(dateStr, selectedIndex, selectedExpiry);

      // Convert string source (from UI state) to integer (for Backend)
      const sourceInt = selectedSource === "WEB_SOCKET" ? DataSource.WEB_SOCKET : DataSource.REST_API;
      const providerInt = selectedProvider === "ANGELONE" ? MarketProvider.ANGELONE : MarketProvider.UPSTOX;
      const url = `${baseUrl}&source=${sourceInt}&provider=${providerInt}`;

      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (res.status === 401) {
        toast.error("Session Expired");
        throw new Error("Unauthorized");
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const result = await res.json();
      if (!Array.isArray(result)) return [];

      const dataMap = new Map();
      result.forEach((item: any) => {
        if (item?.greeks && item.timestamp) {
          const dt = new Date(item.timestamp);
          if (!isNaN(dt.getTime())) {
            dataMap.set(format(dt, "HH:mm"), item);
          }
        }
      });

      return timeSlots.map((slotTime) => {
        const timeKey = format(slotTime, "HH:mm");
        const existingData = dataMap.get(timeKey);
        let greeks = null;
        if (existingData?.greeks) {
          const g = existingData.greeks;
          greeks = {
            call_vega: Number(g.call_vega),
            put_vega: Number(g.put_vega),
            diff_vega: Number(g.put_vega) - Number(g.call_vega),
            call_gamma: Number(g.call_gamma),
            put_gamma: Number(g.put_gamma),
            diff_gamma: Number(g.put_gamma) - Number(g.call_gamma),
            call_delta: Number(g.call_delta),
            put_delta: Number(g.put_delta),
            diff_delta: Number(g.put_delta) - Number(g.call_delta),
            call_theta: Number(g.call_theta),
            put_theta: Number(g.put_theta),
            diff_theta: Number(g.put_theta) - Number(g.call_theta),
          };
        }
        return {
          timestamp: slotTime.toISOString(),
          greeks,
        } as GreeksData;
      });
    },
    enabled: !!token && isAuthenticated && !!selectedExpiry,
    refetchInterval: isToday(selectedDate) ? getMsToNextMinute : false, // Clock-synced zero-drift polling
    staleTime: 30000,
  });

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-inter flex flex-col transition-colors duration-300">
      <SEOHead title={`${selectedIndex} Live Market Intelligence | Vega Market Edge`} />

      <div className="w-full max-w-[1920px] mx-auto py-6 px-4 space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-[#00bcd4] flex items-center gap-3">
              Market Intelligence{" "}
              <span className="text-[10px] font-bold text-muted-foreground bg-muted border border-border px-2 py-0.5 rounded uppercase">
                {selectedIndex}
              </span>
            </h1>
            <p className="text-[11px] text-muted-foreground flex items-center gap-2">
              <Activity
                className={cn(
                  "w-3 h-3",
                  loading ? "animate-pulse text-primary" : "text-muted-foreground/40"
                )}
              />
              {loading ? "Refreshing Intelligence..." : `Live Pulse • Connected`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="h-9 px-3 bg-background text-foreground border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[120px] font-bold"
            >
              <option value="UPSTOX">Upstox</option>
              <option value="ANGELONE">AngelOne</option>
            </select>

            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="h-9 px-3 bg-background text-foreground border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[120px] font-bold"
            >
              <option value="REST_API">REST API</option>
              <option value="WEB_SOCKET">WebSocket</option>
            </select>

            <select
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className="h-9 px-3 bg-background text-foreground border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[100px]"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="MIDCPNIFTY">MIDCPNIFTY</option>
            </select>

            <select
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="h-9 px-3 bg-background text-foreground border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[120px]"
            >
              {expiryList.map((exp: string) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 text-xs flex-1 sm:flex-none sm:min-w-[150px]"
                >
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <GreeksAnalysisSection
          title="Vega"
          icon={TrendingUp}
          data={historyData}
          dataKeyCall="call_vega"
          dataKeyPut="put_vega"
          dataKeyNet="diff_vega"
          colorNet="text-emerald-500"
          selectedDate={selectedDate}
        />
        <GreeksAnalysisSection
          title="Gamma"
          icon={Activity}
          data={historyData}
          dataKeyCall="call_gamma"
          dataKeyPut="put_gamma"
          dataKeyNet="diff_gamma"
          colorNet="text-purple-500"
          selectedDate={selectedDate}
        />
        <GreeksAnalysisSection
          title="Delta"
          icon={Waves}
          data={historyData}
          dataKeyCall="call_delta"
          dataKeyPut="put_delta"
          dataKeyNet="diff_delta"
          colorNet="text-orange-500"
          selectedDate={selectedDate}
        />
        <GreeksAnalysisSection
          title="Theta"
          icon={Zap}
          data={historyData}
          dataKeyCall="call_theta"
          dataKeyPut="put_theta"
          dataKeyNet="diff_theta"
          colorNet="text-pink-500"
          selectedDate={selectedDate}
        />

        <div className="flex justify-end px-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => {
              if (!validateSession()) return;
              const validData = historyData.filter((r) => r.greeks !== null);
              if (!validData.length) {
                toast.info("No data available for export");
                return;
              }
              const csvContent =
                "data:text/csv;charset=utf-8," +
                "Time,Call Vega,Put Vega,Net Vega,Call Gamma,Put Gamma,Net Gamma,Call Delta,Put Delta,Net Delta\n" +
                validData
                  .map((row) => {
                    const g = row.greeks!;
                    const t = format(new Date(row.timestamp), "HH:mm:ss");
                    return `${t},${g.call_vega},${g.put_vega},${g.diff_vega},${g.call_gamma},${g.put_gamma},${g.diff_gamma},${g.call_delta},${g.put_delta},${g.diff_delta}`;
                  })
                  .join("\n");

              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute(
                "download",
                `vega_intelligence_${selectedIndex}_${format(selectedDate, "yyyy-MM-dd")}.csv`
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <TrendingUp className="w-3 h-3 mr-2" /> Export CSV Intelligence
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveData;

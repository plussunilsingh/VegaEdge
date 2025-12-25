import { useState, useEffect, useCallback, useMemo } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, Loader2, TrendingUp, Activity, Waves, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BACKEND_API_BASE_URL, endpoints } from "@/config";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

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
  baseline_diff?: any; // Keeping for interface compatibility but not using
}

import { SEOHead } from "@/components/SEOHead";

  // Helper for initial date (Weekend -> Friday)
  const getInitialDate = () => {
    const today = new Date();
    const day = today.getDay();
    if (day === 0) { // Sunday
       const friday = new Date(today);
       friday.setDate(today.getDate() - 2);
       return friday;
    }
    if (day === 6) { // Saturday
       const friday = new Date(today);
       friday.setDate(today.getDate() - 1);
       return friday;
    }
    return today;
  };

  const formatTime = (isoString: string) => {
    try {
        return format(new Date(isoString), "HH:mm");
    } catch (e) {
        return "";
    }
  };

  const fmt = (val: any, digits = 2) => {
      if (val === null || val === undefined) return "-";
      const num = Number(val);
      if (isNaN(num)) return "-";
      return num.toFixed(digits);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl text-xs">
          <p className="font-medium mb-2 text-muted-foreground">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
             entry.value !== undefined && entry.value !== null && (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-foreground">{entry.name}:</span>
              <span className="font-mono font-medium">{fmt(entry.value)}</span>
            </div>
          )))}
        </div>
      );
    }
    return null;
  };


  const LiveData = () => {
  const { user, profileImageUrl, validateSession } = useAuth();
  
  // State for date selection
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  
  // Expiry State
  const [expiryList, setExpiryList] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");

  // State for fetched data
  const [data, setData] = useState<GreeksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY");
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Helper to generate full day time slots (09:15 to 15:30)
  const generateTimeSlots = (baseDate: Date) => {
      const slots = [];
      const start = new Date(baseDate);
      start.setHours(9, 15, 0, 0);
      const end = new Date(baseDate);
      end.setHours(15, 30, 0, 0);

      let current = start;
      while (current <= end) {
          slots.push(new Date(current));
          current = new Date(current.getTime() + 60000); // Add 1 minute
      }
      return slots;
  };

  // Fetch Expiry List on mount
  useEffect(() => {
     if (token) {
        fetch(endpoints.market.expiryList, {
             headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                 setExpiryList(data);
                 // Optional: Auto-select closest expiry?
                 // For now, let user select or default to None (which means all/merged in backend logic, or we force one)
                 // Requirement: "Add a expiry select drop down"
                 if (data.length > 0) setSelectedExpiry(data[0]); 
            }
        })
        .catch(err => console.error("Failed to fetch expiry list", err));
     }
  }, [token]);

  const fetchHistoryData = useCallback(async (selectedDate: Date, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      if (!BACKEND_API_BASE_URL) {
        throw new Error("Backend URL is not configured");
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const url = endpoints.market.history(dateStr, selectedIndex, selectedExpiry);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

      if (response.status === 401) {
        toast.error("Session Expired. Please login again.");
        // TODO: Trigger global login modal here
        throw new Error("Session Expired");
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      
      if (!Array.isArray(result)) {
        throw new Error("Invalid data format received");
      }

      // 1. Create Lookup Map for fetched data
      const dataMap = new Map();
      result.forEach((item: any) => {
          if (item?.greeks && item.timestamp) {
              const timeStr = item.timestamp;
//               const timeStr = format(new Date(item.timestamp), "HH:mm");
              dataMap.set(timeStr, item);
          }
      });

      // 2. Generate Full Time Backbone
      const timeSlots = generateTimeSlots(selectedDate);
      
      const processedData: GreeksData[] = timeSlots.map((slotTime) => {
          const timeKey = format(slotTime, "HH:mm");
          const existingData = dataMap.get(timeKey);

          let greeks = null;
          if (existingData && existingData.greeks) {
              const g = existingData.greeks;
              // Ensure all values are numbers to prevent chart scaling issues
              const cv = Number(g.call_vega);
              const pv = Number(g.put_vega);
              
              const cg = Number(g.call_gamma);
              const pg = Number(g.put_gamma);
              
              const cd = Number(g.call_delta);
              const pd = Number(g.put_delta);
              
              const ct = Number(g.call_theta);
              const pt = Number(g.put_theta);

              greeks = {
                  call_vega: cv,
                  put_vega: pv,
                  diff_vega: pv - cv,
                  
                  call_gamma: cg,
                  put_gamma: pg,
                  diff_gamma: pg - cg,
                  
                  call_delta: cd,
                  put_delta: pd,
                  diff_delta: pd - cd,
                  
                  call_theta: ct,
                  put_theta: pt,
                  diff_theta: pt - ct,
              };
          }

          return {
              timestamp: slotTime.toISOString(),
              greeks: greeks,
              baseline_diff: existingData?.baseline_diff || null
          };
      });

      console.log(`Processed ${processedData.length} time slots for ${selectedIndex}`);
      setData(processedData);
      setLastUpdated(new Date());
      
    } catch (error: any) {
      console.error("Fetch Error:", error);
      if (!silent) {
        setError(error?.message || "Failed to load data");
        toast.error("Failed to refresh market data");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, selectedIndex, selectedExpiry]);

  // Initial Fetch & Polling (Drift-Free)
  useEffect(() => {
    if (selectedDate && token) {
      fetchHistoryData(selectedDate);
      
      let timeoutId: NodeJS.Timeout;

      if (isToday(selectedDate)) {
        const scheduleNext = () => {
          const now = new Date();
          const target = new Date(now);
          target.setSeconds(5);
          target.setMilliseconds(0);

          if (target.getTime() <= now.getTime()) {
            target.setMinutes(target.getMinutes() + 1);
          }

          const delay = target.getTime() - now.getTime();
          console.log(`Scheduling next update in ${Math.round(delay/1000)}s`);

          timeoutId = setTimeout(() => {
            fetchHistoryData(selectedDate, true);
            scheduleNext();
          }, delay);
        };

        scheduleNext();
      }
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedDate, token, selectedIndex, selectedExpiry, fetchHistoryData]);


  const fmt = (val: any, digits = 2) => {
      if (val === null || val === undefined) return "-";
      const num = Number(val);
      if (isNaN(num)) return "-";
      return num.toFixed(digits);
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl text-xs">
          <p className="font-medium mb-2 text-muted-foreground">{formatTime(label)}</p>
          {payload.map((entry: any, index: number) => (
             entry.value !== undefined && entry.value !== null && (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-foreground">{entry.name}:</span>
              <span className="font-mono font-medium">{fmt(entry.value)}</span>
            </div>
          )))}
        </div>
      );
    }
    return null;
  };

  // --------------------------------------------------------------------------
  // Reusable Section Component: Chart (Left) + Table (Right)
  // --------------------------------------------------------------------------
  const GreekSection = ({ 
      title, 
      icon: Icon, 
      dataKeyCall, 
      dataKeyPut, 
      dataKeyNet, 
      colorCall, 
      colorPut,
      colorNet, // Used for table background
      data,
      selectedDate // Pass selectedDate for ReferenceLine calculation
  }: any) => {
      
      const tableData = useMemo(() => 
          [...data].filter(row => row.greeks !== null).reverse(),
      [data]);
      
      // Helper to determine trend if provided or calculate it
      const getTrend = useCallback((greeks: any) => {
          if (title !== "Vega") return null; // Only for Vega Table
          
          const net = greeks[dataKeyNet]; 
          if (net > 0.5) return { text: "Bearish", color: "text-red-500 font-bold" };
          if (net < -0.5) return { text: "Bullish", color: "text-green-500 font-bold" };
          return { text: "Sideways", color: "text-yellow-500 font-bold" };
      }, [title, dataKeyNet]);

      // Calculate symmetric domain and explicit ticks for centered zero line
      const { yDomain, yTicks } = useMemo(() => {
          let maxVal = 0;
          data.forEach((d: any) => {
              if (d.greeks) {
                  const vals = [
                      Math.abs(d.greeks[dataKeyCall] || 0),
                      Math.abs(d.greeks[dataKeyPut] || 0),
                      Math.abs(d.greeks[dataKeyNet] || 0)
                  ];
                  maxVal = Math.max(maxVal, ...vals);
              }
          });
          
          // Add padding, ensure non-zero
          const limit = maxVal === 0 ? 1 : maxVal * 1.1; 
          
          // Generate explicit symmetric ticks: [-Limit, -Limit/2, 0, Limit/2, Limit]
          // This ensures 0 is always there and ticks are perfectly matched
          const step = limit / 2;
          const ticks = [-limit, -step, 0, step, limit];
          
          return { yDomain: [-limit, limit], yTicks: ticks };
      }, [data, dataKeyCall, dataKeyPut, dataKeyNet]);

      // Calculate 09:15 timestamp for ReferenceLine
      const getStartReference = () => {
          if (!selectedDate) return null;
          const start = new Date(selectedDate);
          start.setHours(9, 15, 0, 0);
          return start.toISOString();
      };

      return (
        <div className="grid grid-cols-12 gap-4 h-[600px]">
            {/* Chart Area (Span 9) */}
            <Card className="col-span-12 lg:col-span-9 border-border/40 bg-card/40 backdrop-blur-md shadow-xl ring-1 ring-white/5 flex flex-col">
                <CardHeader className="py-2 pb-0">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <Icon className={cn("w-4 h-4", colorCall.replace('stroke-', 'text-').replace('#', 'text-'))} /> 
                        {title} Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 w-full min-h-0 p-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.2} vertical={false} />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={formatTime} 
                                tick={{fontSize: 10, fill: '#888'}} 
                                minTickGap={0} 
                                stroke="#444"
                                axisLine={false}
                                tickLine={false}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={window.innerWidth > 1400 ? 5 : 'preserveStartEnd'} 
                            />
                            <YAxis 
                                domain={yDomain} 
                                ticks={yTicks}
                                tickFormatter={(val) => val.toFixed(2)}
                                // Removed auto tickCount since we provide specific ticks
                                tick={{fontSize: 10, fill: '#888'}}
                                stroke="#444"
                                axisLine={{ stroke: '#666', strokeWidth: 1 }}
                                tickLine={false}
                                width={45}
                            />
                            {/* Vertical Line Cursor */}
                            <Tooltip 
                                content={<CustomTooltip />} 
                                cursor={{ stroke: '#ef4444', strokeWidth: 1.5, opacity: 0.8 }} 
                            />
                            <Legend wrapperStyle={{paddingTop: '5px', fontSize: '11px'}} iconType="circle" />
                            <ReferenceLine y={0} stroke="#666" strokeOpacity={1} strokeWidth={1.5} />
                            
                            {/* 09:15 Reference Line */}
                            <ReferenceLine 
                                x={getStartReference()} 
                                stroke="#ea580c" 
                                strokeWidth={2}
                                label={{ value: '09:15', position: 'insideTopLeft', fill: '#ea580c', fontSize: 10, fontWeight: 'bold' }} 
                            />

                            {/* Call Line */}
                            <Line 
                                type="monotone" 
                                dataKey={`greeks.${dataKeyCall}`} 
                                name={`Call ${title}`} 
                                stroke={colorCall} 
                                strokeWidth={1.5}
                                dot={false}
                                connectNulls={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                            {/* Put Line */}
                            <Line 
                                type="monotone" 
                                dataKey={`greeks.${dataKeyPut}`} 
                                name={`Put ${title}`} 
                                stroke={colorPut} 
                                strokeWidth={1.5}
                                dot={false}
                                connectNulls={false}
                                activeDot={{ r: 4, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Table Area (Span 3) */}
            <Card className="col-span-12 lg:col-span-3 border-border/40 bg-card/40 backdrop-blur-md shadow-xl flex flex-col h-[600px]">
                <CardHeader className="py-3 border-b border-border/10 bg-muted/40">
                    <div className="flex justify-between items-center">
                         <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{title} Table</CardTitle>
                         <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                            {tableData.length > 0 ? formatTime(tableData[0].timestamp) : '--:--'}
                         </span>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
                    <Table>
                        <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b-2 border-border/50 shadow-md">
                            <TableRow className="border-b border-border/10 text-[10px] hover:bg-transparent uppercase tracking-wider">
                                <TableHead className="w-[60px] h-9 text-muted-foreground font-bold pl-4">Time</TableHead>
                                <TableHead className="text-right h-9 text-green-500 font-bold border-l border-border/10 bg-green-500/5">Call</TableHead>
                                <TableHead className="text-right h-9 text-red-500 font-bold border-l border-border/10 bg-red-500/5">Put</TableHead>
                                <TableHead className="text-right h-9 font-extrabold text-foreground border-l border-border/10 bg-muted/20">Net</TableHead>
                                {title === "Vega" && <TableHead className="text-center h-9 font-bold text-foreground border-l border-border/10 pr-4">Trend</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tableData.map((row, i) => {
                                const g = row.greeks;
                                const trend = getTrend(g);
                                return (
                                    <TableRow key={i} className="border-b border-border/5 text-[11px] hover:bg-muted/30 transition-colors">
                                        <TableCell className="font-mono text-muted-foreground py-1 pl-4">{formatTime(row.timestamp)}</TableCell>
                                        <TableCell className="text-right font-mono text-green-400 py-1 border-l border-border/5">{fmt(g[dataKeyCall])}</TableCell>
                                        <TableCell className="text-right font-mono text-red-400 py-1 border-l border-border/5">{fmt(g[dataKeyPut])}</TableCell>
                                        <TableCell className={cn("text-right font-mono font-bold py-1 border-l border-border/5", title !== "Vega" && "pr-4", colorNet)}>{fmt(g[dataKeyNet])}</TableCell>
                                        {title === "Vega" && (
                                            <TableCell className={cn("text-center font-mono py-1 border-l border-border/5 pr-4", trend?.color)}>
                                                {trend?.text}
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
      );
  };


  if (error && !data.length) {
      return (
        <div className="min-h-screen bg-background text-foreground">
            <AuthenticatedNavbar />
            <div className="container mx-auto py-20 text-center">
                 <h2 className="text-xl text-red-500">Error Loading Data</h2>
                 <Button onClick={() => selectedDate && fetchHistoryData(selectedDate)} className="mt-4">Retry</Button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AuthenticatedNavbar />
      {/* Full Width Container */}
      <div className="w-[98%] max-w-[1920px] mx-auto py-4 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              Market Intelligence <span className="text-xs font-normal text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">{selectedIndex}</span>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
               <Activity className="w-3 h-3" /> Live Pulse • Updated: {format(lastUpdated, "HH:mm:ss")}
            </p>
          </div>

          <div className="flex gap-2">
            <select 
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className="h-8 px-3 bg-background border border-border/40 hover:border-primary/50 rounded-md text-xs transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="MIDCPNIFTY">MIDCPNIFTY</option>
            </select>

            {/* Expiry Dropdown */}
             <select 
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="h-8 px-3 bg-background border border-border/40 hover:border-primary/50 rounded-md text-xs transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Expiries</option>
              {expiryList.map(exp => (
                  <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="h-8 text-xs justify-start text-left font-normal border-border/40 hover:border-primary/50 transition-colors">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* 1. Vega Section */}
        <GreekSection 
            title="Vega" 
            icon={TrendingUp} 
            data={data}
            dataKeyCall="call_vega"
            dataKeyPut="put_vega"
            dataKeyNet="diff_vega"
            colorCall="#10b981"
            colorPut="#ef4444"
            colorNet="text-emerald-500 bg-emerald-500/5"
            selectedDate={selectedDate}
        />

        {/* 2. Gamma Section */}
        <GreekSection 
            title="Gamma" 
            icon={Activity} 
            data={data}
            dataKeyCall="call_gamma"
            dataKeyPut="put_gamma"
            dataKeyNet="diff_gamma"
            colorCall="#10b981"
            colorPut="#ef4444"
            colorNet="text-purple-500 bg-purple-500/5"
            selectedDate={selectedDate}
        />

        {/* 3. Delta Section */}
        <GreekSection 
            title="Delta" 
            icon={Waves} 
            data={data}
            dataKeyCall="call_delta"
            dataKeyPut="put_delta"
            dataKeyNet="diff_delta"
            colorCall="#10b981"
            colorPut="#ef4444"
            colorNet="text-orange-500 bg-orange-500/5"
            selectedDate={selectedDate}
        />

        {/* 4. Theta Section */}
        <GreekSection 
            title="Theta" 
            icon={Zap} 
            data={data}
            dataKeyCall="call_theta"
            dataKeyPut="put_theta"
            dataKeyNet="diff_theta"
            colorCall="#10b981"
            colorPut="#ef4444"
            colorNet="text-pink-500 bg-pink-500/5"
            selectedDate={selectedDate}
        />

        {/* Detailed Logs Footer */}
        <div className="flex justify-end px-2">
             <Button variant="outline" size="sm" className="text-xs h-7" onClick={() => {
                if (!validateSession()) return;
                const validData = data.filter(r => r.greeks !== null);
                if (!validData.length) return;
                const csvContent = "data:text/csv;charset=utf-8," 
                    + "Time,Call Vega,Put Vega,Net Vega,Call Gamma,Put Gamma,Net Gamma,Call Delta,Put Delta,Net Delta\n"
                    + validData.map(row => {
                        const g = row.greeks!;
                        const t = format(new Date(row.timestamp), "HH:mm:ss");
                        return `${t},${g.call_vega},${g.put_vega},${g.diff_vega},${g.call_gamma},${g.put_gamma},${g.diff_gamma},${g.call_delta},${g.put_delta},${g.diff_delta}`;
                    }).join("\n");
                
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", `market_data_${selectedIndex}_${format(selectedDate || new Date(), "yyyy-MM-dd")}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }}>
                <TrendingUp className="w-3 h-3 mr-2" /> Download Full CSV
            </Button>
        </div>

      </div>
    </div>
  );
};

export default LiveData;

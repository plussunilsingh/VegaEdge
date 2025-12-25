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
import { Calendar as CalendarIcon, Activity, Waves, Zap, TrendingUp } from "lucide-react";
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
  baseline_diff?: any;
}

import { SEOHead } from "@/components/SEOHead";

// --- Pure Helper Functions ---

const getInitialDate = () => {
    const today = new Date();
    const day = today.getDay();
    if (day === 0) return new Date(today.setDate(today.getDate() - 2)); // Sunday -> Friday
    if (day === 6) return new Date(today.setDate(today.getDate() - 1)); // Saturday -> Friday
    return today;
};

// --- Constants & Styles ---
const CHART_COLORS = {
    call: "#00f2fe", // Electric Cyan
    put: "#f53d5a",  // Vibrant Rose
    net: "#7000ff",  // Deep Neon Purple
    grid: "rgba(255, 255, 255, 0.05)",
    axis: "#64748b"
};

const formatTime = (isoString: string) => {
    try {
        return format(new Date(isoString), "HH:mm");
    } catch (e) {
        return "";
    }
};

const fmtNum = (val: any, digits = 2) => {
    if (val === null || val === undefined) return "-";
    const num = Number(val);
    if (isNaN(num)) return "-";
    return num.toFixed(digits);
};

// --- Sub-components ---

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
                            <span className="font-mono font-medium">{fmtNum(entry.value)}</span>
                        </div>
                    )
                ))}
            </div>
        );
    }
    return null;
};

const LiveData = () => {
  const { token, isAuthenticated, isSessionExpired, validateSession } = useAuth();
  
  // State
  const [selectedDate, setSelectedDate] = useState<Date>(getInitialDate());
  const [expiryList, setExpiryList] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [data, setData] = useState<GreeksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY");
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Helper to generate full day time slots (09:15 to 15:30)
  const generateTimeSlots = useCallback((baseDate: Date) => {
      const slots = [];
      const start = new Date(baseDate);
      start.setHours(9, 15, 0, 0);
      const end = new Date(baseDate);
      end.setHours(15, 30, 0, 0);

      let current = start;
      while (current <= end) {
          slots.push(new Date(current));
          current = new Date(current.getTime() + 60000);
      }
      return slots;
  }, []);

  // Fetch Expiry List
  useEffect(() => {
     if (isAuthenticated) {
        fetch(endpoints.market.expiryList, {
             headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(val => {
            if (Array.isArray(val)) {
                 setExpiryList(val);
                 if (val.length > 0 && !selectedExpiry) setSelectedExpiry(val[0]); 
            }
        })
        .catch(err => console.error("Failed to fetch expiry list", err));
     }
  }, [isAuthenticated, token, selectedExpiry]);

  const fetchHistoryData = useCallback(async (dateObj: Date, silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      if (!BACKEND_API_BASE_URL) throw new Error("Backend URL missing");

      const dateStr = format(dateObj, "yyyy-MM-dd");
      const url = endpoints.market.history(dateStr, selectedIndex, selectedExpiry);

      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });

      if (response.status === 401) {
        toast.error("Session Expired");
        throw new Error("Unauthorized");
      }

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Invalid Format");

      const dataMap = new Map();
      result.forEach((item: any) => {
          if (item?.greeks && item.timestamp) {
              const dt = new Date(item.timestamp);
              if (!isNaN(dt.getTime())) {
                  // Use a robust key for matching
                  dataMap.set(format(dt, "HH:mm"), item);
              }
          }
      });

      const timeSlots = generateTimeSlots(dateObj);
      const processedData: GreeksData[] = timeSlots.map((slotTime) => {
          const timeKey = format(slotTime, "HH:mm");
          const existingData = dataMap.get(timeKey);

          let greeks = null;
          if (existingData && existingData.greeks) {
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
              greeks: greeks,
              baseline_diff: existingData?.baseline_diff || null
          };
      });

      setData(processedData);
      setLastUpdated(new Date());
    } catch (e: any) {
      console.error(e);
      if (!silent) setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, selectedIndex, selectedExpiry, generateTimeSlots]);

  // Polling Logic
  useEffect(() => {
    if (selectedDate && isAuthenticated) {
      fetchHistoryData(selectedDate);
      if (!isToday(selectedDate)) return;

      const interval = setInterval(() => {
          fetchHistoryData(selectedDate, true);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [selectedDate, selectedIndex, selectedExpiry, isAuthenticated, fetchHistoryData]);

  // --- Sub-components (Memoized) ---
  const GreekSection = useMemo(() => {
    return ({ title, dataKeyCall, dataKeyPut, dataKeyNet, colorCall, colorPut, colorNet, icon: Icon }: any) => {
        
        const filteredData = data.filter(d => d.greeks);
        const tableData = [...data].filter(r => r.greeks !== null).reverse();

        // Symmetric Scaling
        const { yDomain, yTicks } = (() => {
            let maxVal = 0;
            data.forEach((d: any) => {
                if (d.greeks) {
                    maxVal = Math.max(maxVal, Math.abs((d.greeks as any)[dataKeyCall] || 0), Math.abs((d.greeks as any)[dataKeyPut] || 0), Math.abs((d.greeks as any)[dataKeyNet] || 0));
                }
            });
            const limit = maxVal === 0 ? 1 : maxVal * 1.1; 
            const step = limit / 2;
            return { yDomain: [-limit, limit] as [number, number], yTicks: [-limit, -step, 0, step, limit] };
        })();

        const getStartRef = () => {
             const start = new Date(selectedDate);
             start.setHours(9, 15, 0, 0);
             return start.toISOString();
        };

        const getTrend = (g: any) => {
            if (title !== "Vega") return null;
            const net = g[dataKeyNet];
            if (net > 0.5) return { text: "Bearish", color: "text-red-500 font-bold" };
            if (net < -0.5) return { text: "Bullish", color: "text-green-500 font-bold" };
            return { text: "Sideways", color: "text-yellow-500 font-bold" };
        };

        return (
            <div className="grid grid-cols-12 gap-6 lg:min-h-[600px] xl:min-h-[700px] h-auto mb-10">
                <Card className="col-span-12 lg:col-span-9 border-white/5 bg-[#111115]/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 flex flex-col min-h-[450px] lg:h-full overflow-hidden group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <CardHeader className="py-4 px-6 border-b border-white/5 flex flex-row items-center justify-between z-10">
                        <CardTitle className="flex items-center gap-3 text-sm font-semibold text-slate-100 uppercase tracking-widest">
                            <Icon className={cn("w-5 h-5", colorNet.replace('text-', 'text-'))} /> 
                            {title} Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 w-full min-h-0 p-4 overflow-hidden relative z-10">
                        <div className="w-full h-full overflow-x-auto custom-scrollbar">
                            <div className="min-w-[800px] h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                                        <defs>
                                            <linearGradient id={`gradient-call-${title}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.call} stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor={CHART_COLORS.call} stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id={`gradient-put-${title}`} x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={CHART_COLORS.put} stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor={CHART_COLORS.put} stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                                        <XAxis 
                                            dataKey="timestamp" 
                                            tickFormatter={formatTime} 
                                            tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 500}} 
                                            stroke={CHART_COLORS.grid}
                                            height={60}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis 
                                            domain={yDomain} 
                                            ticks={yTicks}
                                            tickFormatter={(val) => val.toFixed(2)}
                                            tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 500}}
                                            stroke={CHART_COLORS.grid}
                                            width={55}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                        <Legend 
                                            wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 600}} 
                                            iconType="circle" 
                                            verticalAlign="bottom"
                                        />
                                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                                        <ReferenceLine 
                                            x={getStartRef()} 
                                            stroke="rgba(255,255,255,0.2)" 
                                            strokeDasharray="4 4" 
                                            label={{ value: '09:15', position: 'insideTopLeft', fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                                        />
                                        
                                        <Line 
                                            type="monotone" 
                                            dataKey={`greeks.${dataKeyCall}`} 
                                            name={`Call ${title}`} 
                                            stroke={CHART_COLORS.call} 
                                            strokeWidth={3} 
                                            dot={false} 
                                            activeDot={{ r: 6, strokeWidth: 0, fill: CHART_COLORS.call }}
                                            animationDuration={1500}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey={`greeks.${dataKeyPut}`} 
                                            name={`Put ${title}`} 
                                            stroke={CHART_COLORS.put} 
                                            strokeWidth={3} 
                                            dot={false} 
                                            activeDot={{ r: 6, strokeWidth: 0, fill: CHART_COLORS.put }}
                                            animationDuration={1500}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey={`greeks.${dataKeyNet}`} 
                                            name={`Net ${title}`} 
                                            stroke={CHART_COLORS.net} 
                                            strokeWidth={2} 
                                            strokeDasharray="5 5" 
                                            dot={false} 
                                            animationDuration={1500}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-12 lg:col-span-3 border-white/5 bg-[#111115]/60 backdrop-blur-xl shadow-2xl flex flex-col h-[400px] lg:h-full overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xs font-bold uppercase text-slate-400 tracking-tighter">Live {title} Stream</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden flex-1">
                        <div className="overflow-y-auto h-full custom-scrollbar">
                            <Table>
                                <TableHeader className="sticky top-0 bg-[#16161c] border-b border-white/5 z-10">
                                    <TableRow className="text-[10px] uppercase border-none hover:bg-transparent">
                                        <TableHead className="pl-6 h-10">Time</TableHead>
                                        <TableHead className="text-right text-[#00f2fe] h-10">Call</TableHead>
                                        <TableHead className="text-right text-[#f53d5a] h-10">Put</TableHead>
                                        <TableHead className="text-right font-bold text-slate-200 h-10 pr-6">Net</TableHead>
                                        {title === "Vega" && <TableHead className="text-center text-slate-400 h-10">Trend</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableData.map((row, i) => (
                                        <TableRow key={i} className="text-[11px] border-b border-white/[0.02] hover:bg-white/[0.03] transition-colors group">
                                            <TableCell className="pl-6 font-mono text-slate-400">{formatTime(row.timestamp)}</TableCell>
                                            <TableCell className="text-right font-mono text-[#00f2fe]/90">{fmtNum(row.greeks![dataKeyCall])}</TableCell>
                                            <TableCell className="text-right font-mono text-[#f53d5a]/90">{fmtNum(row.greeks![dataKeyPut])}</TableCell>
                                            <TableCell className={cn("text-right font-mono font-bold pr-6", colorNet)}>{fmtNum(row.greeks![dataKeyNet])}</TableCell>
                                            {title === "Vega" && (
                                                <TableCell className={cn("text-center", getTrend(row.greeks)?.color)}>
                                                    <span className="px-2 py-0.5 rounded-full bg-white/5 text-[10px]">{getTrend(row.greeks)?.text}</span>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };
  }, [data, selectedDate]);

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

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-foreground font-inter flex flex-col">
      <SEOHead title={`${selectedIndex} Live Market Intelligence | Vega Market Edge`} />
      <AuthenticatedNavbar />
      
      <div className="w-[98%] max-w-[1920px] mx-auto py-4 space-y-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent flex items-center gap-3">
              Market Intelligence <span className="text-xs font-normal text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">{selectedIndex}</span>
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
               <Activity className="w-3 h-3" /> Live Pulse • Updated: {format(lastUpdated, "HH:mm:ss")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <select 
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(e.target.value)}
              className="h-9 px-3 bg-background border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[100px]"
            >
              <option value="NIFTY">NIFTY</option>
              <option value="BANKNIFTY">BANKNIFTY</option>
              <option value="FINNIFTY">FINNIFTY</option>
              <option value="MIDCPNIFTY">MIDCPNIFTY</option>
            </select>

             <select 
              value={selectedExpiry}
              onChange={(e) => setSelectedExpiry(e.target.value)}
              className="h-9 px-3 bg-background border border-border/40 rounded-md text-xs outline-none focus:ring-1 focus:ring-primary flex-1 sm:flex-none sm:min-w-[120px]"
            >
              <option value="">All Expiries</option>
              {expiryList.map(exp => <option key={exp} value={exp}>{exp}</option>)}
            </select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-9 text-xs flex-1 sm:flex-none sm:min-w-[150px]">
                  <CalendarIcon className="mr-2 h-3 w-3" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <GreekSection title="Vega" icon={TrendingUp} dataKeyCall="call_vega" dataKeyPut="put_vega" dataKeyNet="diff_vega" colorCall="#10b981" colorPut="#ef4444" colorNet="text-emerald-500" />
        <GreekSection title="Gamma" icon={Activity} dataKeyCall="call_gamma" dataKeyPut="put_gamma" dataKeyNet="diff_gamma" colorCall="#10b981" colorPut="#ef4444" colorNet="text-purple-500" />
        <GreekSection title="Delta" icon={Waves} dataKeyCall="call_delta" dataKeyPut="put_delta" dataKeyNet="diff_delta" colorCall="#10b981" colorPut="#ef4444" colorNet="text-orange-500" />
        <GreekSection title="Theta" icon={Zap} dataKeyCall="call_theta" dataKeyPut="put_theta" dataKeyNet="diff_theta" colorCall="#10b981" colorPut="#ef4444" colorNet="text-pink-500" />

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

import { useState, useEffect, useCallback } from "react";
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
import { Calendar as CalendarIcon, Loader2, TrendingUp, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BACKEND_API_BASE_URL } from "@/config";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
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
  };
  velocity?: {
    diff_vega_change: number;
    diff_gamma_change: number;
    call_vega_change: number;
    put_vega_change: number;
  };
  baseline_diff?: {
    call_vega_from_open: number;
    put_vega_from_open: number;
    diff_vega_from_open: number;
    call_gamma_from_open: number;
    put_gamma_from_open: number;
    diff_gamma_from_open: number;
    call_delta_from_open: number;
    put_delta_from_open: number;
    diff_delta_from_open: number;
    call_theta_from_open: number;
    put_theta_from_open: number;
    diff_theta_from_open: number;
  };
}

const LiveData = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY"); // Index selector
  const [data, setData] = useState<GreeksData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  
  // Polling Interval Ref
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchHistoryData = useCallback(async (selectedDate: Date, silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      if (!BACKEND_API_BASE_URL) {
        throw new Error("Backend URL is not configured");
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      // console.log(`Fetching history for ${dateStr}`);

      // Pass index parameter to API
      const response = await fetch(`${BACKEND_API_BASE_URL}/market/history?date=${dateStr}&index_name=${selectedIndex}`, {
        headers: {
          Authorization: `Bearer ${token}`, // User Auth
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const result = await response.json();
      
      if (!Array.isArray(result)) {
        throw new Error("Invalid data format received");
      }

      console.log("API Response sample:", result[0]); // Debug log

      // Map Data - NEW API FORMAT (backend already filtered by index)
      const mappedData: GreeksData[] = result.map((item: any) => {
          // New API returns: { timestamp, index_name, expiry_date, greeks: {...} }
          if (!item || !item.greeks) {
            console.warn("Invalid item:", item);
            return null;
          }
          return {
            timestamp: item.timestamp, // ISO format: "2025-12-11T09:16:00"
            greeks: item.greeks, // All Greeks are here
            // velocity and baseline_diff not yet implemented in new API
          };
      }).filter((item) => item !== null) as GreeksData[];

      console.log(`Received ${mappedData.length} records for ${selectedIndex}`); // Debug log
      setData(mappedData);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error("Fetch Error:", error);
      if (!silent) {
        setError(error?.message || "Failed to load data");
        toast.error("Failed to refresh market data");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [token]);

  // Initial Fetch & Polling
  useEffect(() => {
    if (date && token) {
      fetchHistoryData(date);
      
      // Setup Polling if "Today" is selected
      let interval: NodeJS.Timeout;
      if (isToday(date)) {
        interval = setInterval(() => {
          fetchHistoryData(date, true);
        }, 60000); // Poll every 1 minute
      }
      
      return () => clearInterval(interval);
    }
  }, [date, token, selectedIndex, fetchHistoryData]); // Added selectedIndex to dependencies


  const formatTime = (isoString: string) => {
    try {
        // Expecting "2025-12-11 10:00" or similar
        return format(new Date(isoString), "HH:mm");
    } catch (e) {
        return isoString.split(" ")[1] || isoString;
    }
  };

  const fmt = (val: any, digits = 2) => {
      const num = Number(val);
      if (isNaN(num)) return "-";
      return num.toFixed(digits);
  };
  
  // Chart Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded p-2 shadow-lg text-xs">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {fmt(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (error && !data.length) {
      return (
        <div className="min-h-screen bg-background text-foreground">
            <AuthenticatedNavbar />
            <div className="container mx-auto py-20 text-center">
                 <h2 className="text-xl text-red-500">Error Loading Data</h2>
                 <Button onClick={() => date && fetchHistoryData(date)} className="mt-4">Retry</Button>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <AuthenticatedNavbar />
      <div className="container mx-auto py-6 px-4 max-w-7xl space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Market Intelligence
            </h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
               <Activity className="w-4 h-4" /> Live Market Pulse • Last updated: {format(lastUpdated, "HH:mm:ss")}
            </p>
          </div>

          <div className="flex gap-3">
            {/* Index Selector */}
            <div>
              <select 
                value={selectedIndex}
                onChange={(e) => setSelectedIndex(e.target.value)}
                className="h-10 px-4 py-2 bg-background border border-primary/20 hover:border-primary/50 rounded-md text-sm transition-colors cursor-pointer"
              >
                <option value="NIFTY">NIFTY</option>
                <option value="BANKNIFTY">BANKNIFTY</option>
                <option value="FINNIFTY">FINNIFTY</option>
                <option value="MIDCPNIFTY">MIDCPNIFTY</option>
              </select>
            </div>

            {/* Date Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-[200px] justify-start text-left font-normal border-primary/20 hover:border-primary/50 transition-colors">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Charts Section - All Greeks (Stacked Full Width) */}
        <div className="space-y-6">
            {/* 1. Vega Chart (Call vs Put) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Vega Analysis (Call vs Put)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={formatTime} 
                                tick={{fontSize: 11, fill: '#666'}} 
                                minTickGap={30}
                                stroke="#999"
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                tick={{fontSize: 11, fill: '#666'}}
                                stroke="#999"
                            />
                            <Tooltip 
                                content={<CustomTooltip />}
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    border: '1px solid #ccc',
                                    borderRadius: '6px',
                                    padding: '8px'
                                }}
                            />
                            <Legend 
                                wrapperStyle={{
                                    paddingTop: '12px',
                                    fontSize: '12px'
                                }}
                            />
                            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" strokeWidth={1} />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.call_vega" 
                                name="Call Vega" 
                                stroke="#22c55e" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#22c55e' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.put_vega" 
                                name="Put Vega" 
                                stroke="#ef4444" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Gamma Chart (Call vs Put) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-purple-500" /> Gamma Analysis (Call vs Put)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{fontSize: 11, fill: '#666'}} minTickGap={30} stroke="#999" />
                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 11, fill: '#666'}} stroke="#999" />
                            <Tooltip content={<CustomTooltip />} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '6px', padding: '8px'}} />
                            <Legend wrapperStyle={{paddingTop: '12px', fontSize: '12px'}} />
                            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" strokeWidth={1} />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.call_gamma" 
                                name="Call Gamma" 
                                stroke="#22c55e" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#22c55e' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.put_gamma" 
                                name="Put Gamma" 
                                stroke="#ef4444" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 3. Delta Chart (Call vs Put) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-orange-500" /> Delta Analysis (Call vs Put)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{fontSize: 11, fill: '#666'}} minTickGap={30} stroke="#999" />
                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 11, fill: '#666'}} stroke="#999" />
                            <Tooltip content={<CustomTooltip />} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '6px', padding: '8px'}} />
                            <Legend wrapperStyle={{paddingTop: '12px', fontSize: '12px'}} />
                            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" strokeWidth={1} />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.call_delta" 
                                name="Call Delta" 
                                stroke="#22c55e" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#22c55e' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.put_delta" 
                                name="Put Delta" 
                                stroke="#ef4444" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 4. Theta Chart (Call vs Put) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-pink-500" /> Theta Analysis (Call vs Put)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" strokeOpacity={0.5} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{fontSize: 11, fill: '#666'}} minTickGap={30} stroke="#999" />
                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 11, fill: '#666'}} stroke="#999" />
                            <Tooltip content={<CustomTooltip />} contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '6px', padding: '8px'}} />
                            <Legend wrapperStyle={{paddingTop: '12px', fontSize: '12px'}} />
                            <ReferenceLine y={0} stroke="#999" strokeDasharray="3 3" strokeWidth={1} />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.call_theta" 
                                name="Call Theta" 
                                stroke="#22c55e" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#22c55e' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="greeks.put_theta" 
                                name="Put Theta" 
                                stroke="#ef4444" 
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 5, fill: '#ef4444' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>

        {/* Data Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-md">
          <CardHeader>
            <CardTitle>Detailed Market Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !data.length ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data.length > 0 ? (
              <div className="rounded-md border overflow-x-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[80px]">Time</TableHead>
                      <TableHead className="text-right text-xs">Call Vega</TableHead>
                      <TableHead className="text-right text-xs">Put Vega</TableHead>
                      <TableHead className="text-right text-xs font-bold bg-emerald-500/5">Net Vega</TableHead>
                      <TableHead className="text-right text-xs">Call Gamma</TableHead>
                      <TableHead className="text-right text-xs">Put Gamma</TableHead>
                      <TableHead className="text-right text-xs font-bold bg-purple-500/5">Net Gamma</TableHead>
                      <TableHead className="text-right text-xs">Call Delta</TableHead>
                      <TableHead className="text-right text-xs">Put Delta</TableHead>
                      <TableHead className="text-right text-xs font-bold bg-orange-500/5">Net Delta</TableHead>
                      <TableHead className="text-right text-xs">Call Theta</TableHead>
                      <TableHead className="text-right text-xs">Put Theta</TableHead>
                      <TableHead className="text-right text-xs font-bold bg-pink-500/5">Net Theta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...data].reverse().map((row, index) => { // Show newest first
                       const g = row.greeks || {};
                       
                       return (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium font-mono text-xs">{formatTime(row.timestamp)}</TableCell>
                        
                        {/* Vega */}
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-emerald-600 bg-emerald-500/5">{fmt(g.diff_vega)}</TableCell>
                        
                        {/* Gamma */}
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_gamma)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_gamma)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-purple-600 bg-purple-500/5">{fmt(g.diff_gamma)}</TableCell>
                        
                        {/* Delta */}
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-orange-600 bg-orange-500/5">{fmt(g.diff_delta)}</TableCell>
                        
                        {/* Theta */}
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_theta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_theta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-pink-600 bg-pink-500/5">{fmt(g.diff_theta)}</TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No data available for this date.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveData;

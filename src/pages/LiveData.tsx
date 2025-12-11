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
}

const LiveData = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
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

      const response = await fetch(`${BACKEND_API_BASE_URL}/market/history?date=${dateStr}`, {
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

      // Map Data
      const mappedData: GreeksData[] = result.map((item: any) => {
          if (!item || !item.data || !item.data.greeks) return null;
          return {
            timestamp: item.timestamp, // "YYYY-MM-DD HH:MM"
            greeks: item.data.greeks,
            velocity: item.data.velocity
          };
      }).filter((item) => item !== null) as GreeksData[];

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
  }, [date, token, fetchHistoryData]);


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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. Vega Trend (Absolute) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-primary" /> Vega Momentum (Absolute)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorVega" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{fontSize: 10}} minTickGap={30} />
                            <YAxis domain={['auto', 'auto']} tick={{fontSize: 10}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Area 
                                type="monotone" 
                                dataKey="greeks.diff_vega" 
                                name="Net Vega (Call - Put)" 
                                stroke="#10b981" 
                                fillOpacity={1} 
                                fill="url(#colorVega)" 
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Vega Velocity (Change per Minute) */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <Activity className="w-4 h-4 text-blue-500" /> Vega Velocity (Change / Min)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                             <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{fontSize: 10}} minTickGap={30} />
                            <YAxis tick={{fontSize: 10}} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                            <Line 
                                type="monotone" 
                                dataKey="velocity.diff_vega_change" 
                                name="Vega Acceleration" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={false} 
                                activeDot={{ r: 4 }}
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
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="text-right">Call Vega</TableHead>
                      <TableHead className="text-right">Put Vega</TableHead>
                      <TableHead className="text-right text-primary font-bold bg-primary/5">Net Vega</TableHead>
                      <TableHead className="text-right text-blue-500 font-bold bg-blue-500/5">Velocity</TableHead>
                      <TableHead className="text-right">Call Delta</TableHead>
                      <TableHead className="text-right">Put Delta</TableHead>
                      <TableHead className="text-right font-bold bg-muted/30">Net Delta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...data].reverse().map((row, index) => { // Show newest first
                       const g = row.greeks || {};
                       const v = row.velocity; // Can be undefined
                       const vegaChange = v?.diff_vega_change || 0;
                       
                       return (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium font-mono text-xs">{formatTime(row.timestamp)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-primary bg-primary/5">{fmt(g.diff_vega)}</TableCell>
                        <TableCell className={`text-right font-mono text-xs font-bold bg-blue-500/5 ${vegaChange > 0 ? 'text-green-500' : vegaChange < 0 ? 'text-red-500' : ''}`}>
                            {vegaChange > 0 ? '+' : ''}{fmt(vegaChange)}
                        </TableCell>

                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{fmt(g.call_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-muted-foreground">{fmt(g.put_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-foreground">{fmt(g.diff_delta)}</TableCell>
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

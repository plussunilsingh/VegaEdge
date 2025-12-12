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
  } | null;
}

const LiveData = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY");
  const [data, setData] = useState<GreeksData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const fetchHistoryData = useCallback(async (selectedDate: Date, silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      if (!BACKEND_API_BASE_URL) {
        throw new Error("Backend URL is not configured");
      }

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      
      const response = await fetch(`${BACKEND_API_BASE_URL}/market/history?date=${dateStr}&index_name=${selectedIndex}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });

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
              const timeStr = format(new Date(item.timestamp), "HH:mm");
              dataMap.set(timeStr, item);
          }
      });

      // 2. Generate Full Time Backbone
      const timeSlots = generateTimeSlots(selectedDate);
      
      // 3. Merge & Calculate Baseline
      let baseline: any = null;
      
      const processedData: GreeksData[] = timeSlots.map((slotTime) => {
          const timeKey = format(slotTime, "HH:mm");
          const existingData = dataMap.get(timeKey);

          const point: GreeksData = {
              timestamp: slotTime.toISOString(),
              greeks: existingData ? existingData.greeks : null,
              baseline_diff: null
          };

          if (existingData) {
               if (!baseline) {
                   baseline = existingData.greeks;
                   point.baseline_diff = {
                       call_vega_from_open: 0, put_vega_from_open: 0, diff_vega_from_open: 0,
                       call_gamma_from_open: 0, put_gamma_from_open: 0, diff_gamma_from_open: 0,
                       call_delta_from_open: 0, put_delta_from_open: 0, diff_delta_from_open: 0,
                       call_theta_from_open: 0, put_theta_from_open: 0, diff_theta_from_open: 0,
                   };
               } else {
                   const curr = existingData.greeks;
                   point.baseline_diff = {
                       call_vega_from_open: curr.call_vega - baseline.call_vega,
                       put_vega_from_open: curr.put_vega - baseline.put_vega,
                       diff_vega_from_open: curr.diff_vega - baseline.diff_vega,
                       call_gamma_from_open: curr.call_gamma - baseline.call_gamma,
                       put_gamma_from_open: curr.put_gamma - baseline.put_gamma,
                       diff_gamma_from_open: curr.diff_gamma - baseline.diff_gamma,
                       call_delta_from_open: curr.call_delta - baseline.call_delta,
                       put_delta_from_open: curr.put_delta - baseline.put_delta,
                       diff_delta_from_open: curr.diff_delta - baseline.diff_delta,
                       call_theta_from_open: curr.call_theta - baseline.call_theta,
                       put_theta_from_open: curr.put_theta - baseline.put_theta,
                       diff_theta_from_open: curr.diff_theta - baseline.diff_theta,
                   };
               }
          }
          return point;
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
      if (!silent) setIsLoading(false);
    }
  }, [token, selectedIndex]);

  // Initial Fetch & Polling (Drift-Free)
  useEffect(() => {
    if (date && token) {
      fetchHistoryData(date);
      
      let timeoutId: NodeJS.Timeout;

      if (isToday(date)) {
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
            fetchHistoryData(date, true);
            scheduleNext();
          }, delay);
        };

        scheduleNext();
      }
      
      return () => clearTimeout(timeoutId);
    }
  }, [date, token, selectedIndex, fetchHistoryData]);

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
      <div className="container mx-auto py-6 px-4 max-w-[1600px] space-y-6">
        
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

        {/* Charts Section */}
        <div className="space-y-6">
            {/* 1. Vega Chart */}
            <Card className="border-border/40 bg-card/40 backdrop-blur-md shadow-2xl ring-1 ring-white/5">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        <TrendingUp className="w-4 h-4 text-emerald-500" /> Vega Analysis (Dynamic)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.2} vertical={false} />
                            <XAxis 
                                dataKey="timestamp" 
                                tickFormatter={formatTime} 
                                tick={{fontSize: 10, fill: '#888'}} 
                                minTickGap={50}
                                stroke="#444"
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis 
                                domain={['auto', 'auto']} 
                                tick={{fontSize: 10, fill: '#888'}}
                                stroke="#444"
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Legend wrapperStyle={{paddingTop: '10px', fontSize: '11px'}} iconType="circle" />
                            <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" strokeOpacity={0.5} />
                            <Line type="monotone" dataKey="greeks.call_vega" name="Call Vega" stroke="#10b981" strokeWidth={1.5} dot={false} connectNulls={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                            <Line type="monotone" dataKey="greeks.put_vega" name="Put Vega" stroke="#ef4444" strokeWidth={1.5} dot={false} connectNulls={false} activeDot={{ r: 4, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* 2. Change from Baseline */}
            <div className="pt-4">
                 <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 px-1">
                    <Activity className="w-4 h-4 text-blue-500" />
                    Relative Change (From Baseline)
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vega */}
                    <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                        <CardHeader className="py-3"><CardTitle className="text-xs font-medium uppercase text-muted-foreground">Vega Δ</CardTitle></CardHeader>
                        <CardContent className="h-[250px] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="timestamp" tickFormatter={formatTime} fontSize={10} axisLine={false} tickLine={false} minTickGap={40}/>
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeWidth: 1 }}/>
                                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="baseline_diff.call_vega_from_open" name="Call Δ" stroke="#10b981" dot={false} strokeWidth={1.5} connectNulls={false} />
                                    <Line type="monotone" dataKey="baseline_diff.put_vega_from_open" name="Put Δ" stroke="#ef4444" dot={false} strokeWidth={1.5} connectNulls={false} />
                                    <Line type="monotone" dataKey="baseline_diff.diff_vega_from_open" name="Net Δ" stroke="#3b82f6" dot={false} strokeWidth={1.5} connectNulls={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Gamma */}
                     <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                        <CardHeader className="py-3"><CardTitle className="text-xs font-medium uppercase text-muted-foreground">Gamma Δ</CardTitle></CardHeader>
                        <CardContent className="h-[250px] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="timestamp" tickFormatter={formatTime} fontSize={10} axisLine={false} tickLine={false} minTickGap={40}/>
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeWidth: 1 }}/>
                                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="baseline_diff.call_gamma_from_open" name="Call Δ" stroke="#10b981" dot={false} strokeWidth={1.5} connectNulls={false} />
                                    <Line type="monotone" dataKey="baseline_diff.put_gamma_from_open" name="Put Δ" stroke="#ef4444" dot={false} strokeWidth={1.5} connectNulls={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    
                    {/* Delta */}
                     <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                        <CardHeader className="py-3"><CardTitle className="text-xs font-medium uppercase text-muted-foreground">Delta Δ</CardTitle></CardHeader>
                        <CardContent className="h-[250px] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="timestamp" tickFormatter={formatTime} fontSize={10} axisLine={false} tickLine={false} minTickGap={40}/>
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeWidth: 1 }} />
                                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="baseline_diff.call_delta_from_open" name="Call Δ" stroke="#10b981" dot={false} strokeWidth={1.5} connectNulls={false} />
                                    <Line type="monotone" dataKey="baseline_diff.put_delta_from_open" name="Put Δ" stroke="#ef4444" dot={false} strokeWidth={1.5} connectNulls={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Theta */}
                     <Card className="border-border/40 bg-card/40 backdrop-blur-sm">
                        <CardHeader className="py-3"><CardTitle className="text-xs font-medium uppercase text-muted-foreground">Theta Δ</CardTitle></CardHeader>
                        <CardContent className="h-[250px] p-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#333" strokeOpacity={0.1} />
                                    <XAxis dataKey="timestamp" tickFormatter={formatTime} fontSize={10} axisLine={false} tickLine={false} minTickGap={40}/>
                                    <YAxis fontSize={10} axisLine={false} tickLine={false} width={30} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#666', strokeWidth: 1 }} />
                                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                                    <Line type="monotone" dataKey="baseline_diff.call_theta_from_open" name="Call Δ" stroke="#10b981" dot={false} strokeWidth={1.5} connectNulls={false} />
                                    <Line type="monotone" dataKey="baseline_diff.put_theta_from_open" name="Put Δ" stroke="#ef4444" dot={false} strokeWidth={1.5} connectNulls={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </div>

        {/* Data Table */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detailed Market Logs</CardTitle>
            <Button variant="outline" size="sm" onClick={() => {
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
                link.setAttribute("download", `market_data_${selectedIndex}_${format(date || new Date(), "yyyy-MM-dd")}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }}>
                Download CSV
            </Button>
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
                    {[...data]
                        .filter(row => row.greeks !== null)
                        .reverse()
                        .map((row, index) => {
                           const g = row.greeks!;
                           return (
                      <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium font-mono text-xs">{formatTime(row.timestamp)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-emerald-600 bg-emerald-500/5">{fmt(g.diff_vega)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_gamma)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_gamma)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-purple-600 bg-purple-500/5">{fmt(g.diff_gamma)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-green-600/90">{fmt(g.call_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs text-red-600/90">{fmt(g.put_delta)}</TableCell>
                        <TableCell className="text-right font-mono text-xs font-bold text-orange-600 bg-orange-500/5">{fmt(g.diff_delta)}</TableCell>
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

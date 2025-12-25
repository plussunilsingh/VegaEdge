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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, Loader2, Activity, Waves, Zap, RefreshCw, Key, TrendingUp } from "lucide-react";
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
import { SEOHead } from "@/components/SEOHead";

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

// --- Helpers ---
const formatTime = (iso: string) => { 
    try { 
        return format(new Date(iso), "HH:mm"); 
    } catch { return ""; } 
};

const fmtNum = (v: any, digits = 2) => {
    if (v == null || v === undefined) return "-";
    const num = Number(v);
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
                            <span className="font-mono font-medium">{fmtNum(entry.value)}</span>
                        </div>
                    )
                ))}
            </div>
        );
    }
    return null;
};

const AngleOneLiveData = () => {
  const { token, isAuthenticated, isSessionExpired, validateSession } = useAuth();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [expiries, setExpiries] = useState<string[]>([]);
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const [data, setData] = useState<GreeksData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string>("NIFTY");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [showCreds, setShowCreds] = useState(false);
  const [creds, setCreds] = useState({
      client_code: "",
      password: "",
      totp_secret: "",
      api_key: ""
  });

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

  // Fetch Expiries
  useEffect(() => {
      const fetchExpiries = async () => {
          if (!isAuthenticated) return;
          try {
              const res = await fetch(`${BACKEND_API_BASE_URL}/angleone/expiry-list?index_name=${selectedIndex}`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              const list = await res.json();
              if (Array.isArray(list) && list.length > 0) {
                  setExpiries(list);
                  const today = new Date().toISOString().split('T')[0];
                  const future = list.find(d => d >= today);
                  setSelectedExpiry(future || list[0]);
              }
          } catch(e) {
              console.error("AngelOne Expiry Fetch Error", e);
          }
      };
      fetchExpiries();
  }, [token, selectedIndex, isAuthenticated]);

  const fetchHistoryData = useCallback(async (currentDate: Date, currentExpiry: string, silent = false) => {
    if (!currentExpiry) return;
    if (!silent) setLoading(true);
    try {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const url = `${BACKEND_API_BASE_URL}/angleone/history?date=${dateStr}&index_name=${selectedIndex}&expiry_date=${currentExpiry}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error("Fetch failed");
      const result = await response.json();
      
      const timeSlots = generateTimeSlots(currentDate);
      const processedData: GreeksData[] = timeSlots.map((slotTime) => {
          const match = result.find((r: any) => {
              if (!r.timestamp) return false;
              const d = new Date(r.timestamp);
              if (isNaN(d.getTime())) return false;
              return d.getHours() === slotTime.getHours() && d.getMinutes() === slotTime.getMinutes();
          });

          let greeks = null;
          if (match) {
              greeks = {
                  call_vega: Number(match.call_vega || 0),
                  put_vega: Number(match.put_vega || 0),
                  diff_vega: Number(match.put_vega || 0) - Number(match.call_vega || 0),
                  call_delta: Number(match.call_delta || 0),
                  put_delta: Number(match.put_delta || 0),
                  diff_delta: Number(match.put_delta || 0) - Number(match.call_delta || 0),
                  call_gamma: Number(match.call_gamma || 0),
                  put_gamma: Number(match.put_gamma || 0),
                  diff_gamma: Number(match.put_gamma || 0) - Number(match.call_gamma || 0),
                  call_theta: Number(match.call_theta || 0),
                  put_theta: Number(match.put_theta || 0),
                  diff_theta: Number(match.put_theta || 0) - Number(match.call_theta || 0),
              };
          }
          return { timestamp: slotTime.toISOString(), greeks };
      });

      setData(processedData);
      setLastUpdated(new Date());
    } catch (e) {
      if (!silent) toast.error("Failed to load AngelOne history");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [token, selectedIndex, generateTimeSlots]);

  useEffect(() => {
     if (isAuthenticated && selectedExpiry) {
         fetchHistoryData(selectedDate, selectedExpiry);
         if (!isToday(selectedDate)) return;
         const interval = setInterval(() => {
             fetchHistoryData(selectedDate, selectedExpiry, true);
         }, 60000);
         return () => clearInterval(interval);
     }
  }, [selectedDate, selectedIndex, selectedExpiry, isAuthenticated, fetchHistoryData]);

  const handleTriggerFetch = async () => {
      if (!validateSession()) return;
      setLoading(true);
      try {
          const res = await fetch(`${BACKEND_API_BASE_URL}/angleone/fetch-data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({
                  payload: creds,
                  fetch_params: { index_name: selectedIndex, expiry_date: selectedExpiry || format(selectedDate, "yyyy-MM-dd") }
              })
          });
          if (!res.ok) throw new Error((await res.json()).detail || "Fetch failed");
          toast.success("Fetch triggered!");
          if (selectedExpiry) fetchHistoryData(selectedDate, selectedExpiry);
      } catch (e: any) {
          toast.error(e.message);
      } finally {
          setLoading(false);
      }
  };

  const GreekSection = useMemo(() => {
    return ({ title, dataKeyCall, dataKeyPut, dataKeyNet, colorCall, colorPut, colorNet, icon: Icon }: any) => {
        const tableData = [...data].filter(r => r.greeks !== null).reverse();
        
        const { yDomain, yTicks } = (() => {
            let maxVal = 0;
            data.forEach((d: any) => {
                if (d.greeks) {
                    maxVal = Math.max(
                      maxVal, 
                      Math.abs((d.greeks as any)[dataKeyCall] || 0), 
                      Math.abs((d.greeks as any)[dataKeyPut] || 0), 
                      Math.abs((d.greeks as any)[dataKeyNet] || 0)
                    );
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

        return (
            <div className="grid grid-cols-12 gap-4 lg:min-h-[600px] xl:min-h-[700px] h-auto mb-10">
                <Card className="col-span-12 lg:col-span-9 border-border/40 bg-card/40 backdrop-blur-md shadow-xl ring-1 ring-white/5 flex flex-col min-h-[450px] lg:h-full">
                    <CardHeader className="py-2 pb-0">
                        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            <Icon className={cn("w-4 h-4", "text-purple-500")} /> 
                            {title} Analysis
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 w-full min-h-0 p-2 overflow-hidden relative">
                        <div className="w-full h-full overflow-x-auto pb-2">
                            <div className="min-w-[800px] h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" strokeOpacity={0.4} vertical={false} />
                                        <XAxis 
                                            dataKey="timestamp" 
                                            tickFormatter={formatTime} 
                                            tick={{fontSize: 10, fill: '#94a3b8'}} 
                                            stroke="#334155"
                                            height={60}
                                            angle={-45}
                                            textAnchor="end"
                                        />
                                        <YAxis 
                                            domain={yDomain} 
                                            ticks={yTicks}
                                            tickFormatter={(val) => val.toFixed(2)}
                                            tick={{fontSize: 10, fill: '#94a3b8'}}
                                            stroke="#334155"
                                            width={45}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1 }} />
                                        <Legend wrapperStyle={{paddingTop: '5px', fontSize: '11px'}} iconType="circle" />
                                        <ReferenceLine y={0} stroke="#334155" strokeWidth={1.5} />
                                        <ReferenceLine x={getStartRef()} stroke="#334155" strokeDasharray="4 4" label={{ value: '09:15', position: 'insideTopLeft', fill: '#64748b', fontSize: 10 }} />
                                        <Line type="monotone" dataKey={`greeks.${dataKeyCall}`} name={`Call ${title}`} stroke={colorCall} strokeWidth={1.5} dot={false} connectNulls={false} />
                                        <Line type="monotone" dataKey={`greeks.${dataKeyPut}`} name={`Put ${title}`} stroke={colorPut} strokeWidth={1.5} dot={false} connectNulls={false} />
                                        <Line type="monotone" dataKey={`greeks.${dataKeyNet}`} name={`Net ${title}`} stroke="#94a3b8" strokeWidth={2} dot={false} connectNulls={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-12 lg:col-span-3 border-border/40 bg-card/40 backdrop-blur-md shadow-xl flex flex-col h-[400px] lg:h-full">
                    <CardHeader className="py-2 font-semibold text-xs uppercase text-muted-foreground">{title} Table</CardHeader>
                    <CardContent className="p-0 overflow-hidden flex-1">
                        <div className="overflow-y-auto h-full">
                            <Table>
                                <TableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10">
                                    <TableRow className="text-[10px] uppercase">
                                        <TableHead className="pl-4">Time</TableHead>
                                        <TableHead className="text-right text-green-500">Call</TableHead>
                                        <TableHead className="text-right text-red-500">Put</TableHead>
                                        <TableHead className="text-right font-bold">Net</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {tableData.map((row, i) => (
                                        <TableRow key={i} className="text-[11px] border-b border-white/5">
                                            <TableCell className="pl-4 font-mono">{formatTime(row.timestamp)}</TableCell>
                                            <TableCell className="text-right font-mono text-green-400">{fmtNum(row.greeks![dataKeyCall])}</TableCell>
                                            <TableCell className="text-right font-mono text-red-400">{fmtNum(row.greeks![dataKeyPut])}</TableCell>
                                            <TableCell className={cn("text-right font-mono font-bold", colorNet)}>{fmtNum(row.greeks![dataKeyNet])}</TableCell>
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

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-foreground flex flex-col">
      <SEOHead title={`${selectedIndex} AngelOne Analysis | Vega Market Edge`} />
      <AuthenticatedNavbar />
      <div className="w-[98%] max-w-[1920px] mx-auto py-4 space-y-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 px-2">
           <div>
             <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
               AngelOne Intelligence <span className="text-xs font-normal text-muted-foreground border border-border/50 px-2 py-0.5 rounded-full">{selectedIndex}</span>
             </h1>
             <p className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                <Activity className="w-3 h-3" /> AngelOne SmartAPI • Updated: {format(lastUpdated, "HH:mm:ss")}
             </p>
           </div>

           <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
             <Button variant="outline" size="sm" onClick={() => setShowCreds(!showCreds)} className={cn("h-9 text-xs flex-1 sm:flex-none", showCreds && "bg-muted")}>
                 <Key className="w-3 h-3 mr-2" /> Credentials
             </Button>
             <select value={selectedIndex} onChange={e => setSelectedIndex(e.target.value)} className="h-9 px-3 bg-background border rounded-md text-xs flex-1 sm:w-24 sm:flex-none outline-none">
                 <option value="NIFTY">NIFTY</option>
                 <option value="BANKNIFTY">BANKNIFTY</option>
             </select>
             <select value={selectedExpiry} onChange={e => setSelectedExpiry(e.target.value)} className="h-9 px-3 bg-background border rounded-md text-xs flex-1 sm:w-32 sm:flex-none outline-none" disabled={expiries.length === 0}>
                 {expiries.length === 0 && <option>No Expiries</option>}
                 {expiries.map(exp => <option key={exp} value={exp}>{exp}</option>)}
             </select>
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" className="h-9 text-xs flex-1 sm:flex-none sm:min-w-[150px]">
                   <CalendarIcon className="mr-2 h-3 w-3" />
                   {format(selectedDate, "PPP")}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="end">
                 <Calendar mode="single" selected={selectedDate} onSelect={(d) => d && setSelectedDate(d)} disabled={(d) => d > new Date()} />
               </PopoverContent>
             </Popover>
             <Button size="sm" onClick={handleTriggerFetch} disabled={loading} className="h-9 text-xs bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                 {loading ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <RefreshCw className="w-3 h-3 mr-2" />}
                 Fetch Latest
             </Button>
           </div>
        </div>

        {showCreds && (
            <Card className="bg-muted/30 border-purple-500/20">
                <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1"><Label className="text-xs">Client Code</Label><Input value={creds.client_code} onChange={e => setCreds({...creds, client_code: e.target.value})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">Password</Label><Input type="password" value={creds.password} onChange={e => setCreds({...creds, password: e.target.value})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">TOTP Secret</Label><Input type="password" value={creds.totp_secret} onChange={e => setCreds({...creds, totp_secret: e.target.value})} className="h-8 text-xs" /></div>
                    <div className="space-y-1"><Label className="text-xs">API Key</Label><Input type="password" value={creds.api_key} onChange={e => setCreds({...creds, api_key: e.target.value})} className="h-8 text-xs" /></div>
                </CardContent>
            </Card>
        )}

        <GreekSection title="Vega" icon={TrendingUp} dataKeyCall="call_vega" dataKeyPut="put_vega" dataKeyNet="diff_vega" colorCall="#10b981" colorPut="#ef4444" colorNet="text-emerald-500" />
        <GreekSection title="Gamma" icon={Activity} dataKeyCall="call_gamma" dataKeyPut="put_gamma" dataKeyNet="diff_gamma" colorCall="#10b981" colorPut="#ef4444" colorNet="text-purple-500" />
        <GreekSection title="Delta" icon={Waves} dataKeyCall="call_delta" dataKeyPut="put_delta" dataKeyNet="diff_delta" colorCall="#10b981" colorPut="#ef4444" colorNet="text-orange-500" />
        <GreekSection title="Theta" icon={Zap} dataKeyCall="call_theta" dataKeyPut="put_theta" dataKeyNet="diff_theta" colorCall="#10b981" colorPut="#ef4444" colorNet="text-pink-500" />

      </div>
    </div>
  );
};

export default AngleOneLiveData;

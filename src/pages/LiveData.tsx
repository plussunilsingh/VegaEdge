
import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { BACKEND_API_BASE_URL } from "@/config";

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
}

const LiveData = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [data, setData] = useState<GreeksData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (date && token) {
      fetchHistoryData(date);
    }
  }, [date, token]);

  const fetchHistoryData = async (selectedDate: Date) => {
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      // Use BACKEND_API_BASE_URL
      const response = await fetch(`${BACKEND_API_BASE_URL}/market/history?date=${dateStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      // The API returns OptionGreeksLog objects which have a 'data' field containing the JSON payload
      // We need to map that to our GreeksData interface
      const mappedData = result.map((item: any) => ({
        timestamp: item.timestamp,
        greeks: item.data.greeks
      }));
      
      setData(mappedData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load history data");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    return format(new Date(isoString), "HH:mm:ss");
  };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavbar />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-foreground">Market Greeks History</h1>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
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
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Option Chain Greeks ({date ? format(date, "yyyy-MM-dd") : ""})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : data.length > 0 ? (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Time</TableHead>
                      <TableHead className="text-right">Call Vega</TableHead>
                      <TableHead className="text-right">Put Vega</TableHead>
                      <TableHead className="text-right bg-muted/30">Diff Vega</TableHead>
                      <TableHead className="text-right">Call Delta</TableHead>
                      <TableHead className="text-right">Put Delta</TableHead>
                      <TableHead className="text-right bg-muted/30">Diff Delta</TableHead>
                      <TableHead className="text-right">Call Gamma</TableHead>
                      <TableHead className="text-right">Put Gamma</TableHead>
                      <TableHead className="text-right bg-muted/30">Diff Gamma</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{formatTime(row.timestamp)}</TableCell>
                        <TableCell className="text-right font-mono text-green-600">{row.greeks.call_vega.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{row.greeks.put_vega.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{row.greeks.diff_vega.toFixed(2)}</TableCell>
                        
                        <TableCell className="text-right font-mono text-green-600">{row.greeks.call_delta.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{row.greeks.put_delta.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{row.greeks.diff_delta.toFixed(2)}</TableCell>
                        
                        <TableCell className="text-right font-mono text-green-600">{row.greeks.call_gamma.toFixed(4)}</TableCell>
                        <TableCell className="text-right font-mono text-red-600">{row.greeks.put_gamma.toFixed(4)}</TableCell>
                        <TableCell className="text-right font-mono font-bold">{row.greeks.diff_gamma.toFixed(4)}</TableCell>
                      </TableRow>
                    ))}
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { endpoints } from "@/config";
import { cn } from "@/lib/utils";

const Openchart = () => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  });

  const getDateRange = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const maxDate = yesterday.toISOString().split("T")[0];
    const tenDaysAgo = new Date(yesterday);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const minDate = tenDaysAgo.toISOString().split("T")[0];
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getDateRange();

  // Query for Chart Data
  const { data: chartData = "" } = useQuery({
    queryKey: ["chart-data", selectedOption, selectedDate],
    queryFn: async () => {
      const res = await fetch(
        endpoints.chart.getChartData(selectedOption, Math.random(), selectedDate)
      );
      return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Query for Table Data
  const { data: tableData = "" } = useQuery({
    queryKey: ["table-data", selectedOption, selectedDate],
    queryFn: async () => {
      const res = await fetch(
        endpoints.chart.getTableData(selectedOption, Math.random(), selectedDate)
      );
      return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  // Query for Latest Data Header
  const { data: latestData = "" } = useQuery({
    queryKey: ["latest-data", selectedOption, selectedDate],
    queryFn: async () => {
      const res = await fetch(
        endpoints.chart.getLatestData(selectedOption, Math.random(), selectedDate)
      );
      return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {!user?.approved && (
        <div
          className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4"
          role="alert"
        >
          <p className="font-medium">Account Pending Approval</p>
          <p>
            You can view 10 days of backtest data. Full access will be granted after admin approval.
          </p>
        </div>
      )}

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-end">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              Event-Driven Strategies
            </Button>
            <Button size="sm" variant="secondary">
              Neutral Market Strategies
            </Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Bearish Market Strategies
            </Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">
              Bullish Market Strategies
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium mb-2">Select Option Chain</label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full max-w-xs bg-card text-foreground border border-border rounded-md px-4 py-2"
              >
                <option value="1">Nifty 50</option>
                <option value="2">BANKNIFTY</option>
                <option value="3">SENSEX</option>
                <option value="4">FINNIFTY</option>
                <option value="5">MIDCPNIFTY</option>
              </select>
            </div>

            <div className="flex-1 min-w-[200px] text-right">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDate}
                max={maxDate}
                className="bg-card max-w-xs ml-auto"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div dangerouslySetInnerHTML={{ __html: latestData }} className="mb-6" />
                <div dangerouslySetInnerHTML={{ __html: chartData }} className="min-h-[600px]" />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-lg overflow-hidden sticky top-24">
                <div className="max-h-[800px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted text-muted-foreground z-10 border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-left">Time</th>
                        <th className="px-4 py-3 text-left">Call Vega</th>
                        <th className="px-4 py-3 text-left">Put Vega</th>
                        <th className="px-4 py-3 text-left">Difference</th>
                        <th className="px-4 py-3 text-left">Trend</th>
                      </tr>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{ __html: tableData }} />
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Openchart;

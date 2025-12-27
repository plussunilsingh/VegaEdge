
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { endpoints } from "@/config";

const Chart = () => {
  const { user, profileImageUrl } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Query for Chart Data
  const { data: chartData = "" } = useQuery({
    queryKey: ['chart-data-legacy', selectedOption, selectedDate],
    queryFn: async () => {
        const res = await fetch(endpoints.chart.getChartData(selectedOption, Math.random(), selectedDate));
        return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000
  });

  // Query for Table Data
  const { data: tableData = "" } = useQuery({
    queryKey: ['table-data-legacy', selectedOption, selectedDate],
    queryFn: async () => {
        const res = await fetch(endpoints.chart.getTableData(selectedOption, Math.random(), selectedDate));
        return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000
  });

  // Query for Latest Data Header
  const { data: latestData = "" } = useQuery({
    queryKey: ['latest-data-legacy', selectedOption, selectedDate],
    queryFn: async () => {
        const res = await fetch(endpoints.chart.getLatestData(selectedOption, Math.random(), selectedDate));
        return res.text();
    },
    refetchInterval: 60000,
    staleTime: 30000
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* User Welcome & Strategy Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4">
              <img 
                src={profileImageUrl || "/img/user.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-white"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/img/user.jpg")) return;
                  target.src = "/img/user.jpg";
                }}
              />
              <div>
                <p className="font-bold text-lg text-foreground tracking-tight">Welcome {user?.name}</p>
                <p className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1">
                   Partner Referral Program Active
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-end">
              <Button size="sm" className="bg-[#00e5bc] hover:bg-[#00d4ae] text-white font-extrabold rounded-full border-none shadow-sm px-5">Event-Driven</Button>
              <Button size="sm" className="bg-white hover:bg-slate-50 text-slate-600 font-extrabold rounded-full border-none shadow-sm px-5">Neutral Market</Button>
              <Button size="sm" className="bg-[#10b981] hover:bg-[#059669] text-white font-extrabold rounded-full border-none shadow-sm px-5">Bearish</Button>
              <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-extrabold rounded-full border-none shadow-sm px-5">Bullish</Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">Instrument Selection</label>
              <select 
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
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
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1 text-right">Reference Date</label>
              <Input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-50 border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          {/* Chart & Table Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 shadow-sm border border-border ring-1 ring-border">
                <div 
                  dangerouslySetInnerHTML={{ __html: latestData }}
                  className="mb-6"
                />
                <div 
                  dangerouslySetInnerHTML={{ __html: chartData }}
                  className="min-h-[600px] overflow-hidden rounded-xl bg-slate-50/30"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden sticky top-24 ring-1 ring-border">
                <div className="max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-50/80 backdrop-blur-md text-slate-500 z-10 border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Time</th>
                        <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Call Vega</th>
                        <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Put Vega</th>
                        <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter">Diff</th>
                        <th className="px-4 py-4 text-left font-bold uppercase tracking-tighter text-center">Trend</th>
                      </tr>
                    </thead>
                    <tbody dangerouslySetInnerHTML={{ __html: tableData }} className="bg-white" />
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

export default Chart;

import { useState, useEffect } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { endpoints } from "@/config";

const Chart = () => {
  const { user, profileImageUrl } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [chartData, setChartData] = useState("");
  const [tableData, setTableData] = useState("");
  const [latestData, setLatestData] = useState("");

  const fetchChartData = () => {
    const randomParam = Math.random();
    fetch(endpoints.chart.getChartData(selectedOption, randomParam, selectedDate))
      .then(response => response.text())
      .then(data => setChartData(data))
      .catch(err => console.error("Error fetching chart:", err));
  };

  const fetchTableData = () => {
    const randomParam = Math.random();
    fetch(endpoints.chart.getTableData(selectedOption, randomParam, selectedDate))
      .then(response => response.text())
      .then(data => setTableData(data))
      .catch(err => console.error("Error fetching table:", err));
  };

  const fetchLatestData = () => {
    const randomParam = Math.random();
    fetch(endpoints.chart.getLatestData(selectedOption, randomParam, selectedDate))
      .then(response => response.text())
      .then(data => setLatestData(data))
      .catch(err => console.error("Error fetching latest:", err));
  };

  useEffect(() => {
    fetchChartData();
    fetchTableData();
    fetchLatestData();

    const interval = setInterval(() => {
      fetchChartData();
      fetchTableData();
      fetchLatestData();
    }, 60000); // Refresh every 60 seconds

    return () => clearInterval(interval);
  }, [selectedOption, selectedDate]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <AuthenticatedNavbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* User Welcome & Strategy Buttons */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-4">
              <img 
                src={profileImageUrl || "/img/user.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes("/img/user.jpg")) return; // Prevent loop
                  target.src = "/img/user.jpg";
                }}
              />
              <div>
                <p className="font-bold text-lg">Welcome {user?.name}</p>
                <p className="text-sm text-muted-foreground">Earn 1500 rupees for every referral</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-end">
              <Button size="sm" className="bg-[#00e5bc] hover:bg-[#00d4ae] text-white font-bold rounded-full border-none">Event-Driven</Button>
              <Button size="sm" className="bg-[#f1f5f9] hover:bg-[#e2e8f0] text-[#1e293b] font-bold rounded-full border-none">Neutral Market</Button>
              <Button size="sm" className="bg-[#10b981] hover:bg-[#059669] text-white font-bold rounded-full border-none">Bearish</Button>
              <Button size="sm" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full border-none">Bullish</Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-center">
            <div>
              <label className="block text-sm font-medium mb-2">Select Option Chain</label>
              <select 
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full max-w-xs bg-card border border-border rounded-md px-4 py-2"
              >
                <option value="1">Nifty 50</option>
                <option value="2">BANKNIFTY</option>
                <option value="3">SENSEX</option>
                <option value="4">FINNIFTY</option>
                <option value="5">MIDCPNIFTY</option>
              </select>
            </div>

            <div className="ml-auto">
              <Input 
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-card"
              />
            </div>
          </div>

          {/* Chart & Table Layout */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-2xl p-6 shadow-lg">
                <div 
                  dangerouslySetInnerHTML={{ __html: latestData }}
                  className="mb-6"
                />
                <div 
                  dangerouslySetInnerHTML={{ __html: chartData }}
                  className="min-h-[600px]"
                />
              </div>
            </div>

            {/* Table Section */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl shadow-lg overflow-hidden sticky top-24">
                <div className="max-h-[800px] overflow-y-auto overflow-x-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-100 text-slate-700 z-10 border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Time</th>
                        <th className="px-4 py-3 text-left font-semibold">Call Vega</th>
                        <th className="px-4 py-3 text-left font-semibold">Put Vega</th>
                        <th className="px-4 py-3 text-left font-semibold">Difference</th>
                        <th className="px-4 py-3 text-left font-semibold text-center">Trend</th>
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

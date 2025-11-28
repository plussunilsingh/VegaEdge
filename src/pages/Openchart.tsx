import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { endpoints } from "@/config";

const Openchart = () => {
  const { user } = useAuth();
  const [selectedOption, setSelectedOption] = useState("1");
  const [selectedDate, setSelectedDate] = useState(() => {
    // Get yesterday's date for unapproved users
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  });
  const [chartData, setChartData] = useState("");
  const [tableData, setTableData] = useState("");
  const [latestData, setLatestData] = useState("");

  // Calculate date range - last 10 days from yesterday
  const getDateRange = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const maxDate = yesterday.toISOString().split('T')[0];
    
    const tenDaysAgo = new Date(yesterday);
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
    const minDate = tenDaysAgo.toISOString().split('T')[0];
    
    return { minDate, maxDate };
  };

  const { minDate, maxDate } = getDateRange();

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
    <div className="min-h-screen flex flex-col bg-background">
      {user ? <AuthenticatedNavbar /> : <Navbar />}
      
      {!user?.approved && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
          <p className="font-medium">Account Pending Approval</p>
          <p>You can view 10 days of backtest data. Full access will be granted after admin approval.</p>
        </div>
      )}
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          {/* Strategy Buttons */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-end">
            <Button size="sm" className="bg-primary hover:bg-primary/90">Event-Driven Strategies</Button>
            <Button size="sm" variant="secondary">Neutral Market Strategies</Button>
            <Button size="sm" className="bg-green-600 hover:bg-green-700">Bearish Market Strategies</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700">Bullish Market Strategies</Button>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 items-end">
            <div className="flex-1 min-w-[250px]">
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
                <div className="max-h-[800px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-black text-white z-10">
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

      <Footer />
    </div>
  );
};

export default Openchart;

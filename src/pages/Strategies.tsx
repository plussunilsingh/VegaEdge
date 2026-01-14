import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Strategies = () => {
  const { theme } = useTheme();
  // State to manage active tab: 'event', 'neutral', 'bearish', 'bullish'
  const [activeTab, setActiveTab] = useState("neutral");

  // Strategy Data
  const strategies = {
    neutral: [
      {
        name: "Short Straddle",
        action: "Sell ATM Call + Sell ATM Put",
        legs: 2,
        risk: "Unlimited",
        bestWhen: "Low volatility",
      },
      {
        name: "Short Strangle",
        action: "Sell OTM Call + Sell OTM Put",
        legs: 2,
        risk: "Unlimited",
        bestWhen: "Range Bound",
      },
      {
        name: "Iron Butterfly",
        action: "Sell ATM Call + Put, Buy OTM Call + Put",
        legs: 4,
        risk: "Limited",
        bestWhen: "Earnings Reports",
      },
      {
        name: "Reverse Iron Condor",
        action: "Sell OTM Call + Put, Buy Further OTM Call + Put",
        legs: 4,
        risk: "Limited",
        bestWhen: "Wider Range",
      },
    ],
    event: [
      {
        name: "Long Straddle",
        action: "Buy ATM Call + Buy ATM Put",
        legs: 2,
        risk: "Limited",
        bestWhen: "Big Move Expected",
      },
      {
        name: "Long Strangle",
        action: "Buy OTM Call + Buy OTM Put",
        legs: 2,
        risk: "Limited",
        bestWhen: "Volatile events",
      },
      {
        name: "Reverse Iron Butterfly",
        action: "Buy ATM Call + Put, Sell OTM Call + Put",
        legs: 4,
        risk: "Limited",
        bestWhen: "Earnings Reports",
      },
      {
        name: "Reverse Iron Condor",
        action: "Buy ATM Call + Put, Sell OTM Call + Put",
        legs: 4,
        risk: "Limited",
        bestWhen: "FOMC Meetings",
      },
    ],
    bearish: [
      {
        name: "Bear Put Spread",
        action: "Buy ITM Put + Sell OTM Put",
        legs: 2,
        risk: "Limited",
        bestWhen: "Moderately Bearish",
      },
      {
        name: "Bear Call Spread",
        action: "Sell ITM Call + Buy OTM Call",
        legs: 2,
        risk: "Limited",
        bestWhen: "Moderately Bearish",
      },
    ],
    bullish: [
      {
        name: "Bull Call Spread",
        action: "Buy ITM Call + Sell OTM Call",
        legs: 2,
        risk: "Limited",
        bestWhen: "Moderately Bullish",
      },
      {
        name: "Bull Put Spread",
        action: "Sell ITM Put + Buy OTM Put",
        legs: 2,
        risk: "Limited",
        bestWhen: "Moderately Bullish",
      },
    ],
  };

  const currentStrategies = strategies[activeTab as keyof typeof strategies] || [];

  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10 transform -skew-y-2 origin-top-left scale-110"></div>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Global Market{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              Strategies
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Explore proven option strategies for every market condition.
          </p>
        </div>
      </div>

      {/* Strategy Selector Buttons */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            variant={activeTab === "event" ? "default" : "outline"}
            onClick={() => setActiveTab("event")}
            className="rounded-full px-6"
          >
            Event-Driven
          </Button>
          <Button
            variant={activeTab === "neutral" ? "default" : "secondary"}
            onClick={() => setActiveTab("neutral")}
            className="rounded-full px-6"
          >
            Neutral Market
          </Button>
          <Button
            variant={activeTab === "bearish" ? "destructive" : "outline"}
            onClick={() => setActiveTab("bearish")}
            className="rounded-full px-6 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            style={activeTab === "bearish" ? { backgroundColor: "#ef4444", color: "white" } : {}}
          >
            Bearish Market
          </Button>
          <Button
            variant={activeTab === "bullish" ? "default" : "outline"}
            onClick={() => setActiveTab("bullish")}
            className="rounded-full px-6 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
            style={activeTab === "bullish" ? { backgroundColor: "#22c55e", color: "white" } : {}}
          >
            Bullish Market
          </Button>
        </div>
      </div>

      {/* Strategies Table */}
      <div className="container mx-auto px-4 mb-20">
        <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
          <div className="p-6 bg-primary/5 border-b border-border flex justify-between items-center">
            <h2 className="text-2xl font-bold capitalize">{activeTab} Strategies</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black text-white text-left">
                  <th className="p-4 font-bold">Strategy</th>
                  <th className="p-4 font-bold">Action</th>
                  <th className="p-4 font-bold">Legs</th>
                  <th className="p-4 font-bold">Risk Profiles</th>
                  <th className="p-4 font-bold">Best When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentStrategies.map((strategy, index) => (
                  <tr key={index} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 font-semibold text-primary">{strategy.name}</td>
                    <td className="p-4 text-sm">{strategy.action}</td>
                    <td className="p-4">{strategy.legs}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${strategy.risk === "Limited" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {strategy.risk}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground italic">{strategy.bestWhen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Strategies;

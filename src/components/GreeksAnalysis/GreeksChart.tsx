import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const CHART_COLORS = {
  call: "#059669", // Emerald 600
  put: "#dc2626", // Red 600
  grid: "#e2e8f0", // Slate 200
};

const formatTime = (isoString: string) => {
  try {
    return format(new Date(isoString), "HH:mm");
  } catch (e) {
    return "";
  }
};

const fmtNum = (val: any, digits = 2) => {
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
        {payload.map(
          (entry: any, index: number) =>
            entry.value !== undefined &&
            entry.value !== null && (
              <div key={index} className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-foreground">{entry.name}:</span>
                <span className="font-mono font-medium">{fmtNum(entry.value)}</span>
              </div>
            )
        )}
      </div>
    );
  }
  return null;
};

interface GreeksChartProps {
  title: string;
  data: any[];
  dataKeyCall: string;
  dataKeyPut: string;
  dataKeyNet: string;
  colorNet: string;
  icon: any;
  selectedDate: Date;
  interval?: number;
  baselineTime?: string;
}

import { useState } from "react";
import { Button } from "@/components/ui/button";

// ... existing imports ...

// ... existing code ...

export const GreeksChart = ({
  title,
  data,
  dataKeyCall,
  dataKeyPut,
  dataKeyNet,
  colorNet,
  icon: Icon,
  selectedDate,
  interval = 1,
  baselineTime,
}: GreeksChartProps) => {
  const [visibleSeries, setVisibleSeries] = useState<"both" | "call" | "put">("both");

  // Symmetric Scaling Logic
  const { yDomain, yTicks } = (() => {
    let maxVal = 0;
    data.forEach((d: any) => {
      if (d.greeks) {
        maxVal = Math.max(
          maxVal,
          Math.abs(Number((d.greeks as any)[dataKeyCall]) || 0),
          Math.abs(Number((d.greeks as any)[dataKeyPut]) || 0),
          Math.abs(Number((d.greeks as any)[dataKeyNet]) || 0)
        );
      }
    });
    const limit = maxVal === 0 ? 1 : maxVal * 1.1;
    const step = limit / 2;
    return {
      yDomain: [-limit, limit] as [number, number],
      yTicks: [-limit, -step, 0, step, limit],
    };
  })();

  const getStartRef = () => {
    if (baselineTime) return baselineTime;
    const start = new Date(selectedDate);
    start.setHours(9, 15, 0, 0);
    return start.toISOString();
  };

  // Calculate explicit ticks for X-Axis
  const xAxisTicks = (() => {
    if (!data || data.length === 0) return [];
    
    // For sparse intervals (>= 5m), show every point (User Request)
    // 5m = ~75 labels (Tilted fits okay)
    // 10m = ~37 labels
    // 30m = ~13 labels
    if (interval >= 5) {
      return data.map((d) => d.timestamp);
    }

    // For dense intervals (1m, 3m), showing every point (375 labels) is too messy/overlapping.
    // Solution: Show ticks every 15 minutes instead.
    const ticks: string[] = [];
    
    // Find the first clean 15-min mark or use start
    // We filter raw timestamps to find those landing on :00, :15, :30, :45 minutes
    data.forEach((d) => {
       const dt = new Date(d.timestamp);
       const minutes = dt.getMinutes();
       if (minutes % 15 === 0) {
         ticks.push(d.timestamp);
       }
    });

    // Ensure start/end context if missing (optional, but good for range visibility)
    if (ticks.length === 0 || ticks[0] !== data[0].timestamp) {
        // Only force add start if it's significant, otherwise 15m grid is clean enough
    }
    
    return ticks;
  })();

  return (
    <Card className="col-span-12 lg:col-span-9 border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 flex flex-col h-[500px] lg:h-[600px] overflow-hidden group relative">
      <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between z-10 bg-slate-50/50">
        <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-800 uppercase tracking-widest">
          <Icon className={cn("w-5 h-5", colorNet.replace("text-", "text-"))} />
          {title} Analysis
        </CardTitle>
        <div className="flex items-center gap-2">
           <Button
            variant={visibleSeries === "call" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisibleSeries("call")}
            className={cn(
              "h-7 text-xs font-bold uppercase tracking-wider",
              visibleSeries === "call" ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            )}
          >
            Call Only
          </Button>
          <Button
             variant={visibleSeries === "put" ? "default" : "outline"}
             size="sm"
             onClick={() => setVisibleSeries("put")}
             className={cn(
               "h-7 text-xs font-bold uppercase tracking-wider",
               visibleSeries === "put" ? "bg-red-600 hover:bg-red-700 text-white" : "text-red-600 hover:text-red-700 hover:bg-red-50"
             )}
           >
             Put Only
           </Button>
           <Button
            variant={visibleSeries === "both" ? "default" : "outline"}
            size="sm"
            onClick={() => setVisibleSeries("both")}
            className="h-7 text-xs font-bold uppercase tracking-wider"
          >
            VS Match
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 p-3 lg:p-4 overflow-hidden relative z-10 flex flex-col">
        {/* Dynamic Summary Metrics - Matches Competitor Style */}
        <div className="flex flex-wrap items-center gap-4 mb-4 px-2">
            {(visibleSeries === "both" || visibleSeries === "call") && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded w-fit mb-1">
                  Call {title}
                </span>
                <span
                  className={cn(
                    "text-lg font-mono font-bold",
                    (data[data.length - 1]?.greeks?.[dataKeyCall] ?? 0) < 0
                      ? "text-red-500"
                      : "text-emerald-600"
                  )}
                >
                  {fmtNum(data[data.length - 1]?.greeks?.[dataKeyCall] ?? 0)}
                </span>
              </div>
            )}
            
            {(visibleSeries === "both" || visibleSeries === "put") && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded w-fit mb-1">
                  Put {title}
                </span>
                <span
                  className={cn(
                    "text-lg font-mono font-bold",
                    (data[data.length - 1]?.greeks?.[dataKeyPut] ?? 0) < 0
                      ? "text-red-500"
                      : "text-emerald-600"
                  )}
                >
                  {fmtNum(data[data.length - 1]?.greeks?.[dataKeyPut] ?? 0)}
                </span>
              </div>
            )}

            {visibleSeries === "both" && (
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mb-1">
                  Difference
                </span>
                <span className="text-lg font-mono font-bold text-slate-800">
                  {fmtNum(
                    Math.abs(
                      (data[data.length - 1]?.greeks?.[dataKeyPut] ?? 0) -
                        (data[data.length - 1]?.greeks?.[dataKeyCall] ?? 0)
                    )
                  )}
                </span>
              </div>
            )}
        </div>

        <div className="flex-1 w-full overflow-x-auto custom-scrollbar">
          <div className="w-full h-full min-w-[800px] lg:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  ticks={xAxisTicks}
                  tickFormatter={formatTime}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                  angle={-45}
                  textAnchor="end"
                  stroke={CHART_COLORS.grid}
                  height={60}
                  interval={0} // Force show all provided ticks
                />
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  tickFormatter={(val) => val.toFixed(2)}
                  tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 500 }}
                  stroke={CHART_COLORS.grid}
                  width={45}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "rgba(0,0,0,0.05)", strokeWidth: 1 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "10px",
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                  iconType="rect"
                  verticalAlign="bottom"
                  align="center"
                />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine
                  x={getStartRef()}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  label={{
                    value: baselineTime ? formatTime(baselineTime) : "09:15",
                    position: "insideTopLeft",
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

                {(visibleSeries === "both" || visibleSeries === "call") && (
                  <Line
                    type="monotone"
                    dataKey={`greeks.${dataKeyCall}`}
                    name={`Call ${title}`}
                    stroke={CHART_COLORS.call}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: CHART_COLORS.call }}
                    animationDuration={1500}
                  />
                )}
                
                {(visibleSeries === "both" || visibleSeries === "put") && (
                  <Line
                    type="monotone"
                    dataKey={`greeks.${dataKeyPut}`}
                    name={`Put ${title}`}
                    stroke={CHART_COLORS.put}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, strokeWidth: 0, fill: CHART_COLORS.put }}
                    animationDuration={1500}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

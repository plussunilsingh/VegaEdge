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
}

export const GreeksChart = ({
  title,
  data,
  dataKeyCall,
  dataKeyPut,
  dataKeyNet,
  colorNet,
  icon: Icon,
  selectedDate,
}: GreeksChartProps) => {
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
    const start = new Date(selectedDate);
    start.setHours(9, 15, 0, 0);
    return start.toISOString();
  };

  return (
    <Card className="col-span-12 lg:col-span-9 border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 flex flex-col h-[500px] lg:h-[600px] overflow-hidden group relative">
      <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between z-10 bg-slate-50/50">
        <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-800 uppercase tracking-widest">
          <Icon className={cn("w-5 h-5", colorNet.replace("text-", "text-"))} />
          {title} Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 w-full min-h-0 p-4 overflow-hidden relative z-10">
        <div className="w-full h-full overflow-x-auto custom-scrollbar">
          <div className="w-full h-full min-w-[800px] lg:min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} vertical={false} />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={formatTime}
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                  stroke={CHART_COLORS.grid}
                  height={60}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis
                  domain={yDomain}
                  ticks={yTicks}
                  tickFormatter={(val) => val.toFixed(2)}
                  tick={{ fontSize: 11, fill: "#64748b", fontWeight: 500 }}
                  stroke={CHART_COLORS.grid}
                  width={55}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: "rgba(0,0,0,0.05)", strokeWidth: 1 }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: "20px", fontSize: "11px", fontWeight: 600 }}
                  iconType="circle"
                  verticalAlign="bottom"
                />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine
                  x={getStartRef()}
                  stroke="#cbd5e1"
                  strokeDasharray="4 4"
                  label={{
                    value: "09:15",
                    position: "insideTopLeft",
                    fill: "#94a3b8",
                    fontSize: 10,
                    fontWeight: 700,
                  }}
                />

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
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

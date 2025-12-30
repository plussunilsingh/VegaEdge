import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GreeksTableProps {
  title: string;
  data: any[];
  dataKeyCall: string;
  dataKeyPut: string;
  dataKeyNet: string;
  colorNet: string;
}

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

export const GreeksTable = ({
  title,
  data,
  dataKeyCall,
  dataKeyPut,
  dataKeyNet,
  colorNet,
}: GreeksTableProps) => {
  const tableData = [...data].filter((r) => r.greeks !== null).reverse();

  const getTrend = (g: any) => {
    if (title !== "Vega") return null;
    const net = g[dataKeyNet];
    if (net > 0.5) return { text: "Bearish", color: "text-[#ef4444]", bg: "bg-red-50" };
    if (net < -0.5) return { text: "Bullish", color: "text-[#10b981]", bg: "bg-green-50" };
    return { text: "Sideways", color: "text-[#f59e0b]", bg: "bg-orange-50" };
  };

  return (
    <Card className="col-span-12 lg:col-span-3 border-slate-200 bg-white shadow-sm flex flex-col h-[400px] lg:h-[600px] overflow-hidden">
      <CardHeader className="py-4 px-6 border-b border-slate-100 bg-slate-50/50">
        <CardTitle className="text-xs font-bold uppercase text-slate-500 tracking-tighter">
          Live {title} Stream
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden flex-1">
        <div className="overflow-y-auto h-full custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-white border-b border-slate-100 z-10">
              <TableRow className="text-[10px] uppercase border-none hover:bg-transparent">
                <TableHead className="pl-6 h-10">Time</TableHead>
                <TableHead className="text-right text-emerald-600 h-10">Call</TableHead>
                <TableHead className="text-right text-red-600 h-10">Put</TableHead>
                <TableHead className="text-right font-bold text-slate-700 h-10 pr-6">Net</TableHead>
                {title === "Vega" && (
                  <TableHead className="text-center text-slate-400 h-10">Trend</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, i) => (
                <TableRow
                  key={i}
                  className="text-[11px] border-b border-slate-50 hover:bg-slate-50/50 transition-colors group"
                >
                  <TableCell className="pl-6 font-mono text-slate-500">
                    {formatTime(row.timestamp)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-emerald-600">
                    {fmtNum(row.greeks![dataKeyCall])}
                  </TableCell>
                  <TableCell className="text-right font-mono text-red-600">
                    {fmtNum(row.greeks![dataKeyPut])}
                  </TableCell>
                  <TableCell className={cn("text-right font-mono font-bold pr-6", colorNet)}>
                    {fmtNum(row.greeks![dataKeyNet])}
                  </TableCell>
                  {title === "Vega" && (
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold",
                          getTrend(row.greeks)?.color,
                          getTrend(row.greeks)?.bg
                        )}
                      >
                        {getTrend(row.greeks)?.text}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

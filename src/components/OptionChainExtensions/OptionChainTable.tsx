import { useMemo } from "react";
import { ArrowUp, ArrowDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface GreekData {
  ltp: number;
  oi: number;
  delta: number;
  gamma: number;
  theta: number;
  vega: number;
  iv: number;
}

interface OptionChainRow {
  strike: number;
  CE: GreekData | Record<string, never>;
  PE: GreekData | Record<string, never>;
}

interface OptionChainMeta {
  index: string;
  expiry: string;
  spot: number;
  atm: number;
  timestamp: string;
}

interface OptionChainData {
  meta: OptionChainMeta;
  rows: OptionChainRow[];
}

interface OptionChainTableProps {
  data: OptionChainData | null;
  isLoading: boolean;
}

const HeaderCell = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <th className={cn("px-2 py-2 text-xs font-bold uppercase tracking-tighter text-slate-500", className)}>
    {children}
  </th>
);

const DataCell = ({ 
  value, 
  type = "text", 
  className,
  prevValue 
}: { 
  value: number | string | undefined; 
  type?: "text" | "number" | "currency"; 
  className?: string;
  prevValue?: number;
}) => {
  const displayVal = value === undefined || value === null ? "-" : 
    type === "currency" ? Number(value).toFixed(2) : 
    type === "number" ? Number(value).toFixed(2) : value;

  return (
    <td className={cn("px-2 py-1.5 text-xs font-mono border-r border-slate-100 last:border-r-0", className)}>
      {displayVal}
    </td>
  );
};

export const OptionChainTable = ({ data, isLoading }: OptionChainTableProps) => {
  
  if (isLoading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
        <Activity className="w-8 h-8 mb-2 animate-pulse text-indigo-400" />
        <p className="text-sm font-medium">Loading Live Greeks Chain...</p>
      </div>
    );
  }

  const { rows, meta } = data;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Meta Header */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm font-black text-slate-700">{meta.index}</span>
          <span className="text-xs font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {meta.expiry}
          </span>
        </div>
        <div className="text-sm font-mono">
          <span className="text-slate-500 mr-2">Spot:</span>
          <span className="font-bold text-slate-900">{meta.spot.toFixed(2)}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-50/50 border-b border-indigo-100">
              <th colSpan={8} className="text-center py-1 text-xs font-bold text-emerald-600 border-r border-indigo-100">CALLS</th>
              <th className="py-1"></th>
              <th colSpan={8} className="text-center py-1 text-xs font-bold text-red-600">PUTS</th>
            </tr>
            <tr className="bg-slate-50 border-b border-slate-200">
              {/* CALLS */}
              <HeaderCell>OI</HeaderCell>
              <HeaderCell>Delta</HeaderCell>
              <HeaderCell>Gamma</HeaderCell>
              <HeaderCell>Theta</HeaderCell>
              <HeaderCell>Vega</HeaderCell>
              <HeaderCell>IV</HeaderCell>
              <HeaderCell className="text-right">LTP</HeaderCell>
              
              {/* STRIKE */}
              <HeaderCell className="text-center bg-indigo-50/30 text-indigo-700 min-w-[80px]">Strike</HeaderCell>
              
              {/* PUTS */}
              <HeaderCell className="text-right">LTP</HeaderCell>
              <HeaderCell>IV</HeaderCell>
              <HeaderCell>Vega</HeaderCell>
              <HeaderCell>Theta</HeaderCell>
              <HeaderCell>Gamma</HeaderCell>
              <HeaderCell>Delta</HeaderCell>
              <HeaderCell>OI</HeaderCell>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isATM = row.strike === meta.atm;
              const bgClass = isATM ? "bg-yellow-50" : "hover:bg-slate-50/50";
              const ce = row.CE as GreekData;
              const pe = row.PE as GreekData;
              
              return (
                <tr key={row.strike} className={cn("border-b border-slate-100 transition-colors", bgClass)}>
                  {/* CALLS */}
                  <DataCell value={ce?.oi} type="number" className="text-slate-500" />
                  <DataCell value={ce?.delta} type="number" className="text-orange-600" />
                  <DataCell value={ce?.gamma} type="number" className="text-purple-600" />
                  <DataCell value={ce?.theta} type="number" className="text-pink-600" />
                  <DataCell value={ce?.vega} type="number" className="text-blue-600 font-medium" />
                  <DataCell value={ce?.iv} type="number" className="text-slate-600" />
                  <DataCell value={ce?.ltp} type="currency" className="text-emerald-700 font-bold text-right" />
                  
                  {/* STRIKE */}
                  <DataCell 
                    value={row.strike} 
                    className={cn(
                      "text-center font-bold bg-slate-50/50 text-slate-800",
                      isATM && "bg-yellow-100/50 text-yellow-900 border-x border-yellow-200"
                    )} 
                  />
                  
                  {/* PUTS */}
                  <DataCell value={pe?.ltp} type="currency" className="text-red-700 font-bold text-right" />
                  <DataCell value={pe?.iv} type="number" className="text-slate-600" />
                  <DataCell value={pe?.vega} type="number" className="text-blue-600 font-medium" />
                  <DataCell value={pe?.theta} type="number" className="text-pink-600" />
                  <DataCell value={pe?.gamma} type="number" className="text-purple-600" />
                  <DataCell value={pe?.delta} type="number" className="text-orange-600" />
                  <DataCell value={pe?.oi} type="number" className="text-slate-500" />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

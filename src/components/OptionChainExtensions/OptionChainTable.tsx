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
  <th className={cn("px-2 py-2 text-xs font-semibold uppercase tracking-tight", "text-[#6A7582]", className)}>
    {children}
  </th>
);

const DataCell = ({ 
  value, 
  type = "text", 
  className,
  prevValue,
  precision = 4
}: { 
  value: number | string | undefined; 
  type?: "text" | "number" | "currency" | "greek"; 
  className?: string;
  prevValue?: number;
  precision?: number;
}) => {
  const displayVal = value === undefined || value === null ? "-" : 
    type === "currency" ? Number(value).toFixed(2) : 
    type === "greek" ? Number(value).toFixed(4) :
    type === "number" ? Number(value).toFixed(precision) : value;

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
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-4 py-3 border-b border-slate-200">
        <div className="flex justify-between items-center">
          {/* Left: Index & Expiry */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-black text-slate-800">{meta.index}</span>
            <span className="text-xs font-semibold text-slate-600 bg-white px-3 py-1 rounded-md border border-slate-300 shadow-sm">
              Expiry: {meta.expiry}
            </span>
          </div>
          
          {/* Right: Spot Price with Green Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border-2 border-emerald-500 shadow-md">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-slate-600">SPOT</span>
              </div>
              <span className="text-xl font-black text-emerald-600 font-mono">
                {meta.spot.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F9FBFE] border-b border-slate-200">
              <th colSpan={7} className="text-center py-2 text-xs font-bold text-emerald-600 border-r border-slate-200">CALLS</th>
              <th className="py-2 bg-[#E8ECFC]"></th>
              <th colSpan={7} className="text-center py-2 text-xs font-bold text-red-600">PUTS</th>
            </tr>
            <tr className="bg-[#F9FBFE] border-b border-slate-200">
              {/* CALLS */}
              <HeaderCell>OI</HeaderCell>
              <HeaderCell>Delta</HeaderCell>
              <HeaderCell>Gamma</HeaderCell>
              <HeaderCell>Theta</HeaderCell>
              <HeaderCell>Vega</HeaderCell>
              <HeaderCell>IV</HeaderCell>
              <HeaderCell className="text-right">LTP</HeaderCell>
              
              {/* STRIKE */}
              <HeaderCell className="text-center bg-[#E8ECFC] text-[#212121] font-bold min-w-[80px]">Strike</HeaderCell>
              
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
              const ce = row.CE as GreekData;
              const pe = row.PE as GreekData;
              
              // AngelOne ITM logic: Call ITM when strike < spot, Put ITM when strike > spot
              const isCallITM = row.strike < meta.spot;
              const isPutITM = row.strike > meta.spot;
              
              // AngelOne colors: ITM = #FDF7EC (cream), OTM = white
              const callBg = isCallITM ? "bg-[#FDF7EC]" : "bg-white";
              const putBg = isPutITM ? "bg-[#FDF7EC]" : "bg-white";
              
              // Green line for ATM strike (exact match)
              const borderClass = isATM ? "border-l-[6px] border-l-emerald-600 shadow-sm" : "";
              
              return (
                <tr key={row.strike} className={cn("border-b border-slate-100 transition-colors hover:bg-slate-50/30", borderClass)}>
                  {/* CALLS */}
                  <DataCell value={ce?.oi} type="number" precision={0} className={cn("text-[#008D57]", callBg)} />
                  <DataCell value={ce?.delta} type="greek" className={cn("text-[#212121]", callBg)} />
                  <DataCell value={ce?.gamma} type="greek" className={cn("text-[#212121]", callBg)} />
                  <DataCell value={ce?.theta} type="greek" className={cn("text-[#212121]", callBg)} />
                  <DataCell value={ce?.vega} type="greek" className={cn("text-[#212121]", callBg)} />
                  <DataCell value={ce?.iv} type="greek" className={cn("text-[#212121]", callBg)} />
                  <DataCell value={ce?.ltp} type="currency" className={cn("text-[#3F5BD9] font-semibold text-right", callBg)} />
                  
                  {/* STRIKE */}
                  <DataCell 
                    value={row.strike} 
                    className="text-center font-bold bg-[#E8ECFC] text-[#212121]"
                  />
                  
                  {/* PUTS */}
                  <DataCell value={pe?.ltp} type="currency" className={cn("text-[#3F5BD9] font-semibold text-right", putBg)} />
                  <DataCell value={pe?.iv} type="greek" className={cn("text-[#212121]", putBg)} />
                  <DataCell value={pe?.vega} type="greek" className={cn("text-[#212121]", putBg)} />
                  <DataCell value={pe?.theta} type="greek" className={cn("text-[#212121]", putBg)} />
                  <DataCell value={pe?.gamma} type="greek" className={cn("text-[#212121]", putBg)} />
                  <DataCell value={pe?.delta} type="greek" className={cn("text-[#212121]", putBg)} />
                  <DataCell value={pe?.oi} type="number" precision={0} className={cn("text-[#008D57]", putBg)} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

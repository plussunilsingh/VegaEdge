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
  deltaRange?: { min: number; max: number };
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

export const OptionChainTable = ({ data, isLoading, deltaRange = { min: 0.05, max: 0.6 } }: OptionChainTableProps) => {
  
  // Only show full page loader on INITIAL load (status === pending)
  // If we have data (even stale), we show it.
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground bg-slate-50/50 rounded-xl border border-dashed border-slate-300">
        <Activity className="w-8 h-8 mb-2 animate-pulse text-indigo-400" />
        <p className="text-sm font-medium">Loading Live Greeks Chain...</p>
      </div>
    );
  }

  // Safe defaults if data is missing/null (e.g. API error)
  const rows = data?.rows || [];
  const meta = data?.meta || { index: "-", expiry: "-", spot: 0, atm: 0, timestamp: "" };

  // Filter rows based on delta range
  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const ce = row.CE as GreekData;
      const pe = row.PE as GreekData;
      
      // Call delta is positive (0.05 to 0.6)
      // Put delta is negative (-0.05 to -0.6)
      // We need to check the actual delta value with its sign
      // Normalize delta values to numbers (handle strings/nulls safely)
      const ceDelta = ce?.delta !== undefined && ce?.delta !== null ? Number(ce.delta) : null;
      const peDelta = pe?.delta !== undefined && pe?.delta !== null ? Number(pe.delta) : null;
      
      // Use absolute value for range check to treat positive (Call) and negative (Put) deltas symmetrically
      // We want magnitude between min and max (e.g. 0.05 to 0.6)
      const ceInRange = ceDelta !== null && Math.abs(ceDelta) >= deltaRange.min && Math.abs(ceDelta) <= deltaRange.max;
      const peInRange = peDelta !== null && Math.abs(peDelta) >= deltaRange.min && Math.abs(peDelta) <= deltaRange.max;
      
      return ceInRange || peInRange;
    });
  }, [rows, deltaRange]);

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
                {(meta.spot || 0).toFixed(2)}
              </span>
            </div>
            
            {/* Visible Strikes Counter */}
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 shadow-sm">
              <span className="text-xs font-medium text-slate-600">Strikes:</span>
              <span className="text-sm font-black text-slate-800">
                {filteredRows.length} / {rows.length}
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
            {filteredRows.map((row) => {
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

              // Determine if each side is visually "in range" for the delta filter
              // Use safe numeric conversion
              const ceDeltaVal = ce?.delta !== undefined && ce?.delta !== null ? Number(ce.delta) : null;
              const peDeltaVal = pe?.delta !== undefined && pe?.delta !== null ? Number(pe.delta) : null;

              // Check if side is in range: if delta is null, consider it "in range" enough to show (or default behavior)
              // But here we want to dim what is strictly OUT of range
              const ceInRange = ceDeltaVal !== null && Math.abs(ceDeltaVal) >= deltaRange.min && Math.abs(ceDeltaVal) <= deltaRange.max;
              const peInRange = peDeltaVal !== null && Math.abs(peDeltaVal) >= deltaRange.min && Math.abs(peDeltaVal) <= deltaRange.max;

              // Opacity class: 100% if in range, 30% if out of range
              // This strictly "hides" the data visually as requested by user ("suppose not to show")
              const ceOpacity = ceInRange ? "opacity-100" : "opacity-30 blur-[0.5px] grayscale";
              const peOpacity = peInRange ? "opacity-100" : "opacity-30 blur-[0.5px] grayscale";
              
              return (
                <tr key={row.strike} className={cn("border-b border-slate-100 transition-colors hover:bg-slate-50/30", borderClass)}>
                  {/* CALLS - Apply dimming if out of delta range */}
                  <DataCell value={ce?.oi} type="number" precision={4} className={cn("text-[#008D57]", callBg, ceOpacity)} />
                  <DataCell value={ce?.delta} type="greek" className={cn("text-[#212121]", callBg, ceOpacity)} />
                  <DataCell value={ce?.gamma} type="greek" className={cn("text-[#212121]", callBg, ceOpacity)} />
                  <DataCell value={ce?.theta} type="greek" className={cn("text-[#212121]", callBg, ceOpacity)} />
                  <DataCell value={ce?.vega} type="greek" className={cn("text-[#212121]", callBg, ceOpacity)} />
                  <DataCell value={ce?.iv} type="greek" className={cn("text-[#212121]", callBg, ceOpacity)} />
                  <DataCell value={ce?.ltp} type="currency" className={cn("text-[#3F5BD9] font-semibold text-right", callBg, ceOpacity)} />
                  
                  {/* STRIKE - Always visible */}
                  <DataCell 
                    value={row.strike} 
                    className="text-center font-bold bg-[#E8ECFC] text-[#212121]"
                  />
                  
                  {/* PUTS - Apply dimming if out of delta range */}
                  <DataCell value={pe?.ltp} type="currency" className={cn("text-[#3F5BD9] font-semibold text-right", putBg, peOpacity)} />
                  <DataCell value={pe?.iv} type="greek" className={cn("text-[#212121]", putBg, peOpacity)} />
                  <DataCell value={pe?.vega} type="greek" className={cn("text-[#212121]", putBg, peOpacity)} />
                  <DataCell value={pe?.theta} type="greek" className={cn("text-[#212121]", putBg, peOpacity)} />
                  <DataCell value={pe?.gamma} type="greek" className={cn("text-[#212121]", putBg, peOpacity)} />
                  <DataCell value={pe?.delta} type="greek" className={cn("text-[#212121]", putBg, peOpacity)} />
                  <DataCell value={pe?.oi} type="number" precision={4} className={cn("text-[#008D57]", putBg, peOpacity)} />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

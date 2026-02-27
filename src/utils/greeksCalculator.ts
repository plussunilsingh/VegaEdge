/**
 * Greeks.exe Client-Side Mathematics Engine
 *
 * This utility computes the raw mathematical differences dynamically.
 * Trend logic correctly evaluates the *change* from the Day Open baseline.
 *
 * Lot size multiplication is applied here (UI side) for each index.
 * Greeks.exe: getSlicedOcFor() does col *= AD.LOT_SIZE[index] before summing.
 * Math is identical whether you multiply before storing or before displaying:
 *   (put × lot) - (call × lot) = (put - call) × lot
 */

export interface RawGreeks {
  call_vega: number;
  put_vega: number;
  call_delta: number;
  put_delta: number;
  call_gamma: number;
  put_gamma: number;
  call_theta: number;
  put_theta: number;
  call_iv: number;
  put_iv: number;
  [key: string]: any;
}

export interface CalculatedGreeks extends RawGreeks {
  // Synthesized display values
  display_put_vega: number;

  // Synthesized differences
  diff_vega: number;
  diff_delta: number;
  diff_gamma: number;
  diff_theta: number;
  diff_iv: number;

  // Derived analytical fields
  trend: string;
}

/**
 * NSE Lot sizes — CURRENT values post-SEBI revision (effective Nov 2024).
 * These MUST stay in sync with GreeksUtils.GREEKS_LOT_SIZES in the backend.
 * Greeks.exe reads these from parameters.json → AD.LOT_SIZE[index].
 */
export const LOT_SIZES: Record<string, number> = {
  NIFTY:      25,
  BANKNIFTY:  15,
  FINNIFTY:   25,
  MIDCPNIFTY: 50,
};

/** Returns the lot size for a given index (defaults to 1 = no-op). */
export const getLotSize = (indexName: string): number =>
  LOT_SIZES[indexName?.toUpperCase()] ?? 1;

/**
 * Replicates the decompiled Greeks.exe `getVegaTrend` logic.
 * CRITICAL FIX: The values parsed here MUST be the baseline-adjusted changes
 * (current - dayOpen), NOT the raw values.
 */
export const calculateTrend = (
  cv_net_change: number,
  pv_net_change: number,
  diff_net_change: number
): string => {
  // if callvega > 0 and putvega < 0 and vegadiff < 0: 'BULLISH'
  if (cv_net_change > 0 && pv_net_change < 0 && diff_net_change < 0) return "BULLISH";

  // if callvega < 0 and putvega < 0 and vegadiff < 0: 'SIDEWAYS BULLISH'
  if (cv_net_change < 0 && pv_net_change < 0 && diff_net_change < 0) return "SIDEWAYS BULLISH";

  // if callvega < 0 and putvega > 0 and vegadiff > 0: 'BEARISH'
  if (cv_net_change < 0 && pv_net_change > 0 && diff_net_change > 0) return "BEARISH";

  // if callvega < 0 and putvega < 0 and vegadiff > 0: 'SIDEWAYS BEARISH'
  if (cv_net_change < 0 && pv_net_change < 0 && diff_net_change > 0) return "SIDEWAYS BEARISH";

  return "NEUTRAL"; // Fallback state
};

/**
 * Applies lot size multiplication and computes diffs.
 * Replicates Greeks.exe: getSlicedOcFor (lot multiply) → getCumulativeValues (sum) → diff = PUT - CALL.
 *
 * @param raw       Raw Greeks from DB (backend stores un-multiplied values)
 * @param indexName Index name for lot size lookup (e.g. "NIFTY")
 */
export const processRawGreeks = (raw: RawGreeks, indexName: string = "NIFTY"): CalculatedGreeks => {
  const lot = getLotSize(indexName);

  // Apply lot size multiplication (Greeks.exe: getSlicedOcFor col *= AD.LOT_SIZE[index])
  // IV is intentionally NOT lot-multiplied (confirmed from Greeks.exe bytecode)
  const call_vega  = raw.call_vega  * lot;
  const put_vega   = raw.put_vega   * lot;
  const call_gamma = raw.call_gamma * lot;
  const put_gamma  = raw.put_gamma  * lot;
  const call_theta = raw.call_theta * lot;
  const put_theta  = raw.put_theta  * lot;
  const call_delta = raw.call_delta * lot;
  const put_delta  = raw.put_delta  * lot;

  // Diffs: PUT − CALL (confirmed: getSummaryTableFor main_bytecode.txt line 1092)
  const diffVega  = Number((put_vega  - call_vega) .toFixed(2));
  const diffDelta = Number((put_delta - call_delta).toFixed(2));
  const diffGamma = Number((put_gamma - call_gamma).toFixed(2));
  const diffTheta = Number((put_theta - call_theta).toFixed(2));
  const diffIv    = Number((raw.put_iv - raw.call_iv).toFixed(2)); // IV: no lot multiply

  // Trend evaluates to "NEUTRAL" for the raw stream as it requires baseline data
  // The actual trend is calculated inside LiveData.tsx during the baseline mapping phase
  return {
    ...raw,
    // Overwrite with lot-multiplied values so the rest of the UI sees scaled numbers
    call_vega,
    put_vega,
    call_gamma,
    put_gamma,
    call_theta,
    put_theta,
    call_delta,
    put_delta,
    display_put_vega: put_vega,
    diff_vega:  diffVega,
    diff_delta: diffDelta,
    diff_gamma: diffGamma,
    diff_theta: diffTheta,
    diff_iv:    diffIv,
    trend: "NEUTRAL",
  };
};


/**
 * Greeks.exe Client-Side Mathematics Engine
 *
 * This utility computes the raw mathematical differences dynamically.
 * Trend logic correctly evaluates the *change* from the Day Open baseline.
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

export const processRawGreeks = (raw: RawGreeks): CalculatedGreeks => {
  const diffVega = Number((raw.put_vega - raw.call_vega).toFixed(2));
  const diffDelta = Number((raw.put_delta - raw.call_delta).toFixed(2));
  const diffGamma = Number((raw.put_gamma - raw.call_gamma).toFixed(2));
  const diffTheta = Number((raw.put_theta - raw.call_theta).toFixed(2));
  const diffIv = Number((raw.put_iv - raw.call_iv).toFixed(2));

  // Trend evaluates to "NEUTRAL" for the raw stream as it requires baseline data
  // The actual trend is calculated inside LiveData.tsx during the baseline mapping phase
  return {
    ...raw,
    display_put_vega: raw.put_vega,
    diff_vega: diffVega,
    diff_delta: diffDelta,
    diff_gamma: diffGamma,
    diff_theta: diffTheta,
    diff_iv: diffIv,
    trend: "NEUTRAL",
  };
};

/**
 * Greeks.exe Client-Side Mathematics Engine
 *
 * This utility isolates all subjective and display-oriented math from the backend.
 * It perfectly replicates the decompiled logic of Greeks.exe's `Util_decompiled.py`.
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
 * Greeks.exe explicitly inverts Put Vega so it reads as negative visually.
 * Since Black-Scholes inherently calculates positive Vega for puts, we apply this `-1`
 * multiplier at the UI layer to match the exact `getVegaTrend` function decompiled baseline.
 */
export const calculateDisplayPuts = (putVal: number): number => {
  // Example: if Raw Put Vega = 10 (positive), display becomes -10
  return putVal > 0 ? -putVal : putVal;
};

/**
 * Replicates the decompiled Greeks.exe `getVegaTrend` mathematical exactness.
 * Note: It evaluates against the artificially inverted Put Vega.
 */
export const calculateTrend = (cv: number, displayPv: number, diff: number): string => {
  // if callvega > 0 and putvega < 0 and vegadiff < 0: 'BULLISH'
  if (cv > 0 && displayPv < 0 && diff < 0) return "BULLISH";

  // if callvega < 0 and putvega < 0 and vegadiff < 0: 'SIDEWAYS BULLISH'
  if (cv < 0 && displayPv < 0 && diff < 0) return "SIDEWAYS BULLISH";

  // if callvega < 0 and putvega > 0 and vegadiff > 0: 'BEARISH'
  if (cv < 0 && displayPv > 0 && diff > 0) return "BEARISH";

  // if callvega < 0 and putvega < 0 and vegadiff > 0: 'SIDEWAYS BEARISH'
  if (cv < 0 && displayPv < 0 && diff > 0) return "SIDEWAYS BEARISH";

  return "NEUTRAL"; // Fallback state
};

/**
 * Transforms raw Unopinionated Backend Data into Formatted Greeks.exe Data
 */
export const processRawGreeks = (raw: RawGreeks): CalculatedGreeks => {
  // 1. Invert the Put Vega
  const displayPutVega = calculateDisplayPuts(raw.put_vega);

  // 2. Calculate Strict Mathematical Differences (Display Put - Call)
  // Greeks.exe formula = put_vega - call_vega
  const diffVega = Number((displayPutVega - raw.call_vega).toFixed(2));

  // Other diffs remain standard (Put - Call) without artificial inversion
  const diffDelta = Number((raw.put_delta - raw.call_delta).toFixed(2));
  const diffGamma = Number((raw.put_gamma - raw.call_gamma).toFixed(2));
  const diffTheta = Number((raw.put_theta - raw.call_theta).toFixed(2));
  const diffIv = Number((raw.put_iv - raw.call_iv).toFixed(2));

  // 3. Compute Trend based on the INVERTED put vega
  const trend = calculateTrend(raw.call_vega, displayPutVega, diffVega);

  return {
    ...raw,
    put_vega: displayPutVega, // OVERRIDE the raw put_vega with the inverted display version
    display_put_vega: displayPutVega,
    diff_vega: diffVega,
    diff_delta: diffDelta,
    diff_gamma: diffGamma,
    diff_theta: diffTheta,
    diff_iv: diffIv,
    trend: trend,
  };
};

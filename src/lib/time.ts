/**
 * Standardized Timezone: Asia/Kolkata (IST)
 */
export const IST_TIMEZONE = "Asia/Kolkata";

/**
 * Formats a Date or timestamp to IST string.
 * Format: "HH:mm:ss" or customized
 */
export const formatToIST = (
  date: Date | number | string,
  options: Intl.DateTimeFormatOptions = {}
) => {
  const d = new Date(date);
  return d.toLocaleString("en-IN", {
    timeZone: IST_TIMEZONE,
    ...options,
  });
};

/**
 * Gets current time in IST
 */
export const nowIST = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: IST_TIMEZONE }));

/**
 * Formats for chart display (HH:mm)
 */
export const formatChartTime = (date: string | number) => {
  return formatToIST(date, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

/**
 * Formats for log display (HH:mm:ss.l)
 */
export const formatLogTime = (date: Date = new Date()) => {
  const timeStr = formatToIST(date, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const ms = String(date.getMilliseconds()).padStart(3, "0");
  return `${timeStr}.${ms}`;
};

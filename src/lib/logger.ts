/**
 * Standardized emojis for logging (mirrors backend)
 */
export const LogEmojis = {
  APP_START: "🚀",
  APP_STOP: "🛑",
  SUCCESS: "✅",
  ENTRY: "🟢",
  EXIT: "🏁",
  WARNING: "⚠️",
  ERROR: "❌",
  DEBUG: "🔍",
  USER: "👤",
  SYSTEM: "⚙️",
  SCHEDULER: "📅",
  NETWORK: "🌐",
};

/**
 * Structured Logger for the UI
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(
      `%c${LogEmojis.SYSTEM} [INFO] ${message}`,
      "color: #4CAF50; font-weight: bold",
      ...args
    );
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(
      `%c${LogEmojis.WARNING} [WARN] ${message}`,
      "color: #FFC107; font-weight: bold",
      ...args
    );
  },

  error: (message: string, error?: any, action?: string) => {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const trace = error instanceof Error ? error.stack : "No trace available";

    console.group(`%c${LogEmojis.ERROR} [ERROR] ${message}`, "color: #F44336; font-weight: bold");
    console.error(`❌ ERROR: ${errorMsg}`);
    if (action) console.log(`🔧 ACTION: ${action}`);
    console.log(`📜 TRACE:`, trace);
    console.groupEnd();
  },

  userAction: (action: string, details?: any) => {
    console.log(
      `%c${LogEmojis.USER} [USER_ACTION] ${action}`,
      "color: #2196F3; font-weight: bold",
      details || ""
    );
  },

  network: (method: string, url: string, status?: number) => {
    const statusEmoji = status && status < 400 ? LogEmojis.SUCCESS : LogEmojis.ERROR;
    console.log(
      `%c${LogEmojis.NETWORK} [NETWORK] ${method} ${url} ${status ? `(${status} ${statusEmoji})` : ""}`,
      "color: #9C27B0; font-weight: bold"
    );
  },

  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(
        `%c${LogEmojis.DEBUG} [DEBUG] ${message}`,
        "color: #9E9E9E; font-style: italic",
        ...args
      );
    }
  },
};

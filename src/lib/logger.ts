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
  DATABASE: "💾",
  NETWORK: "🌐",
  CACHE: "🗄️",
  REDIS: "🔴",
  API: "🔌",
  LOCK: "🔒",
  WEBSOCKET: "📡",
  VALIDATION: "📋",
  AUTH: "🔐",
};

/**
 * Error Code Taxonomy (mirrors backend)
 */
export enum ErrorCodes {
  // Database errors
  VEGA_DB_001 = "VEGA-DB-001",
  VEGA_DB_002 = "VEGA-DB-002",
  VEGA_DB_003 = "VEGA-DB-003",

  // Cache/Redis errors
  VEGA_REDIS_001 = "VEGA-REDIS-001",
  VEGA_REDIS_002 = "VEGA-REDIS-002",
  VEGA_CACHE_001 = "VEGA-CACHE-001",

  // API/Network errors
  VEGA_API_001 = "VEGA-API-001",
  VEGA_API_002 = "VEGA-API-002",
  VEGA_API_003 = "VEGA-API-003",

  // Authentication errors
  VEGA_AUTH_001 = "VEGA-AUTH-001", // Login failed
  VEGA_AUTH_002 = "VEGA-AUTH-002", // Session expired
  VEGA_AUTH_003 = "VEGA-AUTH-003", // Invalid stored user

  // Validation errors
  VEGA_VAL_001 = "VEGA-VAL-001",
  VEGA_VAL_002 = "VEGA-VAL-002",

  // General errors
  VEGA_GEN_999 = "VEGA-GEN-999",
}

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

  /**
   * Enhanced error logging with structured format
   * Supports both simple string messages and structured error objects
   */
  error: (
    messageOrParams:
      | string
      | {
          message: string;
          code?: ErrorCodes;
          where?: string;
          action?: string;
          error?: any;
        },
    error?: any,
    action?: string
  ) => {
    // Handle both old signature and new structured format
    if (typeof messageOrParams === "string") {
      // Old signature: error(message, error?, action?)
      const errorMsg = error instanceof Error ? error.message : String(error || "");
      const trace = error instanceof Error ? error.stack : "No trace available";

      console.group(
        `%c${LogEmojis.ERROR} [ERROR] ${messageOrParams}`,
        "color: #F44336; font-weight: bold"
      );
      if (errorMsg) console.error(`❌ ERROR: ${errorMsg}`);
      if (action) console.log(`🔧 ACTION: ${action}`);
      if (import.meta.env.DEV) console.log(`📜 TRACE:`, trace);
      console.groupEnd();
    } else {
      // New structured format
      const params = messageOrParams;
      const errorMsg =
        params.error instanceof Error ? params.error.message : String(params.error || "");
      const trace = params.error instanceof Error ? params.error.stack : "No trace available";

      console.group(
        `%c${LogEmojis.ERROR} [ERROR] ${params.message}`,
        "color: #F44336; font-weight: bold"
      );
      if (params.code) console.log(`🔢 ERROR_CODE: ${params.code}`);
      if (params.where) console.log(`📍 WHERE: ${params.where}`);
      if (errorMsg) console.error(`❌ WHAT: ${errorMsg}`);
      if (params.action) console.log(`🔧 ACTION: ${params.action}`);
      if (import.meta.env.DEV && trace) console.log(`📜 TRACE:`, trace);
      console.groupEnd();
    }
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

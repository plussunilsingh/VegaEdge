/**
 * Data Source Enum
 * Matches backend app/models/enums.py DataSource
 */
export enum DataSource {
  REST_API = 1,
  WEB_SOCKET = 2,
}

/**
 * Market Provider Enum
 * Matches backend app/models/enums.py MarketProvider
 */
export enum MarketProvider {
  UPSTOX = 1,
  ANGELONE = 2,
}

/**
 * Helper function to validate DataSource
 */
export function isValidDataSource(value: number): value is DataSource {
  return value === DataSource.REST_API || value === DataSource.WEB_SOCKET;
}

/**
 * Helper function to get DataSource label
 */
export function getDataSourceLabel(source: DataSource): string {
  switch (source) {
    case DataSource.REST_API:
      return "REST API";
    case DataSource.WEB_SOCKET:
      return "WebSocket";
    default:
      return "Unknown";
  }
}

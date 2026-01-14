// Configuration for API endpoints
// You can override the base URLs by setting VITE_CHART_API_BASE_URL and VITE_BACKEND_API_BASE_URL in your .env file

// Legacy PHP backend for Chart Data
export const CHART_API_BASE_URL =
  import.meta.env.VITE_CHART_API_BASE_URL || "https://ibzd.com/upstox";

// Main Python Backend (Render) for Auth and other features
export const BACKEND_API_BASE_URL =
    import.meta.env.VITE_BACKEND_API_BASE_URL || "https://api.vegagreeks.com";
//   import.meta.env.VITE_BACKEND_API_BASE_URL || "http://localhost:8000";

export const COMPANY_NAME = "Vega Greeks Calculator";
export const COMPANY_EMAIL = "contact@vegagreeks.com";
export const COMPANY_PHONE = "9759315703";
export const COMPANY_WHATSAPP = "https://whatsapp.com/channel/0029Vb6nCyIA89MrcMkbGL2M";
export const COMPANY_YOUTUBE_VIDEO = "https://www.youtube.com/watch?v=ZxMNbbVcjfI";
export const COMPANY_YOUTUBE_VIDEO_ID = "ZxMNbbVcjfI";
export const COMPANY_YOUTUBE_CHANNEL = "https://youtube.com/@greekstool";
export const COMPANY_INSTAGRAM = "https://instagram.com/dine_shkumar4852/?igsh=MTNzNGNhN2RqNmJ0";
export const COMPANY_TELEGRAM = "https://t.me/vegagreeks";
export const COMPANY_FACEBOOK =
  "https://www.facebook.com/people/Visualize-Your-Option-Greeks-In-Real-Time/61585757191318/?rdid=FHhdd8Xc9uMeLnWz&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1G1ZRwyrUA%2F";

// Helper to construct URLs
export const endpoints = {
  chart: {
    getChartData: (id: string, x: number, date: string) =>
      `${CHART_API_BASE_URL}/data.php?id=${id}&x=${x}&date=${date}`,

    getTableData: (id: string, x: number, date: string) =>
      `${CHART_API_BASE_URL}/datav1.php?id=${id}&x=${x}&date=${date}`,

    getLatestData: (id: string, x: number, date: string) =>
      `${CHART_API_BASE_URL}/latest.php?id=${id}&x=${x}&date=${date}`,
  },
  auth: {
    login: `${BACKEND_API_BASE_URL}/auth/login`,
    register: `${BACKEND_API_BASE_URL}/auth/register`,
    me: `${BACKEND_API_BASE_URL}/auth/me`,
    logout: `${BACKEND_API_BASE_URL}/auth/logout`,
    saveToken: `${BACKEND_API_BASE_URL}/auth/save-manual-token`, // Explicit endpoint
  },
  user: {
    image: `${BACKEND_API_BASE_URL}/user/image`,
  },
  contact: {
    submit: `${BACKEND_API_BASE_URL}/contact/`,
  },
  market: {
    greeks: (instrumentKey: string, expiryDate: string, token: string) =>
      `${BACKEND_API_BASE_URL}/market/greeks?instrument_key=${instrumentKey}&expiry_date=${expiryDate}&upstox_access_token=${token}`,
    history: (date: string, indexName: string, expiry?: string) =>
      `${BACKEND_API_BASE_URL}/market/history?date=${date}&index_name=${indexName}${expiry ? `&expiry=${expiry}` : ""}`,
    expiryList: `${BACKEND_API_BASE_URL}/market/expiry-list`,
    refreshCache: `${BACKEND_API_BASE_URL}/market/cache-refresh`,
    syncExpiries: `${BACKEND_API_BASE_URL}/market/sync-expiries`,
  },
  admin: {
    users: `${BACKEND_API_BASE_URL}/admin/users`,
    toggleStatus: (userId: string) => `${BACKEND_API_BASE_URL}/admin/users/${userId}/status`,
  },
  angleone: {
    history: (date: string, indexName: string, expiry?: string) =>
      `${BACKEND_API_BASE_URL}/angleone/history?date=${date}&index_name=${indexName}${expiry ? `&expiry=${expiry}` : ""}`,
    expiryList: (indexName?: string) =>
      `${BACKEND_API_BASE_URL}/angleone/expiry-list${indexName ? `?index_name=${indexName}` : ""}`,
    fetchData: `${BACKEND_API_BASE_URL}/angleone/fetch-data`,
  },
};

export const SESSION_TIMEOUT = 10 * 60; // 10 minutes (in seconds)

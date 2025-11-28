
// Configuration for API endpoints
// You can override the base URLs by setting VITE_CHART_API_BASE_URL and VITE_BACKEND_API_BASE_URL in your .env file

// Legacy PHP backend for Chart Data
export const CHART_API_BASE_URL = import.meta.env.VITE_CHART_API_BASE_URL || "https://ibzd.com/upstox";

// Main Python Backend (Render) for Auth and other features
export const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL || "https://vegabackendserver.onrender.com";

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
  }
};

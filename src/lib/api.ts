import { BACKEND_API_BASE_URL } from "@/config";
import { logger } from "./logger";
import { formatLogTime } from "./time";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestOptions extends RequestInit {
  token?: string | null;
}

class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = BACKEND_API_BASE_URL || "";
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private getAuthHeader(token?: string | null): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    // Prefer passed token, fallback to localStorage
    const effectiveToken = token || localStorage.getItem("alphaedge_session");

    if (effectiveToken) {
      headers["Authorization"] = `Bearer ${effectiveToken}`;
    }

    return headers;
  }

  public async request<T>(
    endpoint: string,
    method: RequestMethod = "GET",
    data?: any,
    options?: ApiRequestOptions
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`;

    const config: RequestInit = {
      method,
      headers: {
        ...this.getAuthHeader(options?.token),
        ...options?.headers,
      },
      ...options,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const start = Date.now();
    try {
      const response = await fetch(url, config);
      const duration = Date.now() - start;

      logger.network(method, url, response.status);

      if (response.status === 401) {
        logger.error({
          message: "API Authentication Failure",
          code: "VEGA-AUTH-001" as any,
          where: `ApiClient.request(${url})`,
          action: "Check session token or login again",
        });
        window.dispatchEvent(new CustomEvent("session-expired"));
        throw new Error("Session Expired");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error({
          message: `API Error: ${response.status}`,
          where: `ApiClient.request(${url})`,
          error: errorData,
        });
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      if (response.status === 204) {
        return {} as T;
      }

      const jsonData = await response.json();
      logger.debug(`API Success: ${method} ${url} (${duration}ms)`);
      return jsonData;
    } catch (error) {
      logger.error({
        message: "Network or System Error",
        where: `ApiClient.request(${url})`,
        error,
      });
      throw error;
    }
  }

  public get<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, "GET", undefined, options);
  }

  public post<T>(endpoint: string, data?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, "POST", data, options);
  }

  public put<T>(endpoint: string, data?: any, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, "PUT", data, options);
  }

  public delete<T>(endpoint: string, options?: ApiRequestOptions) {
    return this.request<T>(endpoint, "DELETE", undefined, options);
  }
}

export const api = ApiClient.getInstance();

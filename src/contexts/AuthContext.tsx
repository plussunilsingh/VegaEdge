import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useLocation } from "react-router-dom";
import { endpoints, SESSION_TIMEOUT, BACKEND_API_BASE_URL } from "@/config";
import { SessionExpiredModal } from "@/components/SessionExpiredModal";
import { toast } from "sonner";

// Define Auth States
export enum AuthStatus {
  LOADING = "LOADING",
  GUEST = "GUEST",
  AUTHENTICATED = "AUTHENTICATED",
  EXPIRED = "EXPIRED",
}

// Define Role Enum
export enum UserRole {
  SUPER_ADMIN_USER = "SUPER_ADMIN_USER",
  ADMIN_USER = "ADMIN_USER",
  NORMAL_USER = "NORMAL_USER",
}

interface User {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  approved?: boolean;
  role: UserRole | string;
  is_subscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  profileImageUrl: string | null;
  token: string | null;
  isLoading: boolean;
  isSessionExpired: boolean;
  validateSession: () => boolean;
  updateUserImage: (url: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SessionContextType {
  sessionTimeLeft: number;
}
const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Pattern: Whitelist for public endpoints that skip kill-switch
const PUBLIC_ENDPOINT_WHITELIST = new Set([
  "/auth/login",
  "/auth/logout",
  "/auth/register", // FIXED: Registration fix
  "/auth/heartbeat",
  "/auth/health",
  "/auth/metrics",
  "/auth/me",
  "/auth/user/image",
  "/auth/upstox-login-url",
  "/contact/", // FIXED: Contact us fix
]);

// Pattern: Route Policy Strategy
const PUBLIC_ROUTES = ["/", "/login", "/register", "/about", "/contact", "/disclaimer", "/privacy"];

const mapUser = (userData: any): User => ({
  id: userData.id.toString(),
  firstName: userData.first_name || "",
  lastName: userData.last_name || "",
  name: userData.first_name
    ? `${userData.first_name} ${userData.last_name || ""}`.trim()
    : userData.email.split("@")[0],
  email: userData.email,
  phone: userData.phone_number || "",
  approved: true,
  role: userData.role || UserRole.NORMAL_USER,
  is_subscribed: userData.is_subscribed || false,
  profileImage: userData.profile_image,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(SESSION_TIMEOUT);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>("/img/default_user.png");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.LOADING);

  const location = useLocation();

  const isPublicRoute = useMemo(
    () => PUBLIC_ROUTES.includes(location.pathname),
    [location.pathname]
  );

  // Derived flags for legacy support if needed
  const isLoading = status === AuthStatus.LOADING;
  const isSessionExpired = status === AuthStatus.EXPIRED;
  const isAuthenticated = status === AuthStatus.AUTHENTICATED;

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      if (status === AuthStatus.AUTHENTICATED) {
        setSessionTimeLeft(SESSION_TIMEOUT);
      }
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => document.addEventListener(event, updateActivity));
    return () => events.forEach((event) => document.removeEventListener(event, updateActivity));
  }, [status]);

  // Session timeout countdown
  useEffect(() => {
    if (status !== AuthStatus.AUTHENTICATED) return;

    const interval = setInterval(() => {
      const timeSinceActivity = Math.floor((Date.now() - lastActivity) / 1000);
      const timeLeft = SESSION_TIMEOUT - timeSinceActivity;

      if (timeLeft <= 0) {
        setStatus(AuthStatus.EXPIRED);
        setSessionTimeLeft(0);
      } else {
        setSessionTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status, lastActivity]);

  // Global Session Enforcement (Kill Switch)
  useEffect(() => {
    if (status !== AuthStatus.EXPIRED || isPublicRoute) return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const urlString = typeof args[0] === "string" ? args[0] : (args[0] as Request).url;
      const url = new URL(urlString, window.location.origin);

      // Strategy: Use whitelisted set for performance lookup
      const isAllowed = Array.from(PUBLIC_ENDPOINT_WHITELIST).some((p) => url.pathname.includes(p));

      if (!isAllowed) {
        console.warn(`[Session Guard] Blocking API call: ${url.pathname}`);
        toast.error("Session expired. Action blocked.");
        return new Response(JSON.stringify({ error: "Session Expired" }), {
          status: 401,
          statusText: "Unauthorized",
        });
      }
      return originalFetch(...args);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [status, isPublicRoute]);

  // Initial Load Verification
  useEffect(() => {
    const sessionToken = localStorage.getItem("alphaedge_session");
    if (!sessionToken) {
      setStatus(AuthStatus.GUEST);
      return;
    }

    setToken(sessionToken);

    // Quick local restore
    const storedUser = localStorage.getItem("alphaedge_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        if (userData.profileImage) {
          const imgUrl = userData.profileImage.startsWith("http")
            ? userData.profileImage
            : `${BACKEND_API_BASE_URL}/${userData.profileImage}`;
          setProfileImageUrl(imgUrl);
        } else {
          setProfileImageUrl("/img/default_user.png");
        }
      } catch (e) {
        console.error("Failed to parse stored user", e);
      }
    }

    // Server verification (Non-blocking async)
    fetch(endpoints.auth.me, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    })
      .then((res) => {
        if (res.ok) return res.json();
        if (res.status === 401) {
          setStatus(AuthStatus.EXPIRED);
          throw new Error("Session expired");
        }
        throw new Error("Refresh failed");
      })
      .then((freshUserData) => {
        const mappedUser = mapUser(freshUserData);
        setUser(mappedUser);
        setStatus(AuthStatus.AUTHENTICATED);
        localStorage.setItem("alphaedge_user", JSON.stringify(mappedUser));
      })
      .catch((err) => {
        console.error("Auth refresh error:", err);
        if (status === AuthStatus.LOADING) setStatus(AuthStatus.GUEST);
      });
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(endpoints.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMsg = "Login failed";
        try {
          const errorData = await response.json();
          errorMsg = errorData.detail || errorData.error || errorMsg;
        } catch (e) {
          // Fallback if response is not JSON
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.access_token) {
        const sessionToken = data.access_token;
        const userResponse = await fetch(endpoints.auth.me, {
          headers: { Authorization: `Bearer ${sessionToken}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const mappedUser = mapUser(userData);

          setUser(mappedUser);
          setToken(sessionToken);
          localStorage.setItem("alphaedge_user", JSON.stringify(mappedUser));
          localStorage.setItem("alphaedge_session", sessionToken);

          // Set profile image url
          if (mappedUser.profileImage) {
            const imgUrl = mappedUser.profileImage.startsWith("http")
              ? mappedUser.profileImage
              : `${BACKEND_API_BASE_URL}/${mappedUser.profileImage}`;
            setProfileImageUrl(imgUrl);
          } else {
            setProfileImageUrl("/img/default_user.png");
          }

          setLastActivity(Date.now());
          setSessionTimeLeft(SESSION_TIMEOUT);
          setStatus(AuthStatus.AUTHENTICATED);

          return true;
        } else {
          throw new Error("Failed to retrieve user profile");
        }
      }
      return false;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Propagate error for UI feedback
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await fetch(endpoints.auth.logout, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setProfileImageUrl("/img/default_user.png");
      setToken(null);
      localStorage.removeItem("alphaedge_user");
      localStorage.removeItem("alphaedge_session");
      setStatus(AuthStatus.GUEST);
      window.location.replace("/");
    }
  }, [token]);

  const updateUserImage = useCallback(
    (url: string) => {
      setProfileImageUrl(url);
      if (user) {
        const updatedUser = { ...user, profileImage: url };
        setUser(updatedUser);
        localStorage.setItem("alphaedge_user", JSON.stringify(updatedUser)); // Persist locally
      }
    },
    [user]
  );

  const authContextValue = useMemo(
    () => ({
      user,
      status,
      login,
      logout,
      isAuthenticated,
      profileImageUrl,
      token,
      isLoading,
      isSessionExpired,
      updateUserImage,
      validateSession: () => {
        if (status === AuthStatus.EXPIRED || status === AuthStatus.GUEST) {
          setStatus(AuthStatus.EXPIRED);
          return false;
        }
        return true;
      },
    }),
    [
      user,
      status,
      login,
      logout,
      profileImageUrl,
      token,
      isAuthenticated,
      isLoading,
      isSessionExpired,
    ]
  );

  return (
    <SessionContext.Provider value={{ sessionTimeLeft }}>
      <AuthContext.Provider value={authContextValue}>
        {children}
        {/* Pattern: Only show modal on protected routes when expired */}
        <SessionExpiredModal
          open={status === AuthStatus.EXPIRED && !isPublicRoute}
          onOpenChange={(open) => !open && setStatus(AuthStatus.EXPIRED)}
        />
      </AuthContext.Provider>
    </SessionContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used within AuthProvider");
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { endpoints, SESSION_TIMEOUT } from "@/config";
import { SessionExpiredModal } from "@/components/SessionExpiredModal";

// Define Role Enum on Frontend for consistency
export enum UserRole {
  SUPER_ADMIN_USER = "SUPER_ADMIN_USER",
  ADMIN_USER = "ADMIN_USER",
  NORMAL_USER = "NORMAL_USER"
}

interface User {
  id: string;
  name: string; // Display Name (Full Name)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  approved?: boolean;
  role: UserRole | string; // Allow string fallbacks but prefer Enum
  is_subscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  profileImageUrl: string | null;
  token: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SessionContextType { sessionTimeLeft: number; }

const SessionContext = createContext<SessionContextType | undefined>(undefined);

// Helper to map backend response to User object
const mapUser = (userData: any): User => ({
    id: userData.id.toString(),
    firstName: userData.first_name || "",
    lastName: userData.last_name || "",
    name: userData.first_name ? `${userData.first_name} ${userData.last_name || ""}`.trim() : userData.email.split('@')[0],
    email: userData.email,
    phone: userData.phone_number || "",
    approved: true,
    role: userData.role || UserRole.NORMAL_USER,
    is_subscribed: userData.is_subscribed || false,
    profileImage: userData.profileImage 
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(SESSION_TIMEOUT);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Initial load check

  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
      setSessionTimeLeft(SESSION_TIMEOUT);
    };

    // Listen to user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, []);

  // Session timeout countdown (Local Inactivity)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const timeSinceActivity = Math.floor((Date.now() - lastActivity) / 1000);
      const timeLeft = SESSION_TIMEOUT - timeSinceActivity;

      if (timeLeft <= 0) {
        // Instead of hard logout, trigger session expiry flow to allow re-login
        setIsSessionExpired(true);
      } else {
        setSessionTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity]);

  // Global Session Event Listener (from API 401s)
  useEffect(() => {
      const handleExpired = () => setIsSessionExpired(true);
      window.addEventListener('session-expired', handleExpired);
      return () => window.removeEventListener('session-expired', handleExpired);
  }, []);

  // Heartbeat Check (Server Connectivity)
  useEffect(() => {
      if (!user || isSessionExpired) return;

      const heartbeatInterval = setInterval(async () => {
          try {
             // Only ping if we have token
             if (token) {
                 const res = await fetch(`${endpoints.auth.login.replace('/login', '')}/heartbeat`, {
                      headers: { 'Authorization': `Bearer ${token}` }
                 });
                 if (res.status === 401) {
                     setIsSessionExpired(true);
                 }
             }
          } catch (e) {
              console.warn("Heartbeat failed, potential connection issue");
          }
      }, 60000); // Check every minute

      return () => clearInterval(heartbeatInterval);
  }, [user, token, isSessionExpired]);


  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('alphaedge_user');
    const sessionToken = localStorage.getItem('alphaedge_session');
    
    if (sessionToken) setToken(sessionToken);

    if (storedUser && sessionToken) {
      // First set from local storage for immediate UI
      const userData = JSON.parse(storedUser);
      setUser(userData);
      
      // Cache profile image URL
      if (userData.profileImage) {
        setProfileImageUrl(`upload/${userData.profileImage}`);
      }

      // Then fetch fresh data from backend
      fetch(endpoints.auth.me, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to refresh user data');
      })
      .then(freshUserData => {
         const mappedUser = mapUser(freshUserData);
         setUser(mappedUser);
         localStorage.setItem('alphaedge_user', JSON.stringify(mappedUser));
      })
      .catch(err => {
        console.error("Error refreshing user data:", err);
        // Do NOT auto logout here immediately, let session expiry handle it if 401
      })
      .finally(() => setIsLoading(false));
    } else {
        setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      if (data.access_token) {
        const sessionToken = data.access_token;
        
        const userResponse = await fetch(endpoints.auth.me, {
          headers: { 'Authorization': `Bearer ${sessionToken}` }
        });
        
        if (userResponse.ok) {
           const userData = await userResponse.json();
           const mappedUser = mapUser(userData);

           setUser(mappedUser);
           localStorage.setItem('alphaedge_user', JSON.stringify(mappedUser));
           localStorage.setItem('alphaedge_session', sessionToken);
           setToken(sessionToken);
           
           setLastActivity(Date.now());
           setSessionTimeLeft(SESSION_TIMEOUT);
           
           // Clear session expired state if we were in recovery mode
           setIsSessionExpired(false);
           
           return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log("Logging out...");
    try {
      const sessionToken = localStorage.getItem('alphaedge_session');
      if (sessionToken) {
        await fetch(endpoints.auth.logout, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${sessionToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setProfileImageUrl(null);
      localStorage.removeItem('alphaedge_user');
      localStorage.removeItem('alphaedge_session');
      setToken(null);
      setIsSessionExpired(false);
      window.location.replace('/');
    }
  }, []);

  const authContextValue = useMemo(() => ({ 
    user, 
    login, 
    logout, 
    isAuthenticated: !!user,
    profileImageUrl,
    token,
    isLoading
  }), [user, login, logout, profileImageUrl, token, isLoading]);

  return (
    <SessionContext.Provider value={{ sessionTimeLeft }}>
      <AuthContext.Provider value={authContextValue}>
        {children}
        {/* Global Session Expired Modal */}
        <SessionExpiredModal open={isSessionExpired} onOpenChange={setIsSessionExpired} />
      </AuthContext.Provider>
    </SessionContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within AuthProvider');
  }
  return context;
};

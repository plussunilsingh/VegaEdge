import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { endpoints } from "@/config";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  approved?: boolean;
  role: string;
  is_subscribed: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  profileImageUrl: string | null;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface SessionContextType { sessionTimeLeft: number; }

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const SESSION_TIMEOUT = 120; // 2 minutes in seconds

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number>(SESSION_TIMEOUT);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  // Session timeout countdown
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const timeSinceActivity = Math.floor((Date.now() - lastActivity) / 1000);
      const timeLeft = SESSION_TIMEOUT - timeSinceActivity;

      if (timeLeft <= 0) {
        logout();
      } else {
        setSessionTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity]);

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

      // Then fetch fresh data from backend to ensure role/subscription status is up to date
      fetch(endpoints.auth.me, {
        headers: { 'Authorization': `Bearer ${sessionToken}` }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to refresh user data');
      })
      .then(freshUserData => {
         const mappedUser: User = {
           id: freshUserData.id.toString(),
           name: freshUserData.username,
           email: freshUserData.email,
           phone: "",
           approved: true,
           role: freshUserData.role || "NORMAL_USER",
           is_subscribed: freshUserData.is_subscribed || false
         };
         setUser(mappedUser);
         localStorage.setItem('alphaedge_user', JSON.stringify(mappedUser));
      })
      .catch(err => {
        console.error("Error refreshing user data:", err);
        // If token is invalid, maybe logout? For now, just log error.
      });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      // Call backend
      const response = await fetch(endpoints.auth.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      // Backend returns { access_token: "...", token_type: "bearer" }
      if (data.access_token) {
        const sessionToken = data.access_token;
        
        // We need to fetch user details separately usually, or decode token.
        // For now, let's fetch /auth/me using the token
        const userResponse = await fetch(endpoints.auth.me, {
          headers: { 'Authorization': `Bearer ${sessionToken}` }
        });
        
        if (userResponse.ok) {
           const userData = await userResponse.json();
           // Map backend user to frontend User interface
           const mappedUser: User = {
             id: userData.id.toString(),
             name: userData.username, // or userData.email if name missing
             email: userData.email,
             phone: "", // Backend might not have phone
             approved: true, // Assume approved for now
             role: userData.role || "NORMAL_USER",
             is_subscribed: userData.is_subscribed || false
           };

           setUser(mappedUser);
           localStorage.setItem('alphaedge_user', JSON.stringify(mappedUser));
           localStorage.setItem('alphaedge_session', sessionToken);
           setToken(sessionToken);
           
           setLastActivity(Date.now());
           setSessionTimeLeft(SESSION_TIMEOUT);
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
      // Always clear local state even if API fails
      setUser(null);
      setProfileImageUrl(null);
      localStorage.removeItem('alphaedge_user');
      localStorage.removeItem('alphaedge_session');
      setToken(null);
      window.location.replace('/');
    }
  }, []);

  const authContextValue = useMemo(() => ({ 
    user, 
    login, 
    logout, 
    isAuthenticated: !!user,
    profileImageUrl,
    token
  }), [user, login, logout, profileImageUrl, token]);

  return (
    <SessionContext.Provider value={{ sessionTimeLeft }}>
      <AuthContext.Provider value={authContextValue}>
        {children}
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

import { Navigate, useLocation } from "react-router-dom";
import { useAuth, AuthStatus } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, status, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
      // Optional: Add a better loading spinner
      return (
        <div className="min-h-screen flex items-center justify-center">
           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
  }

  if (status === AuthStatus.GUEST || status === AuthStatus.EXPIRED || !user) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

import { Navigate } from "react-router-dom";
import { useAuthStore } from "../hooks/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore((state) => state);

  if (isAuthenticated === null) {
    // Show a loading spinner or a placeholder until we know the auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

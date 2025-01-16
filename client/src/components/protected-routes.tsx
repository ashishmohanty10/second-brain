import { Navigate } from "react-router-dom";
import { useAuthStore } from "../hooks/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated === null) {
    // Show a loading spinner or a placeholder until we know the auth status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

import { Navigate } from "react-router-dom";
import { useAuthStore } from "./authStore";

export function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore((state) => state);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

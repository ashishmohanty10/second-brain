import { Signin } from "./components/auth/signin";
import { Signup } from "./components/auth/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layouts/dashboard-layout";
import { Dashboard } from "./components/dashboard/dashboard";
import { Settings } from "./components/settings/settings";
import { QueryProvider } from "./components/providers/query-provider";
import { useAuthStore } from "./hooks/authStore";
import { useEffect } from "react";
import { ProtectedRoute } from "./components/protected-routes";
import { PublicRoute } from "./hooks/useAuth";
import { AllPosts } from "./components/dashboard/all-posts";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div>
      <Router>
        <QueryProvider>
          <Routes>
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <PublicRoute>
                  <Signin />
                </PublicRoute>
              }
            />
            <Route
              path="/allPosts"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route element={<AllPosts />} index />
              <Route element={<Dashboard />} path="dashboard" />
              <Route element={<Settings />} path="settings" />
            </Route>
          </Routes>
        </QueryProvider>
      </Router>
    </div>
  );
}

export default App;

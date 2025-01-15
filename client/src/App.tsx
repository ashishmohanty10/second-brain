import { Signin } from "./components/auth/signin";
import { Signup } from "./components/auth/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layouts/dashboard-layout";
import { Dashboard } from "./components/dashboard/dashboard";
import { Settings } from "./components/settings/settings";
import { QueryProvider } from "./components/providers/query-provider";
// import { useAuthStore } from "./hooks/authStore";
import { ProtectedRoute } from "./components/protected-routes";
// import { useEffect } from "react";

function App() {
  return (
    <div>
      <Router>
        <QueryProvider>
          <Routes>
            <Route element={<Signup />} path="/signup" />
            <Route element={<Signin />} path="/signin" />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route element={<Dashboard />} index />
              <Route element={<Settings />} path="settings" />
            </Route>
          </Routes>
        </QueryProvider>
      </Router>
    </div>
  );
}

export default App;

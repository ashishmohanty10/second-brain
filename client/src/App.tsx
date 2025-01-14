import { Signin } from "./components/auth/signin";
import { Signup } from "./components/auth/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layouts/dashboard-layout";
import { Dashboard } from "./components/dashboard/dashboard";

import { Settings } from "./components/settings/settings";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Signup />} path="/signup" />
          <Route element={<Signin />} path="/signin" />
          <Route element={<DashboardLayout />} path="/dashboard">
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Settings />} path="settings" />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

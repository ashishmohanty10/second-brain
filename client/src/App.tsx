import { Signin } from "./components/auth/signin";
import { Signup } from "./components/auth/signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Signup />} path="/signup" />
          <Route element={<Signin />} path="/signin" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

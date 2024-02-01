import "./App.css";
import {
  SignIn,
  SignUp,
  Root,
  Dashboard,
  Leaderboard,
  ForgotPassword,
  ResetPassword,
  Report,
} from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import PublicRoute from "./utils/PublicRoute";
import useAuthContext from "./hooks/useAuthContext";
import { PrivateRoute } from "./utils/PrivateRoute";
axios.defaults.baseURL = "http://localhost:3000";

function App() {
  const { user } = useAuthContext();
  return (
    <Router>
      <Routes>
        <Route element={<PublicRoute user={user} />}>
          <Route path="/" element={<Root />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<PrivateRoute user={user} isPremiumRoute={false} />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute user={user} isPremiumRoute={true} />}>
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/download-report" element={<Report />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

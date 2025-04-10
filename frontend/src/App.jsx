// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./features/store";

// Pages
import RegistrationForm from "./authentication/Register";
import LoginForm from "./authentication/Login";
import Candidates from "./Pages/candidates/Candidates";
import Employees from "./Pages/Employees";
import Attendence from "./Pages/Attendence";
import LeavePage from "./Pages/Leaves";
import LogoutPopup from "./Pages/Logout";
import Layout from "./component/Layout";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Redirect root to /register */}
          <Route path="/" element={<Navigate to="/register" replace />} />

          {/* Auth Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Dashboard Routes inside Layout */}
          <Route path="/" element={<Layout />}>
            <Route path="candidates" element={<Candidates />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendence" element={<Attendence />} />
            <Route path="leaves" element={<LeavePage />} />
            <Route path="logout" element={<LogoutPopup />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

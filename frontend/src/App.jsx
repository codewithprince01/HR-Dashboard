// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import RegistrationForm from "./authentication/Register";
import LoginForm from "./authentication/Login";
import Candidates from "./Pages/candidates/Candidates";
import Layout from "./component/Layout";
import Employees from "./Pages/Employees";
import Attendence from "./Pages/Attendence";
import LeavePage from "./Pages/Leaves";
import { store } from "./features/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/regrister" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Layout for dashboard pages */}
          <Route path="/" element={<Layout />}>
            <Route path="candidates" element={<Candidates />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendence" element={<Attendence />} />
            <Route path="leaves" element={<LeavePage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

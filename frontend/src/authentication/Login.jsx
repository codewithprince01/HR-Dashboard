import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../component/ImageSlider";
import AuthInput from "../component/AuthInput";
import Button from "../component/Button";
import axios from "axios";
import "../style/auth.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/users/login",
        formData,
        { withCredentials: true }
      );
      console.log("Login successful!");
      navigate("/candidates");
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="logo-section">
    <div className="logo-icon">
      <div className="logo-inner-box"></div>
    </div>
    <span className="logo-text">LOGO</span>
  </div>
    <div className="auth-container">
      <div className="auth-box">
        <ImageSlider />
        <div className="auth-form-container">
          <div className="auth-form-box">
            <h2 className="auth-heading">Welcome to Dashboard</h2>
            <form className="auth-form" onSubmit={handleSubmit}>
              <AuthInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <AuthInput
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <div className="forgot-password">Forgot password?</div>

              <Button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="auth-switch-text">
                Don't have an account?{" "}
                <Link to="/register" className="auth-link">Register</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginForm;

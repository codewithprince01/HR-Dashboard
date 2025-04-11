import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../component/ImageSlider";
import AuthInput from "../component/AuthInput";
import Button from "../component/Button";
import axios from "axios";
import "../style/auth.css";


const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmpassword: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      console.log("Passwords don't match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );
      console.log("Response:", response.data);
      navigate("/login");
    } catch (error) {
      console.log("Error:", error.response?.data);
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
                label="Full name"
                type="text"
                name="fullname"
                placeholder="Full name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
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
              <AuthInput
                label="Confirm Password"
                type="password"
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formData.confirmpassword}
                onChange={handleChange}
                required
              />

              <Button type="submit" className="auth-button" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

              <p className="auth-switch-text">
                Already have an account?{" "}
                <Link to="/login" className="auth-link">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default RegistrationForm;

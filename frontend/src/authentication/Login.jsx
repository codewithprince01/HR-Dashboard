import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../component/ImageSlider";
import AuthInput from "../component/authInput";
import Button from "../component/Button";
import axios from "axios";

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
        {
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      console.log("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-7xl overflow-hidden grid md:grid-cols-2">
        <ImageSlider />
        <div className="flex flex-col justify-center items-center p-8 md:p-12">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Welcome to Dashboard
            </h2>

            <form className="flex flex-col space-y-4 w-full" onSubmit={handleSubmit}>
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

              <div className="text-sm text-start text-gray-500 hover:underline cursor-pointer mb-2">
                Forgot password?
              </div>

              <Button 
                type="submit"
                className="self-start px-5 text-sm my-2"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <p className="text-sm text-gray-500 my-2">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#4D007D] font-medium hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
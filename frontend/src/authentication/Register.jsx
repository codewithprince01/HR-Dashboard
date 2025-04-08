import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ImageSlider from "../component/ImageSlider";
import AuthInput from "../component/authInput";
import Button from "../component/Button";
import axios from "axios";

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

    const requestData = {
      fullname: formData.fullname,
      email: formData.email,
      password: formData.password,
      confirmpassword: formData.confirmpassword
    };
    
    console.log("Sending request:", requestData);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/users/register",
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      console.log("Response:", response.data);
      navigate("/login");
    } catch (error) {
      console.log("Error details:", error.response?.data);
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
                minLength="6"
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

              <Button 
                type="submit"
                className="self-start px-5 text-sm my-2"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </Button>

              <p className="text-sm text-gray-500 my-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple-700 font-medium hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
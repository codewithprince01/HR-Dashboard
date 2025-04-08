import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/users/check-session",
          { withCredentials: true }
        );
        setUser(response.data.user);
      } catch (error) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/users/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {user && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold">User Information</h2>
              <p className="mt-2"><span className="font-medium">Name:</span> {user.fullname}</p>
              <p className="mt-1"><span className="font-medium">Email:</span> {user.email}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <p className="mt-2">Welcome to your dashboard!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




export default Dashboard;




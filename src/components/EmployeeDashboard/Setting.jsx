import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import axios from "axios";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [setting, setSetting] = useState({
    userId: user._id,
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetting({ ...setting, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (setting.newPassword !== setting.confirmPassword) {
      setError("Password not matched");
    } else {
      try {
        const response = await axios.put(
          "https://ems-backend-self.vercel.app/api/setting/change-password",
          setting,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Password changed successfully!");
          if (user.role === "employee") {
            navigate("/employee-dashboard");
          } else {
            navigate("/admin-dashboard");
          }
          setError("");
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          setError(error.response.data.error);
        }
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
      <p className="text-red-500">{error}</p>
      <form onSubmit={handleSubmit}>
        {/* Old Password */}
        <div className="mb-4">
          <label className="text-l font-medium text-gray-700 block mb-2">
            Old Password
          </label>
          <input
            type="password"
            name="oldPassword"
            placeholder="Enter Old Password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="text-l font-medium text-gray-700 block mb-2">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter New Password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-l font-medium text-gray-700 block mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full text-xl mt-6 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md"
        >
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Setting;

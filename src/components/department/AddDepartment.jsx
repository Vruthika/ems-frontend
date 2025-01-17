import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to import axios

const AddDepartment = () => {
  const [dept, setDept] = useState({
    dept_name: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDept({ ...dept, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://ems-backend-self.vercel.app/api/department/add",
        dept,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      }
    } catch (error) {
      if (error.response && !error.response.data.success) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
      <h2 className="text-3xl font-bold mb-6">Add New Department</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="dept_name"
            className="text-l font-medium text-gray-700"
          >
            Department
          </label>
          <input
            type="text"
            name="dept_name"
            onChange={handleChange}
            placeholder="Department Name"
            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-l font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            onChange={handleChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full mt-6 text-xl bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Department
        </button>
      </form>
    </div>
  );
};

export default AddDepartment;

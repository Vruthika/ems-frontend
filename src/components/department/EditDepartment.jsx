import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState([]);
  const [depLoading, setDepLoading] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get(
          `https://ems-backend-self.vercel.app/api/department/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data.success) {
          setDepartment(response.data.department);
        }
      } catch (error) {
        if (error.response && !error.response.data.success) {
          alert(error.response.data.error);
        }
      } finally {
        setDepLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log('Submitting ID:', id); // Log the ID
    // console.log('Submitting Data:', department); // Log the data being submitted

    try {
      const response = await axios.put(
        `https://ems-backend-self.vercel.app/api/department/${id}`,
        {
          dept_name: department.dept_name,
          description: department.description,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admin-dashboard/departments");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Error updating department:", error);
      if (error.response && error.response.data) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md w-96">
          <h2 className="text-3xl font-bold mb-6">Edit Department</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="dept_name"
                className="text-l font-medium text-gray-700 mb-6"
              >
                Department Name{" "}
              </label>
              <input
                type="text"
                name="dept_name"
                onChange={handleChange}
                value={department.dept_name}
                placeholder="Department Name"
                className="mt-1 w-full p-2 border mb-3 border-gray-300 rounded-md"
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
                value={department.description}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md"
                rows="4"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full mt-6 text-xl bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Department
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default EditDepartment;

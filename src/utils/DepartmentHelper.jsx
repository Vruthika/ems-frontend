import axios from "axios"
import { useNavigate } from "react-router-dom"

export const columns = [
    {
        name: "S. No",
        selector: (row) => row.sno,
        width: "150px"
    },
    {
        name: "Department Name",
        selector: (row) => row.dept_name,
        sortable: true,
        width: "450px"
    },
    {
        name: "Action",
        selector: (row) => row.action,

    },
]

export const DepartmentButtons = ({ _id, onDepartmentDelete }) => {
    const navigate = useNavigate()

    const handleDelete = async (id) => {
        const confirm = window.confirm("Do you want to delete?")
        if (confirm) {
            try {
                const response = await axios.delete(`http://localhost:5000/api/department/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (response.data.success) {
                    onDepartmentDelete()
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    alert(error.response.data.error);
                }
            }
        }
    };

    return (
        <div className="flex space-x-3">
            <button className="px-3 py-1 bg-teal-600 text-white rounded-md" onClick={() => navigate(`/admin-dashboard/department/${_id}`)}>Edit</button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md" onClick={() => handleDelete(_id)}>Delete</button>
        </div>
    )
}
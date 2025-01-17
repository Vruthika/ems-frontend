import React from "react";
import { useNavigate } from "react-router-dom";


export const columns = [

    {
        name: "S No",
        selector: (row) => row.sno,
        width: "75px",
    },
    {
        name: "Emp ID",
        selector: (row) => row.employeeId,
        width: "150px",
    },
    {
        name: "Name",
        selector: (row) => row.name,
        width: "250px",
    },
    {
        name: "Leave Type",
        selector: (row) => row.leaveType,
        width: "200px",
    },
    {
        name: "Department",
        selector: (row) => row.department,
        width: "200px",
    },
    {
        name: "Days",
        selector: (row) => row.days,
        width: "125px",
    },
    {
        name: "Status",
        selector: (row) => row.status,
        width: "150px",
    },
    {
        name: "Action",
        selector: (row) => row.action,
        center: true,
    },
]

export const LeaveButtons = ({ _id }) => {
    const navigate = useNavigate();
    const handleView = (_id) => {

        navigate(`/admin-dashboard/leaves/${_id}`);
    };
    return (
        <button
            className="px-4 py-1 bg-teal-500 rounded text-white hover:bg-teal-600"
            onClick={() => handleView(_id)}>
            View
        </button>
    )
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { columns, LeaveButtons } from '../../utils/LeaveHelper';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import styled from 'styled-components';

// Styled components
const StyledContainer = styled.div`
    padding: 1.5rem;
`;

const Title = styled.h3`
    text-align: center;
    font-size: 1.875rem;
    font-weight: bold;
`;

const SearchInput = styled.input`
    padding: 0.5rem 1rem;
    width: 250px;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
`;

const customStyles = {
    headCells: {
        style: {
            fontSize: '1.125rem',
            fontWeight: 'bold',
        },
    },
    cells: {
        style: {
            fontSize: '1rem',
        },
    },
};

const Table = () => {
    const [leaves, setLeaves] = useState([]);
    const [filteredLeaves, setFilteredLeaves] = useState([]);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leave/', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                let sno = 1;
                const data = response.data.leaves
                    .filter(leave => leave.employeeId && leave.employeeId.department) // Safely check if employeeId and department exist
                    .map((leave) => ({
                        _id: leave._id,
                        sno: sno++,
                        employeeId: leave.employeeId.employeeId,
                        name: leave.employeeId.userId?.name || 'No Name', // Handle missing name safely
                        leaveType: leave.leaveType,
                        department: leave.employeeId.department ? leave.employeeId.department.dept_name : 'No Department',
                        days: new Date(leave.endDate).getDate() - new Date(leave.startDate).getDate(),
                        status: leave.status,
                        action: (<LeaveButtons _id={leave._id} />),
                    }));
                setLeaves(data);
                setFilteredLeaves(data);
            } else {
                console.error("Failed to fetch leaves.");
            }
        } catch (error) {
            console.error(error);
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleDeleteDepartment = async (deptName) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/department/${deptName}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.success) {
                const updatedLeaves = leaves.filter(leave => leave.department !== deptName);
                setLeaves(updatedLeaves);
                setFilteredLeaves(updatedLeaves);
                alert("Department and associated records deleted successfully!");
            } else {
                alert("Failed to delete department.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while deleting the department.");
        }
    };

    const filterByInput = (e) => {
        const data = leaves.filter(leave => leave.employeeId.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredLeaves(data);
    };

    const filterByButton = (status) => {
        const data = leaves.filter(leave => leave.status.toLowerCase().includes(status.toLowerCase()));
        setFilteredLeaves(data);
    };

    return (
        <StyledContainer>
            <Title>Manage Leaves</Title>
            <div className='flex justify-between items-center'>
                <SearchInput
                    type="text"
                    placeholder='Search By Employee ID'
                    onChange={filterByInput}
                />
                <div className='space-x-3'>
                    <button
                        className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded-md'
                        onClick={() => filterByButton("Pending")}>
                        Pending
                    </button>
                    <button
                        className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded-md'
                        onClick={() => filterByButton("Approved")}>
                        Approved
                    </button>
                    <button
                        className='px-2 py-1 bg-teal-600 text-white hover:bg-teal-700 rounded-md'
                        onClick={() => filterByButton("Rejected")}>
                        Rejected
                    </button>
                </div>
            </div>

            <div className='mt-3'>
                {leaves.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={filteredLeaves}
                        customStyles={customStyles}
                        pagination
                    />
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </StyledContainer>
    );
};

export default Table;

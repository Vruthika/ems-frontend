import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../../context/authContext'

const List = () => {
    const [leaves, setLeaves] = useState([])
    let sno = 1;
    const { id } = useParams()
    const { user } = useAuth()

    const fetchLeaves = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/leave/${id}/${user.role}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })

            if (response.data.success) {
                setLeaves(response.data.leaves)
            }

        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.message)
            }
        }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    return (
        <div className='p-6'>
            <div className='text-center'>
                <h3 className='text-3xl font-bold'>Manage Leaves</h3>
            </div>
            <div className='flex justify-between items-center'>
                <input type="text" className='px-4 py-0.5 border' placeholder='Search By Leave Name' />
                {user.role === "employee" &&
                    <Link to='/employee-dashboard/add-leave' className='px-4 py-1 bg-teal-600 rounded text-white'> Add New Leave</Link>}
            </div>
            <table className='w-full text-sm text-left text-gray-500 mt-6'>
                <thead className='text-xs text-gray-700 uppercase bg-gray-50 border border-gray-200'>
                    <tr>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>S. No</th>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>Leave Type</th>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>From</th>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>To</th>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>Description</th>
                        <th className='px-6 py-3' style={{ fontSize: '1.125rem' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map((leave) => (
                        <tr key={leave._id} className='bg-white border-b dark:bg-gray-800 dark:border-gray-700'>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{sno++}</td>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{leave.leaveType}</td>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{new Date(leave.startDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{new Date(leave.endDate).toLocaleDateString()}</td>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{leave.reason}</td>
                            <td className='px-6 py-3' style={{ fontSize: '1rem' }}>{leave.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default List

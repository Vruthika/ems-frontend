import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { columns, DepartmentButtons } from '../../utils/DepartmentHelper'
import axios from 'axios'

const DepartmentList = () => {

    const [departments, setDepartments] = useState([])
    const [depLoading, setDepLoading] = useState(false)
    const [filteredDepts, setFilteredDepts] = useState([])

    const onDepartmentDelete = () => {
        fetchDepartments()
    }
    const fetchDepartments = async () => {
        setDepLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/department/', {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                let sno = 1;
                const data = response.data.departments.map((dep) => ({
                    _id: dep._id,
                    sno: sno++,
                    dept_name: dep.dept_name,
                    action: (<DepartmentButtons _id={dep._id} onDepartmentDelete={onDepartmentDelete} />)
                }));
                setDepartments(data);
                setFilteredDepts(data)
            }
        } catch (error) {
            if (error.response && !error.response.data.success) {
                alert(error.response.data.error);
            }
        } finally {
            setDepLoading(false);
        }
    };
    useEffect(() => {

        fetchDepartments();
    }, [])

    const filterDepartments = (e) => {
        const records = departments.filter((dep) =>
            dep.dept_name.toLowerCase().includes(e.target.value.toLowerCase()))
        setFilteredDepts(records)


    }

    const customStyles = {
        headCells: {
            style: {
                fontSize: '1.125rem', // 1.125rem = 18px (for header cells)
                fontWeight: 'bold', // Make it bold
            },
        },
        cells: {
            style: {
                fontSize: '1rem', // 1rem = 16px (for regular cells)
            },
        },
    };

    return (
        <>{depLoading ? <div>Loading...</div> :
            <div className='p-5 ml-40 mr-40'>
                <div className='text-center'>
                    <h3 className='text-3xl font-bold'>Manage Departments</h3>
                </div>
                <div className='flex justify-between items-center'>
                    <input type="text" placeholder='Search By Department Name' className='border px-3 rounded-md py-0.5 border-gray-300 w-[250px]' onChange={filterDepartments} />
                    <Link to='/admin-dashboard/add-department' className='px-4 py-1 bg-teal-600 rounded text-white'>Add New Department</Link>
                </div>
                <div className='mt-5'>
                    <DataTable columns={columns} data={filteredDepts} pagination customStyles={customStyles} />
                </div>
            </div>
        }</>
    )
}

export default DepartmentList
import React from 'react'
import { useAuth } from '../../context/authContext'

const Navbar = () => {
    const { user, logout } = useAuth()
    return (
        <div className='flex items-center justify-between h-16 bg-teal-600 px-5 text-xl text-white'>
            <p>Welcome {user.name}</p>
            <button className='px-4 py-1 bg-teal-700 hover:bg-teal-800 rounded' onClick={logout}>Logout</button>
        </div>
    )
}

export default Navbar
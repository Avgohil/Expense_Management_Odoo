import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { getCurrentUser, mockLogout } from '../store/authSlice'

export default function ProfileMenu(){
  const user = getCurrentUser()
  const [open, setOpen] = useState(false)

  if(!user) return <Link to="/login" className="text-sm text-indigo-600">Login</Link>

  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">{user.name ? user.name[0].toUpperCase() : 'U'}</div>
        <div className="text-sm text-gray-700">{user.name}</div>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow p-2">
          <div className="text-xs text-gray-500 px-2">{user.email}</div>
          <Link to="/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">Profile</Link>
          <button onClick={()=>{ mockLogout(); window.location.href = '/login' }} className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Logout</button>
        </div>
      )}
    </div>
  )
}

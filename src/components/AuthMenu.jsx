import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import { mockLogout } from '../store/authSlice'

// quick presets for dev testing
const PRESETS = [
  { name: 'Employee', user: { company: 'Acme', name: 'Eve', email: 'eve@acme.com', role: 'Employee' } },
  { name: 'Manager', user: { company: 'Acme', name: 'Manny', email: 'manny@acme.com', role: 'Manager' } },
  { name: 'Admin', user: { company: 'Acme', name: 'Ada', email: 'ada@acme.com', role: 'Admin' } },
]

function setUser(user){
  try{ localStorage.setItem('expense_app_user', JSON.stringify(user)) }catch(e){}
  window.location.reload()
}

export default function AuthMenu({loggedIn}){
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="px-3 py-1 rounded bg-white text-sm border shadow-sm">Auth</button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow p-2 z-40">
          {!loggedIn ? (
            <>
              <Link to="/login" className="block px-2 py-1 hover:bg-gray-100 rounded">Log in</Link>
              <Link to="/signup" className="block px-2 py-1 hover:bg-gray-100 rounded">Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="block px-2 py-1 hover:bg-gray-100 rounded">Profile</Link>
              <div className="border-t my-1" />
              <div className="text-xs text-gray-500 px-2">Quick switch</div>
              {PRESETS.map(p=> (
                <button key={p.name} onClick={()=>setUser(p.user)} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">{p.name}</button>
              ))}
              <div className="border-t my-1" />
              <button onClick={()=>{ mockLogout(); window.location.href = '/' }} className="block w-full text-left px-2 py-1 hover:bg-gray-100 rounded">Logout</button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

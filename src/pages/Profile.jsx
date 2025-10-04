import React from 'react'
import MainLayout from '../layouts/MainLayout'
import { getCurrentUser } from '../store/authSlice'

export default function Profile(){
  const user = getCurrentUser()
  if(!user) return (
    <MainLayout menuItems={[{to:'/',label:'Home'}]}>
      <div className="w-full max-w-4xl">Please login to see profile.</div>
    </MainLayout>
  )

  return (
    <MainLayout menuItems={[{to:'/employee',label:'Dashboard'}]}>
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <div className="card p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold">{user.name}</div>
              <div className="text-sm text-muted">{user.email} • {user.company}</div>
            </div>
            <div className="text-sm text-muted">Role: <span className="font-semibold">{user.role}</span></div>
          </div>
        </div>

        {/* Role specific section */}
        {user.role === 'Admin' && (
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Admin Controls</h2>
            <p className="text-sm text-muted">You can approve final expenses and manage company settings.</p>
          </div>
        )}

        {user.role === 'Manager' && (
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Manager Controls</h2>
            <p className="text-sm text-muted">You can review team expenses and forward for approval.</p>
          </div>
        )}

        {user.role === 'Employee' && (
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Employee</h2>
            <p className="text-sm text-muted">Submit expenses and track their status.</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

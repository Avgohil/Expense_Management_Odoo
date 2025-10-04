import React from 'react'

export default function Modal({open, onClose, title, children}){
  if(!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl animate-pop">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-gray-500 transition-smooth hover:text-gray-700">Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

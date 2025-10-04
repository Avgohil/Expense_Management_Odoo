import React from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

export default function Sidebar({items=[], collapsed=false}){
  return (
    <aside className={`min-h-screen bg-white border-r ${collapsed? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <Logo />
          <div className="text-sm text-gray-500 mt-1">Frontend only</div>
        </div>
      </div>
      <nav className="p-4">
        {items.map(i=> (
          <Link key={i.to} to={i.to} className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-100 text-gray-700 transition-smooth">
            <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded flex items-center justify-center text-xs">{i.label[0]}</span>
            <span>{i.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

import React from 'react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeSwitcher(){
  const { theme, setTheme } = useTheme()
  const options = [
    {key:'clean', label:'Clean Corporate'},
    {key:'dark', label:'Dark Neon'},
    {key:'material', label:'Material'}
  ]
  return (
    <div className="flex items-center space-x-2">
      {options.map(o=> (
        <button key={o.key} onClick={()=>setTheme(o.key)} className={`px-3 py-1 rounded text-sm ${theme===o.key? 'bg-indigo-600 text-white':'text-gray-600 bg-white'} transition-smooth`}>{o.label}</button>
      ))}
    </div>
  )
}

import React, {useEffect, useState} from 'react'
import Sidebar from '../components/Sidebar'

export default function MainLayout({children, menuItems}){
  const [collapsed, setCollapsed] = useState(false)

  useEffect(()=>{
    const handler = ()=> setCollapsed(c=>!c)
    window.addEventListener('toggleSidebar', handler)
    return ()=> window.removeEventListener('toggleSidebar', handler)
  },[])

  return (
    <div className="flex app-main">
      <Sidebar items={menuItems} collapsed={collapsed} />
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

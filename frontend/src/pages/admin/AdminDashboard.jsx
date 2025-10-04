import React, {useState} from 'react'
import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'

const dummyForAdmin = [
  {id: 'E-1001', employee: 'Alice', date: '2025-10-01', category: 'Travel', amount: 120.50, status: 'Pending'},
  {id: 'E-1002', employee: 'Charlie', date: '2025-09-27', category: 'Meals', amount: 45.00, status: 'Approved'},
  {id: 'E-1004', employee: 'Dana', date: '2025-10-03', category: 'Accommodation', amount: 250.00, status: 'Pending'},
]

export default function AdminDashboard(){
  const [items, setItems] = useState(dummyForAdmin)

  const columns = [
    {key:'id', title:'ID'},
    {key:'employee', title:'Employee'},
    {key:'date', title:'Date'},
    {key:'category', title:'Category'},
    {key:'amount', title:'Amount', render: r=> `$${r.amount.toFixed(2)}`},
    {key:'status', title:'Status'},
  ]

  function setStatus(id, status){
    setItems(items.map(i=> i.id===id ? {...i,status} : i))
  }

  return (
    <MainLayout menuItems={[{to:'/admin',label:'Dashboard'},{to:'/admin/approvals',label:'Approvals'}]}>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Reports" value={items.length} />
          <StatCard title="Pending" value={items.filter(i=>i.status==='Pending').length} tone="yellow" />
          <StatCard title="Approved" value={items.filter(i=>i.status==='Approved').length} />
        </div>

        <Table columns={columns} data={items} actions={row => (
          <div className="flex justify-end gap-2">
            <button onClick={()=>setStatus(row.id,'Approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            <button onClick={()=>setStatus(row.id,'Rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
          </div>
        )} />
      </div>
    </MainLayout>
  )
}

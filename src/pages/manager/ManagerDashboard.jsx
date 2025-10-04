import React, {useState} from 'react'
import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'
import StatusChip from '../../components/StatusChip'

const dummyForManager = [
  {id: 'E-1001', employee: 'Alice', date: '2025-10-01', category: 'Travel', amount: 120.50, status: 'Pending'},
  {id: 'E-1003', employee: 'Bob', date: '2025-10-02', category: 'Supplies', amount: 30.00, status: 'Pending'},
  {id: 'E-1002', employee: 'Charlie', date: '2025-09-27', category: 'Meals', amount: 45.00, status: 'Approved'},
]

export default function ManagerDashboard(){
  const [items, setItems] = useState(dummyForManager)

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
    <MainLayout menuItems={[{to:'/manager',label:'Dashboard'},{to:'/manager/pending',label:'Pending'}]}>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Reports" value={items.length} />
          <StatCard title="Pending" value={items.filter(i=>i.status==='Pending').length} tone="yellow" />
          <StatCard title="Approved" value={items.filter(i=>i.status==='Approved').length} />
          <div className="card p-4">
            <div className="text-sm text-muted">Pending Approvals</div>
            <div className="mt-2 text-2xl font-semibold">{items.filter(i=>i.status==='Pending').length}</div>
            <div className="text-sm text-muted">Total: ${items.filter(i=>i.status==='Pending').reduce((s,i)=>s+i.amount,0).toFixed(2)}</div>
          </div>
        </div>

        <Table columns={[...columns, {key:'statusChip', title:'State', render: r=> <StatusChip status={r.status} /> }]} data={items} actions={row => (
          <div className="flex justify-end gap-2">
            <button onClick={()=>setStatus(row.id,'Approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            <button onClick={()=>setStatus(row.id,'Rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
          </div>
        )} />
      </div>
    </MainLayout>
  )
}

import React, {useState} from 'react'
import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import StatusChip from '../../components/StatusChip'

const dummyExpenses = [
  {id: 'E-1001', date: '2025-10-01', category: 'Travel', amount: 120.50, status: 'Pending', description: 'Taxi to client site'},
  {id: 'E-1002', date: '2025-09-27', category: 'Meals', amount: 45.00, status: 'Approved', description: 'Team lunch'},
]

export default function EmployeeDashboard(){
  const [expenses, setExpenses] = useState(dummyExpenses)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({date:'',category:'',amount:'',description:''})

  const columns = [
    {key:'id', title:'ID'},
    {key:'date', title:'Date'},
    {key:'category', title:'Category'},
    {key:'amount', title:'Amount', render: r => `$${r.amount.toFixed(2)}`},
    {key:'status', title:'Status'},
    {key:'description', title:'Description'},
  ]

  function handleAdd(){
    const next = { ...form, id: `E-${Math.floor(Math.random()*9000)+1000}`, status: 'Pending', amount: Number(form.amount) }
    setExpenses([next, ...expenses])
    setOpen(false)
    setForm({date:'',category:'',amount:'',description:''})
  }

  return (
    <MainLayout menuItems={[{to:'/employee',label:'Dashboard'},{to:'/employee/expenses',label:'My Expenses'}]}>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={()=>{
              // simulate OCR scan: prefill a form item
              const scanned = { id: `E-${Math.floor(Math.random()*9000)+1000}`, date: new Date().toISOString().slice(0,10), category: 'Travel', amount: 99.99, status: 'Pending', description: 'Scanned receipt (OCR)'}
              setExpenses([scanned, ...expenses])
            }} className="px-4 py-2 btn-cta">Scan Receipt (OCR)</button>
            <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow">Add Expense</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Expenses" value={`$${expenses.reduce((s,e)=>s+e.amount,0).toFixed(2)}`} tone="green" />
          <StatCard title="Pending" value={expenses.filter(e=>e.status==='Pending').length} tone="yellow" />
          <StatCard title="Approved" value={expenses.filter(e=>e.status==='Approved').length} tone="indigo" />
        </div>

        <div>
          <Table columns={[...columns, {key:'statusChip', title:'State', render: r => <StatusChip status={r.status} /> }]} data={expenses} />
        </div>
      </div>

      <Modal open={open} onClose={()=>setOpen(false)} title="Add Expense">
        <div className="space-y-3">
          <label className="block">
            <div className="text-sm text-gray-600">Date</div>
            <input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} className="mt-1 block w-full border rounded px-2 py-1" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-600">Category</div>
            <input value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="mt-1 block w-full border rounded px-2 py-1" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-600">Amount</div>
            <input type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="mt-1 block w-full border rounded px-2 py-1" />
          </label>
          <label className="block">
            <div className="text-sm text-gray-600">Description</div>
            <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="mt-1 block w-full border rounded px-2 py-1" />
          </label>

          <div className="flex justify-end">
            <button onClick={()=>setOpen(false)} className="px-4 py-2 mr-2">Cancel</button>
            <button onClick={handleAdd} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  )
}

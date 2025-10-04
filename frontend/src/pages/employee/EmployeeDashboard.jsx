import React, {useState, useEffect} from 'react'
import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'
import Modal from '../../components/Modal'
import StatusChip from '../../components/StatusChip'
import { expenseService, ocrService } from '../../services'

export default function EmployeeDashboard(){
  const [expenses, setExpenses] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({date:'',category:'',amount:'',description:'',currency:'USD'})
  
  // Fetch expenses on component mount
  useEffect(() => {
    fetchExpenses()
  }, [])
  
  async function fetchExpenses() {
    setLoading(true)
    setError('')
    try {
      const response = await expenseService.getMyExpenses()
      setExpenses(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch expenses')
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {key:'_id', title:'ID', render: r => r._id?.slice(-8) || 'N/A'},
    {key:'date', title:'Date', render: r => new Date(r.date).toLocaleDateString()},
    {key:'category', title:'Category'},
    {key:'amount', title:'Amount', render: r => `${r.currency||'$'}${(r.amount||0).toFixed(2)}`},
    {key:'status', title:'Status'},
    {key:'description', title:'Description'},
  ]

  async function handleAdd(){
    setError('')
    try {
      const expenseData = {
        ...form,
        amount: Number(form.amount)
      }
      const response = await expenseService.createExpense(expenseData)
      
      // Optionally submit immediately
      // await expenseService.submitExpense(response.data._id)
      
      // Refresh expenses list
      await fetchExpenses()
      setOpen(false)
      setForm({date:'',category:'',amount:'',description:'',currency:'USD'})
    } catch (err) {
      setError(err.message || 'Failed to create expense')
      console.error('Error creating expense:', err)
    }
  }
  
  async function handleScanReceipt() {
    // Create a file input element
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = async (e) => {
      const file = e.target.files[0]
      if (!file) return
      
      setError('')
      try {
        const response = await ocrService.processReceipt(file)
        
        // Create expense with OCR data
        const ocrData = response.data
        const expenseData = {
          date: ocrData.date || new Date().toISOString().split('T')[0],
          category: ocrData.category || 'Travel',
          amount: ocrData.amount || 0,
          description: ocrData.description || 'Scanned receipt (OCR)',
          currency: ocrData.currency || 'USD'
        }
        
        await expenseService.createExpense(expenseData)
        await fetchExpenses()
      } catch (err) {
        setError(err.message || 'Failed to process receipt')
        console.error('Error scanning receipt:', err)
      }
    }
    
    input.click()
  }

  return (
    <MainLayout menuItems={[{to:'/employee',label:'Dashboard'},{to:'/employee/expenses',label:'My Expenses'}]}>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Employee Dashboard</h1>
          <div className="flex items-center gap-3">
            <button onClick={handleScanReceipt} className="px-4 py-2 btn-cta">Scan Receipt (OCR)</button>
            <button onClick={()=>setOpen(true)} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded shadow">Add Expense</button>
          </div>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-8">Loading expenses...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard title="Total Expenses" value={`$${expenses.reduce((s,e)=>s+(e.amount||0),0).toFixed(2)}`} tone="green" />
              <StatCard title="Pending" value={expenses.filter(e=>e.status==='Pending').length} tone="yellow" />
              <StatCard title="Approved" value={expenses.filter(e=>e.status==='Approved').length} tone="indigo" />
            </div>

            <div>
              <Table columns={[...columns, {key:'statusChip', title:'State', render: r => <StatusChip status={r.status} /> }]} data={expenses} />
            </div>
          </>
        )}
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

import React, {useState, useEffect} from 'react'
import MainLayout from '../../layouts/MainLayout'
import StatCard from '../../components/StatCard'
import Table from '../../components/Table'
import StatusChip from '../../components/StatusChip'
import { approvalService, expenseService } from '../../services'

export default function ManagerDashboard(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPendingApprovals()
  }, [])

  async function fetchPendingApprovals() {
    setLoading(true)
    setError('')
    try {
      const response = await approvalService.getPendingApprovals()
      setItems(response.data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch pending approvals')
      console.error('Error fetching approvals:', err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {key:'_id', title:'ID', render: r => r._id?.slice(-8) || 'N/A'},
    {key:'user', title:'Employee', render: r => r.user?.name || 'Unknown'},
    {key:'date', title:'Date', render: r => new Date(r.date).toLocaleDateString()},
    {key:'category', title:'Category'},
    {key:'amount', title:'Amount', render: r=> `${r.currency||'$'}${(r.amount||0).toFixed(2)}`},
    {key:'status', title:'Status'},
  ]

  async function handleApprove(expenseId) {
    setError('')
    try {
      await approvalService.approveExpense(expenseId, 'Approved by manager')
      await fetchPendingApprovals()
    } catch (err) {
      setError(err.message || 'Failed to approve expense')
      console.error('Error approving expense:', err)
    }
  }

  async function handleReject(expenseId) {
    const reason = prompt('Please provide a reason for rejection:')
    if (!reason) return

    setError('')
    try {
      await approvalService.rejectExpense(expenseId, reason)
      await fetchPendingApprovals()
    } catch (err) {
      setError(err.message || 'Failed to reject expense')
      console.error('Error rejecting expense:', err)
    }
  }

  return (
    <MainLayout menuItems={[{to:'/manager',label:'Dashboard'},{to:'/manager/pending',label:'Pending'}]}>
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded">{error}</div>}

        {loading ? (
          <div className="text-center py-8">Loading pending approvals...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <StatCard title="Total Reports" value={items.length} />
              <StatCard title="Pending" value={items.filter(i=>i.status==='Pending').length} tone="yellow" />
              <StatCard title="Approved" value={items.filter(i=>i.status==='Approved').length} />
              <div className="card p-4">
                <div className="text-sm text-muted">Pending Approvals</div>
                <div className="mt-2 text-2xl font-semibold">{items.filter(i=>i.status==='Pending').length}</div>
                <div className="text-sm text-muted">Total: ${items.filter(i=>i.status==='Pending').reduce((s,i)=>s+(i.amount||0),0).toFixed(2)}</div>
              </div>
            </div>

            <Table columns={[...columns, {key:'statusChip', title:'State', render: r=> <StatusChip status={r.status} /> }]} data={items} actions={row => (
              <div className="flex justify-end gap-2">
                <button onClick={()=>handleApprove(row._id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                <button onClick={()=>handleReject(row._id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
              </div>
            )} />
          </>
        )}
      </div>
    </MainLayout>
  )
}

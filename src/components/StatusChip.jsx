import React from 'react'

const map = {
  Approved: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-red-100 text-red-700',
  Pending: 'bg-sky-100 text-sky-700',
  Draft: 'bg-gray-100 text-gray-700'
}

export default function StatusChip({status}){
  const cls = map[status] || 'bg-gray-100 text-gray-700'
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{status}</span>
}

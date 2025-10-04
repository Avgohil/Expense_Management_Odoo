import React from 'react'

const toneMap = {
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  indigo: 'text-indigo-600',
  purple: 'text-purple-600',
  red: 'text-red-600'
}

export default function StatCard({title, value, tone='indigo'}){
  const toneClass = toneMap[tone] || toneMap.indigo
  return (
    <div className="bg-white p-4 rounded shadow-sm animate-fade-in">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`mt-2 text-2xl font-semibold ${toneClass}`}>{value}</div>
    </div>
  )
}

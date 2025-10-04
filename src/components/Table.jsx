import React from 'react'

export default function Table({columns=[], data=[], actions}){
  return (
    <div className="bg-white rounded shadow-sm overflow-auto w-full">
      <table className="w-full min-w-full divide-y table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(c=> <th key={c.key} className="px-4 py-2 text-left text-sm text-gray-600">{c.title}</th>)}
            {actions && <th className="px-4 py-2 text-right text-sm text-gray-600">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.map((row, idx)=> (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map(c=> <td key={c.key} className="px-4 py-3 text-sm">{c.render ? c.render(row) : row[c.key]}</td>)}
              {actions && <td className="px-4 py-3 text-sm text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

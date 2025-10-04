import React from 'react'

export default function Logo({size=6}){
  return (
    <div className="flex items-center space-x-2 animate-float">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded flex items-center justify-center text-white font-bold">E</div>
      <div className={`text-lg font-semibold text-indigo-700`}>Expense App</div>
    </div>
  )
}

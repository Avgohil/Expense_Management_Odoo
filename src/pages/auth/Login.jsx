import React, {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../../components/Logo'
import { mockLogin } from '../../store/authSlice'
import { countries } from '../../data/countries'

const COUNTRY_KEY = 'expense_app_country'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [country, setCountry] = useState(()=> localStorage.getItem(COUNTRY_KEY) || 'US')
  const [currency, setCurrency] = useState('USD')
  const navigate = useNavigate()

  useEffect(()=>{
    const c = countries.find(c=>c.code===country) || countries[0]
    setCurrency(c.currency)
    try{ localStorage.setItem(COUNTRY_KEY,country) }catch(e){}
  },[country])

  function handleSubmit(e){
    e.preventDefault()
    const res = mockLogin({email,password})
    if(res.success){
      // redirect based on role
      if(res.user.role === 'Admin') navigate('/admin')
      else if(res.user.role === 'Manager') navigate('/manager')
      else navigate('/employee')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-4">
          <Logo />
          <div className="text-sm text-gray-500">Sign in to your account</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>
            <div>
              <label className="block text-sm text-gray-600">Country</label>
              <select value={country} onChange={e=>setCountry(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 input-focus">
                {countries.map(c=> <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div className="text-sm text-gray-500">Currency: <span className="font-semibold">{currency}</span></div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Don't have an account? <Link to="/signup" className="text-indigo-600">Sign up</Link></div>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded">Login</button>
          </div>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">© ExpenseFlow 2025</div>
      </div>
    </div>
  )
}

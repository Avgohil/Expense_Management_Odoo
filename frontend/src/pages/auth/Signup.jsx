import React, {useEffect, useState} from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup } from '../../store/authSlice'
import Logo from '../../components/Logo'
import { countries } from '../../data/countries'

const COUNTRY_KEY = 'expense_app_country'

export default function Signup(){
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Employee')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [country, setCountry] = useState(()=> localStorage.getItem(COUNTRY_KEY) || 'US')
  const [currency, setCurrency] = useState('USD')
  const navigate = useNavigate()

  useEffect(()=>{
    const c = countries.find(c=>c.code===country) || countries[0]
    setCurrency(c.currency)
    try{ localStorage.setItem(COUNTRY_KEY,country) }catch(e){}
  },[country])

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Get country name from countries array
      const selectedCountry = countries.find(c => c.code === country)
      const countryName = selectedCountry ? selectedCountry.name : 'United States'
      
      const res = await signup({
        name,
        email,
        password,
        country: countryName  // Send country name, not code
      })
      
      if(res.success){
        // redirect based on role
        if(res.user.role === 'Admin') navigate('/admin')
        else if(res.user.role === 'Manager') navigate('/manager')
        else navigate('/employee')
      } else {
        setError(res.message)
      }
    } catch (err) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
  <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 animate-pop">
        <div className="text-center mb-4">
          <Logo />
          <div className="text-sm text-gray-500">Create your account</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Company Name</label>
            <input value={company} onChange={e=>setCompany(e.target.value)} placeholder="Acme Corp" className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Country</label>
            <select value={country} onChange={e=>setCountry(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 input-focus">
              {countries.map(c=> <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Full Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="mt-1 w-full border rounded px-3 py-2 input-focus" />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Role</label>
            <select value={role} onChange={e=>setRole(e.target.value)} className="mt-1 w-full border rounded px-3 py-2 input-focus">
              <option>Employee</option>
              <option>Manager</option>
              <option>Admin</option>
            </select>
            <div className="text-xs text-gray-400 mt-1">If this is the first signup for the company, Admin will be created if chosen.</div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Already have an account? <Link to="/login" className="text-indigo-600">Login</Link></div>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded disabled:opacity-50">
              {loading ? 'Creating account...' : 'Signup'}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center text-xs text-gray-400">© ExpenseFlow 2025</div>
      </div>
    </div>
  )
}

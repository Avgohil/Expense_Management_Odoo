// Minimal mock auth slice using localStorage to persist a user

const STORAGE_KEY = 'expense_app_user'

function saveUser(user){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function loadUser(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) } catch(e){ return null }
}

export function mockSignup({company, name, email, password, role='Employee'}){
  // For demo: if no user exists for this company, allow Admin role.
  const existing = loadUser()
  let assignedRole = role
  if(!existing && role==='Admin') assignedRole = 'Admin'
  if(!existing && role!=='Admin') assignedRole = role

  // naive duplicate check
  if(existing && existing.email === email){
    return { success:false, message: 'User already exists' }
  }

  const user = { company: company||'Personal', name, email, role: assignedRole }
  saveUser(user)
  return { success:true, user }
}

export function mockLogin({email, password}){
  const user = loadUser()
  if(!user) return { success:false, message: 'No users found. Please sign up.' }
  if(user.email !== email) return { success:false, message: 'Invalid credentials' }
  // ignore password check in mock
  return { success:true, user }
}

export function mockLogout(){
  localStorage.removeItem(STORAGE_KEY)
}

export function getCurrentUser(){
  return loadUser()
}

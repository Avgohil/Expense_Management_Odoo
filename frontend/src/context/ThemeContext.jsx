import React, {createContext, useContext, useEffect, useState} from 'react'

const ThemeContext = createContext()
const STORAGE_KEY = 'expense_app_theme'

export function ThemeProvider({children}){
  const [theme, setTheme] = useState(()=>{
    try { return localStorage.getItem(STORAGE_KEY) || 'clean' } catch(e){ return 'clean' }
  })

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(STORAGE_KEY, theme) } catch(e){}
  },[theme])

  return (
    <ThemeContext.Provider value={{theme, setTheme}}>{children}</ThemeContext.Provider>
  )
}

export function useTheme(){ return useContext(ThemeContext) }

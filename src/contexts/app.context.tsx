import { getAccessTokenFromLocalStorage } from '~/utils/auth'
import { createContext, useState } from 'react'

// interface AppContextInterface {
//   isAuthenticated: boolean
//   setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
// }

// const initialAppContext: AppContextInterface = {
//   isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
//   setIsAuthenticated: () => null
// }

// export const AppContext = createContext<AppContextInterface>(initialAppContext)

// export const AppProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)

//   return <AppContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>{children}</AppContext.Provider>
// }

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  userRole: string | null
  setUserRole: React.Dispatch<React.SetStateAction<string | null>>
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  userRole: localStorage.getItem('role'),
  setUserRole: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [userRole, setUserRole] = useState<string | null>(initialAppContext.userRole)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
